'use strict';

function extractVersions (version) {
  var versionNums = version
    .slice(version.indexOf('v') + 1)
    .split('.');
  var majorVersion = versionNums[0];
  var minorVersion = versionNums[1];

  majorVersion = +majorVersion;
  if (isNaN(majorVersion)) {
    throw new Error('Invalid major version');
  }
  versionNums[0] = majorVersion;

  if (minorVersion) {
    minorVersion = +minorVersion;
    if (isNaN(minorVersion)) {
      throw new Error('Invalid minor version');
    }
    versionNums[1] = minorVersion;
  }

  return versionNums;
}

function bumpMajorVersion (version) {
  var versionNums = extractVersions(version);
  versionNums[0]++;

  if (versionNums.length > 1) {
    versionNums[1] = 0;
  }

  return 'v' + versionNums.join('.');
}

function bumpMinorVersion (version) {
  var versionNums = extractVersions(version);

  if (versionNums.length < 2) {
    throw new Error('Invalid minor version');
  }

  versionNums[1]++;
  return 'v' + versionNums.join('.');
}

module.exports = {
  bumpMajor: bumpMajorVersion,
  bumpMinor: bumpMinorVersion
};
