'use strict';

var cp = require('child_process');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var sinon = require('sinon');

describe('flask api:python', function () {
  before(function (done) {
    this.generator = helpers.createGenerator('flask-api:app', [
      path.join(__dirname, '../generators/app')
    ]);

    // Save environment state.
    this.env = _.cloneDeep(process.env);

    done();
  });

  afterEach(function (done) {
    // Restore environment state.
    process.env = _.cloneDeep(this.env);

    done();
  });

  it('finds the active python binary', function (done) {
    var stub = sinon.stub(cp, 'exec').callsArgWithAsync(
      1, null, new Buffer('/usr/bin/python'), new Buffer('')
    );

    this.generator.whichPython(function (err, stdout) {
      assert.equal(stdout.toString(), '/usr/bin/python');
      done();
    });

    stub.restore();
  });

  it('returns the virtualenv path', function () {
    process.env.VIRTUAL_ENV = '~/.venv/venv';
    assert.equal(this.generator.getVirtualEnv(), '~/.venv/venv');
  });

  it('detects if virtualenv is active', function () {
    process.env.VIRTUAL_ENV = '~/.venv/venv';
    assert(this.generator.inVirtualEnv());
    delete process.env.VIRTUAL_ENV;
    assert(!this.generator.inVirtualEnv());
  });

  it('symlinks to active virtualenv', function () {
    process.env.VIRTUAL_ENV = '~/.venv/venv';
    var stub = sinon.stub(fs, 'symlink');
    stub.onFirstCall().callsArgWithAsync(3, null);
    stub.onSecondCall().callsArgWithAsync(3, new Error('EEXIST'));

    this.generator.linkActiveVirtualEnv('.', function (err) {
      assert(!err);
    });
    this.generator.linkActiveVirtualEnv('.', function (err) {
      assert(err);
    });

    stub.restore();
  });
});

describe('flask api:base pip', function () {
  before(function (done) {
    this.generator = helpers.createGenerator('flask-api:app', [
      path.join(__dirname, '../generators/app')
    ]);

    done();
  });

  it('finds the active pip binary', function (done) {
    var stub = sinon.stub(cp, 'exec').callsArgWithAsync(
      1, null, new Buffer('/usr/bin/pip'), new Buffer('')
    );

    this.generator.whichPip(function (err, stdout) {
      assert.equal(stdout.toString(), '/usr/bin/pip');
      done();
    });

    stub.restore();
  });

  it('calls pip install', function () {
    var stub = sinon.stub(this.generator, 'spawnCommandSync').returnsArg(1);

    var withMultiplePkgs = this.generator.pipInstall(['flask', 'marshmallow']);
    assert.deepEqual(withMultiplePkgs, ['install', 'flask', 'marshmallow']);
    var withOpts = this.generator.pipInstall('marshmallow', '--pre');
    assert.deepEqual(withOpts, ['install', 'marshmallow', '--pre']);

    stub.restore();
  });

  it('calls pip freeze', function () {
    var stub = sinon.stub(this.generator, 'spawnCommandSync').returns(
      { stdout: new Buffer('Flask==0.10.1\nmarshmallow==2.0.0b4\n') }
    );
    var result = this.generator.pipFreeze();

    assert.equal(result,
      'Flask==0.10.1\n' +
      'marshmallow==2.0.0b4\n'
    );

    stub.restore();
  });
});

describe('flask api:base lodash', function () {
  before(function (done) {
    var generator = helpers.createGenerator('flask-api:app', [
      path.join(__dirname, '../generators/app')
    ]);
    this.lodash = generator.lodash;

    done();
  });

  it('converts to pascal case', function () {
    var wordWithSpace = 'party cat';
    assert.equal(this.lodash.pascalCase(wordWithSpace), 'PartyCat');
    var wordWithUnderscores = '__party_cat__';
    assert.equal(this.lodash.pascalCase(wordWithUnderscores), 'PartyCat');
    var wordWithDashes = '--party-cat--';
    assert.equal(this.lodash.pascalCase(wordWithDashes), 'PartyCat');
    var wordWithExtraSpaces = ' party  cat ';
    assert.equal(this.lodash.pascalCase(wordWithExtraSpaces), 'PartyCat');
  });

  it('converts to a url slug', function () {
    var wordWithSpace = 'party cat';
    assert.equal(this.lodash.urlSlug(wordWithSpace), 'party-cat');
    var wordWithExtraDashes = 'party--cat';
    assert.equal(this.lodash.urlSlug(wordWithExtraDashes), 'party-cat');
    var wordWithExtraSpaces = ' party  cat ';
    assert.equal(this.lodash.urlSlug(wordWithExtraSpaces), 'party-cat');
    var wordWithNonAsciiChars = 'pàrty cat';
    assert.equal(this.lodash.urlSlug(wordWithNonAsciiChars), 'party-cat');
  });
});

describe('flask api:base abort', function () {
  before(function (done) {
    this.generator = helpers.createGenerator('flask-api:app', [
      path.join(__dirname, '../generators/app')
    ]);
    done();
  });

  it('aborts installation with message', function () {
    var logMock = sinon.mock(this.generator)
          .expects('log')
          .once();
    var errorMock = sinon.mock(this.generator.env)
          .expects('error')
          .once();

    this.generator.abort('deal with it');

    logMock.verify();
    errorMock.verify();
  });
});
