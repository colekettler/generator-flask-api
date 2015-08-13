from .. import db


class <%= modelName %>(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # additional fields

    def __repr__(self):
        return '<%= modelName %> {}>'.format(self.id)
