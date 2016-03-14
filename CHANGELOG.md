## 0.5.0

* :x: [removed] `MutationObserver` and `Function.prototype.bind` polyfills

## 0.4.1

* :warning: [deprecated] `Baz.h.getAttrs(node)`. Use `Baz.h.getAttrs(prefix, node)` or `Baz.h.getAttrs(prefix)(node)`
instead

## 0.4.0

* :wrench: [fixed] `data-bazooka` value with multiple whitespaces
* :heavy_plus_sign: [added] support for components without `bazFunc`
* :heavy_plus_sign: [added] `BazookaWrapper.prototype.getComponents`

## 0.3.0

* :heavy_plus_sign: [added] support for binding multiple bazComponents to a single node
* :x: [removed] automatic bazComponent loading via `require()`. Use `Baz.register()` instead
