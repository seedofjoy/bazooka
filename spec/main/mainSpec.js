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
    var node = appendDiv('exampleBazFunc');
    Baz.refresh();

    expect(componentsRegistry.exampleBazFunc).toHaveBeenCalledWith(node);
  });

  it('should not bind incorrect component to node', function() {
    var node = appendDiv('exampleBazFunc');
    Baz.refresh();

    expect(componentsRegistry.exampleBazFunc2).not.toHaveBeenCalled();
  });

  it('should bind complex component to node', function() {
    var node = appendDiv('exampleComplexBazComponent');
    Baz.refresh();

    expect(
      componentsRegistry.exampleComplexBazComponent.bazFunc
    ).toHaveBeenCalledWith(node);
  });

  it('should bind multiple components to node', function() {
    var node = appendDiv('exampleBazFunc exampleComplexBazComponent');
    Baz.refresh();

    expect(componentsRegistry.exampleBazFunc).toHaveBeenCalledWith(node);
    expect(
      componentsRegistry.exampleComplexBazComponent.bazFunc
    ).toHaveBeenCalledWith(node);
    expect(componentsRegistry.exampleBazFunc2).not.toHaveBeenCalled();
  });

  it('should strip extra whitespaces', function() {
    var node = appendDiv('exampleBazFunc  exampleBazFunc2   ');
    var node2 = appendDiv(
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
    var node = appendDiv('exampleComplexBazFunclessComponent');
    Baz.refresh();
  });
});
