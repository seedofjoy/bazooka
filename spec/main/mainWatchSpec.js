'use strict';

function appendDiv(dataBazooka) {
  var node = document.createElement('div');
  node.setAttribute('test-node', '');
  if (dataBazooka) {
    node.setAttribute('data-bazooka', dataBazooka);
  }
  document.body.appendChild(node);
  return node;
}

var componentsRegistry = {
  bf: function() {},
  bf2: function() {},
};

describe('Baz.watch', function() {
  var Baz = require('bazooka');
  var observer = null;

  beforeEach(function() {
    spyOn(componentsRegistry, 'bf');
    spyOn(componentsRegistry, 'bf2');
    Baz.register(componentsRegistry);
  });

  afterEach(function() {
    Array.prototype.forEach.call(
      document.querySelectorAll('[test-node]'),
      function(el) {
        document.body.removeChild(el);
      }
    );

    if (observer) {
      observer();
      observer = null;
    }
  });

  it('should bind existing nodes', function() {
    var node = appendDiv('bf');
    var node2 = appendDiv('bf2');
    Baz.watch();

    expect(componentsRegistry.bf.calls.allArgs()).toEqual([[node]]);
    expect(componentsRegistry.bf2.calls.allArgs()).toEqual([[node2]]);
  });

  it('should bind added nodes', function(done) {
    var node = appendDiv('bf');
    Baz.watch();

    componentsRegistry.bf.and.callFake(function() {
      expect(componentsRegistry.bf.calls.allArgs()).toEqual([[node], [node2]]);

      done();
    });

    var node2 = appendDiv('bf');
  });

  it('should dispose removed nodes', function(done) {
    componentsRegistry.bf.and.callFake(function() {
      return function() {
        done();
      };
    });

    var node = appendDiv('bf');
    Baz.watch();

    document.body.removeChild(node);
  });
});
