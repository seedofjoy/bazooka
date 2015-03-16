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
    if (/^data-launcher-attr-/.test(attr.name)) {
        var camelCaseName = attr.name.substr(19).replace(/-(.)/g, _camelize);
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
            throw new Error('RocketLauncher: ' + app_name + ' is not callable!');
        }

        Array.prototype.forEach.call(
            document.querySelectorAll("[data-launcher*='" + app_name + "']"),
            _bindAppToNode.bind(_this, apps[app_name])
        );
    }

}

RocketLauncher = function (apps) {
    'use strict';

    if (!(apps && Object.keys(apps).length)) {
        throw new Error('RocketLauncher: No applications found!');
        return;
    }

    domready(_bindApps.bind(this, apps));
};

module.exports = RocketLauncher
