function appendDiv() {
    var node = document.createElement('div');
    node.setAttribute('test-node', '');
    document.body.appendChild(node);
    return node;
}

describe("main", function() {
    var launcher = require('../../src/main.js');

    beforeEach(function() {
    });

    afterEach(function() {
        // Array.prototype.forEach.call(
        //     document.querySelectorAll('[test-node]'),
        //     function (el) {
        //         el.remove();
        //     }
        // );
    });

    it("should run component function", function(done) {
        var node = appendDiv();
        node.setAttribute('data-launcher', 'testComponent');

        var component = function (element, opts) {
            done();
        };

        launcher({
            'testComponent': component
        });
    });
});
