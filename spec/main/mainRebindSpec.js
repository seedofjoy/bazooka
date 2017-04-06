'use strict';

function appendDiv() {
  var node = document.createElement('div');
  node.setAttribute('test-node', '');
  document.body.appendChild(node);
  return node;
}

var componentsRegistry = {
  exampleBazFunc: function() {},
  exampleBazFunc2: function() {},
};

describe('Baz.rebind', function() {
  var Baz = require('bazooka');

  beforeEach(function() {
    spyOn(componentsRegistry, 'exampleBazFunc').and.callThrough();
    spyOn(componentsRegistry, 'exampleBazFunc2').and.callThrough();
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

  it('should rebind only new components', function() {
    var node = appendDiv();
    var node2 = appendDiv();
    node.setAttribute('data-bazooka', 'exampleBazFunc');
    node2.setAttribute('data-bazooka', 'exampleBazFunc exampleBazFunc2');
    Baz.refresh();

    expect(componentsRegistry.exampleBazFunc).toHaveBeenCalledWith(node);
    expect(componentsRegistry.exampleBazFunc).toHaveBeenCalledWith(node2);
    expect(componentsRegistry.exampleBazFunc2).toHaveBeenCalledWith(node2);

    componentsRegistry.exampleBazFunc.calls.reset();
    componentsRegistry.exampleBazFunc2.calls.reset();

    var newRegisterObj = {
      exampleBazFunc: function(node) {},
    };
    spyOn(newRegisterObj, 'exampleBazFunc').and.callThrough();

    Baz.rebind(newRegisterObj);

    expect(componentsRegistry.exampleBazFunc.calls.count()).toEqual(0);
    expect(componentsRegistry.exampleBazFunc2.calls.count()).toEqual(0);
    expect(newRegisterObj.exampleBazFunc).toHaveBeenCalledWith(node);
    expect(newRegisterObj.exampleBazFunc).toHaveBeenCalledWith(node2);

    newRegisterObj.exampleBazFunc.calls.reset();

    Baz.rebind({ exampleBazFunc: componentsRegistry.exampleBazFunc });

    expect(newRegisterObj.exampleBazFunc.calls.count()).toEqual(0);
    expect(componentsRegistry.exampleBazFunc2.calls.count()).toEqual(0);
    expect(componentsRegistry.exampleBazFunc).toHaveBeenCalledWith(node);
    expect(componentsRegistry.exampleBazFunc).toHaveBeenCalledWith(node2);
  });

  it('should call dispose', function() {
    var node = appendDiv();
    var node2 = appendDiv();
    node.setAttribute('data-bazooka', 'exampleBazFunc');
    node2.setAttribute('data-bazooka', 'exampleBazFunc exampleBazFunc2');
    Baz.refresh();

    componentsRegistry.exampleBazFunc.calls.reset();
    componentsRegistry.exampleBazFunc2.calls.reset();

    var disposeSpy = jasmine.createSpy('dispose');
    var newRegisterObj = {
      exampleBazFunc: function(node) {
        return function() {
          disposeSpy(node);
        };
      },
    };
    spyOn(newRegisterObj, 'exampleBazFunc').and.callThrough();

    Baz.rebind(newRegisterObj);
    expect(disposeSpy.calls.count()).toEqual(0);

    Baz.rebind({ exampleBazFunc: componentsRegistry.exampleBazFunc });
    expect(disposeSpy).toHaveBeenCalledWith(node);
    expect(disposeSpy).toHaveBeenCalledWith(node2);
  });
});
