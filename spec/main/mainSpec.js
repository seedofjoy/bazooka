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
  exampleBazFunc: function () {},
  exampleBazFunc2: function () {},
  exampleComplexBazComponent: {
    bazFunc: function () {},
  },
};

describe('Baz', function() {
  var Baz = require('../../src/main.js');

  beforeEach(function() {
    spyOn(console, 'warn');
    spyOn(componentsRegistry, 'exampleBazFunc');
    spyOn(componentsRegistry, 'exampleBazFunc2');
    spyOn(componentsRegistry.exampleComplexBazComponent, 'bazFunc');
    Baz.register(componentsRegistry);
  });

  afterEach(function() {
    Array.prototype.forEach.call(
      document.querySelectorAll('[test-node]'),
      function (el) {
        document.body.removeChild(el);
      }
    );
  });

  it('should return wrapper node', function () {
    var node = appendDiv();
    var $baz = Baz(node);
    expect($baz instanceof Baz.BazookaWrapper).toBe(true);
  });

  it('should increment bazId for new node', function () {
    var node = appendDiv();
    var $baz = Baz(node);

    var node2 = appendDiv();
    var $baz2 = Baz(node2);

    expect(parseInt($baz2.id, 10)).toBe(parseInt($baz.id, 10) + 1);
  });

  it('should do nothing to bazId of already wrapped nodes', function () {
    var node = appendDiv();
    var $baz = Baz(node);
    var $baz2 = Baz(node);

    expect($baz2.id).toBe($baz.id);
  });

  it('should bind simple component to node', function () {
    var node = appendDiv();
    node.setAttribute('data-bazooka', 'exampleBazFunc');
    Baz.refresh();

    expect(componentsRegistry.exampleBazFunc).toHaveBeenCalledWith(node);
  });

  it('should not bind incorrect component to node', function () {
    var node = appendDiv();
    node.setAttribute('data-bazooka', 'exampleBazFunc');
    Baz.refresh();

    expect(componentsRegistry.exampleBazFunc2).not.toHaveBeenCalled();
  });

  it('should bind complex component to node', function () {
    var node = appendDiv();
    node.setAttribute('data-bazooka', 'exampleComplexBazComponent');
    Baz.refresh();

    expect(componentsRegistry.exampleComplexBazComponent.bazFunc).toHaveBeenCalledWith(node);
  });

  it('should bind multiple components to node', function () {
    var node = appendDiv();
    node.setAttribute('data-bazooka', 'exampleBazFunc exampleComplexBazComponent');
    Baz.refresh();

    expect(componentsRegistry.exampleBazFunc).toHaveBeenCalledWith(node);
    expect(componentsRegistry.exampleComplexBazComponent.bazFunc).toHaveBeenCalledWith(node);
    expect(componentsRegistry.exampleBazFunc2).not.toHaveBeenCalled();
  });
});
