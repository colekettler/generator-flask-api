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
      desc: 'Name of the data model.'
    });
  },

  initializing: function () {
    this.appName = this.config.get('appName');
    this.name = this.name.toLowerCase();
    this.database = this.config.get('database');
    this.databaseMapper = this.config.get('databaseMapper');
  },

  writing: function () {
    var template;
    if (this.databaseMapper === 'sqlalchemy') {
      template = 'sqlalchemy_model.py';
    } else {
      template = 'object_model.py';
    }

    this.fs.copyTpl(
      this.templatePath(template),
      this.destinationPath(path.join(
        this.appName, 'models', this.lodash.snakeCase(this.name) + '.py'
      )),
      {
        database: this.database,
        modelClass: this.lodash.pascalCase(this.name)
      }
    );
  },

  end: function () {
    if (!this.options.isGeneratingResource) {
      this.log(chalk.green('\nAll set!\n'));

      this.log(chalk.cyan(
        'Be sure to import your fancy new model into any endpoints\n' +
          'or schemas that need it.\n'
      ));
    }
  }
});
