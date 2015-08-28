'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var sinon = require('sinon');

describe('flask api:app', function () {
  var mocks = {};
  var stubs = {};

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ versioningScheme: 'none' })
      .on('ready', function (generator) {
        mocks.whichPythonMock = sinon.mock(generator)
          .expects('whichPython')
          .once()
          .callsArgWithAsync(0, null, '~/.venv/venv/bin/python');

        mocks.whichPipMock = sinon.mock(generator)
          .expects('whichPip')
          .once()
          .callsArgWithAsync(0, null, '~/.venv/venv/bin/pip');

        mocks.inVirtualEnvMock = sinon.mock(generator)
          .expects('inVirtualEnv')
          .atLeast(1)
          .returns(true);

        stubs.linkActiveVirtualEnvStub = sinon.stub(
          generator, 'linkActiveVirtualEnv'
        );
      })
      .on('end', done);
  });

  after(function () {
    for (var stub in stubs) {
      stubs[stub].restore();
    }
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
    mocks.whichPythonMock.verify();
    mocks.whichPipMock.verify();
    mocks.inVirtualEnvMock.verify();
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

describe('flask api:app with virtualenv', function () {
  var mocks = {};
  var stubs = {};

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ versioningScheme: 'none' })
      .on('ready', function (generator) {
        mocks.linkActiveVirtualEnvMock = sinon.mock(generator)
          .expects('linkActiveVirtualEnv')
          .withArgs('.')
          .once()
          .callsArgAsync(1);

        stubs.whichPythonStub = sinon.stub(generator, 'whichPython');
        stubs.whichPipStub = sinon.stub(generator, 'whichPip');
        stubs.inVirtualEnvStub = sinon.stub(generator, 'inVirtualEnv')
          .returns(true);
      })
      .on('end', done);
  });

  after(function () {
    for (var stub in stubs) {
      stubs[stub].restore();
    }
  });

  it('creates a symlink to a python virtual environment', function () {
    mocks.linkActiveVirtualEnvMock.verify();
  });
});

describe('flask api:app without virtualenv', function () {
  var mocks = {};
  var stubs = {};

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ versioningScheme: 'none' })
      .on('ready', function (generator) {
        mocks.linkActiveVirtualEnvMock = sinon.mock(generator)
          .expects('linkActiveVirtualEnv')
          .never();

        stubs.whichPythonStub = sinon.stub(generator, 'whichPython');
        stubs.whichPipStub = sinon.stub(generator, 'whichPip');
        stubs.inVirtualEnvStub = sinon.stub(generator, 'inVirtualEnv')
          .returns(false);
      })
      .on('end', done);
  });

  after(function () {
    for (var stub in stubs) {
      stubs[stub].restore();
    }
  });

  it('does not create a symlink to a python virtual environment', function () {
    mocks.linkActiveVirtualEnvMock.verify();
  });
});

describe('flask api:app does not use system python', function () {
  var mocks = {};
  var stubs = {};

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: false })
      .withPrompts({
        useSystemPython: false,
        versioningScheme: 'none'
      })
      .on('ready', function (generator) {
        mocks.abortMock = sinon.mock(generator)
          .expects('abort')
          .once();

        stubs.whichPythonStub = sinon.stub(generator, 'whichPython');
        stubs.whichPipStub = sinon.stub(generator, 'whichPip');
        stubs.inVirtualEnvStub = sinon.stub(generator, 'inVirtualEnv')
          .returns(false);
        stubs.pipInstallStub = sinon.stub(generator, 'pipInstall');
        stubs.pipFreezeStub = sinon.stub(generator, 'pipFreeze')
          .returns('');
      })
      .on('end', done);
  });

  after(function () {
    for (var stub in stubs) {
      stubs[stub].restore();
    }
  });

  it('aborts the installation', function () {
    mocks.abortMock.verify();
  });
});

