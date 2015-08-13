from .. import ma
from ..models.<%= modelModule %> import <%= modelClass %>


class <%= schemaClass %>Schema(ma.ModelSchema):

    class Meta:
        model = <%= modelClass %>


<%= schemaVar %>_schema = <%= schemaClass %>Schema()
<%= schemaVarPlural %>_schema = <%= schemaClass %>Schema(many=True)
