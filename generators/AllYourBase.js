'use strict';

var cp = require('child_process');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var chalk = require('chalk');
var encoding = require('encoding');
var inflect = require('i')();
var unorm = require('unorm');
var yeoman = require('yeoman-generator');

var AllYourBase = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    // Prompt answers
    this.answers = {};

    // Values for templating
    this.templateVars = {};

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

    // Abort installation.
    this.abort = function (msg) {
      this.log(chalk.red(msg));
      this.env.error(chalk.red('Aborting generation.'));
    };

    // API template variable names
    this.getApiModuleName = function () {
      var moduleName = 'api';
      var versioningScheme = this.config.get('versioningScheme');
      if (versioningScheme !== 'none') {
        moduleName += '_' + this.config.get('currentVersion').replace('.', '_');
      }
      return moduleName;
    };

    this.getApiUrlName = function () {
      var urlName = this.config.get('urlPrefix');
      var versioningScheme = this.config.get('versioningScheme');
      if (versioningScheme !== 'none') {
        urlName += '/' + this.config.get('currentVersion');
      }
      return urlName;
    };

    // Prompt filters and validators
    this.validateUrlPrefix = function (value) {
      if (!this.lodash.startsWith(value, '/')) {
        return 'Prefixes should start with a forward slash "\/".';
      }
      if (this.lodash.endsWith(value, '/')) {
        return 'Prefixes should not end with a trailing forward slash "\/".';
      }
      if (/\/{2,}/.test(value)) {
        return 'Prefixes should not have consecutive forward slashes "\/".';
      }
      return true;
    };

    this.filterUrlPrefix = function (value) {
      var components = value.split('/');
      components = this.lodash.map(components, this.lodash.urlSlug);
      return components.join('/');
    };

    // Python methods
    this.whichPython = function (cb) {
      return cp.exec('which python', cb);
    };

    this.getVirtualEnv = function () {
      return process.env.VIRTUAL_ENV;
    };

    this.inVirtualEnv = function () {
      var virtualEnv = this.getVirtualEnv();
      return virtualEnv && virtualEnv.length > 0;
    };

    this.linkActiveVirtualEnv = function (basedir, cb) {
      var virtualEnv = this.getVirtualEnv();
      var dstpath = path.join(basedir, 'venv');
      return fs.symlink(virtualEnv, dstpath, 'dir', cb);
    };

    // Pip methods
    this.whichPip = function (cb) {
      return cp.exec('which pip', cb);
    };

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
