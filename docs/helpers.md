## Functions

<dl>
<dt><a href="#getAttrs">getAttrs(prefix, [node])</a> ⇒ <code>function</code> | <code>object</code></dt>
<dd><p>Get all prefixed <code>data-</code> attributes as an object</p>
</dd>
<dt><a href="#getChildrenWithData">getChildrenWithData(parentNode, dataKey, [dataValue])</a> ⇒ <code>NodeList</code></dt>
<dd><p>Query children with specific <code>data-</code>attribute</p>
</dd>
</dl>

<a name="getAttrs"></a>

## getAttrs(prefix, [node]) ⇒ <code>function</code> &#124; <code>object</code>
Get all prefixed `data-` attributes as an object

**Kind**: global function  
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
<a name="getChildrenWithData"></a>

## getChildrenWithData(parentNode, dataKey, [dataValue]) ⇒ <code>NodeList</code>
Query children with specific `data-`attribute

**Kind**: global function  

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
