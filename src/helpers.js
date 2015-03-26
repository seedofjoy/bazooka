'use strict';

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;
var rdataAttr = /^data-(.+)$/;
var rdashAlpha = /-([\da-z])/gi;
var fcamelCase = function (all, letter) {
  return letter.toUpperCase();
};

var getAttrs = function (node) {
  var ignoredAttrs = ['data-bazid', 'data-bazooka'];
  var parsedAttrs = {};

  Array.prototype.forEach.call(node.attributes, function (attr) {
    if ( !(rdataAttr.test(attr.name) && ignoredAttrs.indexOf(attr.name) === -1) ) {
        return;
    }

    var data = attr.value;
    var attrName = attr.name.match(rdataAttr)[1];
    var camelCaseName = attrName.replace(rdashAlpha, fcamelCase);

    if (typeof data === 'string') {
      try {
        if (data === 'true') {
          data = true;
        } else if (data === 'false') {
          data = false;
        } else if (data === 'null') {
          data = null;
        } else if (data === +data + '') {
          data = +data;
        } else if (rbrace.test(data)) {
          data = JSON.parse(data);
        }
      } catch (e) {}
    } else {
      data = undefined;
    }
    parsedAttrs[camelCaseName] = data;
  });

  return parsedAttrs;
};

module.exports = {
  getAttrs: getAttrs
};
