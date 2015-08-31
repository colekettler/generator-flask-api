'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var sinon = require('sinon');
var python = require('../generators/utils/python');

// Global hooks
var sandbox;

before(function () {
  sandbox = sinon.sandbox.create();
});

describe('app', function () {
  var mocks = {};

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ versioningScheme: 'none' })
      .on('ready', function () {
        mocks.pythonMock = sandbox.mock(python);
        mocks.pythonMock
          .expects('whichPython')
          .once()
          .callsArgWithAsync(0, null, '~/.venv/venv/bin/python');
        mocks.pythonMock
          .expects('whichPip')
          .once()
          .callsArgWithAsync(0, null, '~/.venv/venv/bin/pip');
        mocks.pythonMock
          .expects('inVirtualEnv')
          .atLeast(1)
          .returns(true);

        sandbox.stub(python, 'linkActiveVirtualEnv');
      })
      .on('end', done);
  });

  after(function () {
    sandbox.restore();
  });

  it('creates expected files', function () {
    assert.file([
      '.gitattributes',
      '.gitignore',
      '.editorconfig',
      '.yo-rc.json',
      'config.py',
      'run.py'
    ]);
  });

  it('creates expected package structure', function () {
    assert.file([
      'app/__init__.py',
      'app/api/__init__.py',
      'app/models/__init__.py',
      'app/schemas/__init__.py'
    ]);
  });

  it('creates Python-specific project files', function () {
    assert.fileContent([
      ['.gitignore', /__pycache__\//],
      ['.editorconfig', /\[\*\.py\]/]
    ]);
  });

  it('creates an executable run script', function () {
    assert.fileContent([
      ['run.py', /app\.run\(\)/],
      ['run.py', /#! \/usr\/bin\/env python/]
    ]);
  });

  it('checks for python, pip, and active virtualenv', function () {
    mocks.pythonMock.verify();
  });

  it('sets base configs', function () {
    assert.fileContent([
      ['config.py', /ProductionConfig/],
      ['config.py', /DevelopmentConfig/],
      ['config.py', /TestingConfig/]
    ]);
  });

  it('defaults to production config', function () {
    assert.fileContent([
      ['config.py', /'default': ProductionConfig/],
      ['run.py', /default/]
    ]);
  });

  it('uses blueprints', function () {
    assert.fileContent([
      ['app/__init__.py', /register_blueprint/],
      ['app/api/__init__.py', /Blueprint/]
    ]);

    it('correctly references the api package', function () {
      assert.fileContent([
        ['app/__init__.py', /from \.api import api/],
        ['app/__init__.py', /url_prefix='\/api'/],
        ['api/__init__.py', /Blueprint\('api'/]
      ]);
    });
  });
});

describe('app with name', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withArguments('karate')
      .withOptions({ skipInstall: true })
      .withPrompts({ versioningScheme: 'none' })
      .on('ready', function () {
        sandbox.stub(python, 'whichPython');
        sandbox.stub(python, 'whichPip');
        sandbox.stub(python, 'inVirtualEnv').returns(true);
        sandbox.stub(python, 'linkActiveVirtualEnv');
        sandbox.stub(python, 'pipInstall');
        sandbox.stub(python, 'pipFreeze').returns('');
      })
      .on('end', done);
  });

  after(function () {
    sandbox.restore();
  });

  it('creates expected package structure', function () {
    assert.file([
      'karate/__init__.py',
      'karate/api/__init__.py',
      'karate/models/__init__.py',
      'karate/schemas/__init__.py'
    ]);
  });

  it('correctly references the app directory in the run script', function () {
    assert.fileContent('run.py', /from karate import/);
  });
});

describe('app with virtualenv', function () {
  var mocks = {};

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ versioningScheme: 'none' })
      .on('ready', function () {
        mocks.pythonMock = sandbox.mock(python);
        mocks.pythonMock
          .expects('linkActiveVirtualEnv')
          .withArgs('.')
          .once()
          .callsArgAsync(1);

        sandbox.stub(python, 'whichPython');
        sandbox.stub(python, 'whichPip');
        sandbox.stub(python, 'inVirtualEnv').returns(true);
      })
      .on('end', done);
  });

  after(function () {
    sandbox.restore();
  });

  it('creates a symlink to a python virtual environment', function () {
    mocks.pythonMock.verify();
  });
});

describe('app without virtualenv', function () {
  var mocks = {};

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ versioningScheme: 'none' })
      .on('ready', function () {
        mocks.pythonMock = sandbox.mock(python);
        mocks.pythonMock
          .expects('linkActiveVirtualEnv')
          .never();

        sandbox.stub(python, 'whichPython');
        sandbox.stub(python, 'whichPip');
        sandbox.stub(python, 'inVirtualEnv').returns(false);
      })
      .on('end', done);
  });

  after(function () {
    sandbox.restore();
  });

  it('does not create a symlink to a python virtual environment', function () {
    mocks.pythonMock.verify();
  });
});

describe('app without using system python', function () {
  var mocks = {};

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: false })
      .withPrompts({
        useSystemPython: false,
        versioningScheme: 'none'
      })
      .on('ready', function (generator) {
        mocks.abortMock = sandbox.mock(generator)
          .expects('abort')
          .once();

        sandbox.stub(python, 'whichPython');
        sandbox.stub(python, 'whichPip');
        sandbox.stub(python, 'inVirtualEnv').returns(false);
        sandbox.stub(python, 'pipInstall');
        sandbox.stub(python, 'pipFreeze').returns('');
      })
      .on('end', done);
  });

  after(function () {
    sandbox.restore();
  });

  it('aborts the installation', function () {
    mocks.abortMock.verify();
  });
});

