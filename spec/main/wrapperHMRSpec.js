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

describe('BazookaWrapper.prototype.HMRState', function() {
  var Baz = require('bazooka');

  afterEach(function() {
    Array.prototype.forEach.call(
      document.querySelectorAll('[test-node]'),
      function(el) {
        document.body.removeChild(el);
      }
    );
  });

  it('should return initial state', function() {
    var node = appendDiv('bazFunc');

    var checker = jasmine.createSpy('checker');
    var mockModuleHot = {
      dispose: function() {},
      data: {},
    };

    var registerObj = {
      bazFunc: function(node) {
        var state = Baz(node).HMRState(mockModuleHot, function(prev) {
          return prev || { count: 0 };
        });
        checker(state.count);
        state.count++;
      },
    };

    Baz.register(registerObj);
    Baz.refresh();

    expect(checker.calls.allArgs()).toEqual([[0]]);
  });

  it('should save and load data between HMRs', function() {
    var node = appendDiv('bazFunc');

    var checker = jasmine.createSpy('checker');
    var mockModuleHot = {
      dispose: function(cb) {
        mockModuleHot.disposes.push(cb);
      },
      data: {},
      disposes: [],
    };

    var registerObj = {
      bazFunc: function(node) {
        var state = Baz(node).HMRState(mockModuleHot, function(prev) {
          return prev || { count: 0 };
        });
        checker(state.count);
        state.count++;
      },
    };

    Baz.register(registerObj);
    Baz.refresh();

    mockModuleHot.disposes.forEach(function(cb) {
      cb(mockModuleHot.data);
    });
    mockModuleHot.disposes = [];

    Baz.rebind(registerObj);
    expect(checker.calls.allArgs()).toEqual([[0], [1]]);
  });
});
