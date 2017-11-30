## 0.9.0

* :heavy_plus_sign: [added] support for async bazFunc calls via [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). In [browsers without Intersection Observer support](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Browser_compatibility), falls back to the equivalent of `setTimeout(bazFunc, 1, node)`. Check out [\_async example](/examples/_async)

```html
/* (old) sync call */
<div data-bazooka="init-time">
    will be called on `Bazooka.refresh()` / `Bazooka.watch()`
</div>

/* (new) async call */
<div data-bazooka="init-time" data-baz-async="viewport">
    will be called when in viewport
</div>
```

## 0.8.0

* :x: [removed] `Baz.h.getAttrs(node)`. Use `Baz.h.getAttrs(prefix, node)` or `Baz.h.getAttrs(prefix)(node)` instead _(deprecated since 0.4.1)_
* :wrench: [fixed] parsing pretty/multiline JSON (like `{\n"a": 1\n}`) by `Baz.h.getAttrs`:

```javascript
// node = <div data-baz-json='{\n"a": 1\n}' />

Baz.h.getAttrs('baz', node).json
// prior 0.8.0
//    => '{\n"a": 1\n}'

// after 0.8.0
//    => { "a": 1 }
```

## 0.7.0

[Hot Reload](https://github.com/seedofjoy/bazooka/blob/v0.7.0/docs/hot-reloadable-bazfuncs.md)

* :heavy_plus_sign: [added] return `dispose` functions from `bazFunc`
* :heavy_plus_sign: [added] `Bazooka.rebind` to update already bound `bazFunc`s
* :heavy_plus_sign: [added] `BazookaWrapper.prototype.HMRState` to preserve state between hot reloads

## 0.6.1

* :wrench: [changed] rethrow first exception from `Bazooka.refresh`

## 0.6.0

* :heavy_plus_sign: [added] wrapped `bazFunc` calls into `try/catch`

## 0.5.0

* :x: [removed] `MutationObserver` and `Function.prototype.bind` polyfills

## 0.4.1

* :warning: [deprecated] `Baz.h.getAttrs(node)`. Use `Baz.h.getAttrs(prefix, node)` or `Baz.h.getAttrs(prefix)(node)` instead

## 0.4.0

* :wrench: [fixed] `data-bazooka` value with multiple whitespaces
* :heavy_plus_sign: [added] support for components without `bazFunc`
* :heavy_plus_sign: [added] `BazookaWrapper.prototype.getComponents`

## 0.3.0

* :heavy_plus_sign: [added] support for binding multiple bazComponents to a single node
* :x: [removed] automatic bazComponent loading via `require()`. Use `Baz.register()` instead
