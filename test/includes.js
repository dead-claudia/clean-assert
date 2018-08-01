"use strict"

var util = require("../scripts/test-util")

describe("clean-assert (includes)", function () {
    function callIncludes(f, a, b) { return f(a, b) }
    function callEqualsAny(f, a, b) { return f(b, a) }
    function single(call, _) {
        util.testPermuteOne(_, function (_, list) {
            return {
                "checks numbers": function () {
                    call(_.is, list(1, 2, 3, 4, 5), 1)
                    call(_.is, list(1, 2, 3, 4, NaN), NaN)
                },

                "is strict": function () {
                    call(_.not, list("1", 2, 3, 4, 5), 1)
                },

                "checks objects": function () {
                    var obj1 = {key: 1}
                    var obj2 = {key: 2}
                    var obj3 = {key: 3}

                    function A() { this.key = 1 }

                    call(_.is, list(obj1, 3, obj3, "foo"), obj1)
                    call(_.not, list(obj1, 3, obj3, "foo"), obj2)
                    call(_.test("deep"), list(obj1, 3, obj3, "foo"), {key: 1})
                    call(_.test("match"), list(obj1, 3, obj3, "foo"), new A())
                },

                "checks missing numbers": function () {
                    call(_.not, list(1, 2, 3, 4, 5), 10)
                },

                "checks empty iterables": function () {
                    call(_.not, list(), 10)
                },
            }
        })
    }

    single(callIncludes, {
        method: "includes", negate: "excludes",
        accept: ["match", "deep"],
    })

    single(callIncludes, {
        method: "deeplyIncludes", negate: "deeplyExcludes",
        accept: ["deep"],
    })

    single(callIncludes, {
        method: "exactlyIncludes", negate: "exactlyExcludes",
    })

    single(callEqualsAny, {
        method: "equalsAny", negate: "equalsNone",
        accept: ["match", "deep"],
    })

    single(callEqualsAny, {
        method: "deeplyEqualsAny", negate: "deeplyEqualsNone",
        accept: ["deep"],
    })

    single(callEqualsAny, {
        method: "exactlyEqualsAny", negate: "exactlyEqualsNone",
    })

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    function multi(_) {
        util.testPermuteTwo(_, function (_, list, items) {
            function A(foo) { this.foo = foo }

            return {
                "works correctly with empty sequences": function () {
                    _.test("all")(list(1, 2, 3, 4, 5), items())
                },

                "checks numbers": function () {
                    _.is(list(1, 2, 3, 4, 5), items(1))
                },

                "checks all numbers": function () {
                    _.is(list(1, 2, 3, 4, 5), items(1, 2, 3))
                },

                "checks some numbers": function () {
                    _.test("any")(list(1, 2, 3, 4, 5), items(1, 2, 40))
                },

                "is strict": function () {
                    _.not(list("1", 2, 3, 4, 5), items(1))
                },

                "checks objects": function () {
                    var obj1 = {foo: 1}
                    var obj2 = {foo: 2}
                    var obj3 = {foo: 3}

                    _.is(list(obj1, 3, obj3, "foo"), items(obj1, obj3))
                    _.is(list(obj1, obj2, obj3), items(obj1, obj2, obj3))
                    _.test("any")(
                        list(obj1, 3, obj3, "foo"),
                        items(obj1, obj2, obj3)
                    )
                },

                "checks deeply matching objects": function () {
                    _.test("deep")(
                        list({foo: 1}, 3, {foo: 2}, "foo"),
                        items({foo: 1}, {foo: 2})
                    )

                    _.test("deep")(
                        list({foo: 1}, {foo: 2}, {foo: 3}),
                        items({foo: 1}, {foo: 2}, {foo: 3})
                    )

                    _.test("deep", "any")(
                        list({foo: 1}, 3, {foo: 2}, "foo"),
                        items({foo: 1}, {foo: 2}, {foo: 3})
                    )

                    _.not(
                        list({foo: 1}, 3, {foo: 2}, "foo"),
                        items({foo: 3}, {foo: 4})
                    )
                },

                "checks structurally matching objects": function () {
                    _.test("match")(
                        list({foo: 1}, 3, {foo: 2}, "foo"),
                        items(new A(1), new A(2))
                    )

                    _.test("match")(
                        list({foo: 1}, {foo: 2}, {foo: 3}),
                        items(new A(1), new A(2), new A(3))
                    )

                    _.test("match", "any")(
                        list({foo: 1}, 3, {foo: 2}, "foo"),
                        items(new A(1), new A(2), new A(3))
                    )
                },

                "checks missing numbers": function () {
                    _.not(list(1, 2, 3, 4, 5), items(10))
                },

                "checks missing objects": function () {
                    var obj1 = {foo: 1}
                    var obj2 = {foo: 2}
                    var obj3 = {foo: 3}

                    _.test("deep")(list(obj1, obj2, 3, "foo", {}), items({}))
                    _.not(list(obj1, obj2, obj3), items({}))
                    _.not(list(obj1, obj2, obj3), items([]))
                },
            }
        })
    }

    multi({
        method: "includesAll", negate: "excludesAll",
        accept: ["deep", "match", "all"],
    })

    multi({
        method: "includesAny", negate: "excludesAny",
        accept: ["deep", "match", "any"],
    })

    multi({
        method: "exactlyIncludesAll", negate: "exactlyExcludesAll",
        accept: ["all"],
    })

    multi({
        method: "exactlyIncludesAny", negate: "exactlyExcludesAny",
        accept: ["any"],
    })

    multi({
        method: "deeplyIncludesAll", negate: "deeplyExcludesAll",
        accept: ["deep", "all"],
    })

    multi({
        method: "deeplyIncludesAny", negate: "deeplyExcludesAny",
        accept: ["deep", "any"],
    })
})
