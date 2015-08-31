'use strict';

var path = require('path');
var chalk = require('chalk');
var AllYourBase = require('../base/AllYourBase');

module.exports = AllYourBase.extend({
  constructor: function () {
    AllYourBase.apply(this, arguments);

    this.argument('name', {
      required: true,
      type: String,
      desc: 'Name of the API endpoint.'
    });
  },

  initializing: function () {
    this.name = this.name.toLowerCase();
  },

  prompting: function () {
    var done = this.async();

    var prompts = [{
      type: 'checkbox',
      name: 'withRoutes',
      message: 'Which HTTP methods would you like to support?',
      choices: [{
        name: 'GET',
        value: 'getRoute',
        checked: true
      }, {
        name: 'POST',
        value: 'postRoute'
      }, {
        name: 'PUT',
        value: 'putRoute'
      }, {
        name: 'DELETE',
        value: 'deleteRoute'
      }]
    }];

    this.prompt(prompts, function (answers) {
      var isChecked = function (opt) {
        return answers.withRoutes.indexOf(opt) !== -1;
      };

      this.answers.getRoute = isChecked('getRoute');
      this.answers.postRoute = isChecked('postRoute');
      this.answers.putRoute = isChecked('putRoute');
      this.answers.deleteRoute = isChecked('deleteRoute');

      done();
    }.bind(this));
  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath('endpoint.py'),
      this.destinationPath(
        path.join('app', 'api', this.lodash.snakeCase(this.name) + '.py')
      ),
      {
        // Routes
        getRoute: this.answers.getRoute,
        postRoute: this.answers.postRoute,
        putRoute: this.answers.putRoute,
        deleteRoute: this.answers.deleteRoute,
        // Values
        endpointUrl: this.lodash.urlSlug(
          this.inflect.pluralize(this.name)
        ),
        endpointVar: this.lodash.snakeCase(this.name),
        endpointVarPlural: this.lodash.snakeCase(
          this.inflect.pluralize(this.name)
        ),
        modelClass: this.lodash.pascalCase(this.name),
        modelModule: this.lodash.snakeCase(this.name),
        schemaClass: this.lodash.pascalCase(this.name),
        schemaModule: this.lodash.snakeCase(this.name),
        schemaVar: this.lodash.snakeCase(this.name),
        schemaVarPlural: this.lodash.snakeCase(
          this.inflect.pluralize(this.name)
        )
      }
    );
  },

  end: function () {
    if (!this.options.isGeneratingResource) {
      this.log(chalk.green('All set!'));
    }
    this.log(chalk.cyan(
      'Be sure to import your fancy new endpoint into your API blueprint in ' +
        'your API package\'s __init__.py, like this:'
    ));
    this.log(chalk.bold(
      'from . import ' + this.lodash.snakeCase(this.name)
    ));
  }
});
