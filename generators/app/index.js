'use strict';

var path = require('path');
var chalk = require('chalk');
var yosay = require('yosay');
var AllYourBase = require('../base/AllYourBase');
var filters = require('../utils/filters');
var python = require('../utils/python');
var validators = require('../utils/validators');

module.exports = AllYourBase.extend({
  constructor: function () {
    AllYourBase.apply(this, arguments);

    this.argument('name', {
      optional: true,
      type: String,
      defaults: 'app',
      desc: 'Name of the application.'
    });
  },

  initializing: {
    checkPython: function () {
      python.whichPython(function (err, stdout) {
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
      python.whichPip(function (err, stdout) {
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
      this.hasActiveVirtualEnv = python.inVirtualEnv();
    },

    setAppName: function () {
      this.appName = this.lodash.snakeCase(this.name);
      this.config.set('appName', this.appName);
    },

    setConfigDefaults: function () {
      this.config.defaults({
        appName: 'app',
        database: 'none',
        databaseMapper: 'none',
        versioningScheme: 'none',
        currentVersion: '',
        urlPrefix: '/api'
      });
    }
  },

  prompting: {
    greet: function () {
      // Have Yeoman greet the user.
      this.log(yosay(
        'Welcome to the most cromulent ' + chalk.red('Flask REST API') +
          ' generator!'
      ));
    },

    confirmPython: function () {
      var done = this.async();

      this.prompt({
        type: 'confirm',
        name: 'useSystemPython',
        message: 'Since you\'re not using a virtual environment, are you ' +
          'alright with installing to your system\'s Python? (You really ' +
          'should consider using a virtual environment!)',
        default: false,
        when: function () {
          return !this.options['skip-install'] && !this.hasActiveVirtualEnv;
        }.bind(this)
      }, function (answers) {
        if (answers.useSystemPython === false) {
          this.abort(
            'Sorry, there isn\'t much I can do without a Python to install ' +
              'to! Try running me again when you have that sorted out.'
          );
        }

        done();
      }.bind(this));
    },

    chooseDatabase: function () {
      var done = this.async();

      this.prompt({
        type: 'list',
        name: 'database',
        message: 'Which flavor of database will you be using with your API?\n' +
          'Make sure you\'ve got it installed first, of course!',
        choices: [
          { name: 'PostgreSQL', value: 'postgresql' },
          { name: 'MySQL', value: 'mysql' },
          { name: 'SQLite', value: 'sqlite' },
          { name: 'None / Other', value: 'none' }
        ],
        default: 'postgresql'
      }, function (answers) {
        this.lodash.extend(this.answers, answers);

        this.config.set('database', answers.database);

        done();
      }.bind(this));
    },

    chooseDatabaseMapper: function () {
      var done = this.async();

      this.prompt({
        type: 'list',
        name: 'databaseMapper',
        message: 'Which ORM will you be using to interact with your database?',
        choices: [
          { name: 'SQLAlchemy', value: 'sqlalchemy' },
          { name: 'None / Other', value: 'none' }
        ],
        default: 'sqlalchemy'
      }, function (answers) {
        this.lodash.extend(this.answers, answers);

        this.config.set('databaseMapper', answers.databaseMapper);

        done();
      }.bind(this));
    },

    chooseVersioningScheme: function () {
      var done = this.async();

      this.prompt({
        type: 'list',
        name: 'versioningScheme',
        message: 'Which URL scheme would you like to use for versioning ' +
          'your API?',
        choices: [
          { name: 'major: /api/v1/resource', value: 'major' },
          { name: 'major.minor: /api/v1.0/resource', value: 'minor' },
          { name: 'none: /api/resource', value: 'none' }
        ],
        default: 'major'
      }, function (answers) {
        this.lodash.extend(this.answers, answers);

        var versioningScheme = answers.versioningScheme;
        var versions = {
          major: 'v1',
          minor: 'v1.0',
          none: ''
        };
        this.config.set('versioningScheme', versioningScheme);
        this.config.set('currentVersion', versions[versioningScheme]);
        this.templateVars.apiModule = this.getApiModuleName();

        done();
      }.bind(this));
    },

    chooseUrlPrefix: function () {
      var done = this.async();

      this.prompt([{
        type: 'confirm',
        name: 'useUrlPrefix',
        message: 'Do you want to use a URL prefix for your API endpoints?',
        default: true
      }, {
        type: 'input',
        name: 'urlPrefix',
        message: 'Which URL prefix do you want to use for your API ' +
          'endpoints?',
        default: '/api',
        validate: validators.validateUrlPrefix,
        filter: filters.filterUrlPrefix,
        when: function (answers) {
          return answers.useUrlPrefix;
        }
      }], function (answers) {
        this.lodash.extend(this.answers, answers);

        var urlPrefix = answers.useUrlPrefix ? answers.urlPrefix : '';
        this.config.set('urlPrefix', urlPrefix);
        this.templateVars.apiUrl = this.getApiUrlName();

        done();
      }.bind(this));
    }
  },

  configuring: {
    virtualEnv: function () {
      if (this.hasActiveVirtualEnv) {
        this.log(chalk.cyan(
          'It would appear that you\'re already in a Python virtual ' +
            'environment.\nFantastic! I\'ll link that up for you.'
        ));
        python.linkActiveVirtualEnv('.', function () {
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
      this.fs.copyTpl(
        this.templatePath('config.py'),
        this.destinationPath('config.py'),
        {
          appEnvVar: this.appName.toUpperCase(),
          databaseMapper: this.config.get('databaseMapper')
        }
      );
    },

    runnable: function () {
      this.fs.copyTpl(
        this.templatePath('manage.py'),
        this.destinationPath('manage.py'),
        {
          appName: this.appName,
          appEnvVar: this.appName.toUpperCase(),
          databaseMapper: this.config.get('databaseMapper')
        }
      );
    },

    app: function () {
      this.fs.copyTpl(
        this.templatePath('app_init.py'),
        this.destinationPath(path.join(this.appName, '__init__.py')),
        {
          apiModule: this.templateVars.apiModule,
          apiUrl: this.templateVars.apiUrl,
          databaseMapper: this.config.get('databaseMapper')
        }
      );
    },

    api: function () {
      this.fs.copyTpl(
        this.templatePath('api_init.py'),
        this.destinationPath(
          path.join(this.appName, this.templateVars.apiModule, '__init__.py')
        ),
        { apiModule: this.templateVars.apiModule }
      );
    },

    models: function () {
      this.fs.copy(
        this.templatePath('models_init.py'),
        this.destinationPath(path.join(this.appName, 'models', '__init__.py'))
      );
    },

    schemas: function () {
      this.fs.copy(
        this.templatePath('schemas_init.py'),
        this.destinationPath(path.join(this.appName, 'schemas', '__init__.py'))
      );
    },

    tests: function () {
      this.fs.copy(
        this.templatePath('tests_init.py'),
        this.destinationPath(path.join('tests', '__init__.py'))
      );
    }
  },


  install: function () {
    if (!this.options['skip-install']) {
      this.log(chalk.cyan('Installing dependencies...'));

      python.pipInstall('flask-marshmallow', 'flask-script');

      if (this.config.get('database') === 'postgresql') {
        python.pipInstall('psycopg2');
      }

      if (this.config.get('database') === 'mysql') {
        python.pipInstall(
          'mysql-connector-python',
          ['--allow-external', 'mysql-connector-python']
        );
      }

      if (this.config.get('databaseMapper') === 'sqlalchemy') {
        python.pipInstall(['flask-sqlalchemy', 'marshmallow-sqlalchemy']);
      }

      this.log(chalk.cyan('Writing requirements file...'));

      var requirements = python.pipFreeze();
      if (this.config.get('database') === 'mysql') {
        requirements = '--allow-external mysql-connector-python\n' +
          requirements;
      }
      this.fs.write(this.destinationPath('requirements.txt'), requirements);
    }
  },

  end: function () {
    var appConfigEnvVar = this.appName.toUpperCase() + '_CONFIG';

    this.log(chalk.green('\nAll set!\n'));

    this.log(chalk.cyan(
      'You can run Flask\'s local server by executing the manager script:'
    ));
    this.log(chalk.bold('./manage.py runserver\n'));

    this.log(chalk.cyan(
      'For safety\'s sake, this defaults to a production config with DEBUG ' +
        'turned off.\nYou can change the config by setting the ' +
        appConfigEnvVar + '\nenvironment variable to "development" in your ' +
        'shell:'
    ));
    this.log(chalk.bold('export ' + appConfigEnvVar + '=development\n'));
  }
});
