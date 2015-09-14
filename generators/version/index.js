'use strict';

var path = require('path');
var chalk = require('chalk');
var AllYourBase = require('../base/AllYourBase');
var versions = require('../utils/versions');

module.exports = AllYourBase.extend({
  initializing: function () {
    var versioningScheme = this.config.get('versioningScheme');

    if (versioningScheme === 'none') {
      this.abort('Sorry, I can\'t bump the version of a versionless API!');
    }

    if (versioningScheme === 'major') {
      var currentVersion = this.config.get('currentVersion');
      this.config.set('currentVersion', versions.bumpMajor(currentVersion));
    }

    this.appName = this.config.get('appName');
  },

  prompting: function () {
    var done = this.async();

    var currentVersion = this.config.get('currentVersion');

    this.prompt({
      type: 'list',
      name: 'whichBump',
      message: 'Which version are you bumping?',
      choices: function () {
        return [{
          name: 'minor: ' + currentVersion + ' -> ' +
            versions.bumpMinor(currentVersion),
          value: 'minor'
        }, {
          name: 'major: ' + currentVersion + ' -> ' +
            versions.bumpMajor(currentVersion),
          value: 'major'
        }];
      }.bind(this),
      default: 'minor',
      when: function () {
        return this.config.get('versioningScheme') === 'minor';
      }.bind(this)
    }, function (answers) {
      this.lodash.extend(this.answers, answers);

      if (answers.whichBump === 'minor') {
        this.config.set(
          'currentVersion', versions.bumpMinor(currentVersion)
        );
      } else if (answers.whichBump === 'major') {
        this.config.set(
          'currentVersion', versions.bumpMajor(currentVersion)
        );
      }

      done();
    }.bind(this));
  },

  writing: function () {
    var apiModule = this.getApiModuleName();

    this.log(chalk.cyan('Bumping version...'));

    this.fs.copyTpl(
      this.templatePath('api_init.py'),
      this.destinationPath(path.join(this.appName, apiModule, '__init__.py')),
      { apiModule: apiModule }
    );
  },

  end: function () {
    var apiModule = this.getApiModuleName();
    var apiUrl = this.getApiUrlName();
    var currentVersion = this.config.get('currentVersion');

    this.log(chalk.cyan('Bumped version to ' + currentVersion));

    this.log(chalk.green('\nAll set!\n'));

    this.log(chalk.cyan(
      'Be sure to register your shiny new API blueprint\n' +
        'in your app package\'s __init__.py, like this:'
    ));
    this.log(chalk.bold(
      'from .' + apiModule + ' import api as ' + apiModule + '_blueprint\n' +
        'app.register_blueprint(' + apiModule + '_blueprint, ' +
        'url_prefix=\'' + apiUrl +'\')\n'
    ));
  }
});
