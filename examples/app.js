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
