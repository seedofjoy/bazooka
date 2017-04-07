import Baz from 'bazooka';
import component from './component.js';

Baz.register({
  'hot-component': component,
});

Baz.watch();

if (module.hot) {
  module.hot.accept('./component.js', () =>
    Baz.rebind({ 'hot-component': component }));
}
