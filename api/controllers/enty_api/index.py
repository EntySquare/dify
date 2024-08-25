import json
import logging
import uuid

import jmespath
from flask import jsonify, request
from flask_restful import Resource, reqparse
from sqlalchemy import text
from werkzeug.exceptions import InternalServerError

from configs import dify_config
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
from libs import helper
from libs.helper import get_remote_ip
from models.model import Account, App
from services.account_service import AccountService, RegisterService
from services.app_generate_service import AppGenerateService

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


class LoginOrCreation(Resource):
    def get(self):
        user = 'admin'
        account = Account.query.filter_by(email=user).first()  # 查询用户
        # 没有测创建
        if account:
            token = AccountService.login(account, ip_address=get_remote_ip(request))
            return {'result': 'success', 'data': token}

        if not account:
            account = RegisterService.register(
                email=user,
                name=user,
                password=user,
                language="en-US")
            token = AccountService.login(account, ip_address=get_remote_ip(request))
            return {'result': 'success', 'data': token}



api.add_resource(Ping, '/ping')
api.add_resource(WorkflowsAll, '/workflows-all')  # 列表
api.add_resource(DraftWorkflowRunApi, '/workflows-run/<uuid:app_id>')  # 执行
api.add_resource(LoginOrCreation, '/login-or-creation')  # 登录或创建
