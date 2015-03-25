'use strict';

var Baz = require('bazooka');
var logger = require('baz-logger');

var infoClicked = function (ev) {
  logger.info('click on bazId =', Baz(ev.target).id);
};

function bazFunc(node) {
  node.onclick = infoClicked;
}

module.exports = {
  bazFunc: bazFunc,
};
