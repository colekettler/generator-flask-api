'use strict';

var path = require('path');
var chalk = require('chalk');
var AllYourBase = require('../AllYourBase');

module.exports = AllYourBase.extend({
  initializing: function () {
    this.argument('name', {
      required: true,
      type: String,
      desc: 'Name of the API endpoint.'
    });
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
    this.log(chalk.cyan(
      'All set! Be sure to import your fancy new endpoint into your ' +
        'API blueprint.'
    ));
  }
});
