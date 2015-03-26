(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Baz = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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

},{}],2:[function(_dereq_,module,exports){
'use strict';

var _bazId = 0;
var nodesComponentsRegistry = {};
var componentsRegistry = {};
var wrappersRegistry = {};

if (!Function.prototype.bind) {
  // Credits to https://github.com/kdimatteo/bind-polyfill
  // Solves https://github.com/ariya/phantomjs/issues/10522
  /* eslint-disable no-extend-native */
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
      fToBind = this,
      fNOP = function () {},
      fBound = function () {
        return fToBind.apply(
          this instanceof fNOP && oThis ? this : oThis,
          aArgs.concat(Array.prototype.slice.call(arguments))
        );
      };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
  /* eslint-enable no-extend-native */
}

function _getOrRequireComponent(name) {
  if (componentsRegistry[name] === void 0) {
    componentsRegistry[name] = _dereq_(name);
  }

  return componentsRegistry[name];
}

function _bindComponentToNode(wrappedNode, componentName) {
  var bazId = wrappedNode.id;

  if (nodesComponentsRegistry[bazId] === void 0) {
    nodesComponentsRegistry[bazId] = [];
  }

  if (nodesComponentsRegistry[bazId].indexOf(componentName) === -1) {
    nodesComponentsRegistry[bazId].push(componentName);
    var component = _getOrRequireComponent(componentName);
    var bazFunc;

    if (component.bazFunc) {
      bazFunc = component.bazFunc;
    } else {
      bazFunc = component;
    }

    bazFunc(wrappedNode.__wrapped__);
  }
}

function BazookaWrapper(node) {
  var bazId = node.getAttribute('data-bazid');

  if (bazId == null) {
    bazId = (_bazId++).toString();
    node.setAttribute('data-bazid', bazId);
    wrappersRegistry[bazId] = this;
  }

  this.__wrapped__ = node;
  /**
   * Internal id
   * @name Bazooka.id
   * @type {string}
   * @memberof Bazooka
   * @instance
   */
  this.id = bazId;
}

BazookaWrapper.prototype.constructor = BazookaWrapper;

function _wrapAndBindNode(node) {
  var componentName = node.getAttribute('data-bazooka');
  var wrappedNode = new BazookaWrapper(node);

  _bindComponentToNode(wrappedNode, componentName);
}

/** @class Bazooka */

/**
 * @namespace BazComponent
 * @description Interface of component, required by [Bazooka.refresh]{@link module:Bazooka.refresh}
 */

/**
 * @name simple
 * @func
 * @memberof BazComponent
 * @param {node} - bound DOM node
 * @description CommonJS module written only with Bazooka interface to be used with `data-bazooka`
 * @example
 * ```javascript
 *   module.exports = function bazFunc(node) {}
 * ```
 */

/**
 * @name universal
 * @namespace BazComponent.universal
 * @description CommonJS module with Bazooka interface, so it can be used both in `data-bazooka`
 * and in another CommonJS modules via `require()`
 * @example
 * ```javascript
 *   function trackEvent(category, action, label) {}
 *   module.exports = {
 *     bazFunc: function bazFunc(node) { node.onclick = trackEvent.bind(…) },
 *     trackEvent: trackEvent,
 *   }
 * ```
 */

/**
 * @name bazFunc
 * @memberof BazComponent.universal
 * @func
 * @param {node} - bound DOM node
 * @description Component's binding function
 */

/**
 * @func
 * @param {node|BazookaWrapper} value - DOM node or wrapped node
 * @returns {BazookaWrapper}
 * @example
 * ```javascript
 *   var Baz = require('bazooka');
 *   var $baz = Baz(node);
 * ```
 */
var Bazooka = function (value) {
  if (value instanceof BazookaWrapper) {
    return value;
  }

  return new BazookaWrapper(value);
};

/** @module {function} Bazooka */
/**
 * Reference to {@link BazookaWrapper} class
 * @name BazookaWrapper
 */
Bazooka.BazookaWrapper = BazookaWrapper;

Bazooka.h = _dereq_('./helpers.js');

/**
 * Parse and bind bazooka components to nodes without bound components
 * @func refresh
 * @static
 */
Bazooka.refresh = function () {
  for (var bazId in wrappersRegistry) {
    if (wrappersRegistry[bazId] && !wrappersRegistry[bazId].__wrapped__.parentNode) {
      wrappersRegistry[bazId] = null;
      nodesComponentsRegistry[bazId] = [];
    }
  }
  Array.prototype.forEach.call(
    document.querySelectorAll("[data-bazooka]:not([data-bazid])"),
    _wrapAndBindNode
  );
};

/**
 * Watch for new node with `data-bazooka` each 200ms
 * @func watch
 * @static
 * @returns {function} Unwatch function
 */
Bazooka.watch = function () {
  var i = setInterval(
    Bazooka.refresh,
    200
  );

  return clearInterval.bind(null, i);
};

module.exports = Bazooka;

},{"./helpers.js":1}]},{},[2])(2)
});
