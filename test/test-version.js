'use strict';

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var sinon = require('sinon');

describe('version major', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/version'))
      .withOptions({ skipInstall: true })
      .on('ready', function (generator) {
        this.generator = generator;
        generator.config.set('appName', 'app');
        generator.config.set('versioningScheme', 'major');
        generator.config.set('currentVersion', 'v1');
      }.bind(this))
      .on('end', done);
  });

  it('creates expected files', function () {
    assert.file('app/api_v2/__init__.py');
  });

  it('bumps the major version', function () {
    assert.equal(this.generator.config.get('currentVersion'), 'v2');
  });
});

describe('version minor with minor bump', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/version'))
      .withOptions({ skipInstall: true })
      .on('ready', function (generator) {
        this.generator = generator;
        generator.config.set('appName', 'app');
        generator.config.set('versioningScheme', 'minor');
        generator.config.set('currentVersion', 'v1.0');
      }.bind(this))
      .on('end', done);
  });

  it('creates expected files', function () {
    assert.file('app/api_v1_1/__init__.py');
  });

  it('bumps the minor version', function () {
    assert.equal(this.generator.config.get('currentVersion'), 'v1.1');
  });
});

describe('version minor with major bump', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/version'))
      .withOptions({ skipInstall: true })
      .withPrompts({ whichBump: 'major' })
      .on('ready', function (generator) {
        this.generator = generator;
        generator.config.set('appName', 'app');
        generator.config.set('versioningScheme', 'minor');
        generator.config.set('currentVersion', 'v1.0');
      }.bind(this))
      .on('end', done);
  });

  it('creates expected files', function () {
    assert.file('app/api_v2_0/__init__.py');
  });

  it('bumps the minor version', function () {
    assert.equal(this.generator.config.get('currentVersion'), 'v2.0');
  });
});

describe('no versioning', function () {
  var sandbox;
  var mocks = {};

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/version'))
      .withOptions({ skipInstall: true })
      .on('ready', function (generator) {
        this.generator = generator;
        generator.config.set('appName', 'app');
        generator.config.set('versioningScheme', 'none');
        generator.config.set('currentVersion', '');
        this.originalVersion = '';

        sandbox = sinon.sandbox.create();
        mocks.abortMock = sandbox.mock(generator)
          .expects('abort')
          .once();
      }.bind(this))
      .on('end', done);
  });

  after(function () {
    sandbox.restore();
  });

  it('aborts generation', function () {
    mocks.abortMock.verify();
  });

  it('does not bump the version', function () {
    assert.equal(
      this.generator.config.get('currentVersion'),
      this.originalVersion
    );
  });
});
