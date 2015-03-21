'use strict';

var domready = require('domready');

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

    for (var appName in apps) {
        // Avoid a Chakra JIT bug in compatibility modes of IE 11.
        // See https://github.com/jashkenas/underscore/issues/1621 for more details.
        if (!(typeof apps[appName] === 'function' || false)) {
            throw new Error('Bazooka: ' + appName + ' is not callable!');
        }

        var appNodes = document.querySelectorAll("[data-bazooka*='" + appName + "']");
        if (!(appNodes.length)) {
            console.warn('Bazooka: ' + appName + ' not found in HTML nodes');
            continue;
        }

        Array.prototype.forEach.call(
            appNodes,
            _bindAppToNode.bind(_this, apps[appName])
        );
    }

}

var Bazooka = function (apps) {
    if (!(apps && Object.keys(apps).length)) {
        throw new Error('Bazooka: No applications found!');
    }

    domready(_bindApps.bind(this, apps));
};

module.exports = Bazooka;
