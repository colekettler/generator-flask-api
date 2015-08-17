'use strict';

var _ = require('lodash');
var encoding = require('encoding');
var inflect = require('i')();
var unorm = require('unorm');
var yeoman = require('yeoman-generator');

var AllYourBase = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    // Prompt answers
    this.answers = {};

    // Lodash methods
    this.lodash = _;
    _.mixin(this.lodash, {
      pascalCase: function (word) {
        var camelCasedWord = _.camelCase(word);
        return _.capitalize(camelCasedWord);
      },
      urlSlug: function (word) {
        // Just like Mama Django used to make.
        var normalizedWord = unorm.nfkd(word);
        var asciiWord = encoding.convert(normalizedWord, 'ascii').toString();
        return asciiWord
          .replace(/[^\w\s-]/g, '')
          .trim()
          .toLowerCase()
          .replace(/[-\s]+/g, '-');
      }
    });

    // String inflection methods
    this.inflect = inflect;

    // Pip methods
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
