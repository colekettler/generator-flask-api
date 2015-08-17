'use strict';

var Buffer = require('buffer').Buffer;
var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var sinon = require('sinon');

describe('flask api:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ someOption: true })
      .on('end', done);
  });

  it('creates expected files', function () {
    assert.file([
      '.gitattributes',
      '.gitignore',
      '.editorconfig',
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
  });
});

describe('flask api:app install', function () {
  // I hate to have to do this, but getting a reference to the generator
  // while preserving the run context is a total mess.
  var mocks = {};

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: false })
      .withPrompts({ someOption: true })
      .on('ready', function (generator) {
        // Pip mocks
        mocks.pipInstallMock = sinon.mock(generator)
          .expects('pipInstall')
          .atLeast(2);

        mocks.pipFreezeMock = sinon.mock(generator)
          .expects('pipFreeze')
          .once()
          .returns('Flask\n');
      })
      .on('end', done);
  });

  it('installs dependencies with pip', function () {
    //console.log(require('util').inspect(appGenerator));
    mocks.pipInstallMock.verify();
  });

  it('creates a requirements file', function () {
    mocks.pipFreezeMock.verify();
    assert.fileContent('requirements.txt', /Flask/);
  });
});

describe('flask api:pip unit', function () {
  before(function (done) {
    this.generator = helpers.createGenerator('flask-api:app', [
      path.join(__dirname, '../generators/app')
    ]);

    done();
  });

  it('calls pip install', function () {
    var stub = sinon.stub(this.generator, 'spawnCommandSync').returnsArg(1);

    var withMultiplePkgs = this.generator.pipInstall(['flask', 'marshmallow']);
    assert.deepEqual(withMultiplePkgs, ['install', 'flask', 'marshmallow']);
    var withOpts = this.generator.pipInstall('marshmallow', '--pre');
    assert.deepEqual(withOpts, ['install', 'marshmallow', '--pre']);

    stub.restore();
  });

  it('calls pip freeze', function () {
    var stub = sinon.stub(this.generator, 'spawnCommandSync').returns(
      { stdout: new Buffer('Flask==0.10.1\nmarshmallow==2.0.0b4\n') }
    );
    var result = this.generator.pipFreeze();

    assert.equal(result,
      'Flask==0.10.1\n' +
      'marshmallow==2.0.0b4\n'
    );

    stub.restore();
  });
});


describe('flask api:inflect unit', function () {
  before(function (done) {
    var generator = helpers.createGenerator('flask-api:app', [
      path.join(__dirname, '../generators/app')
    ]);
    this.inflect = generator.inflect;

    done();
  });

  it('slugifies with hyphens', function () {
    var wordWithSpace = 'party cat';
    assert.equal(this.inflect.slugify(wordWithSpace), 'party-cat');
    var wordWithExtraDashes = 'party--cat';
    assert.equal(this.inflect.slugify(wordWithExtraDashes), 'party-cat');
    var wordWithExtraSpaces = ' party  cat ';
    assert.equal(this.inflect.slugify(wordWithExtraSpaces), 'party-cat');
    var wordWithNonAsciiChars = 'pàrty cat';
    assert.equal(this.inflect.slugify(wordWithNonAsciiChars), 'party-cat');
  });
});
