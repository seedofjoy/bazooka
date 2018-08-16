'use strict';

// https://github.com/seedofjoy/bazooka/issues/46
describe('dispose', function() {
  var Baz = require('bazooka');

  it('should dispose if parent is removed', function(done) {
    var node = document.createElement('div');
    node.innerHTML = "<p><span data-bazooka='component'></span></p>";

    Baz.register({
      component: function(node) {
        node.innerText = 'ok';

        return done;
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
    node.innerHTML = "<span data-bazooka='component'></span>";

    Baz.register({
      component: function(node) {
        node.innerText = 'ok';

        return done;
      },
    });

    Baz.refresh(node);
    expect(node.innerText).toBe('ok');

    node.innerHTML = '';
    Baz.refresh(node);
  });

  it('should dispose if node is removed', function(done) {
    var node = document.createElement('div');
    node.innerHTML = "<p><span data-bazooka='component'></span></p>";

    Baz.register({
      component: function(node) {
        node.innerText = 'ok';

        return done;
      },
    });

    Baz.refresh(node);

    expect(node.innerText).toBe('ok');
    expect(node.childNodes[0].tagName).toBe('P');
    expect(node.childNodes[0].childNodes[0].tagName).toBe('SPAN');

    node.childNodes[0].removeChild(node.childNodes[0].childNodes[0]);
    Baz.refresh(node);
  });
});
