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

  writing: function () {
    this.fs.copyTpl(
      this.templatePath('endpoint.py'),
      this.destinationPath(
        path.join('app', 'api', this.inflect.underscore(this.name) + '.py')
      ),
      {
        endpointUrl: this.inflect.slugify(this.name),
        endpointUrlPlural: this.inflect.pluralize(
          this.inflect.slugify(this.name)
        ),
        endpointVar: this.inflect.underscore(this.name),
        endpointVarPlural: this.inflect.pluralize(
          this.inflect.underscore(this.name)
        ),
        modelClass: this.inflect.camelize(this.name),
        modelModule: this.inflect.underscore(this.name),
        schemaClass: this.inflect.camelize(this.name),
        schemaModule: this.inflect.underscore(this.name),
        schemaVar: this.inflect.underscore(this.name),
        schemaVarPlural: this.inflect.pluralize(
          this.inflect.underscore(this.name)
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
