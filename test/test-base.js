'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var sinon = require('sinon');

describe('flask api:base pip', function () {
  before(function (done) {
    this.generator = helpers.createGenerator('flask-api:app', [
      path.join(__dirname, '../generators/app')
    ]);

    done();
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
