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
