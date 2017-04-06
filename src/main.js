'use strict';

var _bazId = 0;
var nodesComponentsRegistry = {};
var componentsRegistry = {};
var wrappersRegistry = {};

function _id(value) {
  return value;
}

function _getComponent(name) {
  if (!componentsRegistry[name]) {
    throw new Error(
      name + ' component is not registered. Use `Baz.register()` to do it'
    );
  }

  return componentsRegistry[name];
}

function _bindComponentToNode(wrappedNode, componentName) {
  var bazId = wrappedNode.id;

  if (!componentName) {
    return;
  }

  if (nodesComponentsRegistry[bazId] === void 0) {
    nodesComponentsRegistry[bazId] = [];
  }

  if (nodesComponentsRegistry[bazId].indexOf(componentName) === -1) {
    nodesComponentsRegistry[bazId].push(componentName);
  }
}

function _applyComponentToNode(componentName, wrappedNode) {
  var bazId = wrappedNode.id;
  var component = _getComponent(componentName);
  var dispose;

  if (component.bazFunc) {
    dispose = component.bazFunc(wrappedNode.__wrapped__);

    if (typeof dispose === 'function') {
      wrappedNode.__disposesMap__[componentName] = dispose;
    } else if (wrappedNode.__disposesMap__[componentName]) {
      wrappedNode.__disposesMap__[componentName] = null;
    }
  }
}

/**
 * @class BazookaWrapper
 * @inner
 */
function BazookaWrapper(node) {
  var bazId = node.getAttribute('data-bazid');

  if (bazId == null) {
    bazId = (_bazId++).toString();
    node.setAttribute('data-bazid', bazId);
    wrappersRegistry[bazId] = this;
    this.__disposesMap__ = {};
  } else {
    this.__disposesMap__ = wrappersRegistry[bazId].__disposesMap__;
  }

  /**
   * Internal id
   * @name Bazooka.id
   * @type {string}
   * @memberof Bazooka
   * @instance
   */
  this.id = bazId;
  this.__wrapped__ = node;
}

/**
 * @ignore
 * @constructor
 * @param {node} — DOM node with a bound components
 */
BazookaWrapper.prototype.constructor = BazookaWrapper;

/**
 * @returns {Object.<string, BazComponent>} object of the bound to the wrapped node [BazComponents]{@link module:BazComponent}
 */
BazookaWrapper.prototype.getComponents = function() {
  var components = {};

  for (var i = 0; i < nodesComponentsRegistry[this.id].length; i++) {
    components[nodesComponentsRegistry[this.id][i]] = _getComponent(
      nodesComponentsRegistry[this.id][i]
    );
  }

  return components;
};

/**
 * Callback to get state between Webpack's hot module reloads (HMR)
 *
 * @callback HMRStateCallback
 * @param {Object?} previous state. `undefined` on first call
 * @returns {Object} whatever state should be after HMR
 */

/**
 * Helper method to preserve component's state between Webpack's hot module reloads (HMR)
 * @param {webpackHotModule} moduleHot - [module.hot](https://github.com/webpack/webpack/blob/e7c13d75e4337cf166d421c153804892c49511bd/lib/HotModuleReplacement.runtime.js#L80) of the component
 * @param {HMRStateCallback} stateCallback - callback to create state. Called with undefined `prev` on initial binding and with `prev` equal latest component state after every HMR
 * @example
 * ```javascript
 *   const state = module.hot
 *     ? Baz(node).HMRState(module.hot, prev => prev || model())
 *     : model();
 * ```
 * @returns {Object} value from `stateCallback`
 */
BazookaWrapper.prototype.HMRState = function(moduleHot, stateCallback) {
  // moduleHot is bazFunc's `module.hot` (with method related to *that* bazFunc)
  var state;
  moduleHot.dispose(
    function(data) {
      data[this.id] = state;
    }.bind(this)
  );

  if (moduleHot.data && moduleHot.data[this.id]) {
    state = stateCallback(moduleHot.data[this.id]);
    moduleHot.data[this.id] = null;
  } else {
    state = stateCallback();
  }

  return state;
};

function _wrapAndBindNode(node) {
  var dataBazooka = (node.getAttribute('data-bazooka') || '').trim();
  var wrappedNode;
  var componentNames;
  var componentName;
  var caughtException;

  if (dataBazooka) {
    componentNames = dataBazooka.split(' ');
    wrappedNode = new BazookaWrapper(node);

    for (var i = 0; i < componentNames.length; i++) {
      _bindComponentToNode(wrappedNode, componentNames[i].trim());
    }

    for (var i = 0; i < nodesComponentsRegistry[wrappedNode.id].length; i++) {
      componentName = nodesComponentsRegistry[wrappedNode.id][i];

      try {
        _applyComponentToNode(componentName, wrappedNode);
      } catch (e) {
        console.error(
          componentName + ' component throws during initialization.',
          e
        );
        if (!caughtException) {
          caughtException = e;
        }
      }
    }

    if (caughtException) {
      throw caughtException;
    }
  }
}

/**
 * @interface BazComponent
 * @exports BazComponent
 * @description Interface of component, required by [Bazooka.refresh]{@link module:Bazooka.refresh}
 */

/**
 * @name simple
 * @func
 * @interface
 * @param {node} - bound DOM node
 * @description CommonJS module written only with Bazooka interface to be used with `data-bazooka`
 * @returns {function} `dispose` callback to cleanup components `eventListeners`, timers, etc. after [Bazooka.rebind]{@link module:Bazooka.rebind} or removal of the node from DOM
 * @example
 * ```javascript
 *   module.exports = function bazFunc(node) {}
 * ```
 */

