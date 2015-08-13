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
  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath('model.py'),
      this.destinationPath(
        path.join('app', 'models', this.inflect.underscore(this.name) + '.py')
      ),
      { modelClass: this.inflect.camelize(this.name) }
    );
  },

  end: function () {
    this.log(chalk.cyan(
      'All set! Be sure to import your fancy new model into any ' +
        'endpoints or schemas that need it.'
    ));
  }
});
