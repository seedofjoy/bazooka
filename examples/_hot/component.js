import Baz from 'bazooka';

import view from './view.js';
import model from './model.js';

function mockRerender(node, state) {
  node.textContent = view(state);
}

function clickHandler(node, state) {
  return function(event) {
    // modify this expression for some HOT magic
    state.count = state.count + 1;
    mockRerender(node, state);
  };
}

export default function hotComponent(node) {
  const state = module.hot
    ? Baz(node).HMRState(module.hot, model())
    : model();

  if (module.hot) {
    // reload page if `./model.js` is changed
    module.hot.decline('./model.js')
  }

  mockRerender(node, state);

  const boundHandler = clickHandler(node, state);
  node.addEventListener('click', boundHandler);

  return () => {
    node.removeEventListener('click', boundHandler);
  };
}
