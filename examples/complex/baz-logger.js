'use strict';

var Baz = require('bazooka');

function bazFunc(node) {
  var $baz = Baz(node);

  $baz.r('info', console.info.bind(console, '[baz-logger]'));
}

module.exports = bazFunc;
