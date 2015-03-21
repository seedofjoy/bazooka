'use strict';

var _bazId = 0;
var nodesRegistry = {};
var methodsRegistry = {};
var componentsRegistry = {};

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

    if (nodesRegistry[bazId] === void 0) {
        nodesRegistry[bazId] = [];
    }

    if (nodesRegistry[bazId].indexOf(componentName) > -1) {
        nodesRegistry[bazId].push(componentName);
    }

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

function registerMethod(bazId, methodName, method) {
    if (methodsRegistry[bazId] === void 0) {
        methodsRegistry[bazId] = {};
    }

    methodsRegistry[bazId][methodName] = method;
}

function getMethod(bazId, methodName) {
    return methodsRegistry[bazId][methodName];
}

function BazookaWrapper(node) {
    var bazId = node.getAttribute('data-bazid');

    if (bazId === void 0 || bazId === null) {
        bazId = _bazId++;
        node.setAttribute('data-bazid', bazId);
    }

    this.__wrapped__ = node;
    this.id = parseInt(bazId, 10);
}

BazookaWrapper.prototype.constructor = BazookaWrapper;
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
Bazooka.parseNodes = function() {
    var appNodes = document.querySelectorAll("[data-bazooka]");

    Array.prototype.forEach.call(
        appNodes,
        function (node) {
            var componentName = node.getAttribute('data-bazooka');
            var wrappedNode = new BazookaWrapper(node);

            _bindComponentToNode(wrappedNode, componentName);
        }
    );
};

module.exports = Bazooka;
