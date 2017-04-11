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
  errorousBazFunc: function() {
    throw new Error('lol');
  },
  goodBazFunc: function(node) {
    node.setAttribute('data-called', 'yes');
  },
};

describe('Baz', function() {
  var Baz = require('bazooka');

  beforeEach(function() {
    spyOn(componentsRegistry, 'errorousBazFunc').and.callThrough();
    spyOn(componentsRegistry, 'goodBazFunc').and.callThrough();
    Baz.register(componentsRegistry);
  });

  afterEach(function() {
    Array.prototype.forEach.call(
      document.querySelectorAll('[test-node]'),
      function(el) {
        document.body.removeChild(el);
      }
    );
  });

  it('should bind goodBazFunc', function() {
    var node = appendDiv('goodBazFunc');
    Baz.refresh();

    expect(componentsRegistry.goodBazFunc).toHaveBeenCalledWith(node);
  });

  it('should catch error from errorousBazFunc', function() {
    console.error = spyOn(console, 'error');

    var node = appendDiv('errorousBazFunc');

    expect(function() {
      Baz.refresh();
    }).toThrow();

    expect(componentsRegistry.errorousBazFunc).toHaveBeenCalledWith(node);
  });

  it('error from errorousBazFunc should not stop goodBazFunc', function() {
    console.error = spyOn(console, 'error');

    var node = appendDiv('goodBazFunc errorousBazFunc');
    var node2 = appendDiv('errorousBazFunc goodBazFunc');
    var node3 = appendDiv('goodBazFunc');

    expect(function() {
      Baz.refresh();
    }).toThrow();

    expect(componentsRegistry.errorousBazFunc).toHaveBeenCalledWith(node);
    expect(componentsRegistry.errorousBazFunc).toHaveBeenCalledWith(node2);
    expect(componentsRegistry.errorousBazFunc).not.toHaveBeenCalledWith(node3);

    expect(componentsRegistry.goodBazFunc).toHaveBeenCalledWith(node);
    expect(componentsRegistry.goodBazFunc).toHaveBeenCalledWith(node2);
    expect(componentsRegistry.goodBazFunc).toHaveBeenCalledWith(node3);

    expect(node.getAttribute('data-called')).toBe('yes');
    expect(node2.getAttribute('data-called')).toBe('yes');
    expect(node3.getAttribute('data-called')).toBe('yes');
  });

  it('should not try to rebind errorous component', function() {
    console.error = spyOn(console, 'error');

    var node = appendDiv('errorousBazFunc');

    expect(function() {
      Baz.refresh();
    }).toThrow();
    expect(componentsRegistry.errorousBazFunc).toHaveBeenCalledWith(node);

    Baz.refresh();
  });
});
