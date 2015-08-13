'use strict';

var _ = require('lodash');
var inflect = require('i')();
var yeoman = require('yeoman-generator');

var AllYourBase = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    // String inflection methods.
    this.inflect = inflect;
    _.extend(this.inflect, {
      slugify: function (word) {
        return inflect.underscore(inflect.dasherize(word));
      }
    });
  }
});

module.exports = AllYourBase;
