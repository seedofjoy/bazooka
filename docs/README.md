#Index

**Modules**

* [Bazooka](#module_Bazooka)
  * [Bazooka~wrapper](#module_Bazooka..wrapper)
  * [Bazooka~Bazooka(value)](#module_Bazooka..Bazooka)
  * [~~Bazooka.parseNodes()~~](#module_Bazooka.parseNodes)
  * [Bazooka.refresh()](#module_Bazooka.refresh)
  * [Bazooka.watch()](#module_Bazooka.watch)

**Classes**

* [class: Bazooka](#Bazooka)
  * [Bazooka.id](#Bazooka.id)
  * [Bazooka.r(methodName, method)](#Bazooka.r)
  * [Bazooka.g(methodName)](#Bazooka.g)

**Namespaces**

* [BazComponent](#BazComponent)
  * [BazComponent.simple()](#BazComponent.simple)
  * [BazComponent.complex](#BazComponent.complex)
    * [complex.deps](#BazComponent.complex.deps)
    * [complex.f()](#BazComponent.complex.f)
 
<a name="module_Bazooka"></a>
#Bazooka
Bazooka

**Type**: `function`  
**Members**

* [Bazooka](#module_Bazooka)
  * [Bazooka~wrapper](#module_Bazooka..wrapper)
  * [Bazooka~Bazooka(value)](#module_Bazooka..Bazooka)
  * [~~Bazooka.parseNodes()~~](#module_Bazooka.parseNodes)
  * [Bazooka.refresh()](#module_Bazooka.refresh)
  * [Bazooka.watch()](#module_Bazooka.watch)

<a name="module_Bazooka..wrapper"></a>
##Bazooka~wrapper
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

<a name="module_Bazooka.parseNodes"></a>
##~~Bazooka.parseNodes()~~
Parse and bind bazooka components on page

***Deprecated***  
<a name="module_Bazooka.refresh"></a>
##Bazooka.refresh()
Parse and bind bazooka components to nodes without bound components

<a name="module_Bazooka.watch"></a>
##Bazooka.watch()
Watch for new node with `data-bazooka` each 200ms

**Returns**: `function` - Unwatch function  
<a name="Bazooka"></a>
#class: Bazooka
**Members**

* [class: Bazooka](#Bazooka)
  * [Bazooka.id](#Bazooka.id)
  * [Bazooka.r(methodName, method)](#Bazooka.r)
  * [Bazooka.g(methodName)](#Bazooka.g)

<a name="Bazooka.id"></a>
##Bazooka.id
Internal id

**Type**: `number`  
<a name="Bazooka.r"></a>
##Bazooka.r(methodName, method)
Register method of wrapped node

**Params**

- methodName `string`  
- method `function`  

**Example**  
```javascript
  var Baz = require('bazooka');
  var $baz = Baz(node);
  $baz.r('logger', console.log.bind(console, '[logger]'));
```

<a name="Bazooka.g"></a>
##Bazooka.g(methodName)
Get previously registered via [r](#Bazooka.r) method of wrapped node

**Params**

- methodName `string`  

**Returns**: `function`  
**Example**  
```javascript
  var Baz = require('bazooka');
  var $baz = Baz(node);
  $baz.g('logger')($baz.id);
```

<a name="BazComponent"></a>
#BazComponent
Interface of component, required by [refresh](#module_Bazooka.refresh)

**Members**

* [BazComponent](#BazComponent)
  * [BazComponent.simple()](#BazComponent.simple)
  * [BazComponent.complex](#BazComponent.complex)
    * [complex.deps](#BazComponent.complex.deps)
    * [complex.f()](#BazComponent.complex.f)

<a name="BazComponent.simple"></a>
##BazComponent.simple()
Component's binding function

**Params**

-  `node` - bound DOM node  

**Example**  
```javascript
  module.exports = function bazFunc(node) {}
```

<a name="BazComponent.complex"></a>
##BazComponent.complex
**Example**  
```javascript
  module.exports = {
    f: function bazFunc(node) {},
    deps: ['baz-logger'],
  }
```

**Members**

* [BazComponent.complex](#BazComponent.complex)
  * [complex.deps](#BazComponent.complex.deps)
  * [complex.f()](#BazComponent.complex.f)

<a name="BazComponent.complex.deps"></a>
###complex.deps
Names of components on which this component depends

**Type**: `Array.<string>`  
<a name="BazComponent.complex.f"></a>
###complex.f()
**Params**

-  `node` - bound DOM node
Component's binding function  

