from flask import Flask
from flask.ext.marshmallow import Marshmallow
from flask.ext.sqlalchemy import SQLAlchemy

from config import config


db = SQLAlchemy()
ma = Marshmallow()


def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    db.init_app(app)
    ma.init_app(app)

    from .<%= apiModule %> import api as <%= apiModule %>_blueprint
    app.register_blueprint(<%= apiModule %>_blueprint, url_prefix='<%= apiUrl %>')

    return app
