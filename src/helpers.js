'use strict';

var IGNORED_ATTRS = ['data-bazid', 'data-bazooka'];

var rbrace = /^(?:\{.*\}|\[.*\])$/;
var rdataAttr = /^data-([a-z\d\-]+)$/;
var rdashAlpha = /-([a-z])/gi;
var fcamelCase = function (all, letter) {
  return letter.toUpperCase();
};

function _parseAttr(prefix, parsedAttrs, attr) {
  if (typeof attr.value !== 'string') { return parsedAttrs; }

  if ( !rdataAttr.test(attr.name) || IGNORED_ATTRS.indexOf(attr.name) !== -1) {
    return parsedAttrs;
  }

  var attrName = attr.name.match(rdataAttr)[1];

  if (prefix) {
    prefix = prefix.concat('-');
    if (prefix === attrName.slice(0, prefix.length)) {
      attrName = attrName.slice(prefix.length);
    } else {
      return parsedAttrs;
    }
  }

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

function _getPrefixedAttrs(prefix, node) {
  return Array.prototype.reduce.call(node.attributes, _parseAttr.bind(null, prefix), {});
}

/**
 * @param {string} [prefix] - data-attribute prefix
 * @param {HTMLNode} node - target node
 * @returns {function|object} - curried function for parsing node with passed prefix or parsed attrs
 */
var getAttrs = function (prefix, node) {
  if (typeof prefix === 'string' && node === void 0) {
    return _getPrefixedAttrs.bind(null, prefix);
  }

  if (node === void 0) {
    if (process.env.NODE_ENV != 'production') {
      console.warn('`Baz.h.getAttrs(node)` is deprecated. Use `Baz.h.getAttrs(prefix, node)` or `Baz.h.getAttrs(prefix)(node)` instead')
    }
    node = prefix;
    return _getPrefixedAttrs('', node);
  }

  return _getPrefixedAttrs(prefix, node);
};

function _prefixDataKey(dataKey) {
  if (!dataKey) {
    throw new Error('dataKey must be non empty');
  }

  if (dataKey.indexOf('data-') === 0) {
    return dataKey
  } else if (dataKey.indexOf('-') >= 0) {
    return 'data-' + dataKey
  } else {
    return 'data-' + dataKey.replace(/([A-Z])/g, "-$1").toLowerCase()
  }
};

/**
 * @param {HTMLNode} parentNode
 * @param {string} dataKey – data-key. data-baz-key, baz-key and bazKey are equivalent
 * @param {string} [dataValue]
 * @returns {NodeList}
 */
var getChildrenWithData = function (parentNode, dataKey, dataValue) {
  var prefixedDataKey = _prefixDataKey(dataKey);
  var query;

  if (dataValue === void 0) {
    query = '[' + prefixedDataKey + ']'
  } else {
    query = '[' + prefixedDataKey + '="' + dataValue + '"]'
  }

  return parentNode.querySelectorAll(query)
};

module.exports = {
  getAttrs: getAttrs,
  getChildrenWithData: getChildrenWithData
};
