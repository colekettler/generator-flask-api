'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('endpoint without methods', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/endpoint'))
      .withArguments('beartato')
      .withOptions({ skipInstall: true })
      .withPrompts({ withRoutes: [] })
      .on('ready', function (generator) {
        generator.config.set('appName', 'app');
        generator.config.set('versioningScheme', 'none');
        generator.config.set('currentVersion', '');
      })
      .on('end', done);
  });

  it('creates expected files', function () {
    assert.file('app/api/beartato.py');
  });

  it('does not create any routes', function () {
    assert.noFileContent('app/api/beartato.py', /\.route/);
  });
});

describe('endpoint with methods', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/endpoint'))
      .withArguments('reginald')
      .withOptions({ skipInstall: true })
      .withPrompts({
        withRoutes: ['getRoute', 'postRoute', 'putRoute', 'deleteRoute']
      })
      .on('ready', function (generator) {
        generator.config.set('appName', 'app');
        generator.config.set('versioningScheme', 'none');
        generator.config.set('currentVersion', '');
      })
      .on('end', done);
  });

  it('creates expected files', function () {
    assert.file('app/api/reginald.py');
  });

  it('creates a GET list route', function () {
    assert.fileContent([
      ['app/api/reginald.py', /'\/reginalds', methods=\['GET'\]/],
      ['app/api/reginald.py', /get_reginalds\(\):/]
    ]);
  });

  it('creates a GET route', function () {
    assert.fileContent([
      ['app/api/reginald.py', /'\/reginalds\/<int:id>', methods=\['GET'\]/],
      ['app/api/reginald.py', /get_reginald\(id\):/]
    ]);
  });

  it('creates a POST route', function () {
    assert.fileContent([
      ['app/api/reginald.py', /'\/reginalds', methods=\['POST'\]/],
      ['app/api/reginald.py', /create_reginald\(\):/]
    ]);
  });

  it('creates a PUT route', function () {
    assert.fileContent([
      ['app/api/reginald.py', /'\/reginalds\/<int:id>', methods=\['PUT'\]/],
      ['app/api/reginald.py', /update_reginald\(id\):/]
    ]);
  });

  it('creates a DELETE route', function () {
    assert.fileContent([
      ['app/api/reginald.py', /'\/reginalds\/<int:id>', methods=\['DELETE'\]/],
      ['app/api/reginald.py', /delete_reginald\(id\):/]
    ]);
  });
});

describe('endpoint with versioning', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/endpoint'))
      .withArguments('beartato')
      .withOptions({ skipInstall: true })
      .withPrompts({ withRoutes: [] })
      .on('ready', function (generator) {
        generator.config.set('appName', 'app');
        generator.config.set('versioningScheme', 'major');
        generator.config.set('currentVersion', 'v2');
      })
      .on('end', done);
  });

  it('creates expected files', function () {
    assert.file('app/api_v2/beartato.py');
  });
});

describe('endpoint as part of resource', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/endpoint'))
      .withArguments('beartato')
      .withOptions({ skipInstall: true, isGeneratingResource: true })
      .withPrompts({ withRoutes: [] })
      .on('ready', function (generator) {
        generator.config.set('appName', 'app');
        generator.config.set('versioningScheme', 'none');
        generator.config.set('currentVersion', '');
      })
      .on('end', done);
  });

  it('creates expected files', function () {
    assert.file('app/api/beartato.py');
  });
});
