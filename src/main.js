'use strict';

// polyfills
/* eslint-disable no-extend-native, no-undef */
var MutationObserver = window.MutationObserver
  || window.WebKitMutationObserver
  || window.MozMutationObserver;

if (!MutationObserver) {
  MutationObserver = require('mutation-observer');
}

if (!Function.prototype.bind) {
  Function.prototype.bind = require('function-bind');
}
/* eslint-enable no-extend-native, no-undef */
// /polyfills


var _bazId = 0;
var nodesComponentsRegistry = {};
var componentsRegistry = {};
var wrappersRegistry = {};

function _getComponent(name) {
  if (!componentsRegistry[name]) {
    throw new Error(name + ' component is not registered. Use `Baz.register()` to do it');
  }

  return componentsRegistry[name];
}

function _bindComponentToNode(wrappedNode, componentName) {
  var bazId = wrappedNode.id;

  if (!componentName) {
    return
  }

  if (nodesComponentsRegistry[bazId] === void 0) {
    nodesComponentsRegistry[bazId] = [];
  }

  if (nodesComponentsRegistry[bazId].indexOf(componentName) === -1) {
    nodesComponentsRegistry[bazId].push(componentName);
  }
}

function _applyComponentsToNode(wrappedNode) {
  var bazId = wrappedNode.id;

  for (var i = 0; i < nodesComponentsRegistry[bazId].length; i++) {
    var component = _getComponent(nodesComponentsRegistry[bazId][i]);

    if (component.bazFunc) {
      component.bazFunc(wrappedNode.__wrapped__);
    }
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
BazookaWrapper.prototype.getComponents = function () {
  var components = {}

  for (var i = 0; i < nodesComponentsRegistry[this.id].length; i++) {
    components[nodesComponentsRegistry[this.id][i]] = _getComponent(nodesComponentsRegistry[this.id][i])
  }

  return components
};

function _wrapAndBindNode(node) {
  var dataBazooka = (node.getAttribute('data-bazooka') || '').trim();
  var wrappedNode;
  var componentNames;

  if (dataBazooka) {
    componentNames = dataBazooka.split(' ');
    wrappedNode = new BazookaWrapper(node);

    for (var i = 0; i < componentNames.length; i++) {
      _bindComponentToNode(wrappedNode, componentNames[i].trim());
    }

    _applyComponentsToNode(wrappedNode);
  }
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

Bazooka.h = require('./helpers.js');

/**
 * Register components names
 * @func register
 * @param {Object} componentsObj - object with names as keys and components as values
 * @static
 */
Bazooka.register = function (componentsObj) {
  for (var name in componentsObj) {
    if (typeof componentsObj[name] === 'function') {
      componentsRegistry[name] = {
        bazFunc: componentsObj[name],
      };
    } else {
      componentsRegistry[name] = componentsObj[name];
    }
  }
};

/**
 * Parse and bind bazooka components to nodes without bound components
 * @func refresh
 * @param {node} [rootNode=document.body] - DOM node, children of which will be checked for `data-bazooka`
 * @static
 */
Bazooka.refresh = function (rootNode) {
  rootNode = rootNode || document.body;

  for (var bazId in wrappersRegistry) {
    if (wrappersRegistry[bazId] && !wrappersRegistry[bazId].__wrapped__.parentNode) {
      wrappersRegistry[bazId] = null;
      nodesComponentsRegistry[bazId] = [];
    }
  }

  Array.prototype.forEach.call(
    rootNode.querySelectorAll('[data-bazooka]:not([data-bazid])'),
    _wrapAndBindNode
  );
};

function _observedMutationCallback(mutation) {
  Bazooka.refresh(mutation.target);
}

function _MutationObserverCallback(mutations) {
  mutations.forEach(_observedMutationCallback);
}

/**
 * Watch for new nodes with `data-bazooka`. No need to run {@link Bazooka.refresh} before this. It will be called automatically.
 * @func watch
 * @param {node} [rootNode=document.body] - DOM node, children of which will be watched for `data-bazooka`
 * @static
 * @returns {function} Unwatch function
 */
Bazooka.watch = function (rootNode) {
  var observer = new MutationObserver(_MutationObserverCallback);
  rootNode = rootNode || document.body;

  Bazooka.refresh(rootNode);
  observer.observe(rootNode, {childList: true, subtree: true});

  return observer.disconnect.bind(observer);
};

module.exports = Bazooka;
