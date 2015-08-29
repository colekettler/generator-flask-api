'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('flask api:version major', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/version'))
      .withOptions({ skipInstall: true })
      .on('ready', function (generator) {
        generator.config.set('versioningScheme', 'major');
        generator.config.set('currentVersion', 'v1');
        this.generator = generator;
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

describe('flask api:version minor with minor bump', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/version'))
      .withOptions({ skipInstall: true })
      .on('ready', function (generator) {
        generator.config.set('versioningScheme', 'minor');
        generator.config.set('currentVersion', 'v1.0');
        this.generator = generator;
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

describe('flask api:version minor with major bump', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/version'))
      .withOptions({ skipInstall: true })
      .withPrompts({ whichBump: 'major' })
      .on('ready', function (generator) {
        generator.config.set('versioningScheme', 'minor');
        generator.config.set('currentVersion', 'v1.0');
        this.generator = generator;
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
