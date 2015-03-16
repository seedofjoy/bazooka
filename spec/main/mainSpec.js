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
        Array.prototype.forEach.call(
            document.querySelectorAll('[test-node]'),
            function (el) {
                document.body.removeChild(el);
            }
        );
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

    it("should fail on empty apps", function() {
        var noAppsError = new Error('RocketLauncher: No applications found!');
        expect(function () { launcher() }).toThrow(noAppsError);
        expect(function () { launcher(null) }).toThrow(noAppsError);
        expect(function () { launcher({}) }).toThrow(noAppsError);
    });

    it("should parse attributes to opts", function(done) {
        var node = appendDiv();
        node.setAttribute('data-launcher', 'testComponent');
        node.setAttribute('data-launcher-attr-one', 1);
        node.setAttribute('data-launcher-attr-two', 'two');
        node.setAttribute('data-launcher-attr-three-zero', null);

        var component = function (element, opts) {
            expect(Object.keys(opts).length).toBe(3);
            expect(opts.one).toBe('1');
            expect(opts.two).toBe('two');
            expect(opts.threeZero).toBe('null');
            done();
        };

        launcher({
            'testComponent': component
        });
    });
});
