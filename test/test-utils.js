'use strict';

var cp = require('child_process');
var fs = require('fs');
var _ = require('lodash');
var assert = require('yeoman-generator').assert;
var sinon = require('sinon');
var spawn = require('cross-spawn');
var filters = require('../generators/utils/filters');
var python = require('../generators/utils/python');
var strings = require('../generators/utils/strings');
var validators = require('../generators/utils/validators');
var versions = require('../generators/utils/versions');

describe('utils filters', function () {
  describe('filterUrlPrefix', function () {
    it('converts url prefix components to slugs', function () {
      var singleComponent = '/a.p\i';
      assert.equal(filters.filterUrlPrefix(singleComponent), '/api');
      var multipleComponents = '/àye/pee/èye';
      assert.equal(filters.filterUrlPrefix(multipleComponents), '/aye/pee/eye');
    });
  });
});

describe('utils python', function () {
  beforeEach(function () {
    // Save environment state.
    this.env = _.cloneDeep(process.env);
  });

  afterEach(function () {
    // Restore environment state.
    process.env = _.cloneDeep(this.env);
  });

  it('finds the active python binary', sinon.test(function (done) {
    this.stub(cp, 'exec').callsArgWithAsync(
      1, null, new Buffer('/usr/bin/python'), new Buffer('')
    );

    python.whichPython(function (err, stdout) {
      assert.equal(stdout.toString(), '/usr/bin/python');
      done();
    });
  }));

  it('returns the virtualenv path', function () {
    process.env.VIRTUAL_ENV = '~/.venv/venv';
    assert.equal(python.getVirtualEnv(), '~/.venv/venv');
  });

  it('detects if virtualenv is active', function () {
    process.env.VIRTUAL_ENV = '~/.venv/venv';
    assert(python.inVirtualEnv());
    delete process.env.VIRTUAL_ENV;
    assert(!python.inVirtualEnv());
  });

  it('symlinks to active virtualenv', sinon.test(function () {
    process.env.VIRTUAL_ENV = '~/.venv/venv';
    this.stub(fs, 'symlink')
      .onFirstCall().callsArgWithAsync(3, null)
      .onSecondCall().callsArgWithAsync(3, new Error('EEXIST'));

    python.linkActiveVirtualEnv('.', function (err) {
      assert(!err);
    });
    python.linkActiveVirtualEnv('.', function (err) {
      assert(err);
    });
  }));

  it('finds the active pip binary', sinon.test(function (done) {
    this.stub(cp, 'exec').callsArgWithAsync(
      1, null, new Buffer('/usr/bin/pip'), new Buffer('')
    );

    python.whichPip(function (err, stdout) {
      assert.equal(stdout.toString(), '/usr/bin/pip');
      done();
    });
  }));

  it('calls pip install', sinon.test(function () {
    this.stub(spawn, 'sync').returnsArg(1);

    var withMultiplePkgs = python.pipInstall(['flask', 'marshmallow']);
    assert.deepEqual(withMultiplePkgs, ['install', 'flask', 'marshmallow']);
    var withOpts = python.pipInstall('marshmallow', '--pre');
    assert.deepEqual(withOpts, ['install', 'marshmallow', '--pre']);
  }));

  it('calls pip freeze', sinon.test(function () {
    this.stub(spawn, 'sync').returns(
      { stdout: new Buffer('Flask==0.10.1\nmarshmallow==2.0.0b4\n') }
    );

    var result = python.pipFreeze();
    assert.equal(result,
      'Flask==0.10.1\n' +
      'marshmallow==2.0.0b4\n'
    );
  }));
});

describe('utils strings', function () {
  describe('pascalCase', function () {
    it('converts to pascal case', function () {
      var wordWithSpace = 'party cat';
      assert.equal(strings.pascalCase(wordWithSpace), 'PartyCat');
      var wordWithUnderscores = '__party_cat__';
      assert.equal(strings.pascalCase(wordWithUnderscores), 'PartyCat');
      var wordWithDashes = '--party-cat--';
      assert.equal(strings.pascalCase(wordWithDashes), 'PartyCat');
      var wordWithExtraSpaces = ' party  cat ';
      assert.equal(strings.pascalCase(wordWithExtraSpaces), 'PartyCat');
    });
  });

  describe('urlSlug', function () {
    it('converts to a url slug', function () {
      var wordWithSpace = 'party cat';
      assert.equal(strings.urlSlug(wordWithSpace), 'party-cat');
      var wordWithExtraDashes = 'party--cat';
      assert.equal(strings.urlSlug(wordWithExtraDashes), 'party-cat');
      var wordWithExtraSpaces = ' party  cat ';
      assert.equal(strings.urlSlug(wordWithExtraSpaces), 'party-cat');
      var wordWithNonAsciiChars = 'pàrty cat';
      assert.equal(strings.urlSlug(wordWithNonAsciiChars), 'party-cat');
    });
  });
});

describe('utils validators', function () {
  describe('validateUrlPrefix', function () {
    it('accepts valid prefixes', function () {
      var singleComponent = '/api';
      assert(validators.validateUrlPrefix(singleComponent));
      var multipleComponents = '/aye/pee/eye';
      assert(validators.validateUrlPrefix(multipleComponents));
    });

    it('rejects invalid prefixes', function () {
      var noLeadingSlash = 'api';
      assert.notEqual(validators.validateUrlPrefix(noLeadingSlash), true);
      var trailingSlash = '/api/';
      assert.notEqual(validators.validateUrlPrefix(trailingSlash), true);
      var duplicateSlashes = '/aye//pee/eye';
      assert.notEqual(validators.validateUrlPrefix(duplicateSlashes), true);
    });
  });
});

describe('utils versions', function () {
  describe('bumpMajor', function () {
    it('increments the major version', function () {
      var currentVersion = 'v1';
      assert.equal(versions.bumpMajor(currentVersion), 'v2');
    });

    it('increments the major version in a minor version string', function () {
      var currentVersion = 'v1.0';
      assert.equal(versions.bumpMajor(currentVersion), 'v2.0');
    });

    it('throws an error if given an invalid version string', function () {
      var invalidVersion = 'vA';
      assert.throws(
        versions.bumpMajor.bind(null, invalidVersion),
        /invalid/i
      );
    });
  });

  describe('bumpMinor', function () {
    it('increments the minor version', function () {
      var currentVersion = 'v1.0';
      assert.equal(versions.bumpMinor(currentVersion), 'v1.1');
    });

    it('throws an error if not given a minor version string', function () {
      var invalidVersion = 'v1';
      assert.throws(
        versions.bumpMinor.bind(null, invalidVersion),
        /invalid/i
      );
    });

    it('throws an error if given an invalid version string', function () {
      var invalidMinorVersion = 'v1.A';
      assert.throws(
        versions.bumpMinor.bind(null, invalidMinorVersion),
        /invalid/i
      );
      var invalidMajorVersion = 'vA.1';
      assert.throws(
        versions.bumpMinor.bind(null, invalidMajorVersion),
        /invalid/i
      );
    });
  });
});
