'use strict';

var Baz = require('bazooka');

function bazFunc(node) {
  var $baz = Baz(node);

  node.onclick = function () {
    $baz.g('info')('clicked', $baz.id);
  };
}

module.exports = {
  f: bazFunc,

  deps: [
    'baz-logger'
  ]
};
