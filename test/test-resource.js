'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;
var sinon = require('sinon');

describe('flask api:resource', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/resource'))
      .withGenerators([
        [helpers.createDummyGenerator(), 'flask-api:endpoint'],
        [helpers.createDummyGenerator(), 'flask-api:model'],
        [helpers.createDummyGenerator(), 'flask-api:schema'],
      ])
      .withArguments('beartato')
      .withOptions({ skipInstall: true })
      .withPrompts({ withRoutes: [] })
      .on('ready', function (generator) {
        this.generator = generator;
        sinon.spy(this.generator, 'composeWith');
      }.bind(this))
      .on('end', done);
  });

  after(function () {
    this.generator.composeWith.restore();
  });

  it('composes with subgenerators', function () {
    sinon.assert.calledThrice(this.generator.composeWith);
  });
});
