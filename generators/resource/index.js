'use strict';

var chalk = require('chalk');
var AllYourBase = require('../base/AllYourBase');

module.exports = AllYourBase.extend({
  constructor: function () {
    AllYourBase.apply(this, arguments);

    this.argument('name', {
      required: true,
      type: String,
      desc: 'Name of the resource model, schema, and endpoint.'
    });
  },

  initializing: function () {
    this.options.isGeneratingResource = true;
  },

  writing: function () {
    this.composeWith('flask-api:model', {
      arguments: this.args,
      options: { isGeneratingResource: true }
    });
    this.composeWith('flask-api:schema', {
      arguments: this.args,
      options: { isGeneratingResource: true }
    });
    this.composeWith('flask-api:endpoint', {
      arguments: this.args,
      options: { isGeneratingResource: true }
    });
  },

  end: function () {
    this.log(chalk.green('\nAll set!\n'));
  }
});
