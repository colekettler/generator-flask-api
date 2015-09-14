<% if (database === 'postgresql') { -%>
import psycopg2
<% } else if (database === 'mysql') { -%>
import mysql.connector
<% } else if (database === 'sqlite') { -%>
import sqlite3
<% } -%>
<% if (database !== 'none') { -%>


<% } -%>
class <%= modelClass %>(object):

    def __init__(self, id):
        self.id = id
        # Additional fields

    def __repr__(self):
        return '<%= modelClass %> {}>'.format(self.id)
