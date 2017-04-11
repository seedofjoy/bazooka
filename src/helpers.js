'use strict';

var IGNORED_ATTRS = ['data-bazid', 'data-bazooka'];

var rbrace = /^(?:\{.*\}|\[.*\])$/;
var rdataAttr = /^data-([a-z\d\-]+)$/;
var rdashAlpha = /-([a-z])/gi;
var fcamelCase = function(all, letter) {
  return letter.toUpperCase();
};

function _parseAttr(prefix, parsedAttrs, attr) {
  if (typeof attr.value !== 'string') {
    return parsedAttrs;
  }

  if (!rdataAttr.test(attr.name) || IGNORED_ATTRS.indexOf(attr.name) !== -1) {
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
      } catch (e) {
        return parsedAttrs;
      }
  }

  parsedAttrs[camelCaseName] = data;
  return parsedAttrs;
}

function _getPrefixedAttrs(prefix, node) {
  return Array.prototype.reduce.call(
    node.attributes,
    _parseAttr.bind(null, prefix),
    {}
  );
}

/**
 * @module h
 * @memberof Bazooka
 */
var h = {};

/**
 * Get all prefixed `data-` attributes as an object
 * @func getAttrs
 * @static
 * @param {string} prefix - `data-`attribute prefix
 * @param {HTMLNode} [node] - target node
 * @returns {function|object} - curried function for parsing node with passed prefix or parsed attrs
 * @example
 * ```javascript
 *   // <div id="n" data-x-a="lol" data-x-b="1" data-y-c='{"key": 1}' data-y-composed-attr="true"></div>
 *   
 *   Baz.h.getAttrs('x', window.n) // => {a: "lol", b: 1}
 *   Baz.h.getAttrs('y', window.n) // => {y: {key: 1}, composedAttr: true}
 *
 *   const xAttrs = Baz.h.getAttrs('x')
 *   xAttrs(window.n) // => {x: "lol", b: 1}
 * ```
 */
h.getAttrs = function(prefix, node) {
  if (typeof prefix === 'string' && node === void 0) {
    return _getPrefixedAttrs.bind(null, prefix);
  }

  return _getPrefixedAttrs(prefix, node);
};

function _prefixDataKey(dataKey) {
  if (!dataKey) {
    throw new Error('dataKey must be non empty');
  }

  if (dataKey.indexOf('data-') === 0) {
    return dataKey;
  } else if (dataKey.indexOf('-') >= 0) {
    return 'data-' + dataKey;
  } else {
    return 'data-' + dataKey.replace(/([A-Z])/g, '-$1').toLowerCase();
  }
}

/**
 * Query children with specific `data-`attribute
 * @func getChildrenWithData
 * @static
 * @param {HTMLNode} parentNode
 * @param {string} dataKey – data-key. `data-baz-key`, `baz-key` and `bazKey` are equivalent
 * @param {string} [dataValue] - value of a `data-`attribute
 * @returns {NodeList}
 * @example
 * ```javascript
 *   // <div id="parent">
 *   //   <div data-user-id="1">yep</div>
 *   //   <div data-user-id="2">nope</div>
 *   // </div>
 *   
 *   Baz.h.getChildrenWithData(window.parent, 'data-user-id', 1)[0].textContent === 'yep'
 *   Baz.h.getChildrenWithData(window.parent, 'user-id', 1)[0].textContent === 'yep'
 *   Baz.h.getChildrenWithData(window.parent, 'userId', 2)[0].textContent === 'nope'
 * ```
 */
h.getChildrenWithData = function(parentNode, dataKey, dataValue) {
  var prefixedDataKey = _prefixDataKey(dataKey);
  var query;

  if (dataValue === void 0) {
    query = '[' + prefixedDataKey + ']';
  } else {
    query = '[' + prefixedDataKey + '="' + dataValue + '"]';
  }

  return parentNode.querySelectorAll(query);
};

module.exports = h;
