'use strict';

var path = require('path');
var helpers = require('yeoman-test');
var sinon = require('sinon');

describe('resource', function () {
  var sandbox;

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
        generator.config.set('appName', 'app');

        sandbox = sinon.sandbox.create();
        sandbox.spy(this.generator, 'composeWith');
      }.bind(this))
      .on('end', done);
  });

  after(function () {
    sandbox.restore();
  });

  it('composes with subgenerators', function () {
    sinon.assert.calledThrice(this.generator.composeWith);
  });
});
