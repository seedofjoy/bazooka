<a name="Bazooka.module_h"></a>

## h

* [h](#Bazooka.module_h)
    * [.getAttrs(prefix, [node])](#Bazooka.module_h.getAttrs) ⇒ <code>function</code> &#124; <code>object</code>
    * [.getChildrenWithData(parentNode, dataKey, [dataValue])](#Bazooka.module_h.getChildrenWithData) ⇒ <code>NodeList</code>

<a name="Bazooka.module_h.getAttrs"></a>

### h.getAttrs(prefix, [node]) ⇒ <code>function</code> &#124; <code>object</code>
Get all prefixed `data-` attributes as an object

**Kind**: static method of <code>[h](#Bazooka.module_h)</code>  
**Returns**: <code>function</code> &#124; <code>object</code> - - curried function for parsing node with passed prefix or parsed attrs  

| Param | Type | Description |
| --- | --- | --- |
| prefix | <code>string</code> | `data-`attribute prefix |
| [node] | <code>HTMLNode</code> | target node |

**Example**  
```javascript
  // <div id="n" data-x-a="lol" data-x-b="1" data-y-c='{"key": 1}' data-y-composed-attr="true"></div>
  
  Baz.h.getAttrs('x', document.n) // => {a: "lol", b: 1}
  Baz.h.getAttrs('y', document.n) // => {y: {key: 1}, composedAttr: true}

  const xAttrs = Baz.h.getAttrs('x')
  xAttrs(document.n) // => {x: "lol", b: 1}
```
<a name="Bazooka.module_h.getChildrenWithData"></a>

### h.getChildrenWithData(parentNode, dataKey, [dataValue]) ⇒ <code>NodeList</code>
Query children with specific `data-`attribute

**Kind**: static method of <code>[h](#Bazooka.module_h)</code>  

| Param | Type | Description |
| --- | --- | --- |
| parentNode | <code>HTMLNode</code> |  |
| dataKey | <code>string</code> | – data-key. `data-baz-key`, `baz-key` and `bazKey` are equivalent |
| [dataValue] | <code>string</code> | value of a `data-`attribute |

**Example**  
```javascript
  // <div id="parent">
  //   <div data-user-id="1">yep</div>
  //   <div data-user-id="2">nope</div>
  // </div>
  
  Baz.h.getChildrenWithData(document.parent, 'data-user-id', 1)[0].textContent === 'yep'
  Baz.h.getChildrenWithData(document.parent, 'user-id', 1)[0].textContent === 'yep'
  Baz.h.getChildrenWithData(document.parent, 'userId', 2)[0].textContent === 'nope'
```
