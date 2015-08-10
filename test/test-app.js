'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('flask api:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ someOption: true })
      .on('end', done);
  });

  it('creates expected files', function () {
    assert.file([
      'config.py',
      'run.py',
      'requirements.txt',
      '.gitattributes',
      '.gitignore',
      '.editorconfig'
    ]);
  });
});
