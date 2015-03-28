'use strict';

var IGNORED_ATTRS = ['data-bazid', 'data-bazooka'];

var rbrace = /^(?:\{.*\}|\[.*\])$/;
var rdataAttr = /^data-(.+)$/;
var rdashAlpha = /-([\da-z])/gi;
var fcamelCase = function (all, letter) {
  return letter.toUpperCase();
};

function _parseAttr(parsedAttrs, attr) {
  if (typeof attr.value !== 'string') { return parsedAttrs; }

  if ( !rdataAttr.test(attr.name) || IGNORED_ATTRS.indexOf(attr.name) !== -1) {
      return parsedAttrs;
  }

  var attrName = attr.name.match(rdataAttr)[1];
  var camelCaseName = attrName.replace(rdashAlpha, fcamelCase);

  var data;

  switch (attr.value) {
    case 'true':
      data = true;
      break;
    case 'false':
      data = false;
      break;
    case 'null':
      data = null;
      break;
    default:
      try {
        if (attr.value === +attr.value + '') {
          data = +attr.value;
        } else if (rbrace.test(attr.value)) {
          data = JSON.parse(attr.value);
        } else {
          data = attr.value;
        }
      } catch (e) { return parsedAttrs; }
  }

  parsedAttrs[camelCaseName] = data;
  return parsedAttrs;
}

var getAttrs = function (node) {
  return Array.prototype.reduce.call(node.attributes, _parseAttr, {});
};

module.exports = {
  getAttrs: getAttrs
};
