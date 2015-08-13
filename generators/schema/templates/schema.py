from .. import ma
from ..models.<%= modelModule %> import <%= modelName %>


class <%= schemaName %>Schema(ma.ModelSchema):

    class Meta:
        model = <%= modelName %>


<%= schemaVar %>_schema = <%= schemaName %>Schema()
<%= schemaVar %>s_schema = <%= schemaName %>Schema(many=True)
