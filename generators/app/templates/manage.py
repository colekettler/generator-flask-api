#! /usr/bin/env python

import os

from flask.ext.script import Manager

from <%= appName %> import create_app<% if (databaseMapper === 'sqlalchemy') { -%>, db<% } %>


app = create_app(os.getenv('<%= appEnvVar %>_CONFIG', 'default'))
manager = Manager(app)


@manager.shell
def make_shell_context():
    return dict(app=app<% if (databaseMapper === 'sqlalchemy') { -%>, db=db<% } %>)


if __name__ == '__main__':
    manager.run()
