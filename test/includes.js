"use strict"

var assert = require("../index")
var util = require("../test-util")

describe("clean-assert (includes)", function () {
    describe("includes()", function () {
        it("checks numbers", function () {
            assert.includes([1, 2, 3, 4, 5], 1)
            assert.includes([1, 2, 3, 4, 5], [1])
        })

        it("is strict", function () {
            util.fail("includes", ["1", 2, 3, 4, 5], 1)
            util.fail("includes", ["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            assert.includes([obj1, 3, obj3, "foo"], [obj1, obj3])
            assert.includes([obj1, obj2, obj3], [obj1, obj2, obj3])
            util.fail("includes", [obj1, 3, obj3, "foo"], [obj1, obj2, obj3])
        })

        it("checks nothing", function () {
            assert.includes([{}, {}], [])
        })

        it("checks missing numbers", function () {
            util.fail("includes", [1, 2, 3, 4, 5], 10)
            util.fail("includes", [1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            util.fail("includes", [obj1, obj2, 3, "foo", {}], [{}])
            util.fail("includes", [obj1, obj2, obj3], [{}])
            util.fail("includes", [obj1, obj2, obj3], [[]])
        })
    })

    describe("notIncludesAll()", function () {
        it("checks numbers", function () {
            util.fail("notIncludesAll", [1, 2, 3, 4, 5], 1)
            util.fail("notIncludesAll", [1, 2, 3, 4, 5], [1])
        })

        it("is strict", function () {
            assert.notIncludesAll(["1", 2, 3, 4, 5], 1)
            assert.notIncludesAll(["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            util.fail("notIncludesAll", [obj1, 3, obj3, "foo"], [obj1, obj3])
            util.fail("notIncludesAll", [obj1, obj2, obj3], [obj1, obj2, obj3])
            assert.notIncludesAll([obj1, 3, obj3, "foo"], [obj1, obj2, obj3])
        })

        it("checks nothing", function () {
            assert.notIncludesAll([{}, {}], [])
        })

        it("checks missing numbers", function () {
            assert.notIncludesAll([1, 2, 3, 4, 5], 10)
            assert.notIncludesAll([1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            assert.notIncludesAll([obj1, obj2, 3, "foo", {}], [{}])
            assert.notIncludesAll([obj1, obj2, obj3], [{}])
            assert.notIncludesAll([obj1, obj2, obj3], [[]])
        })
    })

    describe("includesAny()", function () {
        it("checks numbers", function () {
            assert.includesAny([1, 2, 3, 4, 5], 1)
            assert.includesAny([1, 2, 3, 4, 5], [1])
        })

        it("is strict", function () {
            util.fail("includesAny", ["1", 2, 3, 4, 5], 1)
            util.fail("includesAny", ["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            assert.includesAny([obj1, 3, obj3, "foo"], [obj1, obj3])
            assert.includesAny([obj1, obj2, obj3], [obj1, obj2, obj3])
            assert.includesAny([obj1, 3, obj3, "foo"], [obj1, obj2, obj3])
        })

        it("checks nothing", function () {
            assert.includesAny([{}, {}], [])
        })

        it("checks missing numbers", function () {
            util.fail("includesAny", [1, 2, 3, 4, 5], 10)
            util.fail("includesAny", [1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            util.fail("includesAny", [obj1, obj2, 3, "foo", {}], [{}])
            util.fail("includesAny", [obj1, obj2, obj3], [{}])
            util.fail("includesAny", [obj1, obj2, obj3], [[]])
        })
    })

    describe("notIncludes()", function () {
        it("checks numbers", function () {
            util.fail("notIncludes", [1, 2, 3, 4, 5], 1)
            util.fail("notIncludes", [1, 2, 3, 4, 5], [1])
        })

        it("is strict", function () {
            assert.notIncludes(["1", 2, 3, 4, 5], 1)
            assert.notIncludes(["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            util.fail("notIncludes", [obj1, 3, obj3, "foo"], [obj1, obj3])
            util.fail("notIncludes", [obj1, obj2, obj3], [obj1, obj2, obj3])
            util.fail("notIncludes", [obj1, 3, obj3, "foo"], [obj1, obj2, obj3])
        })

        it("checks nothing", function () {
            assert.notIncludes([{}, {}], [])
        })

        it("checks missing numbers", function () {
            assert.notIncludes([1, 2, 3, 4, 5], 10)
            assert.notIncludes([1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            assert.notIncludes([obj1, obj2, 3, "foo", {}], [{}])
            assert.notIncludes([obj1, obj2, obj3], [{}])
            assert.notIncludes([obj1, obj2, obj3], [[]])
        })
    })

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    describe("includesDeep()", function () {
        it("checks numbers", function () {
            assert.includesDeep([1, 2, 3, 4, 5], 1)
            assert.includesDeep([1, 2, 3, 4, 5], [1])
        })

        it("is strict", function () {
            util.fail("includesDeep", ["1", 2, 3, 4, 5], 1)
            util.fail("includesDeep", ["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            assert.includesDeep([obj1, 3, obj3, "foo"], [obj1, obj3])
            assert.includesDeep([obj1, obj2, obj3], [obj1, obj2, obj3])
            assert.includesDeep([obj1, 3, obj3, "foo"], [obj1, obj2, obj3])

            assert.includesDeep([{foo: 1}, {bar: 2}, 3, "foo", {}], [{foo: 1}])
            assert.includesDeep([{foo: 1}, {bar: 2}, {}], [{bar: 2}, {}])
            assert.includesDeep([{foo: 1}, {bar: 2}, []], [[]])
        })

        it("checks nothing", function () {
            assert.includesDeep([{}, {}], [])
        })

        it("checks missing numbers", function () {
            util.fail("includesDeep", [1, 2, 3, 4, 5], 10)
            util.fail("includesDeep", [1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            util.fail("includesDeep", [{foo: 1}, {bar: 2}, {}], [[]])
            util.fail("includesDeep", [{foo: 1}, {bar: 2}, {}], [[], {foo: 1}])
        })
    })

    describe("notIncludesAllDeep()", function () {
        it("checks numbers", function () {
            util.fail("notIncludesAllDeep", [1, 2, 3, 4, 5], 1)
            util.fail("notIncludesAllDeep", [1, 2, 3, 4, 5], [1])
        })

        it("is strict", function () {
            assert.notIncludesAllDeep(["1", 2, 3, 4, 5], 1)
            assert.notIncludesAllDeep(["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            assert.notIncludesAllDeep([{foo: 1}, 3, "foo"], ["foo", 1])

            assert.notIncludesAllDeep(
                [{foo: 1}, {bar: 2}],
                [{foo: 1}, {bar: 1}])

            util.fail("notIncludesAllDeep",
                [{foo: 1}, {bar: 2}],
                [{foo: 1}, {bar: 2}])
        })

        it("checks nothing", function () {
            assert.notIncludesAllDeep([{}, {}], [])
        })

        it("checks missing numbers", function () {
            assert.notIncludesAllDeep([1, 2, 3, 4, 5], 10)
            assert.notIncludesAllDeep([1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            assert.notIncludesAllDeep([{foo: 1}, {bar: 2}, {}], [[]])
            assert.notIncludesAllDeep([{foo: 1}, {bar: 2}, {}], [[], {foo: 1}])
        })
    })

    describe("includesAnyDeep()", function () {
        it("checks numbers", function () {
            assert.includesAnyDeep([1, 2, 3, 4, 5], 1)
            assert.includesAnyDeep([1, 2, 3, 4, 5], [1])
        })

        it("is strict", function () {
            util.fail("includesAnyDeep", ["1", 2, 3, 4, 5], 1)
            util.fail("includesAnyDeep", ["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            assert.includesAnyDeep([{foo: 1}, 3, "foo"], ["foo", 1])
            assert.includesAnyDeep([{foo: 1}, {bar: 2}], [{foo: 1}, {bar: 1}])
            assert.includesAnyDeep([{foo: 1}, {bar: 2}], [{foo: 1}, {bar: 2}])
        })

        it("checks nothing", function () {
            assert.includesAnyDeep([{}, {}], [])
        })

        it("checks missing numbers", function () {
            util.fail("includesAnyDeep", [1, 2, 3, 4, 5], 10)
            util.fail("includesAnyDeep", [1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            util.fail("includesAnyDeep", [{foo: 1}, {bar: 2}, {}], [[]])
            assert.includesAnyDeep([{foo: 1}, {bar: 2}, {}], [[], {foo: 1}])
        })
    })

    describe("notIncludesDeep()", function () {
        it("checks numbers", function () {
            util.fail("notIncludesDeep", [1, 2, 3, 4, 5], 1)
            util.fail("notIncludesDeep", [1, 2, 3, 4, 5], [1])
        })

        it("is strict", function () {
            assert.notIncludesDeep(["1", 2, 3, 4, 5], 1)
            assert.notIncludesDeep(["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            util.fail("notIncludesDeep", [{foo: 1}, 3, "foo"], ["foo", 1])

            util.fail("notIncludesDeep",
                [{foo: 1}, {bar: 2}],
                [{foo: 1}, {bar: 1}])

            util.fail("notIncludesDeep",
                [{foo: 1}, {bar: 2}],
                [{foo: 1}, {bar: 2}])
        })

        it("checks nothing", function () {
            assert.notIncludesDeep([{}, {}], [])
        })

        it("checks missing numbers", function () {
            assert.notIncludesDeep([1, 2, 3, 4, 5], 10)
            assert.notIncludesDeep([1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            assert.notIncludesDeep([{foo: 1}, {bar: 2}, {}], [[]])

            util.fail("notIncludesDeep",
                [{foo: 1}, {bar: 2}, {}],
                [[], {foo: 1}])
        })
    })

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    describe("includesMatch()", function () {
        it("checks numbers", function () {
            assert.includesMatch([1, 2, 3, 4, 5], 1)
            assert.includesMatch([1, 2, 3, 4, 5], [1])
        })

        it("is strict", function () {
            util.fail("includesMatch", ["1", 2, 3, 4, 5], 1)
            util.fail("includesMatch", ["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            assert.includesMatch([obj1, 3, obj3, "foo"], [obj1, obj3])
            assert.includesMatch([obj1, obj2, obj3], [obj1, obj2, obj3])
            assert.includesMatch([obj1, 3, obj3, "foo"], [obj1, obj2, obj3])

            assert.includesMatch([{foo: 1}, {bar: 2}, 3, "foo", {}], [{foo: 1}])
            assert.includesMatch([{foo: 1}, {bar: 2}, {}], [{bar: 2}, {}])
            assert.includesMatch([{foo: 1}, {bar: 2}, []], [[]])
        })

        it("checks nothing", function () {
            assert.includesMatch([{}, {}], [])
        })

        it("checks missing numbers", function () {
            util.fail("includesMatch", [1, 2, 3, 4, 5], 10)
            util.fail("includesMatch", [1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            util.fail("includesMatch", [{foo: 1}, {bar: 2}, {}], [[]])
            util.fail("includesMatch", [{foo: 1}, {bar: 2}, {}], [[], {foo: 1}])
        })
    })

    describe("notIncludesAllMatch()", function () {
        it("checks numbers", function () {
            util.fail("notIncludesAllMatch", [1, 2, 3, 4, 5], 1)
            util.fail("notIncludesAllMatch", [1, 2, 3, 4, 5], [1])
        })

        it("is strict", function () {
            assert.notIncludesAllMatch(["1", 2, 3, 4, 5], 1)
            assert.notIncludesAllMatch(["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            assert.notIncludesAllMatch([{foo: 1}, 3, "foo"], ["foo", 1])

            assert.notIncludesAllMatch(
                [{foo: 1}, {bar: 2}],
                [{foo: 1}, {bar: 1}])

            util.fail("notIncludesAllMatch",
                [{foo: 1}, {bar: 2}],
                [{foo: 1}, {bar: 2}])
        })

        it("checks nothing", function () {
            assert.notIncludesAllMatch([{}, {}], [])
        })

        it("checks missing numbers", function () {
            assert.notIncludesAllMatch([1, 2, 3, 4, 5], 10)
            assert.notIncludesAllMatch([1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            assert.notIncludesAllMatch([{foo: 1}, {bar: 2}, {}], [[]])
            assert.notIncludesAllMatch([{foo: 1}, {bar: 2}, {}], [[], {foo: 1}])
        })
    })

    describe("includesAnyMatch()", function () {
        it("checks numbers", function () {
            assert.includesAnyMatch([1, 2, 3, 4, 5], 1)
            assert.includesAnyMatch([1, 2, 3, 4, 5], [1])
        })

        it("is strict", function () {
            util.fail("includesAnyMatch", ["1", 2, 3, 4, 5], 1)
            util.fail("includesAnyMatch", ["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            assert.includesAnyMatch([{foo: 1}, 3, "foo"], ["foo", 1])
            assert.includesAnyMatch([{foo: 1}, {bar: 2}], [{foo: 1}, {bar: 1}])
            assert.includesAnyMatch([{foo: 1}, {bar: 2}], [{foo: 1}, {bar: 2}])
        })

        it("checks nothing", function () {
            assert.includesAnyMatch([{}, {}], [])
        })

        it("checks missing numbers", function () {
            util.fail("includesAnyMatch", [1, 2, 3, 4, 5], 10)
            util.fail("includesAnyMatch", [1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            util.fail("includesAnyMatch", [{foo: 1}, {bar: 2}, {}], [[]])
            assert.includesAnyMatch([{foo: 1}, {bar: 2}, {}], [[], {foo: 1}])
        })
    })

    describe("notIncludesMatch()", function () {
        it("checks numbers", function () {
            util.fail("notIncludesMatch", [1, 2, 3, 4, 5], 1)
            util.fail("notIncludesMatch", [1, 2, 3, 4, 5], [1])
        })

        it("is strict", function () {
            assert.notIncludesMatch(["1", 2, 3, 4, 5], 1)
            assert.notIncludesMatch(["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            util.fail("notIncludesMatch", [{foo: 1}, 3, "foo"], ["foo", 1])

            util.fail("notIncludesMatch",
                [{foo: 1}, {bar: 2}],
                [{foo: 1}, {bar: 1}])

            util.fail("notIncludesMatch",
                [{foo: 1}, {bar: 2}],
                [{foo: 1}, {bar: 2}])
        })

        it("checks nothing", function () {
            assert.notIncludesMatch([{}, {}], [])
        })

        it("checks missing numbers", function () {
            assert.notIncludesMatch([1, 2, 3, 4, 5], 10)
            assert.notIncludesMatch([1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            assert.notIncludesMatch([{foo: 1}, {bar: 2}, {}], [[]])

            util.fail("notIncludesMatch",
                [{foo: 1}, {bar: 2}, {}],
                [[], {foo: 1}])
        })
    })
})
