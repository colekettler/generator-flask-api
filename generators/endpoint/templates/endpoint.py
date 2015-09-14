<% if (databaseMapper === 'none') { -%>
<% if (database === 'postgresql') { -%>
import psycopg2
<% } else if (database === 'mysql') { -%>
import mysql.connector
<% } else if (database === 'sqlite') { -%>
import sqlite3

<% } -%>
<% } -%>
from flask import jsonify, request

from . import api
<% if (databaseMapper === 'sqlalchemy') { -%>
from .. import db
<% } -%>
from ..models.<%= modelModule %> import <%= modelClass %>
from ..schemas.<%= schemaModule %> import <%= schemaVar %>_schema, <%= schemaVarPlural %>_schema
<% if (getRoute) { -%>


@api.route('/<%= endpointUrl %>', methods=['GET'])
def get_<%= endpointVarPlural %>():
    pass


@api.route('/<%= endpointUrl %>/<int:id>', methods=['GET'])
def get_<%= endpointVar %>(id):
    pass
<% } -%>
<% if (postRoute) { -%>


@api.route('/<%= endpointUrl %>', methods=['POST'])
def create_<%= endpointVar %>():
    pass
<% } -%>
<% if (putRoute) { -%>


@api.route('/<%= endpointUrl %>/<int:id>', methods=['PUT'])
def update_<%= endpointVar %>(id):
    pass
<% } -%>
<% if (deleteRoute) { -%>


@api.route('/<%= endpointUrl %>/<int:id>', methods=['DELETE'])
def delete_<%= endpointVar %>(id):
    pass
<% } -%>
