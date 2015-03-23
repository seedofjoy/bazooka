(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Baz = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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

function BazookaWrapper(node) {
  var bazId = node.getAttribute('data-bazid');

  if (bazId === void 0 || bazId === null) {
    bazId = _bazId++;
    node.setAttribute('data-bazid', bazId);
    wrappersRegistry[bazId] = this;
  }

  this.__wrapped__ = node;
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

BazookaWrapper.prototype.g = function (methodName) {
  return getMethod(this.bazId, methodName);
};
BazookaWrapper.prototype.r = function (methodName, method) {
  registerMethod(this.bazId, methodName, method);
};

var Bazooka = function (value) {
  if (value instanceof BazookaWrapper) {
    return value;
  }

  return new BazookaWrapper(value);
};

Bazooka.wrapper = BazookaWrapper;
Bazooka.parseNodes = function () {
  Array.prototype.forEach.call(
    document.querySelectorAll("[data-bazooka]"),
    _wrapAndBindNode
  );
};
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
Bazooka.watch = function () {
  var i = setInterval(
    Bazooka.refresh,
    200
  );

  return clearInterval.bind(null, i);
};

module.exports = Bazooka;

},{}]},{},[1])(1)
});
