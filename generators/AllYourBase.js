'use strict';

var _ = require('lodash');
var inflect = require('i')();
var yeoman = require('yeoman-generator');

var AllYourBase = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    // Prompt answers.
    this.answers = {};

    // String inflection methods.
    this.inflect = inflect;
    _.extend(this.inflect, {
      slugify: function (word) {
        return inflect.underscore(inflect.dasherize(word));
      }
    });

    // Pip
    this.pipInstall = function (pkgs, options) {
      pkgs = Array.isArray(pkgs) ? pkgs : [pkgs];
      options = options || [];

      var args = pkgs.concat(options);
      args.unshift('install');

      return this.spawnCommandSync('pip', args);
    };

    this.pipFreeze = function () {
      // Requirements file
      var output = this.spawnCommandSync('pip', ['freeze'], { stdio: 'pipe' });
      return output.stdout.toString();
    };
  }
});

module.exports = AllYourBase;
