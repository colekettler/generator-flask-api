'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('flask api:model', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/model'))
      .withArguments('beartato')
      .withOptions({ skipInstall: true, force: true })
      .on('end', done);
  });

  it('creates expected files', function () {
    assert.file([
      'app/models/beartato.py'
    ]);
  });

  it('creates a database model', function () {
    assert.fileContent('app/models/beartato.py', /class Beartato\(db\.Model\)/);
  });
});
