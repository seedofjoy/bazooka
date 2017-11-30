# bazooka [![Build Status](https://travis-ci.org/seedofjoy/bazooka.svg)](https://travis-ci.org/seedofjoy/bazooka)
Simple tool for declarative binding applications to HTML nodes.


## Installation

```bash
$ npm install bazooka
```

### Browser Support

Bazooka uses [`MutationObserver`](https://developer.mozilla.org/en/docs/Web/API/MutationObserver) to watch for DOM updates. If you want to use `Baz.watch()` and need to support [browsers without `MutationObserver`](http://caniuse.com/#feat=mutationobserver), you'll need any `MutationObserver` polyfill (we recommend [this one](https://www.npmjs.com/package/mutation-observer))

Also, Bazooka can initiate components asynchriously (when component's node comes into viewport, via `data-baz-async="viewport"` HTML attribute). For that, Bazooka uses [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). In [browsers without `IntersectionObserver` support](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Browser_compatibility), falls back to the equivalent of `setTimeout(bazFunc, 1, node)`


## Examples

To view the examples, clone the bazooka repo, install the dependencies and compile examples:

```bash
$ git clone git://github.com/seedofjoy/bazooka.git
$ cd bazooka
$ npm install
$ npm run examples
```

Then run whichever example you want by opening index.html in `/examples/` subdirectories:
```bash
$ cd examples
```

* **complex** — universal component to work with and without bazooka
* **react-basic** — bazooka + [react](https://facebook.github.io/react/)
* **gifflix** — bazooka + frp (via [kefir.js](https://rpominov.github.io/kefir/))


## [Docs](docs)
- [API](docs/README.md)
- [Helpers (`Baz.h`)](docs/helpers.md)
- [Hot Reloadable `bazFunc`s](docs/hot-reloadable-bazfuncs.md)

## [Changelog](CHANGELOG.md)


## Tests

To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```

## Lint

Bazooka uses [prettier](https://github.com/prettier/prettier) linter. To conform with it, just run before creating a commit:

```bash
$ npm run fmt
```


## License

  [MIT](LICENSE)
