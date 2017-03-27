'use strict';
/* global describe, beforeEach, afterEach, it, expect */
/* eslint max-nested-callbacks:0 */

var Baz = require('bazooka');
var getChildrenWithData = Baz.h.getChildrenWithData;

describe('Baz.h.getChildrenWithData', function() {
  var node;

  beforeEach(function() {
    node = document.createElement('div');
  });

  afterEach(function() {
    node = null;
  });

  it('should return an empty array', function() {
    expect(getChildrenWithData(node, 'data-x-x').length).toEqual(0);
    expect(getChildrenWithData(node, 'x-x').length).toEqual(0);
    expect(getChildrenWithData(node, 'xX').length).toEqual(0);
  });

  it('should get child with data attibute', function() {
    var childWithData = document.createElement('div');
    childWithData.setAttribute('data-x');
    node.appendChild(childWithData);
    expect(getChildrenWithData(node, 'data-x')[0]).toEqual(childWithData);
  });

  it('should not get child with different data attibute', function() {
    var childWithY = document.createElement('div');
    var childWithX = document.createElement('div');
    childWithY.setAttribute('data-y');
    childWithX.setAttribute('data-x');

    node.appendChild(childWithY);
    expect(getChildrenWithData(node, 'data-x').length).toEqual(0);

    node.appendChild(childWithX);
    expect(getChildrenWithData(node, 'data-x').length).toEqual(1);
    expect(getChildrenWithData(node, 'data-x')[0]).toEqual(childWithX);
  });

  it('should prefix data attribute key', function() {
    var childWithData = document.createElement('div');
    childWithData.setAttribute('data-camel-case');
    node.appendChild(childWithData);

    expect(getChildrenWithData(node, 'data-camel-case')[0]).toEqual(
      childWithData
    );
    expect(getChildrenWithData(node, 'camel-case')[0]).toEqual(childWithData);
    expect(getChildrenWithData(node, 'camelCase')[0]).toEqual(childWithData);
  });

  it('should get child with data key and value', function() {
    var childWithData = document.createElement('div');
    childWithData.setAttribute('data-camel-case', 'value');
    node.appendChild(childWithData);

    expect(getChildrenWithData(node, 'camelCase', 'value')[0]).toEqual(
      childWithData
    );
  });

  it('should not get child with data key and different value', function() {
    var childWithCorrectValue = document.createElement('div');
    var childWithDifferentValue = document.createElement('div');
    childWithCorrectValue.setAttribute('data-camel-case', 'value');
    childWithDifferentValue.setAttribute('data-camel-case', 'different');

    node.appendChild(childWithDifferentValue);
    expect(getChildrenWithData(node, 'camelCase', 'value').length).toEqual(0);

    node.appendChild(childWithCorrectValue);
    expect(getChildrenWithData(node, 'camelCase', 'value').length).toEqual(1);
    expect(getChildrenWithData(node, 'camelCase', 'value')[0]).toEqual(
      childWithCorrectValue
    );
  });

  it('should throw on empty dataKey', function() {
    expect(getChildrenWithData.bind(null, node)).toThrow();
    expect(getChildrenWithData.bind(null, node, '')).toThrow();
    expect(getChildrenWithData.bind(null, node, null)).toThrow();
  });
});
