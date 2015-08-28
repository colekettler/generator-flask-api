'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('flask api:schema', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/schema'))
      .withArguments('beartato')
      .withOptions({ skipInstall: true })
      .on('end', done);
  });

  it('creates expected files', function () {
    assert.file('app/schemas/beartato.py');
  });

  it('creates a serialization schema', function () {
    assert.fileContent(
      'app/schemas/beartato.py', /class BeartatoSchema\(ma\.ModelSchema\)/
    );
  });
});

describe('flask api:schema as part of resource', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/schema'))
      .withArguments('beartato')
      .withOptions({ skipInstall: true, isGeneratingResource: true})
      .on('end', done);
  });

  it('creates expected files', function () {
    assert.file('app/schemas/beartato.py');
  });
});
