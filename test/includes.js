"use strict"

var assert = require("../index")
var util = require("../test-util")

describe("clean-assert (includes)", function () {
    function check(func) {
        func(util.toArray, util.toArray)
        func(util.toArray, util.iterable)
        func(util.iterable, util.toArray)
        func(util.iterable, util.iterable)
    }

    function checkSingle(func) {
        func(util.toArray, util.identity)
        func(util.toArray, util.toArray)
        func(util.toArray, util.iterable)
        func(util.iterable, util.identity)
        func(util.iterable, util.toArray)
        func(util.iterable, util.iterable)
    }

    describe("includes()", function () {
        it("checks numbers", function () {
            checkSingle(function (list, single) {
                assert.includes(list(1, 2, 3, 4, 5), single(1))
            })
        })

        it("is strict", function () {
            checkSingle(function (list, single) {
                util.fail("includes", list("1", 2, 3, 4, 5), single(1))
            })
        })

        it("checks objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            check(function (list, items) {
                assert.includes(list(obj1, 3, obj3, "foo"), items(obj1, obj3))
                assert.includes(list(obj1, obj2, obj3), items(obj1, obj2, obj3))
                util.fail("includes", list(obj1, 3, obj3, "foo"),
                    items(obj1, obj2, obj3))
            })
        })

        it("checks nothing", function () {
            check(function (list, items) {
                assert.includes(list({}, {}), items())
            })
        })

        it("checks missing numbers", function () {
            checkSingle(function (list, single) {
                util.fail("includes", list(1, 2, 3, 4, 5), single(10))
            })
        })

        it("checks missing objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            checkSingle(function (list, single) {
                util.fail("includes", list(obj1, obj2, 3, "foo", {}),
                    single({}))
                util.fail("includes", list(obj1, obj2, obj3), single({}))
            })

            check(function (list, items) {
                util.fail("includes", list(obj1, obj2, obj3), items([]))
            })
        })
    })

    describe("notIncludesAll()", function () {
        it("checks numbers", function () {
            checkSingle(function (list, single) {
                util.fail("notIncludesAll", list(1, 2, 3, 4, 5), single(1))
            })
        })

        it("is strict", function () {
            checkSingle(function (list, single) {
                assert.notIncludesAll(list("1", 2, 3, 4, 5), single(1))
            })
        })

        it("checks objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            check(function (list, items) {
                util.fail("notIncludesAll", list(obj1, 3, obj3, "foo"),
                    items(obj1, obj3))
                util.fail("notIncludesAll", list(obj1, obj2, obj3),
                    items(obj1, obj2, obj3))
                assert.notIncludesAll(list(obj1, 3, obj3, "foo"),
                    items(obj1, obj2, obj3))
            })
        })

        it("checks nothing", function () {
            check(function (list, items) {
                assert.notIncludesAll(list({}, {}), items())
            })
        })

        it("checks missing numbers", function () {
            checkSingle(function (list, single) {
                assert.notIncludesAll(list(1, 2, 3, 4, 5), single(10))
            })
        })

        it("checks missing objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            checkSingle(function (list, single) {
                assert.notIncludesAll(list(obj1, obj2, 3, "foo", {}),
                    single({}))
                assert.notIncludesAll(list(obj1, obj2, obj3), single({}))
            })

            check(function (list, items) {
                assert.notIncludesAll(list(obj1, obj2, obj3), items([]))
            })
        })
    })

    describe("includesAny()", function () {
        it("checks numbers", function () {
            checkSingle(function (list, single) {
                assert.includesAny(list(1, 2, 3, 4, 5), single(1))
            })
        })

        it("is strict", function () {
            checkSingle(function (list, single) {
                util.fail("includesAny", list("1", 2, 3, 4, 5), single(1))
            })
        })

        it("checks objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            check(function (list, items) {
                assert.includesAny(list(obj1, 3, obj3, "foo"),
                    items(obj1, obj3))
                assert.includesAny(list(obj1, obj2, obj3),
                    items(obj1, obj2, obj3))
                assert.includesAny(list(obj1, 3, obj3, "foo"),
                    items(obj1, obj2, obj3))
            })
        })

        it("checks nothing", function () {
            check(function (list, items) {
                assert.includesAny(list({}, {}), items())
            })
        })

        it("checks missing numbers", function () {
            checkSingle(function (list, single) {
                util.fail("includesAny", list(1, 2, 3, 4, 5), single(10))
            })
        })

        it("checks missing objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            checkSingle(function (list, single) {
                util.fail("includesAny", list(obj1, obj2, 3, "foo", {}),
                    single({}))
                util.fail("includesAny", list(obj1, obj2, obj3), single({}))
            })

            check(function (list, items) {
                util.fail("includesAny", list(obj1, obj2, obj3), items([]))
            })
        })
    })

    describe("notIncludes()", function () {
        it("checks numbers", function () {
            checkSingle(function (list, single) {
                util.fail("notIncludes", list(1, 2, 3, 4, 5), single(1))
            })
        })

        it("is strict", function () {
            checkSingle(function (list, single) {
                assert.notIncludes(list("1", 2, 3, 4, 5), single(1))
            })
        })

        it("checks objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            check(function (list, items) {
                util.fail("notIncludes", list(obj1, 3, obj3, "foo"),
                    items(obj1, obj3))
                util.fail("notIncludes", list(obj1, obj2, obj3),
                    items(obj1, obj2, obj3))
                util.fail("notIncludes", list(obj1, 3, obj3, "foo"),
                    items(obj1, obj2, obj3))
            })
        })

        it("checks nothing", function () {
            check(function (list, items) {
                assert.notIncludes(list({}, {}), items())
            })
        })

        it("checks missing numbers", function () {
            checkSingle(function (list, single) {
                assert.notIncludes(list(1, 2, 3, 4, 5), single(10))
            })
        })

        it("checks missing objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            checkSingle(function (list, single) {
                assert.notIncludes(list(obj1, obj2, 3, "foo", {}), single({}))
                assert.notIncludes(list(obj1, obj2, obj3), single({}))
            })

            check(function (list, items) {
                assert.notIncludes(list(obj1, obj2, obj3), items([]))
            })
        })
    })

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    describe("includesDeep()", function () {
        it("checks numbers", function () {
            checkSingle(function (list, single) {
                assert.includesDeep(list(1, 2, 3, 4, 5), single(1))
            })
        })

        it("is strict", function () {
            checkSingle(function (list, single) {
                util.fail("includesDeep", list("1", 2, 3, 4, 5), single(1))
            })
        })

        it("checks objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            check(function (list, items) {
                assert.includesDeep(list(obj1, 3, obj3, "foo"),
                    items(obj1, obj3))
                assert.includesDeep(list(obj1, obj2, obj3),
                    items(obj1, obj2, obj3))
                assert.includesDeep(list(obj1, 3, obj3, "foo"),
                    items(obj1, obj2, obj3))
            })

            checkSingle(function (list, single) {
                assert.includesDeep(list({foo: 1}, {bar: 2}, 3, "foo", {}),
                    single({foo: 1}))
            })

            check(function (list, items) {
                assert.includesDeep(list({foo: 1}, {bar: 2}, {}),
                    items({bar: 2}, {}))
                assert.includesDeep(list({foo: 1}, {bar: 2}, []), items([]))
            })
        })

        it("checks nothing", function () {
            check(function (list, items) {
                assert.includesDeep(list({}, {}), items())
            })
        })

        it("checks missing numbers", function () {
            checkSingle(function (list, single) {
                util.fail("includesDeep", list(1, 2, 3, 4, 5), single(10))
            })
        })

        it("checks missing objects", function () {
            check(function (list, items) {
                util.fail("includesDeep", list({foo: 1}, {bar: 2}, {}),
                    items([]))
                util.fail("includesDeep", list({foo: 1}, {bar: 2}, {}),
                    items([], {foo: 1}))
            })
        })
    })

    describe("notIncludesAllDeep()", function () {
        it("checks numbers", function () {
            checkSingle(function (list, single) {
                util.fail("notIncludesAllDeep", list(1, 2, 3, 4, 5), single(1))
            })
        })

        it("is strict", function () {
            checkSingle(function (list, single) {
                assert.notIncludesAllDeep(list("1", 2, 3, 4, 5), single(1))
            })
        })

        it("checks objects", function () {
            check(function (list, items) {
                assert.notIncludesAllDeep(list({foo: 1}, 3, "foo"),
                    items("foo", 1))
                assert.notIncludesAllDeep(list({foo: 1}, {bar: 2}),
                    items({foo: 1}, {bar: 1}))
                util.fail("notIncludesAllDeep", list({foo: 1}, {bar: 2}),
                    items({foo: 1}, {bar: 2}))
            })
        })

        it("checks nothing", function () {
            check(function (list, items) {
                assert.notIncludesAllDeep(list({}, {}), items())
            })
        })

        it("checks missing numbers", function () {
            checkSingle(function (list, single) {
                assert.notIncludesAllDeep(list(1, 2, 3, 4, 5), single(10))
            })
        })

        it("checks missing objects", function () {
            check(function (list, items) {
                assert.notIncludesAllDeep(list({foo: 1}, {bar: 2}, {}),
                    items([]))
                assert.notIncludesAllDeep(list({foo: 1}, {bar: 2}, {}),
                    items([], {foo: 1}))
            })
        })
    })

    describe("includesAnyDeep()", function () {
        it("checks numbers", function () {
            checkSingle(function (list, single) {
                assert.includesAnyDeep(list(1, 2, 3, 4, 5), single(1))
            })
        })

        it("is strict", function () {
            checkSingle(function (list, single) {
                util.fail("includesAnyDeep", list("1", 2, 3, 4, 5), single(1))
            })
        })

        it("checks objects", function () {
            check(function (list, items) {
                assert.includesAnyDeep(list({foo: 1}, 3, "foo"),
                    items("foo", 1))
                assert.includesAnyDeep(list({foo: 1}, {bar: 2}),
                    items({foo: 1}, {bar: 1}))
                assert.includesAnyDeep(list({foo: 1}, {bar: 2}),
                    items({foo: 1}, {bar: 2}))
            })
        })

        it("checks nothing", function () {
            check(function (list, items) {
                assert.includesAnyDeep(list({}, {}), items())
            })
        })

        it("checks missing numbers", function () {
            checkSingle(function (list, single) {
                util.fail("includesAnyDeep", list(1, 2, 3, 4, 5), single(10))
            })
        })

        it("checks missing objects", function () {
            check(function (list, items) {
                util.fail("includesAnyDeep", list({foo: 1}, {bar: 2}, {}),
                    items([]))
                assert.includesAnyDeep(list({foo: 1}, {bar: 2}, {}),
                    items([], {foo: 1}))
            })
        })
    })

    describe("notIncludesDeep()", function () {
        it("checks numbers", function () {
            checkSingle(function (list, single) {
                util.fail("notIncludesDeep", list(1, 2, 3, 4, 5), single(1))
            })
        })

        it("is strict", function () {
            checkSingle(function (list, single) {
                assert.notIncludesDeep(list("1", 2, 3, 4, 5), single(1))
            })
        })

        it("checks objects", function () {
            check(function (list, items) {
                util.fail("notIncludesDeep", list({foo: 1}, 3, "foo"),
                    items("foo", 1))
                util.fail("notIncludesDeep", list({foo: 1}, {bar: 2}),
                    items({foo: 1}, {bar: 1}))
                util.fail("notIncludesDeep", list({foo: 1}, {bar: 2}),
                    items({foo: 1}, {bar: 2}))
            })
        })

        it("checks nothing", function () {
            check(function (list, items) {
                assert.notIncludesDeep(list({}, {}), items())
            })
        })

        it("checks missing numbers", function () {
            checkSingle(function (list, single) {
                assert.notIncludesDeep(list(1, 2, 3, 4, 5), single(10))
            })
        })

        it("checks missing objects", function () {
            check(function (list, items) {
                assert.notIncludesDeep(list({foo: 1}, {bar: 2}, {}),
                    items([]))
                util.fail("notIncludesDeep", list({foo: 1}, {bar: 2}, {}),
                    items([], {foo: 1}))
            })
        })
    })

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    describe("includesMatch()", function () {
        it("checks numbers", function () {
            checkSingle(function (list, single) {
                assert.includesMatch(list(1, 2, 3, 4, 5), single(1))
            })
        })

        it("is strict", function () {
            checkSingle(function (list, single) {
                util.fail("includesMatch", list("1", 2, 3, 4, 5), single(1))
            })
        })

        it("checks objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            check(function (list, items) {
                assert.includesMatch(list(obj1, 3, obj3, "foo"),
                    items(obj1, obj3))
                assert.includesMatch(list(obj1, obj2, obj3),
                    items(obj1, obj2, obj3))
                assert.includesMatch(list(obj1, 3, obj3, "foo"),
                    items(obj1, obj2, obj3))
            })

            checkSingle(function (list, single) {
                assert.includesMatch(list({foo: 1}, {bar: 2}, 3, "foo", {}),
                    single({foo: 1}))
            })

            check(function (list, items) {
                assert.includesMatch(list({foo: 1}, {bar: 2}, {}),
                    items({bar: 2}, {}))
                assert.includesMatch(list({foo: 1}, {bar: 2}, []), items([]))
            })
        })

        it("checks nothing", function () {
            check(function (list, items) {
                assert.includesMatch(list({}, {}), items())
            })
        })

        it("checks missing numbers", function () {
            checkSingle(function (list, single) {
                util.fail("includesMatch", list(1, 2, 3, 4, 5), single(10))
            })
        })

        it("checks missing objects", function () {
            check(function (list, items) {
                util.fail("includesMatch", list({foo: 1}, {bar: 2}, {}),
                    items([]))
                util.fail("includesMatch", list({foo: 1}, {bar: 2}, {}),
                    items([], {foo: 1}))
            })
        })
    })

    describe("notIncludesAllMatch()", function () {
        it("checks numbers", function () {
            checkSingle(function (list, single) {
                util.fail("notIncludesAllMatch", list(1, 2, 3, 4, 5), single(1))
            })
        })

        it("is strict", function () {
            checkSingle(function (list, single) {
                assert.notIncludesAllMatch(list("1", 2, 3, 4, 5), single(1))
            })
        })

        it("checks objects", function () {
            check(function (list, items) {
                assert.notIncludesAllMatch(list({foo: 1}, 3, "foo"),
                    items("foo", 1))
                assert.notIncludesAllMatch(list({foo: 1}, {bar: 2}),
                    items({foo: 1}, {bar: 1}))
                util.fail("notIncludesAllMatch", list({foo: 1}, {bar: 2}),
                    items({foo: 1}, {bar: 2}))
            })
        })

        it("checks nothing", function () {
            check(function (list, items) {
                assert.notIncludesAllMatch(list({}, {}), items())
            })
        })

        it("checks missing numbers", function () {
            checkSingle(function (list, single) {
                assert.notIncludesAllMatch(list(1, 2, 3, 4, 5), single(10))
            })
        })

        it("checks missing objects", function () {
            check(function (list, items) {
                assert.notIncludesAllMatch(list({foo: 1}, {bar: 2}, {}),
                    items([]))
                assert.notIncludesAllMatch(list({foo: 1}, {bar: 2}, {}),
                    items([], {foo: 1}))
            })
        })
    })

    describe("includesAnyMatch()", function () {
        it("checks numbers", function () {
            checkSingle(function (list, single) {
                assert.includesAnyMatch(list(1, 2, 3, 4, 5), single(1))
            })
        })

        it("is strict", function () {
            checkSingle(function (list, single) {
                util.fail("includesAnyMatch", list("1", 2, 3, 4, 5), single(1))
            })
        })

        it("checks objects", function () {
            check(function (list, items) {
                assert.includesAnyMatch(list({foo: 1}, 3, "foo"),
                    items("foo", 1))
                assert.includesAnyMatch(list({foo: 1}, {bar: 2}),
                    items({foo: 1}, {bar: 1}))
                assert.includesAnyMatch(list({foo: 1}, {bar: 2}),
                    items({foo: 1}, {bar: 2}))
            })
        })

        it("checks nothing", function () {
            check(function (list, items) {
                assert.includesAnyMatch(list({}, {}), items())
            })
        })

        it("checks missing numbers", function () {
            checkSingle(function (list, single) {
                util.fail("includesAnyMatch", list(1, 2, 3, 4, 5), single(10))
            })
        })

        it("checks missing objects", function () {
            check(function (list, items) {
                util.fail("includesAnyMatch", list({foo: 1}, {bar: 2}, {}),
                    items([]))
                assert.includesAnyMatch(list({foo: 1}, {bar: 2}, {}),
                    items([], {foo: 1}))
            })
        })
    })

    describe("notIncludesMatch()", function () {
        it("checks numbers", function () {
            checkSingle(function (list, single) {
                util.fail("notIncludesMatch", list(1, 2, 3, 4, 5), single(1))
            })
        })

        it("is strict", function () {
            checkSingle(function (list, single) {
                assert.notIncludesMatch(list("1", 2, 3, 4, 5), single(1))
            })
        })

        it("checks objects", function () {
            check(function (list, items) {
                util.fail("notIncludesMatch", list({foo: 1}, 3, "foo"),
                    items("foo", 1))
                util.fail("notIncludesMatch", list({foo: 1}, {bar: 2}),
                    items({foo: 1}, {bar: 1}))
                util.fail("notIncludesMatch", list({foo: 1}, {bar: 2}),
                    items({foo: 1}, {bar: 2}))
            })
        })

        it("checks nothing", function () {
            check(function (list, items) {
                assert.notIncludesMatch(list({}, {}), items())
            })
        })

        it("checks missing numbers", function () {
            checkSingle(function (list, single) {
                assert.notIncludesMatch(list(1, 2, 3, 4, 5), single(10))
            })
        })

        it("checks missing objects", function () {
            check(function (list, items) {
                assert.notIncludesMatch(list({foo: 1}, {bar: 2}, {}),
                    items([]))
                util.fail("notIncludesMatch", list({foo: 1}, {bar: 2}, {}),
                    items([], {foo: 1}))
            })
        })
    })
})