/**
 * @name universal
 * @interface
 * @description CommonJS module with Bazooka interface, so it can be used both in `data-bazooka`
 * and in another CommonJS modules via `require()`
 * @example
 * ```javascript
 *   function trackEvent(category, action, label) {}
 *   module.exports = {
 *     bazFunc: function bazFunc(node) { node.onclick = trackEvent.bind(…) },
 *     trackEvent: trackEvent,
 *   }
 * ```
 */

/**
 * @name bazFunc
 * @abstract
 * @memberof BazComponent.universal
 * @func
 * @param {node} - bound DOM node
 * @description Component's binding function
 * @returns {function} `dispose` callback to cleanup components `eventListeners`, timers, etc. after [Bazooka.rebind]{@link module:Bazooka.rebind} or removal of the node from DOM
 */

/**
 * @module {function} Bazooka
 * @param {node|BazookaWrapper} value - DOM node or wrapped node
 * @returns {BazookaWrapper}
 * @example
 * ```javascript
 *   var Baz = require('bazooka');
 *   var $baz = Baz(node);
 * ```
 */
var Bazooka = function(value) {
  if (value instanceof BazookaWrapper) {
    return value;
  }

  return new BazookaWrapper(value);
};

/**
 * Reference to {@link BazookaWrapper} class
 * @name BazookaWrapper
 */
Bazooka.BazookaWrapper = BazookaWrapper;

Bazooka.h = require('./helpers');

/**
 * Register components names
 * @func register
 * @param {Object} componentsObj - object with names as keys and components as values
 * @static
 */
Bazooka.register = function(componentsObj) {
  for (var name in componentsObj) {
    if (typeof componentsObj[name] === 'function') {
      componentsRegistry[name] = {
        bazFunc: componentsObj[name],
      };
    } else {
      componentsRegistry[name] = componentsObj[name];
    }
  }
};

/**
 * Parse and bind bazooka components to nodes without bound components
 * @func refresh
 * @param {node} [rootNode=document.body] - DOM node, children of which will be checked for `data-bazooka`
 * @static
 */
Bazooka.refresh = function(rootNode) {
  rootNode = rootNode || document.body;
  var nodes;
  var caughtException;

  for (var bazId in wrappersRegistry) {
    var wrapper = wrappersRegistry[bazId];
    if (wrapper && !wrapper.__wrapped__.parentNode) {
      for (var disposableComponentName in wrapper.__disposesMap__) {
        if (
          typeof wrapper.__disposesMap__[disposableComponentName] === 'function'
        ) {
          wrapper.__disposesMap__[disposableComponentName]();
          wrapper.__disposesMap__[disposableComponentName] = null;
        }
      }

      wrappersRegistry[bazId] = null;
      nodesComponentsRegistry[bazId] = [];
    }
    wrapper = null;
  }

  nodes = Array.prototype.map.call(
    rootNode.querySelectorAll('[data-bazooka]:not([data-bazid])'),
    _id
  );

  for (var i = 0; i < nodes.length; i++) {
    try {
      _wrapAndBindNode(nodes[i]);
    } catch (e) {
      if (!caughtException) {
        caughtException = e;
      }
    }
  }

  if (caughtException) {
    throw caughtException;
  }
};

/**
 * Rebind existing components. Nodes with already bound component will be [disposed]{@link BazFunc.dispose} and bound again to a new `bazFunc`
 * @func rebind
 * @param {Object} componentsObj - object with new components
 * @example
 * ```javascript
 *   import bazFunc from './bazFunc.js'
 *
 *   Baz.register({
 *     bazFunc: bazFunc,
 *   });
 *
 *   Baz.watch();
 *
 *   if (module.hot) {
 *     module.hot.accept('./bazFunc.js', () => Baz.rebind({ bazFunc: bazFunc }));
 *     // or, if you prefer `require()`
 *     // module.hot.accept('./bazFunc.js', () => Baz.rebind({ bazFunc: require('./bazFunc.js') }));
 *   }
 * ```
 * @static
 */
Bazooka.rebind = function rebind(componentsObj) {
  var wrappedNode;

  Bazooka.register(componentsObj);

  for (var componentName in componentsObj) {
    for (var bazId in wrappersRegistry) {
      wrappedNode = wrappersRegistry[bazId];

      if (!wrappedNode) {
        continue;
      }

      if (
        wrappedNode &&
        typeof wrappedNode.__disposesMap__[componentName] === 'function'
      ) {
        wrappedNode.__disposesMap__[componentName]();
        wrappedNode.__disposesMap__[componentName] = null;
      }

      _applyComponentToNode(componentName, wrappedNode);
    }
  }
};

function _observedMutationCallback(mutation) {
  Bazooka.refresh(mutation.target);
}

function _MutationObserverCallback(mutations) {
  mutations.forEach(_observedMutationCallback);
}

/**
 * Watch for new nodes with `data-bazooka`. No need to run [Bazooka.refresh]{@link module:Bazooka.refresh} before this. It will be called automatically.
 * @func watch
 * @param {node} [rootNode=document.body] - DOM node, children of which will be watched for `data-bazooka`
 * @static
 * @returns {function} Unwatch function
 */
Bazooka.watch = function(rootNode) {
  var observer = new MutationObserver(_MutationObserverCallback);
  rootNode = rootNode || document.body;

  Bazooka.refresh(rootNode);
  observer.observe(rootNode, { childList: true, subtree: true });

  return observer.disconnect.bind(observer);
};

module.exports = Bazooka;
