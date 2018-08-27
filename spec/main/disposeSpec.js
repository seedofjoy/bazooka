'use strict';

// https://github.com/seedofjoy/bazooka/issues/46
describe('dispose', function() {
  var Baz = require('bazooka');

  it('should dispose if parent is removed', function(done) {
    var node = document.createElement('div');
    node.innerHTML = '<p><span data-bazooka="component"></span></p>';

    Baz.register({
      component: function(node) {
        node.innerText = 'ok';

        return function() {
          done();
        };
      },
    });

    Baz.refresh(node);

    expect(node.innerText).toBe('ok');
    expect(node.childNodes[0].tagName).toBe('P');
    expect(node.childNodes[0].childNodes[0].tagName).toBe('SPAN');

    node.removeChild(node.childNodes[0]);
    Baz.refresh(node);
  });

  it('should dispose if direct child is removed', function(done) {
    var node = document.createElement('div');
    node.innerHTML = '<span data-bazooka="component"></span>';

    Baz.register({
      component: function(node) {
        node.innerText = 'ok';

        return function() {
          done();
        };
      },
    });

    Baz.refresh(node);
    expect(node.innerText).toBe('ok');

    node.innerHTML = '';
    Baz.refresh(node);
  });

  it('should dispose if node is removed', function(done) {
    var node = document.createElement('div');
    node.innerHTML = '<p><span data-bazooka="component"></span></p>';

    Baz.register({
      component: function(node) {
        node.innerText = 'ok';

        return function() {
          done();
        };
      },
    });

    Baz.refresh(node);

    expect(node.innerText).toBe('ok');
    expect(node.childNodes[0].tagName).toBe('P');
    expect(node.childNodes[0].childNodes[0].tagName).toBe('SPAN');

    node.childNodes[0].removeChild(node.childNodes[0].childNodes[0]);
    Baz.refresh(node);
  });

  it("shouldn't dispose if node is moved inside the rootNode", function() {
    var node = document.createElement('div');
    node.innerHTML = '<p><span data-bazooka="component"></span></p><div></div>';

    var disposeSpy = jasmine.createSpy('disposeSpy');

    Baz.register({
      component: function(node) {
        node.innerText = node.innerText + 'ok';

        return disposeSpy;
      },
    });

    Baz.refresh(node);

    var pNode = node.childNodes[0];
    var divNode = node.childNodes[1];
    var spanNode = node.childNodes[0].childNodes[0];

    expect(pNode.tagName).toBe('P');
    expect(divNode.tagName).toBe('DIV');
    expect(spanNode.tagName).toBe('SPAN');
    expect(pNode.innerText).toBe('ok');
    expect(divNode.innerText).toBe('');

    divNode.appendChild(spanNode);
    Baz.refresh(node);

    expect(disposeSpy).not.toHaveBeenCalled();
    expect(pNode.innerText).toBe('');
    expect(divNode.innerText).toBe('ok');
  });
});
