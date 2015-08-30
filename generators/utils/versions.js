'use strict';

function bumpMajorVersion (version) {
  var versionNums = version
    .slice(version.indexOf('v') + 1)
    .split('.');
  var majorVersion = +versionNums[0];

  if (isNaN(majorVersion)) {
    throw new Error('Invalid version string');
  }

  versionNums[0] = majorVersion + 1;
  return 'v' + versionNums.join('.');
}

function bumpMinorVersion (version) {
  var versionNums = version
    .slice(version.indexOf('v') + 1)
    .split('.');
  var majorVersion = +versionNums[0];
  var minorVersion = +versionNums[1];

  if (isNaN(minorVersion) || isNaN(majorVersion)) {
    throw new Error('Invalid version string');
  }

  versionNums[1] = minorVersion + 1;
  return 'v' + versionNums.join('.');
}

module.exports = {
  bumpMajor: bumpMajorVersion,
  bumpMinor: bumpMinorVersion
};
