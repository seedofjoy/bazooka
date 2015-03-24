#Index

**Modules**

* [Bazooka](#module_Bazooka)
  * [Bazooka~wrapper](#module_Bazooka..wrapper)
  * [~~Bazooka.parseNodes()~~](#module_Bazooka.parseNodes)
  * [Bazooka.refresh()](#module_Bazooka.refresh)
  * [Bazooka.watch()](#module_Bazooka.watch)

**Classes**

* [class: BazookaWrapper](#BazookaWrapper)
  * [new BazookaWrapper(node)](#new_BazookaWrapper)
  * [BazookaWrapper.id](#BazookaWrapper.id)
  * [bazookaWrapper.r(methodName, method)](#BazookaWrapper#r)
  * [bazookaWrapper.g(methodName)](#BazookaWrapper#g)

**Namespaces**

* [BazComponent](#BazComponent)
  * [BazComponent.simple()](#BazComponent.simple)
  * [BazComponent.complex](#BazComponent.complex)
    * [complex.deps](#BazComponent.complex.deps)
    * [complex.f()](#BazComponent.complex.f)
 
<a name="module_Bazooka"></a>
#Bazooka
Bazooka

**Params**

- value `node` | <code>[BazookaWrapper](#BazookaWrapper)</code> - DOM node or wrapped node  

**Type**: `function`  
**Returns**: [BazookaWrapper](#BazookaWrapper)  
**Members**

* [Bazooka](#module_Bazooka)
  * [Bazooka~wrapper](#module_Bazooka..wrapper)
  * [~~Bazooka.parseNodes()~~](#module_Bazooka.parseNodes)
  * [Bazooka.refresh()](#module_Bazooka.refresh)
  * [Bazooka.watch()](#module_Bazooka.watch)

<a name="module_Bazooka..wrapper"></a>
##Bazooka~wrapper
Reference to [BazookaWrapper](#BazookaWrapper) class

**Scope**: inner member of [Bazooka](#module_Bazooka)  
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
<a name="BazookaWrapper"></a>
#class: BazookaWrapper
**Members**

* [class: BazookaWrapper](#BazookaWrapper)
  * [new BazookaWrapper(node)](#new_BazookaWrapper)
  * [BazookaWrapper.id](#BazookaWrapper.id)
  * [bazookaWrapper.r(methodName, method)](#BazookaWrapper#r)
  * [bazookaWrapper.g(methodName)](#BazookaWrapper#g)

<a name="new_BazookaWrapper"></a>
##new BazookaWrapper(node)
**Params**

- node `node`  

<a name="BazookaWrapper.id"></a>
##BazookaWrapper.id
Internal id

**Type**: `number`  
<a name="BazookaWrapper#r"></a>
##bazookaWrapper.r(methodName, method)
Register method of wrapped node

**Params**

- methodName `string`  
- method `function`  

<a name="BazookaWrapper#g"></a>
##bazookaWrapper.g(methodName)
Get previously [r](#BazookaWrapper#r) method of wrapped node

**Params**

- methodName `string`  

**Returns**: `function`  
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

<a name="BazComponent.complex"></a>
##BazComponent.complex
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

