"use strict"

var assert = require("../index")
var util = require("../scripts/test-util")

describe("clean-assert (computation)", function () {
    util.testSingle("throws", function (pass, fail) {
        function throwTypeError() { throw new TypeError("fail") }
        function throwReferenceError() { throw new ReferenceError("fail") }
        function throwError() { throw new Error("fail") }
        function noop() {}

        return {
            "passes if matching error type thrown": function () {
                pass(Error, throwError)
                pass(ReferenceError, throwReferenceError)
                pass(TypeError, throwTypeError)
            },
            "passes if inherited error type thrown": function () {
                pass(Error, throwTypeError)
            },
            "fails if no error thrown": function () {
                fail(Error, noop)
            },
            "captures and fails on supertype instance": function () {
                fail(TypeError, throwError)
            },
            "captures and fails on unrelated type instance": function () {
                fail(TypeError, throwReferenceError)
            },
            "works with strings": function () {
                // eslint-disable-next-line no-throw-literal
                pass("string", function () { throw "foo" })
                fail("string", throwReferenceError)
            },
        }
    })

    util.testSingle("throwsMatching", function (pass, fail) {
        var sentinel = new Error("sentinel")

        sentinel.someKey = {foo: "bar"}
        function test() { throw sentinel }
        function is(e) { return e === sentinel }
        function not(e) { return e !== sentinel }

        return {
            "passes if matcher returns truthy": function () {
                pass(is, test)
            },
            "passes if message equals string": function () {
                pass("sentinel", test)
            },
            "passes if message matches regexp": function () {
                pass(/sent/, test)
            },
            "passes if error matches structure": function () {
                pass({message: "sentinel", someKey: {foo: "bar"}}, test)
            },
            "fails if matcher returns falsy": function () {
                fail(not, test)
            },
            "fails if no error could be checked": function () {
                var count = 0

                fail(function () { count++ }, function () {})
                assert.equal(count, 0)
            },
            "fails if message doesn't equal string": function () {
                fail("nope", test)
            },
            "fails if regexp doesn't match message": function () {
                fail(/hi/, test)
            },
            "fails if object doesn't match at top level": function () {
                fail({message: "nope"}, test)
            },
            "fails if object doesn't match deeply": function () {
                fail({message: "sentinel", someKey: {foo: "nope"}}, test)
            },
        }
    })

    util.testPair("atLeast", "below", function (pass, fail, never) {
        return {
            "works": function () {
                pass(0, 0)
                pass(1, 1)
                pass(1, -1)
                pass(12398.4639, 1245.472398)

                fail(0, 1000)
                fail(-1, 1)
                fail(-1, 0)
            },

            "works with Infinities": function () {
                pass(0, -Infinity)
                pass(-Infinity, -Infinity)
                pass(Infinity, -Infinity)
                pass(Infinity, 0)
                pass(Infinity, Infinity)
                fail(-Infinity, Infinity)
                fail(-Infinity, 0)
            },

            "fails with NaNs": function () {
                never(NaN, 0)
                never(0, NaN)
                never(NaN, NaN)
                never(NaN, Infinity)
                never(Infinity, NaN)
                never(NaN, -Infinity)
                never(-Infinity, NaN)
            },
        }
    })

    util.testPair("atMost", "above", function (pass, fail, never) {
        return {
            "works": function () {
                pass(0, 0)
                pass(1, 1)
                fail(1, -1)
                fail(12398.4639, 1245.472398)

                pass(0, 1000)
                pass(-1, 1)
                pass(-1, 0)
            },

            "works with Infinities": function () {
                fail(0, -Infinity)
                pass(-Infinity, -Infinity)
                fail(Infinity, -Infinity)
                fail(Infinity, 0)
                pass(Infinity, Infinity)

                pass(-Infinity, Infinity)
                pass(-Infinity, 0)
            },

            "fails with NaNs": function () {
                never(NaN, 0)
                never(0, NaN)
                never(NaN, NaN)
                never(NaN, Infinity)
                never(Infinity, NaN)
                never(NaN, -Infinity)
                never(-Infinity, NaN)
            },
        }
    })

    util.testPair("between", "notBetween", function (pass, fail, never) {
        return {
            "works": function () {
                pass(0, 0, 1)
                pass(1, 0, 1)
                pass(1, 1, 1)
                pass(0, -1, 1)
                fail(1, -1, 0)
                pass(1, -1, 1)
                fail(12398.4639, 1245.472398, 12345.12345)
            },

            "works with Infinities": function () {
                fail(0, -Infinity, -1)
                pass(0, -Infinity, 0)
                pass(-Infinity, -Infinity, -Infinity)
                pass(-Infinity, -Infinity, 0)
                fail(Infinity, -Infinity, 0)
                fail(Infinity, 0, 0)
                pass(Infinity, 0, Infinity)
                pass(-Infinity, -Infinity, Infinity)
            },

            "fails with NaNs": function () {
                never(NaN, 0, NaN)
                never(NaN, NaN, 0)
                never(0, NaN, 0)
                never(0, 0, NaN)
                never(NaN, NaN, NaN)
                never(NaN, 0, Infinity)
                never(NaN, -Infinity, 0)
                never(NaN, -Infinity, Infinity)
                never(Infinity, NaN, 0)
                never(Infinity, 0, NaN)
                never(Infinity, NaN, NaN)
                never(-Infinity, NaN, 0)
                never(-Infinity, 0, NaN)
                never(-Infinity, NaN, NaN)
            },
        }
    })

    util.testPair("closeTo", "notCloseTo", function (pass, fail, never) {
        return {
            "works with default tolerance": function () {
                pass(0, 0)
                pass(0, -0)
                pass(0, 1e-10)
                pass(0, -1e-10)
                pass(1, 1)
                pass(1, 1 + 1e-10)
                // It should not pass if it's at least mildly non-zero
                fail(0, 0.000001)
                fail(0, -0.000001)
                fail(1, 1.0000001)
            },

            "works with explicit tolerance": function () {
                pass(0, 0, 0)
                pass(0, -0, 0)
                pass(0, 0.1, 0.1)
                pass(0, -0.1, 0.1)
                pass(1, 0.5, 0.5)
                pass(-1, -0.5, 1)
                pass(0, -0.5, 1)
                pass(0, 0.5, 1)
                fail(0, 0.2, 0.1)
                fail(0, -0.2, 0.1)
                fail(0, 1, 0.5)
                fail(-1, 1, 0.5)
                fail(0, -1, 0.5)
            },

            "works with Infinities": function () {
                pass(0, 0, Infinity)
                pass(0, 100, Infinity)
                pass(0, Infinity, Infinity)
                pass(-Infinity, Infinity, Infinity)
                pass(0, 0, Infinity)
                pass(100, 0, Infinity)
                pass(Infinity, 0, Infinity)
                pass(Infinity, -Infinity, Infinity)
            },

            "fails with NaNs": function () {
                never(0, NaN, 0)
                never(0, NaN, Infinity)
                never(Infinity, NaN, 0)
                never(Infinity, NaN, Infinity)
                never(-Infinity, NaN, 0)
                never(-Infinity, NaN, Infinity)
                never(NaN, 0, 0)
                never(NaN, 0, Infinity)
                never(NaN, Infinity, 0)
                never(NaN, Infinity, Infinity)
                never(NaN, -Infinity, 0)
                never(NaN, -Infinity, Infinity)
            },
        }
    })
})
