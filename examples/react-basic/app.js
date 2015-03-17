'use strict';

var React = require('react');
var Baz = require('bazooka');

var GreetingComponent = React.createClass({
    render: function() {
        return React.DOM.h1(null, this.props.message + ', world!');
    }
});

var GreetingComponentFactory = React.createFactory(GreetingComponent);

var app = function (element, opts) {
    React.render(
        GreetingComponentFactory({'message': opts.message}),
        element
    );
};

Baz({
    'greetingApp': app
});
