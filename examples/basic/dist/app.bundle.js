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

},{"bazooka":"bazooka"}],"bazooka":[function(require,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Baz = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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

},{}],2:[function(_dereq_,module,exports){
var domready = _dereq_('domready');

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
            app_nodes,
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

},{"domready":1}]},{},[2])(2)
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
