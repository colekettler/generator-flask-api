'use strict';

var path = require('path');
var chalk = require('chalk');
var AllYourBase = require('../base/AllYourBase');

module.exports = AllYourBase.extend({
  constructor: function () {
    AllYourBase.apply(this, arguments);

    this.argument('name', {
      required: true,
      type: String,
      desc: 'Name of the serialization schema.'
    });
  },

  initializing: function () {
    this.appName = this.config.get('appName');
    this.name = this.name.toLowerCase();
    this.databaseMapper = this.config.get('databaseMapper');
  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath('schema.py'),
      this.destinationPath(
        path.join(
          this.appName, 'schemas', this.lodash.snakeCase(this.name) + '.py'
        )
      ),
      {
        databaseMapper: this.databaseMapper,
        modelClass: this.lodash.pascalCase(this.name),
        modelModule: this.lodash.snakeCase(this.name),
        schemaClass: this.lodash.pascalCase(this.name),
        schemaVar: this.lodash.snakeCase(this.name),
        schemaVarPlural: this.lodash.snakeCase(
          this.inflect.pluralize(this.name)
        )
      }
    );
  },

  end: function () {
    if (!this.options.isGeneratingResource) {
      this.log(chalk.green('\nAll set!\n'));

      this.log(chalk.cyan(
        'Be sure to import your fancy new schema into any endpoints\n' +
          'that need it.\n'
      ));
    }
  }
});
