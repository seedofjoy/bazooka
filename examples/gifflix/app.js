'use strict'
var Baz = require('bazooka')
var Kefir = require('kefir')

window.appBus = Kefir.pool()
window.appBus.push = function (value) {
  window.appBus.plug(Kefir.constant(value))
}

window.appBus
  .filter(function (msg) { return msg.tell == 'singleFavUpdate'})
  .scan(function (acc, msg) {
    acc[msg.id] = msg.active
    return acc
  }, {})
  .map(function (favs) { return {
    tell: 'favsUpdate',
    favs: favs,
  }})
  .onValue(function (msg) { window.appBus.push(msg) })

Baz.register({
  'star': require('star'),
  'counter': require('counter'),
})

var unwatch = Baz.watch()
