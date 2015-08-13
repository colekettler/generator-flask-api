'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

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
