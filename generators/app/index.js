'use strict';

var chalk = require('chalk');
var yosay = require('yosay');
var AllYourBase = require('../AllYourBase');

module.exports = AllYourBase.extend({
  initializing: {
    checkPython: function () {
      this.whichPython(function (err, stdout) {
        this.pythonPath = stdout.toString();

        if (this.pythonPath.length === 0) {
          this.abort(
            'You don\'t appear to have Python installed. You should fix that ' +
              'post-haste! Try running me again when you have that sorted out.'
          );
        }
      }.bind(this));
    },

    checkPip: function () {
      this.whichPip(function (err, stdout) {
        this.pipPath = stdout.toString();

        if (!this.options['skip-install'] && this.pipPath.length === 0) {
          this.abort(
            'It looks like you don\'t have Pip installed on your active ' +
              'Python, which would make installing things a little tricky! ' +
              'Try running me again when you have that sorted out.'
          );
        }
      }.bind(this));
    },

    checkVirtualEnv: function () {
      this.hasActiveVirtualEnv = this.inVirtualEnv();
    }
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the most cromulent ' + chalk.red('Flask REST API') +
        ' generator!'
    ));

    var prompts = [{
      type: 'confirm',
      name: 'useSystemPython',
      message: 'Since you\'re not using a virtual environment, are you ' +
        'alright with installing to your system\'s Python? (You really ' +
        'should consider using a virtual environment!)',
      default: false,
      when: function () {
        return !this.options['skip-install'] && !this.hasActiveVirtualEnv;
      }.bind(this)
    }];

    this.prompt(prompts, function (answers) {
      if (answers.useSystemPython === false) {
        this.abort(
          'Sorry, there isn\'t much I can do without a Python to install to! ' +
            'Try running me again when you have that sorted out.'
        );
      }

      this.answers = answers;
      done();
    }.bind(this));
  },

  configuring: {
    virtualEnv: function () {
      if (this.hasActiveVirtualEnv) {
        this.log(chalk.cyan(
          'It would appear that you\'re already in a Python virtual ' +
            'environment. Fantastic! I\'ll link that up for you.'
        ));
        this.linkActiveVirtualEnv('.', function () {
          this.log(chalk.cyan('Symlinked virtual environment into ./venv'));
        }.bind(this));
      }
    },

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
    }
  },

  writing: {
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
    },

    app: function () {
      this.fs.copy(
        this.templatePath('app_init.py'),
        this.destinationPath('app/__init__.py')
      );
    },

    api: function () {
      this.fs.copy(
        this.templatePath('api_init.py'),
        this.destinationPath('app/api/__init__.py')
      );
    },

    models: function () {
      this.fs.copy(
        this.templatePath('models_init.py'),
        this.destinationPath('app/models/__init__.py')
      );
    },

    schemas: function () {
      this.fs.copy(
        this.templatePath('schemas_init.py'),
        this.destinationPath('app/schemas/__init__.py')
      );
    }
  },

  install: function () {
    if (!this.options['skip-install']) {
      this.pipInstall('marshmallow', '--pre');
      this.pipInstall('flask-marshmallow');
      this.pipInstall(['flask-sqlalchemy', 'marshmallow-sqlalchemy']);

      this.fs.write(
        this.destinationPath('requirements.txt'),
        this.pipFreeze()
      );
    }
  }
});
