## Modules

<dl>
<dt><a href="#module_BazComponent">BazComponent</a></dt>
<dd><p>Interface of component, required by <a href="#module_Bazooka.refresh">Bazooka.refresh</a></p>
</dd>
<dt><a href="#module_Bazooka">Bazooka</a> ⇒ <code><a href="#BazookaWrapper">BazookaWrapper</a></code></dt>
<dd><p>Bazooka</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#HMRStateCallback">HMRStateCallback</a> ⇒ <code>Object</code></dt>
<dd><p>Callback to get state between Webpack&#39;s hot module reloads (HMR)</p>
</dd>
</dl>

<a name="module_BazComponent"></a>

## BazComponent
Interface of component, required by [Bazooka.refresh](#module_Bazooka.refresh)


* [BazComponent](#module_BazComponent)
    * [~simple](#module_BazComponent..simple)
    * [~universal](#module_BazComponent..universal)

<a name="module_BazComponent..simple"></a>

### BazComponent~simple
CommonJS module written only with Bazooka interface to be used with `data-bazooka`

**Kind**: inner interface of <code>[BazComponent](#module_BazComponent)</code>  

| Type | Description |
| --- | --- |
| <code>node</code> | bound DOM node |

**Example**  
```javascript
  module.exports = function bazFunc(node) {}
```
<a name="module_BazComponent..universal"></a>

### BazComponent~universal
CommonJS module with Bazooka interface, so it can be used both in `data-bazooka`
and in another CommonJS modules via `require()`

**Kind**: inner interface of <code>[BazComponent](#module_BazComponent)</code>  
**Example**  
```javascript
  function trackEvent(category, action, label) {}
  module.exports = {
    bazFunc: function bazFunc(node) { node.onclick = trackEvent.bind(…) },
    trackEvent: trackEvent,
  }
```
<a name="module_Bazooka"></a>

## Bazooka ⇒ <code>[BazookaWrapper](#BazookaWrapper)</code>
Bazooka


| Param | Type | Description |
| --- | --- | --- |
| value | <code>node</code> &#124; <code>[BazookaWrapper](#BazookaWrapper)</code> | DOM node or wrapped node |

**Example**  
```javascript
  var Baz = require('bazooka');
  var $baz = Baz(node);
```

* [Bazooka](#module_Bazooka) ⇒ <code>[BazookaWrapper](#BazookaWrapper)</code>
    * _static_
        * [.register(componentsObj)](#module_Bazooka.register)
        * [.refresh([rootNode])](#module_Bazooka.refresh)
        * [.rebind(componentsObj)](#module_Bazooka.rebind)
        * [.watch([rootNode])](#module_Bazooka.watch) ⇒ <code>function</code>
    * _inner_
        * [~BazookaWrapper](#module_Bazooka..BazookaWrapper)

<a name="module_Bazooka.register"></a>

### Bazooka.register(componentsObj)
Register components names

**Kind**: static method of <code>[Bazooka](#module_Bazooka)</code>  

| Param | Type | Description |
| --- | --- | --- |
| componentsObj | <code>Object</code> | object with names as keys and components as values |

<a name="module_Bazooka.refresh"></a>

### Bazooka.refresh([rootNode])
Parse and bind bazooka components to nodes without bound components

**Kind**: static method of <code>[Bazooka](#module_Bazooka)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [rootNode] | <code>node</code> | <code>document.body</code> | DOM node, children of which will be checked for `data-bazooka` |

<a name="module_Bazooka.rebind"></a>

### Bazooka.rebind(componentsObj)
Rebind existing components. Nodes with already bound component will be [disposed](BazFunc.dispose) and bound again to a new `bazFunc`

**Kind**: static method of <code>[Bazooka](#module_Bazooka)</code>  

| Param | Type | Description |
| --- | --- | --- |
| componentsObj | <code>Object</code> | object with new components |

**Example**  
```javascript
  import bazFunc from './bazFunc.js'

  Baz.register({
    bazFunc: bazFunc,
  });

  Baz.watch();

  if (module.hot) {
    module.hot.accept('./bazFunc.js', () => Baz.rebind({ bazFunc: bazFunc }));
    // or, if you prefer `require()`
    // module.hot.accept('./bazFunc.js', () => Baz.rebind({ bazFunc: require('./bazFunc.js') }));
  }
```
<a name="module_Bazooka.watch"></a>

### Bazooka.watch([rootNode]) ⇒ <code>function</code>
Watch for new nodes with `data-bazooka`. No need to run [Bazooka.refresh](#module_Bazooka.refresh) before this. It will be called automatically.

**Kind**: static method of <code>[Bazooka](#module_Bazooka)</code>  
**Returns**: <code>function</code> - Unwatch function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [rootNode] | <code>node</code> | <code>document.body</code> | DOM node, children of which will be watched for `data-bazooka` |

<a name="module_Bazooka..BazookaWrapper"></a>

### Bazooka~BazookaWrapper
Reference to [BazookaWrapper](#BazookaWrapper) class

**Kind**: inner property of <code>[Bazooka](#module_Bazooka)</code>  
<a name="HMRStateCallback"></a>

## HMRStateCallback ⇒ <code>Object</code>
Callback to get state between Webpack's hot module reloads (HMR)

**Kind**: global typedef  
**Returns**: <code>Object</code> - whatever state should be after HMR  

| Param | Type | Description |
| --- | --- | --- |
| previous | <code>Object</code> | state. `undefined` on first call |

<a name="BazookaWrapper"></a>

## ~BazookaWrapper
**Kind**: inner class  

* [~BazookaWrapper](#BazookaWrapper)
    * [.getComponents()](#BazookaWrapper+getComponents) ⇒ <code>Object.&lt;string, BazComponent&gt;</code>
    * [.HMRState(moduleHot, stateCallback)](#BazookaWrapper+HMRState) ⇒ <code>Object</code>

<a name="BazookaWrapper+getComponents"></a>

### bazookaWrapper.getComponents() ⇒ <code>Object.&lt;string, BazComponent&gt;</code>
**Kind**: instance method of <code>[BazookaWrapper](#BazookaWrapper)</code>  
**Returns**: <code>Object.&lt;string, BazComponent&gt;</code> - object of the bound to the wrapped node [BazComponents](#module_BazComponent)  
<a name="BazookaWrapper+HMRState"></a>

### bazookaWrapper.HMRState(moduleHot, stateCallback) ⇒ <code>Object</code>
Helper method to preserve component's state between Webpack's hot module reloads (HMR)

**Kind**: instance method of <code>[BazookaWrapper](#BazookaWrapper)</code>  
**Returns**: <code>Object</code> - value from `stateCallback`  

| Param | Type | Description |
| --- | --- | --- |
| moduleHot | <code>webpackHotModule</code> | — [module.hot](https://github.com/webpack/webpack/blob/e7c13d75e4337cf166d421c153804892c49511bd/lib/HotModuleReplacement.runtime.js#L80) of the component |
| stateCallback | <code>[HMRStateCallback](#HMRStateCallback)</code> | — callback to create state. Called with undefined `prev` on initial binding and with `prev` equal latest component state after every HMR |

**Example**  
```javascript
  const state = module.hot
    ? Baz(node).HMRState(module.hot, prev => prev || model())
    : model();
```
