"use strict"

var assert = require("../index")
var util = require("../test-util")

describe("clean-assert (computation)", function () {
    describe("throws()", function () {
        it("works", function () {
            assert.throws(function () { throw new Error("fail") })
            assert.throws(TypeError, function () { throw new TypeError("fail") }) // eslint-disable-line max-len
            assert.throws(Error, function () { throw new TypeError("fail") })
            util.fail("throws", Error, function () {})
            util.fail("throws", function () {})
        })

        it("doesn't rethrow non-matching errors", function () {
            util.fail("throws", TypeError, function () {
                throw new Error("fail")
            })
        })

        it("doesn't rethrow non-errors", function () {
            /* eslint-disable no-throw-literal */

            assert.throws(function () { throw undefined })
            assert.throws(function () { throw null })
            assert.throws(function () { throw 1 })
            assert.throws(function () { throw "why" })
            assert.throws(function () { throw true })
            assert.throws(function () { throw [] })
            assert.throws(function () { throw {} })

            util.fail("throws", Error, function () { throw undefined })
            util.fail("throws", Error, function () { throw null })
            util.fail("throws", Error, function () { throw 1 })
            util.fail("throws", Error, function () { throw "why" })
            util.fail("throws", Error, function () { throw true })
            util.fail("throws", Error, function () { throw [] })
            util.fail("throws", Error, function () { throw {} })

            /* eslint-disable no-undef */

            if (typeof Symbol === "function") {
                assert.throws(function () { throw Symbol() })
                util.fail("throws", Error, function () { throw Symbol() })
            }

            /* eslint-enable no-undef, no-throw-literal */
        })
    })

    describe("throwsMatch()", function () {
        it("works", function () {
            var sentinel = new Error("sentinel")

            function test() { throw sentinel }
            function is(e) { return e === sentinel }
            function not(e) { return e !== sentinel }

            assert.throwsMatch(is, test)
            assert.throwsMatch("sentinel", test)
            assert.throwsMatch(/sent/, test)
            assert.throwsMatch({message: "sentinel"}, test)

            util.fail("throwsMatch", not, test)
            util.fail("throwsMatch", not, function () {})
            util.fail("throwsMatch", "nope", test)
            util.fail("throwsMatch", /hi/, test)
            util.fail("throwsMatch", {message: "nope"}, test)
        })
    })

    describe("atLeast()", function () {
        it("works", function () {
            assert.atLeast(0, 0)
            assert.atLeast(1, 1)
            assert.atLeast(1, -1)
            assert.atLeast(12398.4639, 1245.472398)

            util.fail("atLeast", 0, 1000)
            util.fail("atLeast", -1, 1)
            util.fail("atLeast", -1, 0)
        })

        it("works with Infinities", function () {
            assert.atLeast(0, -Infinity)
            assert.atLeast(-Infinity, -Infinity)
            assert.atLeast(Infinity, -Infinity)
            assert.atLeast(Infinity, 0)
            assert.atLeast(Infinity, Infinity)

            util.fail("atLeast", -Infinity, Infinity)
            util.fail("atLeast", -Infinity, 0)
        })

        it("fails with NaNs", function () {
            util.fail("atLeast", NaN, 0)
            util.fail("atLeast", 0, NaN)
            util.fail("atLeast", NaN, NaN)
            util.fail("atLeast", NaN, Infinity)
            util.fail("atLeast", Infinity, NaN)
            util.fail("atLeast", NaN, -Infinity)
            util.fail("atLeast", -Infinity, NaN)
        })
    })

    describe("atMost()", function () {
        it("works", function () {
            assert.atMost(0, 0)
            assert.atMost(1, 1)
            util.fail("atMost", 1, -1)
            util.fail("atMost", 12398.4639, 1245.472398)

            assert.atMost(0, 1000)
            assert.atMost(-1, 1)
            assert.atMost(-1, 0)
        })

        it("works with Infinities", function () {
            util.fail("atMost", 0, -Infinity)
            assert.atMost(-Infinity, -Infinity)
            util.fail("atMost", Infinity, -Infinity)
            util.fail("atMost", Infinity, 0)
            assert.atMost(Infinity, Infinity)

            assert.atMost(-Infinity, Infinity)
            assert.atMost(-Infinity, 0)
        })

        it("fails with NaNs", function () {
            util.fail("atMost", NaN, 0)
            util.fail("atMost", 0, NaN)
            util.fail("atMost", NaN, NaN)
            util.fail("atMost", NaN, Infinity)
            util.fail("atMost", Infinity, NaN)
            util.fail("atMost", NaN, -Infinity)
            util.fail("atMost", -Infinity, NaN)
        })
    })

    describe("below()", function () {
        it("works", function () {
            util.fail("below", 0, 0)
            util.fail("below", 1, 1)
            util.fail("below", 1, -1)
            util.fail("below", 12398.4639, 1245.472398)

            assert.below(0, 1000)
            assert.below(-1, 1)
            assert.below(-1, 0)
        })

        it("works with Infinities", function () {
            util.fail("below", 0, -Infinity)
            util.fail("below", -Infinity, -Infinity)
            util.fail("below", Infinity, -Infinity)
            util.fail("below", Infinity, 0)
            util.fail("below", Infinity, Infinity)

            assert.below(-Infinity, Infinity)
            assert.below(-Infinity, 0)
        })

        it("fails with NaNs", function () {
            util.fail("below", NaN, 0)
            util.fail("below", 0, NaN)
            util.fail("below", NaN, NaN)
            util.fail("below", NaN, Infinity)
            util.fail("below", Infinity, NaN)
            util.fail("below", NaN, -Infinity)
            util.fail("below", -Infinity, NaN)
        })
    })

    describe("between()", function () {
        it("works", function () {
            assert.between(0, 0, 1)
            assert.between(1, 0, 1)
            assert.between(1, 1, 1)
            assert.between(0, -1, 1)
            util.fail("between", 1, -1, 0)
            assert.between(1, -1, 1)
            util.fail("between", 12398.4639, 1245.472398, 12345.12345)
        })

        it("works with Infinities", function () {
            util.fail("between", 0, -Infinity, -1)
            assert.between(0, -Infinity, 0)
            assert.between(-Infinity, -Infinity, -Infinity)
            assert.between(-Infinity, -Infinity, 0)
            util.fail("between", Infinity, -Infinity, 0)
            util.fail("between", Infinity, 0, 0)
            assert.between(Infinity, 0, Infinity)
            assert.between(-Infinity, -Infinity, Infinity)
        })

        it("fails with NaNs", function () {
            util.fail("between", NaN, 0, NaN)
            util.fail("between", NaN, NaN, 0)
            util.fail("between", 0, NaN, 0)
            util.fail("between", 0, 0, NaN)
            util.fail("between", NaN, NaN, NaN)
            util.fail("between", NaN, 0, Infinity)
            util.fail("between", NaN, -Infinity, 0)
            util.fail("between", NaN, -Infinity, Infinity)
            util.fail("between", Infinity, NaN, 0)
            util.fail("between", Infinity, 0, NaN)
            util.fail("between", Infinity, NaN, NaN)
            util.fail("between", -Infinity, NaN, 0)
            util.fail("between", -Infinity, 0, NaN)
            util.fail("between", -Infinity, NaN, NaN)
        })
    })

    describe("closeTo()", function () {
        it("works", function () {
            assert.closeTo(0, 0, 0)
            assert.closeTo(-0, 0, 0)
            assert.closeTo(0.1, 0, 0.2)
            assert.closeTo(-0.1, 0, 0.2)
            assert.closeTo(0.5, 1, 1)
            assert.closeTo(-0.5, -1, 1)
            assert.closeTo(-0.5, 0, 1)
            assert.closeTo(0.5, 0, 1)
            util.fail("closeTo", 0.2, 0, 0.1)
            util.fail("closeTo", -0.2, 0, 0.1)
            util.fail("closeTo", 1, 0, 0.2)
            util.fail("closeTo", 1, -1, 0.2)
            util.fail("closeTo", 1, 0, 0.2)
        })

        it("works with Infinities", function () {
            assert.closeTo(0, 0, Infinity)
            assert.closeTo(100, 0, Infinity)
            assert.closeTo(Infinity, 0, Infinity)
            assert.closeTo(Infinity, -Infinity, Infinity)
            assert.closeTo(0, 0, Infinity)
            assert.closeTo(0, 100, Infinity)
            assert.closeTo(0, Infinity, Infinity)
            assert.closeTo(-Infinity, Infinity, Infinity)
        })

        it("fails with NaNs", function () {
            util.fail("closeTo", NaN, 0, 0)
            util.fail("closeTo", NaN, 0, Infinity)
            util.fail("closeTo", NaN, Infinity, 0)
            util.fail("closeTo", NaN, Infinity, Infinity)
            util.fail("closeTo", NaN, -Infinity, 0)
            util.fail("closeTo", NaN, -Infinity, Infinity)
            util.fail("closeTo", 0, NaN, 0)
            util.fail("closeTo", 0, NaN, Infinity)
            util.fail("closeTo", Infinity, NaN, 0)
            util.fail("closeTo", Infinity, NaN, Infinity)
            util.fail("closeTo", -Infinity, NaN, 0)
            util.fail("closeTo", -Infinity, NaN, Infinity)
        })
    })

    describe("notCloseTo()", function () {
        it("works", function () {
            util.fail("notCloseTo", 0, 0, 0)
            util.fail("notCloseTo", 0, 0, 0)
            util.fail("notCloseTo", 0.1, 0, 0.2)
            util.fail("notCloseTo", -0.1, 0, 0.2)
            util.fail("notCloseTo", 0.5, 1, 1)
            util.fail("notCloseTo", -0.5, -1, 1)
            util.fail("notCloseTo", -0.5, 0, 1)
            util.fail("notCloseTo", 0.5, 0, 1)
            assert.notCloseTo(0.2, 0, 0.1)
            assert.notCloseTo(-0.2, 0, 0.1)
            assert.notCloseTo(1, 0, 0.2)
            assert.notCloseTo(1, -1, 0.2)
            assert.notCloseTo(1, 0, 0.2)
        })

        it("works with Infinities", function () {
            util.fail("notCloseTo", 0, 0, Infinity)
            util.fail("notCloseTo", 100, 0, Infinity)
            util.fail("notCloseTo", Infinity, 0, Infinity)
            util.fail("notCloseTo", Infinity, -Infinity, Infinity)
            util.fail("notCloseTo", 0, 0, Infinity)
            util.fail("notCloseTo", 0, 100, Infinity)
            util.fail("notCloseTo", 0, Infinity, Infinity)
            util.fail("notCloseTo", -Infinity, Infinity, Infinity)
        })

        it("fails with NaNs", function () {
            util.fail("notCloseTo", NaN, 0, 0)
            util.fail("notCloseTo", NaN, 0, Infinity)
            util.fail("notCloseTo", NaN, Infinity, 0)
            util.fail("notCloseTo", NaN, Infinity, Infinity)
            util.fail("notCloseTo", NaN, -Infinity, 0)
            util.fail("notCloseTo", NaN, -Infinity, Infinity)
            util.fail("notCloseTo", 0, NaN, 0)
            util.fail("notCloseTo", 0, NaN, Infinity)
            util.fail("notCloseTo", Infinity, NaN, 0)
            util.fail("notCloseTo", Infinity, NaN, Infinity)
            util.fail("notCloseTo", -Infinity, NaN, 0)
            util.fail("notCloseTo", -Infinity, NaN, Infinity)
        })
    })
})
