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
