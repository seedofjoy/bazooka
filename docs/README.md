#Index

**Modules**

* [Bazooka](#module_Bazooka)
  * [Bazooka~BazookaWrapper](#module_Bazooka..BazookaWrapper)
  * [Bazooka~Bazooka(value)](#module_Bazooka..Bazooka)
  * [Bazooka.refresh([rootNode])](#module_Bazooka.refresh)
  * [Bazooka.watch([rootNode])](#module_Bazooka.watch)

**Classes**

* [class: Bazooka](#Bazooka)
  * [Bazooka.id](#Bazooka.id)

**Namespaces**

* [BazComponent](#BazComponent)
  * [BazComponent.simple()](#BazComponent.simple)
  * [BazComponent.universal](#BazComponent.universal)
    * [universal.bazFunc()](#BazComponent.universal.bazFunc)
 
<a name="module_Bazooka"></a>
#Bazooka
Bazooka

**Type**: `function`  
**Members**

* [Bazooka](#module_Bazooka)
  * [Bazooka~BazookaWrapper](#module_Bazooka..BazookaWrapper)
  * [Bazooka~Bazooka(value)](#module_Bazooka..Bazooka)
  * [Bazooka.refresh([rootNode])](#module_Bazooka.refresh)
  * [Bazooka.watch([rootNode])](#module_Bazooka.watch)

<a name="module_Bazooka..BazookaWrapper"></a>
##Bazooka~BazookaWrapper
Reference to `BazookaWrapper` class

**Scope**: inner member of [Bazooka](#module_Bazooka)  
<a name="module_Bazooka..Bazooka"></a>
##Bazooka~Bazooka(value)
**Params**

- value `node` | `BazookaWrapper` - DOM node or wrapped node  

**Scope**: inner function of [Bazooka](#module_Bazooka)  
**Returns**: `BazookaWrapper`  
**Example**  
```javascript
  var Baz = require('bazooka');
  var $baz = Baz(node);
```

<a name="module_Bazooka.refresh"></a>
##Bazooka.refresh([rootNode])
Parse and bind bazooka components to nodes without bound components

**Params**

- \[rootNode=document.body\] `node` - DOM node, children of which will be checked for `data-bazooka`  

<a name="module_Bazooka.watch"></a>
##Bazooka.watch([rootNode])
Watch for new nodes with `data-bazooka`

**Params**

- \[rootNode=document.body\] `node` - DOM node, children of which will be watched for `data-bazooka`  

**Returns**: `function` - Unwatch function  
<a name="Bazooka"></a>
#class: Bazooka
**Members**

* [class: Bazooka](#Bazooka)
  * [Bazooka.id](#Bazooka.id)

<a name="Bazooka.id"></a>
##Bazooka.id
Internal id

**Type**: `string`  
<a name="BazComponent"></a>
#BazComponent
Interface of component, required by [refresh](#module_Bazooka.refresh)

**Members**

* [BazComponent](#BazComponent)
  * [BazComponent.simple()](#BazComponent.simple)
  * [BazComponent.universal](#BazComponent.universal)
    * [universal.bazFunc()](#BazComponent.universal.bazFunc)

<a name="BazComponent.simple"></a>
##BazComponent.simple()
CommonJS module written only with Bazooka interface to be used with `data-bazooka`

**Params**

-  `node` - bound DOM node  

**Example**  
```javascript
  module.exports = function bazFunc(node) {}
```

<a name="BazComponent.universal"></a>
##BazComponent.universal
CommonJS module with Bazooka interface, so it can be used both in `data-bazooka`
and in another CommonJS modules via `require()`

**Example**  
```javascript
  function trackEvent(category, action, label) {}
  module.exports = {
    bazFunc: function bazFunc(node) { node.onclick = trackEvent.bind(…) },
    trackEvent: trackEvent,
  }
```

**Members**

* [BazComponent.universal](#BazComponent.universal)
  * [universal.bazFunc()](#BazComponent.universal.bazFunc)

<a name="BazComponent.universal.bazFunc"></a>
###universal.bazFunc()
Component's binding function

**Params**

-  `node` - bound DOM node  

