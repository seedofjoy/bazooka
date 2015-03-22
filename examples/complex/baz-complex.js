'use strict';

var Baz = require('bazooka');

var infoClicked = function (ev) {
  Baz(ev.target).g('info')('clicked', ev.target.getAttribute('data-bazid'));
};

function bazFunc(node) {
  node.onclick = infoClicked;
}

module.exports = {
  f: bazFunc,

  deps: [
    'baz-logger'
  ]
};
