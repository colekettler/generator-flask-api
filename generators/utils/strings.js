'use strict';

var _ = require('lodash');
var encoding = require('encoding');
var unorm = require('unorm');

function pascalCase (word) {
  var camelCasedWord = _.camelCase(word);
  return _.capitalize(camelCasedWord);
}

function urlSlug (word) {
  // Just like Mama Django used to make.
  var normalizedWord = unorm.nfkd(word);
  var asciiWord = encoding.convert(normalizedWord, 'ascii').toString();
  return asciiWord
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, '-');
}

module.exports = {
  pascalCase: pascalCase,
  urlSlug: urlSlug
};
