function appendDiv() {
    var node = document.createElement('div');
    node.setAttribute('test-node', '');
    document.body.appendChild(node);
    return node;
}

describe("Baz", function() {
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

    it("should return wrapper node", function () {
        var node = appendDiv();
        var $baz = Baz(node);
        expect($baz instanceof Baz.wrapper).toBe(true);
    });

    it("should increment bazId for new node", function () {
        var node = appendDiv();
        var $baz = Baz(node);

        var node2 = appendDiv();
        var $baz2 = Baz(node2);

        expect($baz2.id).toBe($baz.id + 1);
    });

    it("should do nothing to bazId of already wrapped nodes", function () {
        var node = appendDiv();
        var $baz = Baz(node);
        var $baz2 = Baz(node);

        expect($baz2.id).toBe($baz.id);
    });
});
