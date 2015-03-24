'use strict';

var _bazId = 0;
var nodesComponentsRegistry = {};
var methodsRegistry = {};
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
    componentsRegistry[name] = require(name);
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

    if (component.f) {
      bazFunc = component.f;
    } else {
      bazFunc = component;
    }

    if (component.deps && component.deps.length) {
      Array.prototype.forEach.call(
        component.deps,
        _bindComponentToNode.bind(null, wrappedNode)
      );
    }

    bazFunc(wrappedNode.__wrapped__);
  }
}

/**
 * @class
 * @param {node} node
 */
function BazookaWrapper(node) {
  var bazId = node.getAttribute('data-bazid');

  if (bazId === void 0 || bazId === null) {
    bazId = _bazId++;
    node.setAttribute('data-bazid', bazId);
    wrappersRegistry[bazId] = this;
  }

  this.__wrapped__ = node;
  /**
   * Internal id
   * @type {number}
   */
  this.id = parseInt(bazId, 10);
}

BazookaWrapper.prototype.constructor = BazookaWrapper;

function _wrapAndBindNode(node) {
  var componentName = node.getAttribute('data-bazooka');
  var wrappedNode = new BazookaWrapper(node);

  _bindComponentToNode(wrappedNode, componentName);
}

function registerMethod(bazId, methodName, method) {
  if (methodsRegistry[bazId] === void 0) {
    methodsRegistry[bazId] = {};
  }

  methodsRegistry[bazId][methodName] = method;
}

function getMethod(bazId, methodName) {
  return methodsRegistry[bazId][methodName];
}

/**
 * Register method of wrapped node
 * @function r
 * @memberof BazookaWrapper
 * @param {string} methodName
 * @param {function} method
 * @instance
 */
BazookaWrapper.prototype.r = function (methodName, method) {
  registerMethod(this.bazId, methodName, method);
};

/**
 * Get previously {@link BazookaWrapper#r|registered} method of wrapped node
 * @function g
 * @memberof BazookaWrapper
 * @param {string} methodName
 * @instance
 * @returns {function}
 */
BazookaWrapper.prototype.g = function (methodName) {
  return getMethod(this.bazId, methodName);
};

/**
 * @module {function} Bazooka
 * @name Bazooka
 * @param {node|BazookaWrapper} value - DOM node or wrapped node
 * @returns {BazookaWrapper}
 */
var Bazooka = function (value) {
  if (value instanceof BazookaWrapper) {
    return value;
  }

  return new BazookaWrapper(value);
};

/**
 * Reference to {@link BazookaWrapper} class
 * @var wrapper
 */
Bazooka.wrapper = BazookaWrapper;

/**
 * Parse and bind bazooka components on page
 * @func parseNodes
 * @static
 * @deprecated Use {@link module:Bazooka.refresh|Bazooka.refresh} instead
 */
Bazooka.parseNodes = function () {
  Array.prototype.forEach.call(
    document.querySelectorAll("[data-bazooka]"),
    _wrapAndBindNode
  );
};

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
      methodsRegistry[bazId] = {};
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
