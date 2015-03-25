'use strict';

var info = console.info.bind(console, '[baz-logger]');

function bazFunc(node) {
  node.onclick = info.bind(null, 'click')
}

module.exports = {
  bazFunc: bazFunc,
  info: info
};
