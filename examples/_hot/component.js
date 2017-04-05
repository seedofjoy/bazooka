import view from './view.js';

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

let hotComponent = function hotComponent(node, prevState) {
  const state = prevState || {
    count: 1,
  };

  mockRerender(node, state);

  const boundHandler = clickHandler(node, state);
  node.addEventListener('click', boundHandler);

  return () => {
    node.removeEventListener('click', boundHandler);

    return state;
  };
};

export default hotComponent;
