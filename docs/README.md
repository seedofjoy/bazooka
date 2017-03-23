## Modules

<dl>
<dt><a href="#module_BazComponent">BazComponent</a></dt>
<dd><p>Interface of component, required by <a href="#module_Bazooka.refresh">Bazooka.refresh</a></p>
</dd>
<dt><a href="#module_Bazooka">Bazooka</a> ⇒ <code><a href="#BazookaWrapper">BazookaWrapper</a></code></dt>
<dd><p>Bazooka</p>
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
<a name="BazookaWrapper"></a>

## ~BazookaWrapper
**Kind**: inner class  
<a name="BazookaWrapper+getComponents"></a>

### bazookaWrapper.getComponents() ⇒ <code>Object.&lt;string, BazComponent&gt;</code>
**Kind**: instance method of <code>[BazookaWrapper](#BazookaWrapper)</code>  
**Returns**: <code>Object.&lt;string, BazComponent&gt;</code> - object of the bound to the wrapped node [BazComponents](#module_BazComponent)  
