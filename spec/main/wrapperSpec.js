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
  exampleComplexBazFunclessComponent: {
    triggers: ['click'],
  },
};

describe('BazookaWrapper', function() {
  var Baz = require('bazooka');

  beforeEach(function() {
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

  it('should return bound components', function () {
    var node = appendDiv();
    node.setAttribute('data-bazooka', 'exampleBazFunc exampleComplexBazComponent exampleComplexBazFunclessComponent');
    Baz.refresh();

    var nodeComponents = Baz(node).getComponents()

    expect(nodeComponents.exampleBazFunc.bazFunc)
      .toBe(componentsRegistry.exampleBazFunc)

    expect(nodeComponents.exampleComplexBazComponent)
      .toBe(componentsRegistry.exampleComplexBazComponent)

    expect(nodeComponents.exampleComplexBazFunclessComponent)
      .toBe(componentsRegistry.exampleComplexBazFunclessComponent)
  });
});
