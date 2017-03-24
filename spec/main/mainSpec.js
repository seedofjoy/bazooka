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
  exampleBazFunc: function() {},
  exampleBazFunc2: function() {},
  exampleComplexBazComponent: {
    bazFunc: function() {},
  },
  exampleComplexBazFunclessComponent: {
    triggers: ['click'],
  },
};

describe('Baz', function() {
  var Baz = require('bazooka');

  beforeEach(function() {
    spyOn(componentsRegistry, 'exampleBazFunc');
    spyOn(componentsRegistry, 'exampleBazFunc2');
    spyOn(componentsRegistry.exampleComplexBazComponent, 'bazFunc');
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

  it('should bind simple component to node', function() {
    var node = appendDiv();
    node.setAttribute('data-bazooka', 'exampleBazFunc');
    Baz.refresh();

    expect(componentsRegistry.exampleBazFunc).toHaveBeenCalledWith(node);
  });

  it('should not bind incorrect component to node', function() {
    var node = appendDiv();
    node.setAttribute('data-bazooka', 'exampleBazFunc');
    Baz.refresh();

    expect(componentsRegistry.exampleBazFunc2).not.toHaveBeenCalled();
  });

  it('should bind complex component to node', function() {
    var node = appendDiv();
    node.setAttribute('data-bazooka', 'exampleComplexBazComponent');
    Baz.refresh();

    expect(
      componentsRegistry.exampleComplexBazComponent.bazFunc
    ).toHaveBeenCalledWith(node);
  });

  it('should bind multiple components to node', function() {
    var node = appendDiv();
    node.setAttribute(
      'data-bazooka',
      'exampleBazFunc exampleComplexBazComponent'
    );
    Baz.refresh();

    expect(componentsRegistry.exampleBazFunc).toHaveBeenCalledWith(node);
    expect(
      componentsRegistry.exampleComplexBazComponent.bazFunc
    ).toHaveBeenCalledWith(node);
    expect(componentsRegistry.exampleBazFunc2).not.toHaveBeenCalled();
  });

  it('should strip extra whitespaces', function() {
    var node = appendDiv();
    var node2 = appendDiv();
    node.setAttribute('data-bazooka', 'exampleBazFunc  exampleBazFunc2   ');
    node2.setAttribute(
      'data-bazooka',
      'exampleBazFunc  \
                      exampleBazFunc2'
    );
    Baz.refresh();

    expect(componentsRegistry.exampleBazFunc).toHaveBeenCalledWith(node);
    expect(componentsRegistry.exampleBazFunc2).toHaveBeenCalledWith(node);

    expect(componentsRegistry.exampleBazFunc).toHaveBeenCalledWith(node2);
    expect(componentsRegistry.exampleBazFunc2).toHaveBeenCalledWith(node2);
  });

  it('should bind bazFuncless component to node', function() {
    var node = appendDiv();
    node.setAttribute('data-bazooka', 'exampleComplexBazFunclessComponent');
    Baz.refresh();
  });
});