describe('app without python', function () {
  var stubs = {};

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: false })
      .withPrompts({ versioningScheme: 'none' })
      .on('ready', function (generator) {
        stubs.abortStub = sandbox.stub(generator, 'abort');

        sandbox.stub(python, 'whichPython').callsArgWithAsync(0, null, '');
        sandbox.stub(python, 'whichPip');
        sandbox.stub(python, 'inVirtualEnv').returns(false);
        sandbox.stub(python, 'pipInstall');
        sandbox.stub(python, 'pipFreeze').returns('');
      })
      .on('end', done);
  });

  after(function () {
    sandbox.restore();
  });

  it('aborts the installation', function () {
    sinon.assert.calledWith(stubs.abortStub, sinon.match('Python installed'));
  });
});

describe('app without pip', function () {
  var stubs = {};

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: false })
      .withPrompts({ versioningScheme: 'none' })
      .on('ready', function (generator) {
        stubs.abortStub = sandbox.stub(generator, 'abort');

        sandbox.stub(python, 'whichPython');
        sandbox.stub(python, 'whichPip').callsArgWithAsync(0, null, '');
        sandbox.stub(python, 'inVirtualEnv').returns(false);
        sandbox.stub(python, 'pipInstall');
        sandbox.stub(python, 'pipFreeze').returns('');
      })
      .on('end', done);
  });

  after(function () {
    sandbox.restore();
  });

  it('aborts the installation', function () {
    sinon.assert.calledWith(stubs.abortStub, sinon.match('Pip installed'));
  });
});

describe('app with major versioning', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ versioningScheme: 'major' })
      .on('ready', function () {
        sandbox.stub(python, 'whichPython');
        sandbox.stub(python, 'whichPip');
        sandbox.stub(python, 'inVirtualEnv').returns(true);
        sandbox.stub(python, 'linkActiveVirtualEnv');
        sandbox.stub(python, 'pipInstall');
        sandbox.stub(python, 'pipFreeze').returns('');
      })
      .on('end', done);
  });

  after(function () {
    sandbox.restore();
  });

  it('creates expected package structure', function () {
    assert.file([
      'app/api_v1/__init__.py',
    ]);
  });

  it('correctly references the api package', function () {
    assert.fileContent([
      ['app/__init__.py', /from \.api_v1 import api/],
      ['app/__init__.py', /url_prefix='\/api\/v1'/],
      ['app/api_v1/__init__.py', /Blueprint\('api_v1'/]
    ]);
  });
});


describe('app with minor versioning', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ versioningScheme: 'minor' })
      .on('ready', function () {
        sandbox.stub(python, 'whichPython');
        sandbox.stub(python, 'whichPip');
        sandbox.stub(python, 'inVirtualEnv').returns(true);
        sandbox.stub(python, 'linkActiveVirtualEnv');
        sandbox.stub(python, 'pipInstall');
        sandbox.stub(python, 'pipFreeze').returns('');
      })
      .on('end', done);
  });

  after(function () {
    sandbox.restore();
  });

  it('creates expected package structure', function () {
    assert.file([
      'app/api_v1_0/__init__.py',
    ]);
  });

  it('correctly references the api package', function () {
    assert.fileContent([
      ['app/__init__.py', /from \.api_v1_0 import api/],
      ['app/__init__.py', /url_prefix='\/api\/v1\.0'/],
      ['app/api_v1_0/__init__.py', /Blueprint\('api_v1_0'/]
    ]);
  });
});

describe('app with custom url prefix', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ urlPrefix: '/aye/pee/eye' })
      .on('ready', function () {
        sandbox.stub(python, 'whichPython');
        sandbox.stub(python, 'whichPip');
        sandbox.stub(python, 'inVirtualEnv').returns(true);
        sandbox.stub(python, 'linkActiveVirtualEnv');
        sandbox.stub(python, 'pipInstall');
        sandbox.stub(python, 'pipFreeze').returns('');
      })
      .on('end', done);
  });

  after(function () {
    sandbox.restore();
  });

  it('correctly sets the url prefix', function () {
    assert.fileContent([
      ['app/__init__.py', /url_prefix='\/aye\/pee\/eye\/v1'/],
    ]);
  });
});

describe('app without url prefix', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ useUrlPrefix: false })
      .on('ready', function () {
        sandbox.stub(python, 'whichPython');
        sandbox.stub(python, 'whichPip');
        sandbox.stub(python, 'inVirtualEnv').returns(true);
        sandbox.stub(python, 'linkActiveVirtualEnv');
        sandbox.stub(python, 'pipInstall');
        sandbox.stub(python, 'pipFreeze').returns('');
      })
      .on('end', done);
  });

  after(function () {
    sandbox.restore();
  });

  it('correctly sets the url prefix', function () {
    assert.fileContent([
      ['app/__init__.py', /url_prefix='\/v1'/],
    ]);
  });
});

describe('app with install', function () {
  var mocks = {};

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: false })
      .withPrompts({ versioningScheme: 'none' })
      .on('ready', function () {
        mocks.pythonMock = sandbox.mock(python);
        mocks.pythonMock
          .expects('pipInstall')
          .atLeast(2);
        mocks.pythonMock
          .expects('pipFreeze')
          .once()
          .returns('Flask\n');

        sandbox.stub(python, 'whichPython');
        sandbox.stub(python, 'whichPip');
        sandbox.stub(python, 'inVirtualEnv').returns(true);
        sandbox.stub(python, 'linkActiveVirtualEnv');
      })
      .on('end', done);
  });

  after(function () {
    sandbox.restore();
  });

  it('installs and outputs dependencies', function () {
    mocks.pythonMock.verify();
  });

  it('creates a requirements file', function () {
    assert.fileContent('requirements.txt', /Flask/);
  });
});
