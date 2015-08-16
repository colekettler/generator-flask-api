'use strict';

var AllYourBase = require('../AllYourBase');

module.exports = AllYourBase.extend({
  initializing: function () {
    this.argument('name', {
      required: true,
      type: String,
      desc: 'Name of the resource model, schema, and endpoint.'
    });
  },

  writing: function () {
    this.composeWith('flask-api:model', { arguments: this.args });
    this.composeWith('flask-api:schema', { arguments: this.args });
    this.composeWith('flask-api:endpoint', {arguments: this.args });
  }
});
