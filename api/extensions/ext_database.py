from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
import coloredlogs
import logging

POSTGRES_INDEXES_NAMING_CONVENTION = {
    "ix": "%(column_0_label)s_idx",
    "uq": "%(table_name)s_%(column_0_name)s_key",
    "ck": "%(table_name)s_%(constraint_name)s_check",
    "fk": "%(table_name)s_%(column_0_name)s_fkey",
    "pk": "%(table_name)s_pkey",
}

metadata = MetaData(naming_convention=POSTGRES_INDEXES_NAMING_CONVENTION)
db = SQLAlchemy(metadata=metadata)


def init_app(app):
    app.config['SQLALCHEMY_ECHO'] = True

    # 配置 SQLAlchemy 日志记录器
    sqlalchemy_logger = logging.getLogger('sqlalchemy.engine')
    sqlalchemy_logger.setLevel(logging.INFO)

    # 设置日志格式和颜色
    coloredlogs.install(level='INFO', logger=sqlalchemy_logger,
                        fmt='%(asctime)s %(hostname)s %(name)s[%(process)d] %(levelname)s %(message)s',
                        level_styles={'info': {'color': 'blue'}, 'warning': {'color': 'yellow'},
                                      'error': {'color': 'red'}})

    db.init_app(app)
