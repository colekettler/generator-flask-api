'use strict';

var _ = require('lodash');
var chalk = require('chalk');
var inflect = require('i')();
var yeoman = require('yeoman-generator');
var strings = require('../utils/strings');

var AllYourBase = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    // Prompt answers
    this.answers = {};

    // Values for templating
    this.templateVars = {};

    // Lodash methods
    this.lodash = _;
    _.mixin(this.lodash, strings);

    // String inflection methods
    this.inflect = inflect;

    // Abort installation
    this.abort = function (msg) {
      this.log(chalk.red('\n' + msg + '\n'));
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
  }
});

module.exports = AllYourBase;
