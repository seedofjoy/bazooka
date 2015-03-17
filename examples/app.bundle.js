require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Baz = require('bazooka');

var component = function (element, opts) {
    console.log(element.dataset.bazooka + ' initialized.');
    console.log(element.dataset.bazooka + ' opts:');
    console.log(opts);
};

Baz({
    'testComponent': component
});

},{"bazooka":"bazooka"}],2:[function(require,module,exports){
/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()

}('domready', function () {

  var fns = [], listener
    , doc = document
    , hack = doc.documentElement.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


  if (!loaded)
  doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener)
    loaded = 1
    while (listener = fns.shift()) listener()
  })

  return function (fn) {
    loaded ? fn() : fns.push(fn)
  }

});

},{}],"bazooka":[function(require,module,exports){
var domready = require('domready');

if (!Function.prototype.bind) {
    // Credits to https://github.com/kdimatteo/bind-polyfill
    // Solves https://github.com/ariya/phantomjs/issues/10522
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
}

function _camelize(match, p1) { return p1.toUpperCase(); }

function _moveAttrToOpts(opts, attr) {
    if (/^data-bazooka-attr-/.test(attr.name)) {
        var camelCaseName = attr.name.substr(18).replace(/-(.)/g, _camelize);
        opts[camelCaseName] = attr.value;
    }
}

function _bindAppToNode(app, node) {
    var opts = {};
    Array.prototype.forEach.call(node.attributes, _moveAttrToOpts.bind(null, opts));
    setTimeout(app.bind(this, node, opts), 0);
}

function _bindApps(apps) {
    var _this = this;

    for (var app_name in apps) {
        // Avoid a Chakra JIT bug in compatibility modes of IE 11.
        // See https://github.com/jashkenas/underscore/issues/1621 for more details.
        if (!(typeof apps[app_name] == 'function' || false)) {
            throw new Error('Bazooka: ' + app_name + ' is not callable!');
        }

        var app_nodes = document.querySelectorAll("[data-bazooka*='" + app_name + "']");
        if (!(app_nodes.length)) {
            console.warn('Bazooka: ' + app_name + ' not found in HTML nodes');
            continue;
        }

        Array.prototype.forEach.call(
            document.querySelectorAll("[data-bazooka*='" + app_name + "']"),
            _bindAppToNode.bind(_this, apps[app_name])
        );
    }

}

Bazooka = function (apps) {
    'use strict';

    if (!(apps && Object.keys(apps).length)) {
        throw new Error('Bazooka: No applications found!');
    }

    domready(_bindApps.bind(this, apps));
};

module.exports = Bazooka;

},{"domready":2}]},{},[1]);
