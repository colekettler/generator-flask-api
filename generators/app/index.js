'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the most cromulent ' + chalk.red('Flask REST API') +
        ' generator!'
    ));

    var prompts = [{
      type: 'confirm',
      name: 'someOption',
      message: 'Would you like to enable this option?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: {
    git: function () {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );

      this.fs.copy(
        this.templatePath('gitattributes'),
        this.destinationPath('.gitattributes')
      );
    },

    editorConfig: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
    },

    pip: function () {
      this.fs.copy(
        this.templatePath('requirements.txt'),
        this.destinationPath('requirements.txt')
      );
    },

    config: function () {
      this.fs.copy(
        this.templatePath('config.py'),
        this.destinationPath('config.py')
      );
    },

    runnable: function () {
      this.fs.copy(
        this.templatePath('run.py'),
        this.destinationPath('run.py')
      );
    }
  },

  install: function () {
    this.installDependencies();
  }
});
