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
        path.join('app', 'schemas', this.lodash.snakeCase(this.name) + '.py')
      ),
      {
        modelModule: this.lodash.snakeCase(this.name),
        modelName: this.lodash.pascalCase(this.name),
        schemaName: this.lodash.pascalCase(this.name),
        schemaVar: this.lodash.snakeCase(this.name)
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
