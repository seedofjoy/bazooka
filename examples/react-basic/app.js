'use strict';
var Baz = require('bazooka');

Baz.register({
  greeting: require('greeting'),
});

Baz.refresh();
