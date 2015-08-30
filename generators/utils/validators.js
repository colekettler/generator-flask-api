'use strict';

var _ = require('lodash');

function validateUrlPrefix (value) {
  if (!_.startsWith(value, '/')) {
    return 'Prefixes should start with a forward slash "\/".';
  }
  if (_.endsWith(value, '/')) {
    return 'Prefixes should not end with a trailing forward slash "\/".';
  }
  if (/\/{2,}/.test(value)) {
    return 'Prefixes should not have consecutive forward slashes "\/".';
  }
  return true;
}

module.exports = {
  validateUrlPrefix: validateUrlPrefix
};
