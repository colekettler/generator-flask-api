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
    _.mixin(this.inflect, {
      slugify: function (word) {
        // Just like Mama Django used to make.
        var normalizedWord = word.normalize('NFKD');
        var asciiWord = (new Buffer(normalizedWord, 'ascii').toString('ascii'));
        return asciiWord
          .replace(/[^\w\s-]/g, '')
          .trim()
          .toLowerCase()
          .replace(/[-\s]+/g, '-');
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
