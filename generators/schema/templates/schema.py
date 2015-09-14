from .. import ma
from ..models.<%= modelModule %> import <%= modelClass %>


class <%= schemaClass %>Schema(ma.<% if (databaseMapper === 'sqlalchemy') { -%>Model<% } -%>Schema):

    class Meta:
<% if (databaseMapper === 'sqlalchemy') { -%>
        model = <%= modelClass %>
<% } else { -%>
        fields = ('id')
<% } -%>


<%= schemaVar %>_schema = <%= schemaClass %>Schema()
<%= schemaVarPlural %>_schema = <%= schemaClass %>Schema(many=True)
