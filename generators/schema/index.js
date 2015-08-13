'use strict';

var path = require('path');
var chalk = require('chalk');
var AllYourBase = require('../AllYourBase');

module.exports = AllYourBase.extend({
  initializing: function () {
    this.argument('name', {
      required: true,
      type: String,
      desc: 'Name of the serialization schema.'
    });
  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath('schema.py'),
      this.destinationPath(
        path.join('app', 'schemas', this.inflect.underscore(this.name) + '.py')
      ),
      {
        modelClass: this.inflect.camelize(this.name),
        modelModule: this.inflect.underscore(this.name),
        schemaClass: this.inflect.camelize(this.name),
        schemaVar: this.inflect.underscore(this.name),
        schemaVarPlural: this.inflect.pluralize(
          this.inflect.underscore(this.name)
        )
      }
    );
  },

  end: function () {
    this.log(chalk.cyan(
      'All set! Be sure to import your fancy new schema into any ' +
        'endpoints that need it.'
    ));
  }
});
