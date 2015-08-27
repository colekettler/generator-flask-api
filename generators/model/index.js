'use strict';

var path = require('path');
var chalk = require('chalk');
var AllYourBase = require('../AllYourBase');

module.exports = AllYourBase.extend({
  initializing: function () {
    this.argument('name', {
      required: true,
      type: String,
      desc: 'Name of the data model.'
    });
    this.name = this.name.toLowerCase();
  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath('model.py'),
      this.destinationPath(
        path.join('app', 'models', this.lodash.snakeCase(this.name) + '.py')
      ),
      { modelClass: this.lodash.pascalCase(this.name) }
    );
  },

  end: function () {
    if (!this.options.isGeneratingResource) {
      this.log(chalk.green('All set!'));
      this.log(chalk.cyan(
        'Be sure to import your fancy new model into any endpoints or ' +
          'schemas that need it.'
      ));
    }
  }
});
