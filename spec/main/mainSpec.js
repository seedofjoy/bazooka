function appendDiv() {
    var node = document.createElement('div');
    node.setAttribute('test-node', '');
    document.body.appendChild(node);
    return node;
}

describe("main", function() {
    var Baz = require('../../src/main.js');

    beforeEach(function() {
        spyOn(console, 'warn');
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
        node.setAttribute('data-bazooka', 'testComponent');

        var component = function (element, opts) {
            done();
        };

        Baz({
            'testComponent': component
        });
    });

    it("should fail on empty apps", function() {
        var noAppsError = new Error('Bazooka: No applications found!');
        expect(function () { Baz() }).toThrow(noAppsError);
        expect(function () { Baz(null) }).toThrow(noAppsError);
        expect(function () { Baz({}) }).toThrow(noAppsError);
    });

    it("should parse attributes to opts", function(done) {
        var node = appendDiv();
        node.setAttribute('data-bazooka', 'testComponent');
        node.setAttribute('data-bazooka-attr-one', 1);
        node.setAttribute('data-bazooka-attr-two', 'two');
        node.setAttribute('data-bazooka-attr-three-zero', null);

        var component = function (element, opts) {
            expect(Object.keys(opts).length).toBe(3);
            expect(opts.one).toBe('1');
            expect(opts.two).toBe('two');
            expect(opts.threeZero).toBe('null');
            done();
        };

        Baz({
            'testComponent': component
        });
    });

    it("should print warnings if app does not found in HTML nodes", function() {
        var node = appendDiv();
        node.setAttribute('data-bazookamisspelled', 'testComponent');

        var component = function (element, opts) {
            done();
        };

        Baz({
            'testComponent': component
        });

        expect(console.warn).toHaveBeenCalledWith('Bazooka: testComponent not found in HTML nodes');
    });
});
