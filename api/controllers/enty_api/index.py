import json
import logging
import uuid
from datetime import datetime

import jmespath
from flask import jsonify
from flask_login import current_user
from flask_restful import Resource, marshal_with, reqparse
from sqlalchemy import text
from werkzeug.exceptions import BadRequest, Forbidden, InternalServerError

from configs import dify_config
from controllers.console import api as console_api
from controllers.console.setup import setup_required
from controllers.console.wraps import account_initialization_required, cloud_edition_billing_resource_check
from controllers.enty_api import api
from controllers.service_api.app.error import (
    CompletionRequestError,
    ProviderModelCurrentlyNotSupportError,
    ProviderNotInitializeError,
    ProviderQuotaExceededError,
)
from controllers.service_api.wraps import create_or_update_end_user_for_user_id
from core.app.entities.app_invoke_entities import InvokeFrom
from core.errors.error import (
    AppInvokeQuotaExceededError,
    ModelCurrentlyNotSupportError,
    ProviderTokenNotInitError,
    QuotaExceededError,
)
from core.model_runtime.errors.invoke import InvokeError
from extensions.ext_database import db
from fields.app_fields import (
    app_detail_fields,
)
from libs import helper
from libs.login import login_required
from models.model import App
from services.app_generate_service import AppGenerateService
from services.app_service import AppService
from services.workflow_service import WorkflowService

from .chat_one_v1.chat_one_v1_features import data as one_v1_features
from .chat_one_v1.chat_one_v1_qraph import data as chat_one_v1_qraph  # 第一版
from .chat_one_v1.general_v2 import data as general_v2  # 通用版本 第二版

logger = logging.getLogger(__name__)


class Ping(Resource):
    def get(self):
        return {
            "welcome": "ent OpenAPI",
            "api_version": "v1",
            "server_version": dify_config.CURRENT_VERSION,
        }


class WorkflowsAll(Resource):
    def post(self):
        return self._handle_request()

    def _handle_request(self):
        query = """
              SELECT apps.id, apps.name, workflows.graph
              FROM apps
              JOIN workflows ON apps.id = workflows.app_id
              WHERE workflows.version = 'draft'
              """
        result = db.session.execute(text(query))
        rows = result.fetchall()
        db.session.close()

        retData = []
        for row in rows:
            app_id = row[0]  # 工作流id
            app_name = row[1]  # 工作流名字
            data = json.loads(row[2])
            types = "0"  # 0=未知 1=tgai单聊
            # 检查工作流类型
            if jmespath.search('nodes[?data.type == `start` && data.variables[?variable == `in_chat_one_v1`]]',
                               data) and \
                    jmespath.search('nodes[?data.type == `end` && data.outputs[?variable == `out_chat_one_v1`]]', data):
                types = "1"

            retData.append({"workflow_id": app_id, "workflow_name": app_name, "workflow_types": types})
        print(retData)
        return jsonify({"code": "", "data": retData})


class DraftWorkflowRunApi(Resource):
    def post(self, app_id: uuid.UUID):
        print("DraftWorkflowRunApi run...")
        parser = reqparse.RequestParser()
        parser.add_argument('inputs', type=dict, required=True, nullable=False, location='json')
        parser.add_argument('files', type=list, required=False, location='json')
        parser.add_argument('response_mode', type=str, choices=['blocking', 'streaming'], location='json')
        args = parser.parse_args()
        streaming = args.get('response_mode') == 'streaming'

        app_model = db.session.query(App).filter(App.id == app_id).first()
        end_user = create_or_update_end_user_for_user_id(app_model, app_model.tenant_id)
        try:
            response = AppGenerateService.generate(
                app_model=app_model,
                user=end_user,
                args=args,
                invoke_from=InvokeFrom.SERVICE_API,
                streaming=streaming
            )
            return helper.compact_generate_response(response)
        except ProviderTokenNotInitError as ex:
            raise ProviderNotInitializeError(ex.description)
        except QuotaExceededError:
            raise ProviderQuotaExceededError()
        except ModelCurrentlyNotSupportError:
            raise ProviderModelCurrentlyNotSupportError()
        except InvokeError as e:
            raise CompletionRequestError(e.description)
        except (ValueError, AppInvokeQuotaExceededError) as e:
            raise e
        except Exception as e:
            logging.exception("internal server error.")
            raise InternalServerError()


