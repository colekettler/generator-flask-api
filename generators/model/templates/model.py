from .. import db


class <%= modelClass %>(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # additional fields

    def __repr__(self):
        return '<%= modelClass %> {}>'.format(self.id)
