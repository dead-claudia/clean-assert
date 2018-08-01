"use strict"

var util = require("../scripts/test-util")

describe("clean-assert (has keys)", function () {
    function checkObject(_) {
        util.test(_, function (_) {
            var tests = Object.create(null)

            util.permute(function (context, list) {
                function test(name, init) {
                    tests[name + " (" + context + ")"] = init
                }

                test("checks single number keys", function () {
                    _.is({1: true, 2: true, 3: false}, list(1))
                })

                test("checks single string keys", function () {
                    _.is({foo: true, bar: false, baz: 1}, list("foo"))
                })

                test("checks multiple number keys", function () {
                    _.is({1: true, 2: true, 3: false}, list(1))
                })

                test("checks multiple string keys", function () {
                    _.is({foo: true, bar: false, baz: 1}, list("foo"))
                })

                test("checks single missing number keys", function () {
                    _.not({1: true, 2: true, 3: false}, list(0))
                })

                test("checks single missing string keys", function () {
                    _.not({foo: true, bar: false, baz: 1}, list("missing"))
                })

                test("checks all missing number keys", function () {
                    _.not({1: true, 2: true, 3: false}, list(0, 4))
                })

                test("checks all missing string keys", function () {
                    _.not({foo: true, bar: false, baz: 1}, list("one", "two"))
                })

                test("checks some missing number keys", function () {
                    _.test("any")({1: true, 2: true, 3: false}, list(1, 0))
                    _.test("any")({1: true, 2: true, 3: false}, list(0, 1))
                })

                test("checks some missing string keys", function () {
                    _.test("any")({foo: true, bar: false, baz: 1},
                        list("foo", "missing")
                    )
                    _.test("any")({foo: true, bar: false, baz: 1},
                        list("missing", "foo")
                    )
                })

                test("checks empty key lists", function () {
                    _.test("all")({foo: true, bar: false, baz: 1}, list())
                })

                test("checks own vs inherited keys", function () {
                    _.test("inherited")(new A(), list("foo"))
                })
            })

            tests["checks values for numeric keys"] = function () {
                _.is({1: true, 2: true, 3: false}, {1: true})
            }

            tests["checks values for string keys"] = function () {
                _.is({foo: true, bar: false, baz: 1}, {foo: true})
            }

            tests["is strict"] = function () {
                _.not({foo: "1", bar: 2, baz: 3}, {foo: 1})
            }

            tests["checks objects"] = function () {
                var obj1 = {}
                var obj2 = {}
                var obj3 = {}

                _.is(
                    {obj1: obj1, obj3: obj3, prop: 3, foo: "foo"},
                    {obj1: obj1, obj3: obj3}
                )

                _.is(
                    {obj1: obj1, obj2: obj2, obj3: obj3},
                    {obj1: obj1, obj2: obj2, obj3: obj3}
                )

                _.is(
                    {obj1: obj1, obj2: obj2, obj3: obj3},
                    {obj1: obj1, obj3: obj3}
                )

                _.test("any")(
                    {obj1: obj1, obj3: obj3},
                    {obj1: obj1, obj2: obj2, obj3: obj3}
                )

                _.test("any")(
                    {obj1: obj1, obj3: obj3, prop: 3, foo: "foo"},
                    {obj1: obj1, obj2: obj2, obj3: obj3}
                )

                _.test("deep")(
                    {foo: {foo: 1}, bar: {foo: 2}, baz: 3, qux: {}},
                    {foo: {foo: 1}}
                )

                _.test("deep")(
                    {foo: {foo: 1}, bar: {bar: 2}, baz: {}},
                    {bar: {bar: 2}, baz: {}}
                )

                _.not(
                    {foo: {foo: 1}, bar: {bar: 2}, baz: []},
                    {bar: []}
                )
            }

            tests["checks nothing"] = function () {
                _.test("all")({foo: {}, bar: {}}, {})
            }

            tests["checks missing keys"] = function () {
                _.not({foo: 1, bar: 2, baz: 3}, [10])
                _.not({foo: 1, bar: 2, baz: 3}, {a: 10})
                _.not({foo: 1, bar: 2, baz: 3}, {foo: 10})
            }

            tests[
                _.check("match")
                    ? "checks structurally"
                    : "doesn't check structurally"
            ] = function () {
                function A() { this.foo = 1 }
                function B() { this.foo = 1 }

                _.test("match")({foo: new A()}, {foo: new B()})
            }

            function A() {}
            function B() { this.hi = "there" }
            A.prototype.foo = 1
            A.prototype.bar = 2
            A.prototype.baz = {three: "four"}
            A.prototype.what = new B()

            tests["checks own vs inherited keys"] = function () {
                _.test("inherited")(new A(), {foo: 1, bar: 2})

                ;(_.check("inherited", "any")
                    ? _.is
                    : _.test("inherited", "deep")
                )(new A(), {foo: 1, baz: {three: "four"}})

                ;(
                    _.check("inherited", "any")
                        ? _.is
                        : _.test("inherited", "match")
                )(new A(), {foo: 1, what: {hi: "there"}})
            }

            return tests
        })
    }

    function checkMap(_) {
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

            var tests = Object.create(null)

            util.permute(function (context, list) {
                function test(name, init) {
                    tests[name + " (" + context + ")"] = init
                }

                test("checks single keys", function () {
                    _.is(
                        map([["foo", 1], ["bar", 2], ["baz", 3]]),
                        list("foo")
                    )
                })

                test("checks multiple keys", function () {
                    _.is(
                        map([["foo", 1], ["bar", 2], ["baz", 3]]),
                        list("foo")
                    )
                })

                test("checks single missing keys", function () {
                    _.not(
                        map([["foo", 1], ["bar", 2], ["baz", 3]]),
                        list("missing")
                    )
                })

                test("checks all missing keys", function () {
                    _.not(
                        map([["foo", 1], ["bar", 2], ["baz", 3]]),
                        list("one", "two")
                    )
                })

                test("checks some missing string keys", function () {
                    _.test("any")(
                        map([["foo", 1], ["bar", 2], ["baz", 3]]),
                        list("foo", "missing")
                    )
                    _.test("any")(
                        map([["foo", 1], ["bar", 2], ["baz", 3]]),
                        list("missing", "foo")
                    )
                })

                test("checks empty key lists", function () {
                    _.test("all")(
                        map([["foo", 1], ["bar", 2], ["baz", 3]]),
                        list()
                    )
                })
            })

            tests["checks values for keys"] = function () {
                _.is(
                    map([["foo", 1], ["bar", 2], ["baz", 3]]),
                    {foo: 1}
                )
            }

            tests["is strict"] = function () {
                _.not(map([["foo", "1"], ["bar", 2], ["baz", 3]]), {foo: 1})
            }

            tests["checks objects"] = function () {
                var obj1 = {}
                var obj2 = {}
                var obj3 = {}

                _.is(
                    map([
                        ["obj1", obj1], ["obj3", obj3],
                        ["prop", 3], ["foo", "foo"],
                    ]),
                    {obj1: obj1, obj3: obj3}
                )

                _.is(
                    map([["obj1", obj1], ["obj2", obj2], ["obj3", obj3]]),
                    {obj1: obj1, obj2: obj2, obj3: obj3}
                )

                _.is(
                    map([["obj1", obj1], ["obj2", obj2], ["obj3", obj3]]),
                    {obj1: obj1, obj3: obj3}
                )

                _.test("any")(
                    map([["obj1", obj1], ["obj3", obj3]]),
                    {obj1: obj1, obj2: obj2, obj3: obj3}
                )

                _.test("any")(
                    map([
                        ["obj1", obj1], ["obj3", obj3],
                        ["prop", 3], ["foo", "foo"],
                    ]),
                    {obj1: obj1, obj2: obj2, obj3: obj3}
                )

                _.test("deep")(
                    map([
                        ["foo", {foo: 1}],
                        ["bar", {foo: 2}],
                        ["baz", 3],
                        ["qux", {}],
                    ]),
                    {foo: {foo: 1}}
                )

                _.test("deep")(
                    map([["foo", {foo: 1}], ["bar", {bar: 2}], ["baz", {}]]),
                    {bar: {bar: 2}, baz: {}}
                )

                _.not(
                    map([["foo", {foo: 1}], ["bar", {bar: 2}], ["baz", {}]]),
                    {bar: []}
                )
            }

            tests["checks nothing"] = function () {
                _.test("all")(map([["foo", {}], ["bar", {}]]), {})
            }

            tests["checks missing keys"] = function () {
                _.not(map([["foo", 1], ["bar", 2], ["baz", 3]]), [10])
                _.not(map([["foo", 1], ["bar", 2], ["baz", 3]]), {a: 10})
                _.not(map([["foo", 1], ["bar", 2], ["baz", 3]]), {foo: 10})
            }

            tests[
                _.check("match")
                    ? "checks structurally"
                    : "doesn't check structurally"
            ] = function () {
                function A() { this.foo = 1 }
                function B() { this.foo = 1 }

                _.test("match")(map([["foo", new A()]]), {foo: new B()})
            }

            return tests
        })
    }

    checkObject({
        method: "exactlyHasAllIn", negate: "exactlyLacksAllIn",
        accept: ["inherited", "all"],
    })

    checkObject({
        method: "exactlyHasAnyIn", negate: "exactlyLacksAnyIn",
        accept: ["inherited", "any"],
    })

    checkObject({
        method: "hasAllIn", negate: "lacksAllIn",
        accept: ["inherited", "all", "deep", "match"],
    })

    checkObject({
        method: "hasAnyIn", negate: "lacksAnyIn",
        accept: ["inherited", "any", "deep", "match"],
    })

    checkObject({
        method: "deeplyHasAllIn", negate: "deeplyLacksAllIn",
        accept: ["inherited", "all", "deep"],
    })

    checkObject({
        method: "deeplyHasAnyIn", negate: "deeplyLacksAnyIn",
        accept: ["inherited", "any", "deep"],
    })

    checkObject({
        method: "exactlyHasAllOwn", negate: "exactlyLacksAllOwn",
        accept: ["all"],
    })

    checkObject({
        method: "exactlyHasAnyOwn", negate: "exactlyLacksAnyOwn",
        accept: ["any"],
    })

    checkObject({
        method: "hasAllOwn", negate: "lacksAllOwn",
        accept: ["all", "deep", "match"],
    })

    checkObject({
        method: "hasAnyOwn", negate: "lacksAnyOwn",
        accept: ["any", "deep", "match"],
    })

    checkObject({
        method: "deeplyHasAllOwn", negate: "deeplyLacksAllOwn",
        accept: ["all", "deep"],
    })

    checkObject({
        method: "deeplyHasAnyOwn", negate: "deeplyLacksAnyOwn",
        accept: ["any", "deep"],
    })

    checkMap({
        method: "exactlyHasAllKeys", negate: "exactlyLacksAllKeys",
        accept: ["all"],
    })

    checkMap({
        method: "exactlyHasAnyKey", negate: "exactlyLacksAnyKey",
        accept: ["any"],
    })

    checkMap({
        method: "hasAllKeys", negate: "lacksAllKeys",
        accept: ["all", "deep", "match"],
    })

    checkMap({
        method: "hasAnyKey", negate: "lacksAnyKey",
        accept: ["any", "deep", "match"],
    })

    checkMap({
        method: "deeplyHasAllKeys", negate: "deeplyLacksAllKeys",
        accept: ["all", "deep"],
    })

    checkMap({
        method: "deeplyHasAnyKey", negate: "deeplyLacksAnyKey",
        accept: ["any", "deep"],
    })
})
