import Baz from 'bazooka';

Baz.register({
  'init-time': function(node) {
    node.innerText = node.innerText + new Date().toString();
  },
});

Baz.watch();
