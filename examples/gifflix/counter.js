'use strict';
function counterBazFunc(node) {
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
    .map(function(favs) {
      var count = 0;
      for (var key in favs) {
        if (favs[key]) {
          count++;
        }
      }

      return count;
    })
    .onValue(function(count) {
      node.textContent = count;
    });
}

module.exports = {
  bazFunc: counterBazFunc,
};
