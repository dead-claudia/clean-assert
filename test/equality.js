"use strict"

var util = require("../scripts/test-util")

// eslint-disable-next-line max-statements
describe("clean-assert (equality)", function () {
    var ignore = {}

    function testSingle(_) {
        var bind = _.bind

        util.test(_, function (_) {
            function test() { return bind(_.test.apply(_, arguments)) }
            return {
                "`true`": function () { test(true)(true) },
                "`false`": function () { test(false)(false) },
                "`0`": function () { test(0)(0) },
                "`1`": function () { test(1)(1) },
                "`NaN`": function () { test(NaN)(NaN) },
                "`Infinity`": function () { test(Infinity)(Infinity) },
                "non-empty strings": function () { test("foo")("foo") },
                "empty strings": function () { test("")("") },
                "`null`": function () { test(null)(null) },
                "objects": function () { test("object")({}) },
                "arrays": function () { test("array")([]) },
                "iterables": function () { test("iterable")(util.iterable()) },
                "functions": function () { test("function")(function () {}) },
                "`undefined`": function () { test(undefined)(undefined) },
                "no argument": function () { test(undefined)() },
                // eslint-disable-next-line no-undef
                "symbols": typeof Symbol === "function"
                    // eslint-disable-next-line no-undef
                    ? function () { test("symbol")(Symbol()) }
                    : undefined,
            }
        })
    }

    function testIs(method, accept) {
        testSingle({
            bind: function (f) { return f.bind(undefined, method) },
            method: "is", negate: "not", context: method,
            accept: accept,
        })
        testSingle({
            bind: function (f) { return f.bind(undefined, method) },
            method: "possibly", negate: "notPossibly", context: method,
            accept: accept.concat([null, undefined]),
        })
    }

    testSingle({
        bind: function (f) { return f },
        method: "ok", negate: "notOk",
        accept: [
            true, false, 0, 1, NaN, Infinity, "", "foo",
            "object", "array", "iterable", "function", "symbol",
        ],
    })

    testIs("boolean", [true, false])
    testIs("number", [0, 1, NaN, Infinity])
    testIs("function", ["function"])
    testIs("object", ["object", "array", "iterable"])
    testIs("string", ["", "foo"])
    testIs("symbol", ["symbol"])
    testIs("array", ["array"])
    testIs("iterable", [
        typeof ""[util.symbolIterator] === "function" ? "" : ignore,
        typeof ""[util.symbolIterator] === "function" ? "foo" : ignore,
        "iterable",
        typeof ""[util.symbolIterator] === "function" ? "array" : ignore,
    ])
    testIs("array-like", ["", "foo", "array", "function"])

    util.testPair("is", "not", "type", function (is, not) {
        function A() {}
        function B() {}
        B.prototype = Object.create(A.prototype)
        B.prototype.constructor = B

        return {
            "direct parent": function () { is(A, new A()) },
            "parent extends `Object`": function () { is(Object, new A()) },
            "direct child": function () { is(B, new B()) },
            "child extends parent": function () { is(A, new B()) },
            "parent doesn't extend child": function () { not(B, new A()) },
            "passes with native types": function () { is(RegExp, /(?:)/) },
            "fails with native types": function () { not(RegExp, []) },
        }
    })

    // Note that some tests aren't included, because they should pass/fail on
    // all variants.
    function testEqual(_) {
        util.test(_, function (_) {
            return {
                "both `0`": function () { _.is(0, 0) },
                "both `1`": function () { _.is(1, 1) },
                "both `null`": function () { _.is(null, null) },
                "both `undefined`": function () { _.is(undefined, undefined) },
                "both `Infinity`": function () { _.is(Infinity, Infinity) },
                "both `''`": function () { _.is("", "") },
                "both `'foo'`": function () { _.is("foo", "foo") },
                "same object": function () {
                    var obj = {}

                    _.is(obj, obj)
                },
                "fully matching empty object": function () {
                    _.test("deep")({}, {})
                },
                "property matching empty object": function () {
                    function A() {}
                    function B() {}
                    _.test("match")(new A(), new B())
                },
                "fully matching non-empty object": function () {
                    _.test("deep")({a: [2, 3], b: [4]}, {a: [2, 3], b: [4]})
                },
                "property matching non-empty object": function () {
                    function A() { this.a = [2, 3]; this.b = [4] }
                    function B() { this.a = [2, 3]; this.b = [4] }
                    _.test("match")(new A(), new B())
                },
                "null vs undefined": function () {
                    _.not(null, undefined)
                },
                "different numbers": function () {
                    _.not(0, 1)
                },
                "loosely equal numbers": function () {
                    _.not(1, "1")
                },
            }
        })
    }

    testEqual({
        method: "exactlyEqual", negate: "exactlyNotEqual",
    })

    testEqual({
        method: "deeplyEqual", negate: "deeplyNotEqual",
        accept: ["deep"],
    })

    testEqual({
        method: "equal", negate: "notEqual",
        accept: ["deep", "match"],
    })

    function testHasCheck(_) {
        util.test(_, function (_) {
            function F() { this.value = 1; this.other = {foo: "bar"} }
            F.prototype.prop = 1

            return {
                "existing literal own": function () {
                    _.is({prop: 1}, "prop")
                },
                "existing literal inherited": function () {
                    _.test("inherited")({prop: 1}, "toString")
                },
                "missing literal": function () {
                    _.not({prop: 1}, "missing")
                },
                "existing non-literal own": function () {
                    _.is(new F(), "value")
                },
                "existing non-literal inherited": function () {
                    _.test("inherited")(new F(), "prop")
                },
                "missing non-literal": function () {
                    _.not(new F(), "missing")
                },
            }
        })
    }

    testHasCheck({
        method: "hasOwn", negate: "lacksOwn", context: "check key",
    })
    testHasCheck({
        method: "hasIn", negate: "lacksIn", context: "check key",
        accept: ["inherited"],
    })

    util.testPair("hasKey", "lacksKey", "check key", function (is, not) {
        var mapLike = {has: function (key) { return key === "foo" }}

        return {
            existing: function () { is(mapLike, "foo") },
            missing: function () { not(mapLike, "missing") },
        }
    })

    function testHasValue(_) {
        util.test(_, function (_) {
            function A(foo) { this.foo = foo }
            function B(one) { this.one = one }
            function F() {
                this.value = 1
                this.object = {foo: "bar"}
            }
            F.prototype.prop = 1
            F.prototype.other = {one: "two"}

            var toString = {}.toString

            return {
                "exactly equal literal own": function () {
                    _.is({prop: 1}, "prop", 1)
                },
                "exactly equal literal inherited": function () {
                    _.test("inherited")({prop: 1}, "toString", toString)
                },
                "loosely equal existing literal own": function () {
                    _.not({prop: 1}, "prop", "1")
                },
                "loosely equal existing literal inherited": function () {
                    _.not({prop: 1}, "toString", toString.toString())
                },
                "missing literal": function () {
                    _.not({prop: 1}, "missing", undefined)
                },
                "loosely equal missing literal": function () {
                    _.not({prop: 1}, "missing", null)
                },
                "exactly equal object own": function () {
                    _.is(new F(), "value", 1)
                },
                "exactly equal object inherited": function () {
                    _.test("inherited")(new F(), "toString", toString)
                },
                "exactly equal object inherited non-root": function () {
                    _.test("inherited")(new F(), "prop", 1)
                },
                "loosely equal existing object own": function () {
                    _.not(new F(), "value", "1")
                },
                "loosely equal existing literal object non-root": function () {
                    _.not(new F(), "toString", toString.toString())
                },
                "missing non-root": function () {
                    _.not(new F(), "missing", undefined)
                },
                "loosely equal missing non-root": function () {
                    _.not(new F(), "missing", null)
                },
                "deeply equal object own": function () {
                    _.test("deep")(new F(), "object", {foo: "bar"})
                },
                "deeply equal object inherited non-root": function () {
                    _.test("deep", "inherited")(new F(), "other", {one: "two"})
                },
                "deeply different object own": function () {
                    _.not(new F(), "object", {foo: "nope"})
                },
                "deeply different object inherited": function () {
                    _.not(new F(), "other", {one: "nope"})
                },
                "structurally equal object own": function () {
                    _.test("match")(new F(), "object", new A("bar"))
                },
                "structurally equal object inherited": function () {
                    _.test("match", "inherited")(new F(), "other", new B("two"))
                },
                "structurally different object own": function () {
                    _.not(new F(), "object", new A("nope"))
                },
                "structurally different object inherited": function () {
                    _.not(new F(), "other", new B("nope"))
                },
            }
        })
    }

    testHasValue({
        method: "hasOwn", negate: "lacksOwn", context: "check value",
        accept: ["deep", "match"],
    })
    testHasValue({
        method: "hasIn", negate: "lacksIn", context: "check value",
        accept: ["deep", "match", "inherited"],
    })
    testHasValue({
        method: "exactlyHasOwn", negate: "exactlyLacksOwn",
    })
    testHasValue({
        method: "exactlyHasIn", negate: "exactlyLacksIn",
        accept: ["inherited"],
    })
    testHasValue({
        method: "deeplyHasOwn", negate: "deeplyLacksOwn",
        accept: ["deep"],
    })
    testHasValue({
        method: "deeplyHasIn", negate: "deeplyLacksIn",
        accept: ["deep", "inherited"],
    })

    function testHasMapValue(_) {
        util.test(_, function (_) {
            function map(pairs) {
                var keys = pairs.map(function (p) { return p[0] })
                var values = pairs.map(function (p) { return p[1] })

                return {
                    keys: keys, values: values,
                    has: function (key) { return keys.indexOf(key) >= 0 },
                    get: function (key) { return values[keys.indexOf(key)] },
                }
            }

            function A(foo) { this.foo = foo }

            return {
                "exactly equal": function () {
                    _.is(map([["key", 1]]), "key", 1)
                },
                "loosely equal existing": function () {
                    _.not(map([["key", 1]]), "key", "1")
                },
                "missing": function () {
                    _.not(map([["key", 1]]), "missing", undefined)
                },
                "loosely equal missing": function () {
                    _.not(map([["key", 1]]), "missing", null)
                },
                "deeply equal": function () {
                    _.test("deep")(map([["key", {foo: 1}]]), "key", {foo: 1})
                },
                "deeply different": function () {
                    _.not(map([["key", {foo: 1}]]), "key", {foo: 2})
                },
                "structurally equal": function () {
                    _.test("match")(map([["key", {foo: 1}]]), "key", new A(1))
                },
                "structurally different": function () {
                    _.not(map([["key", {foo: 1}]]), "key", new A(2))
                },
            }
        })
    }

    testHasMapValue({
        method: "hasKey", negate: "lacksKey", context: "check value",
        accept: ["deep", "match"],
    })
    testHasMapValue({
        method: "exactlyHasKey", negate: "exactlyLacksKey",
    })
    testHasMapValue({
        method: "deeplyHasKey", negate: "deeplyLacksKey",
        accept: ["deep"],
    })
})
