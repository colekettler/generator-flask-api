'use strict';

var _ = require('lodash');
var strings = require('./strings');

function filterUrlPrefix (value) {
  var components = value.split('/');
  components = _.map(components, strings.urlSlug);
  return components.join('/');
}

module.exports = {
  filterUrlPrefix: filterUrlPrefix
};
