require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var launcher = require('rocket-launcher');

var component = function (element, opts) {
    console.log(element.dataset.launcher + ' initialized.');
    console.log(element.dataset.launcher + ' opts:');
    console.log(opts);
};

launcher({
    'testComponent': component
});

},{"rocket-launcher":"rocket-launcher"}],"rocket-launcher":[function(require,module,exports){
RocketLauncher = function (apps) {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {

        if (!apps) {
            console.error('RocketLauncher: No applications found!');
            return;
        }

        Array.prototype.forEach.call(
            document.querySelectorAll('[data-launcher]'), 
            function (el) {
                var app_name = el.getAttribute('data-launcher'), 
                    opts = {};

                if (!(app_name in apps)) {
                    console.error('RocketLauncher: Application ' + app_name + ' not found.');
                    return;
                }

                Array.prototype.forEach.call(el.attributes, function (attr) {
                    if (/^data-launcher-attr-/.test(attr.name)) {
                        var camelCaseName = attr.name.substr(14).replace(/-(.)/g, function (match, p1) {
                            return p1.toUpperCase();
                        });
                        opts[camelCaseName] = attr.value;
                    }
                });

                setTimeout(function () {
                    apps[app_name](el, opts);
                }, 0);
            }
        );

    });
};

module.exports = RocketLauncher

},{}]},{},[1]);
