'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('flask api:endpoint', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/endpoint'))
      .withArguments('beartato')
      .withOptions({ skipInstall: true, force: true })
      .on('end', done);
  });

  it('creates expected files', function () {
    assert.file([
      'app/api/beartato.py'
    ]);
  });

  it('creates an API endpoint', function () {
    assert.fileContent('app/api/beartato.py', /\/beartatos/);
  });
});
