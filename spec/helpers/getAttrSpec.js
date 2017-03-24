'use strict';
/* global describe, beforeEach, afterEach, it, expect */
/* eslint max-nested-callbacks:0 */

var Baz = require('bazooka');
var getAttrs = Baz.h.getAttrs;

describe('Baz.h.getAttrs', function() {
  var node;

  beforeEach(function() {
    spyOn(console, 'warn');
    node = document.createElement('div');
  });

  afterEach(function() {
    node = null;
  });

  it('should return an empty object', function() {
    expect(getAttrs(node)).toEqual({});
  });

  it('should skip empty keys', function() {
    node.setAttribute('data-', 0);
    expect(getAttrs(node)).toEqual({});
  });

  it('should skip bazooka keys', function() {
    node.setAttribute('data-bazooka', 'test');
    node.setAttribute('data-bazid', 12);
    expect(getAttrs(node)).toEqual({});
  });

  it('should parse create camelCase keys', function() {
    node.setAttribute('data-a', 0);
    node.setAttribute('data-abc', 0);
    node.setAttribute('data-ab-c-de', 0);

    var attrs = getAttrs(node);
    expect(attrs.a).toBeDefined();
    expect(attrs.abc).toBeDefined();
    expect(attrs.abCDe).toBeDefined();
  });

  it('should parse `true`', function() {
    node.setAttribute('data-bool', true);
    node.setAttribute('data-bool-string', 'true');

    expect(getAttrs(node)).toEqual({
      bool: true,
      boolString: true,
    });
  });

  it('should parse `false`', function() {
    node.setAttribute('data-bool', false);
    node.setAttribute('data-bool-string', 'false');

    expect(getAttrs(node)).toEqual({
      bool: false,
      boolString: false,
    });
  });

  it('should parse `null`', function() {
    node.setAttribute('data-nul', null);
    node.setAttribute('data-nul-string', 'null');

    expect(getAttrs(node)).toEqual({
      nul: null,
      nulString: null,
    });
  });

  it('should parse numbers', function() {
    var numbers = [0, 0.1, 100, 123, -0.2];
    for (var i = 0; i < numbers.length; i++) {
      node.setAttribute('data-num', numbers[i]);
      node.setAttribute('data-num-string', numbers[i].toString());

      expect(getAttrs(node)).toEqual({
        num: numbers[i],
        numString: numbers[i],
      });
    }
  });

  it('should parse strings', function() {
    var strings = ['a', 'sdbsdh', 'слово', ''];
    for (var i = 0; i < strings.length; i++) {
      node.setAttribute('data-str', strings[i]);

      expect(getAttrs(node)).toEqual({
        str: strings[i],
      });
    }
  });

  it('should curry over prefix', function() {
    var getAttrsCurried = getAttrs('tt');
    expect(typeof getAttrsCurried).toBe('function');
    expect(getAttrsCurried.length).toBe(1);
  });

  it('should apply curried prefix', function() {
    var getAttrsCurried = getAttrs('tt');

    node.setAttribute('data-tt-a', 0);
    node.setAttribute('data-tt-abc', 0);
    node.setAttribute('data-tt-ab-c-de', 0);

    var attrs = getAttrsCurried(node);
    expect(attrs.a).toBeDefined();
    expect(attrs.abc).toBeDefined();
    expect(attrs.abCDe).toBeDefined();
  });

  it('should apply prefix', function() {
    node.setAttribute('data-tt-a', 0);
    node.setAttribute('data-tt-abc', 0);
    node.setAttribute('data-tt-ab-c-de', 0);

    var attrs = getAttrs('tt', node);
    expect(attrs.a).toBeDefined();
    expect(attrs.abc).toBeDefined();
    expect(attrs.abCDe).toBeDefined();
  });

  it('deprecation warnings', function() {
    window.NODE_ENV = 'production';
    getAttrs(node);
    expect(console.warn).not.toHaveBeenCalled();

    window.NODE_ENV = 'development';
    getAttrs(node);
    expect(console.warn).toHaveBeenCalled();
    console.warn.calls.reset();

    delete window.NODE_ENV;

    getAttrs('tt', node);
    expect(console.warn).not.toHaveBeenCalled();

    getAttrs('tt')(node);
    expect(console.warn).not.toHaveBeenCalled();
  });
});