describe('flask api:app no python', function () {
  var stubs = {};

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: false })
      .withPrompts({ versioningScheme: 'none' })
      .on('ready', function (generator) {
        stubs.abortStub = sinon.stub(generator, 'abort');
        stubs.whichPythonStub = sinon.stub(generator, 'whichPython')
          .callsArgWithAsync(0, null, '');
        stubs.whichPipStub = sinon.stub(generator, 'whichPip');
        stubs.inVirtualEnvStub = sinon.stub(generator, 'inVirtualEnv')
          .returns(false);
        stubs.pipInstallStub = sinon.stub(generator, 'pipInstall');
        stubs.pipFreezeStub = sinon.stub(generator, 'pipFreeze')
          .returns('');
      })
      .on('end', done);
  });

  after(function () {
    for (var stub in stubs) {
      stubs[stub].restore();
    }
  });

  it('aborts the installation', function () {
    sinon.assert.calledWith(stubs.abortStub, sinon.match('Python installed'));
  });
});

describe('flask api:app no pip', function () {
  var stubs = {};

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: false })
      .withPrompts({ versioningScheme: 'none' })
      .on('ready', function (generator) {
        stubs.abortStub = sinon.stub(generator, 'abort');
        stubs.whichPythonStub = sinon.stub(generator, 'whichPython');
        stubs.whichPipStub = sinon.stub(generator, 'whichPip')
          .callsArgWithAsync(0, null, '');
        stubs.inVirtualEnvStub = sinon.stub(generator, 'inVirtualEnv')
          .returns(false);
        stubs.pipInstallStub = sinon.stub(generator, 'pipInstall');
        stubs.pipFreezeStub = sinon.stub(generator, 'pipFreeze')
          .returns('');
      })
      .on('end', done);
  });

  after(function () {
    for (var stub in stubs) {
      stubs[stub].restore();
    }
  });

  it('aborts the installation', function () {
    sinon.assert.calledWith(stubs.abortStub, sinon.match('Pip installed'));
  });
});

describe('flask api:app major versioning', function () {
  var stubs = {};

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ versioningScheme: 'major' })
      .on('ready', function (generator) {
        stubs.whichPythonStub = sinon.stub(generator, 'whichPython');
        stubs.whichPipStub = sinon.stub(generator, 'whichPip');
        stubs.inVirtualEnvStub = sinon.stub(generator, 'inVirtualEnv')
          .returns(true);
        stubs.linkActiveVirtualEnvStub = sinon.stub(
          generator, 'linkActiveVirtualEnv'
        );
        stubs.pipInstallStub = sinon.stub(generator, 'pipInstall');
        stubs.pipFreezeStub = sinon.stub(generator, 'pipFreeze')
          .returns('');
      })
      .on('end', done);
  });

  after(function () {
    for (var stub in stubs) {
      stubs[stub].restore();
    }
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


describe('flask api:app minor versioning', function () {
  var stubs = {};

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ versioningScheme: 'minor' })
      .on('ready', function (generator) {
        stubs.whichPythonStub = sinon.stub(generator, 'whichPython');
        stubs.whichPipStub = sinon.stub(generator, 'whichPip');
        stubs.inVirtualEnvStub = sinon.stub(generator, 'inVirtualEnv')
          .returns(true);
        stubs.linkActiveVirtualEnvStub = sinon.stub(
          generator, 'linkActiveVirtualEnv'
        );
        stubs.pipInstallStub = sinon.stub(generator, 'pipInstall');
        stubs.pipFreezeStub = sinon.stub(generator, 'pipFreeze')
          .returns('');
      })
      .on('end', done);
  });

  after(function () {
    for (var stub in stubs) {
      stubs[stub].restore();
    }
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

describe('flask api:app install', function () {
  var mocks = {};
  var stubs = {};

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: false })
      .withPrompts({ versioningScheme: 'none' })
      .on('ready', function (generator) {
        mocks.pipInstallMock = sinon.mock(generator)
          .expects('pipInstall')
          .atLeast(2);

        mocks.pipFreezeMock = sinon.mock(generator)
          .expects('pipFreeze')
          .once()
          .returns('Flask\n');

        stubs.whichPythonStub = sinon.stub(generator, 'whichPython');
        stubs.whichPipStub = sinon.stub(generator, 'whichPip');
        stubs.inVirtualEnvStub = sinon.stub(generator, 'inVirtualEnv')
          .returns(true);
        stubs.linkActiveVirtualEnvStub = sinon.stub(
          generator, 'linkActiveVirtualEnv'
        );
      })
      .on('end', done);
  });

  it('installs dependencies with pip', function () {
    mocks.pipInstallMock.verify();
  });

  it('creates a requirements file', function () {
    mocks.pipFreezeMock.verify();
    assert.fileContent('requirements.txt', /Flask/);
  });
});
