'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var GreetingComponent = React.createClass({
  render: function() {
    return React.DOM.h1(null, this.props.message + ', world!');
  },
});

var greeting = function(element) {
  ReactDOM.render(
    React.createElement(GreetingComponent, {
      message: element.getAttribute('data-message'),
    }),
    element
  );
};

module.exports = greeting;
