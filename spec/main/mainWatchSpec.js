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
    observer = Baz.watch();

    expect(componentsRegistry.bf.calls.allArgs()).toEqual([[node]]);
    expect(componentsRegistry.bf2.calls.allArgs()).toEqual([[node2]]);
  });

  it('should bind added nodes', function(done) {
    var node = appendDiv('bf');
    observer = Baz.watch();

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
    observer = Baz.watch();

    document.body.removeChild(node);
  });

  it('should dispose children of removed nodes', function(done) {
    componentsRegistry.bf.and.callFake(function() {
      return function() {
        done();
      };
    });

    var node = appendDiv();
    node.innerHTML = '<div data-bazooka="bf"></div>';
    observer = Baz.watch();

    document.body.removeChild(node);
  });

  it("shouldn't dispose children on new heighbours", function(done) {
    var disposeSpy = jasmine.createSpy('disposeSpy');

    componentsRegistry.bf.and.callFake(function(node) {
      return disposeSpy;
    });

    var node = appendDiv();
    node.innerHTML = '<div data-bazooka="bf"></div>';
    observer = Baz.watch();

    var newNode = document.createElement();
    newNode.innerHTML = '<div data-bazooka="bf"></div>';
    node.appendChild(newNode);

    setTimeout(
      function() {
        expect(componentsRegistry.bf.calls.count()).toBe(2);
        expect(componentsRegistry.bf.calls.allArgs()).toEqual([
          [node.childNodes[0]],
          [newNode.childNodes[0]],
        ]);
        expect(disposeSpy).not.toHaveBeenCalled();
        done();
      },
      0
    );
  });
});
