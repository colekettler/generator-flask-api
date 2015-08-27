'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('flask api:resource', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/resource'))
      .withGenerators([
        path.join(__dirname, '../generators/endpoint'),
        path.join(__dirname, '../generators/model'),
        path.join(__dirname, '../generators/schema')
      ])
      .withArguments('beartato')
      .withOptions({ skipInstall: true, force: true })
      .withPrompts({ withRoutes: [] })
      .on('end', done);
  });

  it('creates expected files', function () {
    assert.file([
      'app/api/beartato.py',
      'app/models/beartato.py',
      'app/schemas/beartato.py'
    ]);
  });
});
