'use strict';
/* global describe, beforeEach, afterEach, it, expect, spyOn */
/* eslint max-nested-callbacks:0 */

function appendDiv() {
  var node = document.createElement('div');
  node.setAttribute('test-node', '');
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
    var node = appendDiv();
    node.setAttribute('data-bazooka', 'goodBazFunc');
    Baz.refresh();

    expect(componentsRegistry.goodBazFunc).toHaveBeenCalledWith(node);
  });

  it('should catch error from errorousBazFunc', function() {
    console.error = spyOn(console, 'error');

    var node = appendDiv();
    node.setAttribute('data-bazooka', 'errorousBazFunc');

    expect(function() {
      Baz.refresh();
    }).toThrow();

    expect(componentsRegistry.errorousBazFunc).toHaveBeenCalledWith(node);
  });

  it('error from errorousBazFunc should not stop goodBazFunc', function() {
    console.error = spyOn(console, 'error');

    var node = appendDiv();
    var node2 = appendDiv();
    var node3 = appendDiv();
    node.setAttribute('data-bazooka', 'goodBazFunc errorousBazFunc');
    node2.setAttribute('data-bazooka', 'errorousBazFunc goodBazFunc');
    node3.setAttribute('data-bazooka', 'goodBazFunc');

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

    var node = appendDiv();
    node.setAttribute('data-bazooka', 'errorousBazFunc');

    expect(function() {
      Baz.refresh();
    }).toThrow();
    expect(componentsRegistry.errorousBazFunc).toHaveBeenCalledWith(node);

    Baz.refresh();
  });
});
