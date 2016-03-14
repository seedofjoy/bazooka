## Modules

<dl>
<dt><a href="#module_Bazooka">Bazooka</a> : <code>function</code></dt>
<dd><p>Bazooka</p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#Bazooka">Bazooka</a></dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#BazComponent">BazComponent</a> : <code>object</code></dt>
<dd><p>Interface of component, required by <a href="#module_Bazooka.refresh">Bazooka.refresh</a></p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#Bazooka">Bazooka(value)</a> ⇒ <code><a href="#BazookaWrapper">BazookaWrapper</a></code></dt>
<dd></dd>
</dl>

<a name="module_Bazooka"></a>
## Bazooka : <code>function</code>
Bazooka


* [Bazooka](#module_Bazooka) : <code>function</code>
    * _static_
        * [.register(componentsObj)](#module_Bazooka.register)
        * [.refresh([rootNode])](#module_Bazooka.refresh)
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
<a name="Bazooka"></a>
## Bazooka
**Kind**: global class  
<a name="Bazooka.id"></a>
### Bazooka.id : <code>string</code>
Internal id

**Kind**: static property of <code>[Bazooka](#Bazooka)</code>  
<a name="BazComponent"></a>
## BazComponent : <code>object</code>
Interface of component, required by [Bazooka.refresh](#module_Bazooka.refresh)

**Kind**: global namespace  

* [BazComponent](#BazComponent) : <code>object</code>
    * [.universal](#BazComponent.universal) : <code>object</code>
        * [.bazFunc()](#BazComponent.universal.bazFunc)
    * [.simple()](#BazComponent.simple)

<a name="BazComponent.universal"></a>
### BazComponent.universal : <code>object</code>
CommonJS module with Bazooka interface, so it can be used both in `data-bazooka`
and in another CommonJS modules via `require()`

**Kind**: static namespace of <code>[BazComponent](#BazComponent)</code>  
**Example**  
```javascript
  function trackEvent(category, action, label) {}
  module.exports = {
    bazFunc: function bazFunc(node) { node.onclick = trackEvent.bind(…) },
    trackEvent: trackEvent,
  }
```
<a name="BazComponent.universal.bazFunc"></a>
#### universal.bazFunc()
Component's binding function

**Kind**: static method of <code>[universal](#BazComponent.universal)</code>  

| Type | Description |
| --- | --- |
| <code>node</code> | bound DOM node |

<a name="BazComponent.simple"></a>
### BazComponent.simple()
CommonJS module written only with Bazooka interface to be used with `data-bazooka`

**Kind**: static method of <code>[BazComponent](#BazComponent)</code>  

| Type | Description |
| --- | --- |
| <code>node</code> | bound DOM node |

**Example**  
```javascript
  module.exports = function bazFunc(node) {}
```
<a name="Bazooka"></a>
## Bazooka(value) ⇒ <code>[BazookaWrapper](#BazookaWrapper)</code>
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>node</code> &#124; <code>[BazookaWrapper](#BazookaWrapper)</code> | DOM node or wrapped node |

**Example**  
```javascript
  var Baz = require('bazooka');
  var $baz = Baz(node);
```
<a name="Bazooka.id"></a>
### Bazooka.id : <code>string</code>
Internal id

**Kind**: static property of <code>[Bazooka](#Bazooka)</code>  
<a name="BazookaWrapper"></a>
## ~BazookaWrapper
**Kind**: inner class  
<a name="BazookaWrapper+getComponents"></a>
### bazookaWrapper.getComponents() ⇒ <code>Object.&lt;string, BazComponent&gt;</code>
**Kind**: instance method of <code>[BazookaWrapper](#BazookaWrapper)</code>  
**Returns**: <code>Object.&lt;string, BazComponent&gt;</code> - object of the bound to the wrapped node [BazComponents](#BazComponent)  
