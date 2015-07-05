'use strict';
var Baz = require('bazooka');

Baz.register({
  'baz-complex': require('baz-complex'),
  'baz-logger': require('baz-logger'),
});

var unwatch = Baz.watch();
