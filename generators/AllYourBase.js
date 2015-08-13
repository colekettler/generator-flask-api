'use strict';

var _ = require('lodash');
var yeoman = require('yeoman-generator');

var AllYourBase = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    // Lodash methods.
    this.lodash = _;

    function pascalCase (word) {
      return _.capitalize(_.camelCase(word));
    }

    this.lodash.mixin({ 'pascalCase': pascalCase });
  }
});

module.exports = AllYourBase;
