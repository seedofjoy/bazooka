# Hot reloadable `bazFunc`s

To make a component hot reloadable, you will need to:
1. (optionally) return `dispose` function from `bazFunc`. This function cleans up eventListeners, timers, etc.
```diff
import model from './model.js';

export default function hotBaz(node) {
  const state = model();

  render(node, state);
  node.addEventListener('click', clickHandler);

+  return () => {
+    node.removeEventListener('click', boundHandler);
+  };
};
```
2. (optionally) call `Baz(node).HMRState(moduleHot, stateCallback)` method to preserve `state` between hot reloads. `stateCallback` is called without arguments on initial execution and with preserved state after each hot reload
```diff
+import Baz from 'bazooka';
import model from './model.js';

export default function hotBaz(node) {
-  const state = model();
+  const state = module.hot
+    ? Baz(node).HMRState(module.hot, prev => prev || model())
+    : model();

  mockRerender(node, state);

  const boundHandler = clickHandler(node, state);
  node.addEventListener('click', boundHandler);

  return () => {
    node.removeEventListener('click', boundHandler);
  };
}
```
3. write `module.hot.accept` handler in init script ("near" `Baz.watch`/`Baz.refresh`), which calls new `Baz.rebind` function
```diff
import component from './component.js';

Baz.register({ 'hot-component': component });
Baz.watch();

+if (module.hot) {
+  module.hot.accept('./component.js', () =>
+    Baz.rebind({ 'hot-component': component }));
+}
```
