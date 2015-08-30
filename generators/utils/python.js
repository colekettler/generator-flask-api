'use strict';

var cp = require('child_process');
var fs = require('fs');
var path = require('path');
var spawn = require('cross-spawn');

function whichPython (cb) {
  return cp.exec('which python', cb);
}

function getVirtualEnv () {
  return process.env.VIRTUAL_ENV;
}

function inVirtualEnv () {
  var virtualEnv = getVirtualEnv();
  return virtualEnv && virtualEnv.length > 0;
}

function linkActiveVirtualEnv (basedir, cb) {
  var virtualEnv = getVirtualEnv();
  var dstpath = path.join(basedir, 'venv');
  return fs.symlink(virtualEnv, dstpath, 'dir', cb);
}

function whichPip (cb) {
  return cp.exec('which pip', cb);
}

function pipInstall (pkgs, options) {
  pkgs = Array.isArray(pkgs) ? pkgs : [pkgs];
  options = options || [];

  var args = pkgs.concat(options);
  args.unshift('install');

  return spawn.sync('pip', args, { stdio: 'inherit' });
}

function pipFreeze () {
  var output = spawn.sync('pip', ['freeze'], { stdio: 'pipe' });
  return output.stdout.toString();
}

module.exports = {
  whichPython: whichPython,
  getVirtualEnv: getVirtualEnv,
  inVirtualEnv: inVirtualEnv,
  linkActiveVirtualEnv: linkActiveVirtualEnv,
  whichPip: whichPip,
  pipInstall: pipInstall,
  pipFreeze: pipFreeze
};
