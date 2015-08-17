from flask import jsonify, request

from . import api
from .. import db
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
