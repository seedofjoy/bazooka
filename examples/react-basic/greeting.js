'use strict';

var React = require('react');

var GreetingComponent = React.createClass({
  render: function() {
    return React.DOM.h1(null, this.props.message + ', world!');
  }
});

var greeting = function (element) {
  React.render(
    React.createElement(
      GreetingComponent,
      {'message': element.getAttribute('data-message')}
    ),
    element
  );
};

module.exports = greeting;
