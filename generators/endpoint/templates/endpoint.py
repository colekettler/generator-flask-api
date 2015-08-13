from flask import jsonify, request

from . import api
from .. import db
from ..models.<%= modelModule %> import <%= modelClass %>
from ..schemas.<%= schemaModule %> import <%= schemaVar %>_schema, <%= schemaVarPlural %>_schema


@api.route('/<%= endpointUrlPlural %>', methods=['GET'])
def get_<%= endpointVar %>s():
    <%= endpointVarPlural %> = <%= modelClass %>.query.all()
    result = <%= schemaVarPlural %>_schema.dump(<%= endpointVarPlural %>)
    return jsonify({'<%= endpointVarPlural %>': result.data})