# class LoginOrCreation(Resource):
#     def get(self):
#         user = 'admin'
#         account = Account.query.filter_by(email=user).first()  # 查询用户
#         # 没有测创建
#         if account:
#             token = AccountService.login(account, ip_address=get_remote_ip(request))
#             return {'result': 'success', 'data': token}
#
#         if not account:
#             account = RegisterService.register(
#                 email=user,
#                 name=user,
#                 password=user,
#                 language="en-US")
#             token = AccountService.login(account, ip_address=get_remote_ip(request))
#             return {'result': 'success', 'data': token}



class CreateChatOneV1(Resource):
    @setup_required
    @login_required
    @account_initialization_required
    @marshal_with(app_detail_fields)
    @cloud_edition_billing_resource_check('apps')
    def post(self):
        """Create app"""
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True, location='json')
        parser.add_argument('description', type=str, location='json')
        parser.add_argument('icon_type', type=str, location='json')
        parser.add_argument('icon', type=str, location='json')
        parser.add_argument('icon_background', type=str, location='json')
        args = parser.parse_args()

        args["name"] = "单聊模版(TGAI_V1)"
        args["description"] = '临时模版名称，请修改。此模版为TGAI单聊对接模版，遵循输入输出规范才可生效模版创建时间：'+datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        args["mode"] = 'workflow'
        # The role of the current user in the ta table must be admin, owner, or editor
        if not current_user.is_editor:
            raise Forbidden()

        if 'mode' not in args or args['mode'] is None:
            raise BadRequest("mode is required")

        app_service = AppService()
        workflow_service = WorkflowService()
        app = app_service.create_app(current_user.current_tenant_id, args, current_user)
        workflow = workflow_service.sync_draft_workflow(
            app_model=app,
            graph=chat_one_v1_qraph,
            features=one_v1_features,
            unique_hash=app.id,
            account=current_user,
            environment_variables={},
            conversation_variables={},
        )
        print("得到workflow——————————")
        print("workflow")
        print("得到workflow》》》》》》")
        return app, 201


class CreateGeneralV2(Resource):
    @setup_required
    @login_required
    @account_initialization_required
    @marshal_with(app_detail_fields)
    @cloud_edition_billing_resource_check('apps')
    def post(self):
        """Create app"""
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True, location='json')
        parser.add_argument('description', type=str, location='json')
        parser.add_argument('icon_type', type=str, location='json')
        parser.add_argument('icon', type=str, location='json')
        parser.add_argument('icon_background', type=str, location='json')
        args = parser.parse_args()

        args["name"] = "通用模版(V2)"
        args["description"] = '临时模版名称，请修改。此模版为通用模版，遵循输入输出规范才可生效模版创建时间：'+datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        args["mode"] = 'workflow'
        # The role of the current user in the ta table must be admin, owner, or editor
        if not current_user.is_editor:
            raise Forbidden()

        if 'mode' not in args or args['mode'] is None:
            raise BadRequest("mode is required")

        app_service = AppService()
        workflow_service = WorkflowService()
        app = app_service.create_app(current_user.current_tenant_id, args, current_user)
        workflow = workflow_service.sync_draft_workflow(
            app_model=app,
            graph=general_v2,
            features=one_v1_features,
            unique_hash=app.id,
            account=current_user,
            environment_variables={},
            conversation_variables={},
        )
        print("得到workflow——————————")
        print("workflow")
        print("得到workflow》》》》》》")
        return app, 201

api.add_resource(Ping, '/ping')
api.add_resource(WorkflowsAll, '/workflows-all')  # 列表
api.add_resource(DraftWorkflowRunApi, '/workflows-run/<uuid:app_id>')  # 执行
# api.add_resource(LoginOrCreation, '/login-or-creation')  # 登录或创建

console_api.add_resource(CreateChatOneV1, '/create/chat_one_v1')  # 创建tgai 单聊模版
console_api.add_resource(CreateGeneralV2, '/create/general_v2')  # 创建tgai 单聊模版
