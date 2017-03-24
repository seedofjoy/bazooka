'use strict';
var Kefir = require('kefir');
var Baz = require('bazooka');

var getAttrs = Baz.h.getAttrs('star');

function starBazFunc(node) {
  Kefir.fromEvents(node, 'click')
    .map(function(e) {
      return {
        tell: 'singleFavUpdate',
        id: getAttrs(e.target).id,
        active: !getAttrs(e.target).active,
      };
    })
    .onValue(function(msg) {
      window.appBus.push(msg);
    });

  window.appBus
    .filter(function(msg) {
      return msg.tell == 'favsUpdate';
    })
    .map(function(msg) {
      return msg.favs;
    })
    .toProperty(function() {
      return {};
    })
    .onValue(function(favs) {
      favs[getAttrs(node).id]
        ? node.setAttribute('data-star-active', 1)
        : node.removeAttribute('data-star-active');
    });
}

module.exports = {
  bazFunc: starBazFunc,
};
