'use strict';

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var sinon = require('sinon');

describe('base', function () {
  before(function () {
    this.generator = helpers.createGenerator('flask-api:app', [
      path.join(__dirname, '../generators/app')
    ]);
  });

  describe('abort', function () {
    it('aborts installation with message', sinon.test(function () {
      var logMock = this.mock(this.generator)
        .expects('log')
        .once();
      var errorMock = this.mock(this.generator.env)
        .expects('error')
        .once();

      this.generator.abort('deal with it');

      logMock.verify();
      errorMock.verify();
    }));
  });

  describe('getApiModuleName', function () {
    it('generates a major versioned api module name', sinon.test(function () {
      var configGetStub = this.stub(this.generator.config, 'get');
      configGetStub.withArgs('versioningScheme').returns('major');
      configGetStub.withArgs('currentVersion').returns('v1');

      var apiModule = this.generator.getApiModuleName();
      assert.equal(apiModule, 'api_v1');
    }));

    it('generates a minor versioned api module name', sinon.test(function () {
      var configGetStub = this.stub(this.generator.config, 'get');
      configGetStub.withArgs('versioningScheme').returns('minor');
      configGetStub.withArgs('currentVersion').returns('v1.0');

      var apiModule = this.generator.getApiModuleName();
      assert.equal(apiModule, 'api_v1_0');
    }));

    it('generates a versionless api module name', sinon.test(function () {
      var configGetStub = this.stub(this.generator.config, 'get');
      configGetStub.withArgs('versioningScheme').returns('none');
      configGetStub.withArgs('currentVersion').returns('');

      var apiModule = this.generator.getApiModuleName();
      assert.equal(apiModule, 'api');
    }));
  });

  describe('getApiUrlName', function () {
    it('generates a major versioned api url name', sinon.test(function () {
      var configGetStub = this.stub(this.generator.config, 'get');
      configGetStub.withArgs('versioningScheme').returns('major');
      configGetStub.withArgs('currentVersion').returns('v1');
      configGetStub.withArgs('urlPrefix').returns('/api');

      var apiUrl = this.generator.getApiUrlName();
      assert.equal(apiUrl, '/api/v1');
    }));

    it('generates a minor versioned api url name', sinon.test(function () {
      var configGetStub = this.stub(this.generator.config, 'get');
      configGetStub.withArgs('versioningScheme').returns('minor');
      configGetStub.withArgs('currentVersion').returns('v1.0');
      configGetStub.withArgs('urlPrefix').returns('/api');

      var apiUrl = this.generator.getApiUrlName();
      assert.equal(apiUrl, '/api/v1.0');
    }));

    it('generates a versionless api url name', sinon.test(function () {
      var configGetStub = this.stub(this.generator.config, 'get');
      configGetStub.withArgs('versioningScheme').returns('none');
      configGetStub.withArgs('currentVersion').returns('');
      configGetStub.withArgs('urlPrefix').returns('/api');

      var apiUrl = this.generator.getApiUrlName();
      assert.equal(apiUrl, '/api');
    }));

    it('generates a custom-prefixed api url name', sinon.test(function () {
      var configGetStub = this.stub(this.generator.config, 'get');
      configGetStub.withArgs('versioningScheme').returns('major');
      configGetStub.withArgs('currentVersion').returns('v1');
      configGetStub.withArgs('urlPrefix').returns('/wharrgarbl');

      var apiUrl = this.generator.getApiUrlName();
      assert.equal(apiUrl, '/wharrgarbl/v1');
    }));

    it('generates a non-prefixed api url name', sinon.test(function () {
      var configGetStub = this.stub(this.generator.config, 'get');
      configGetStub.withArgs('versioningScheme').returns('major');
      configGetStub.withArgs('currentVersion').returns('v1');
      configGetStub.withArgs('urlPrefix').returns('');

      var apiUrl = this.generator.getApiUrlName();
      assert.equal(apiUrl, '/v1');
    }));
  });
});
