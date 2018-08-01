"use strict"

var assert = require("../index")

describe("clean-assert (core)", function () {
    describe("class AssertionError", function () {
        it("is an error", function () {
            if (!(new assert.AssertionError() instanceof Error)) {
                throw new Error("Expected AssertionError to subclass Error")
            }
        })

        function checkValue(e, prop, expected, own) {
            if (own && !Object.prototype.hasOwnProperty.call(e, prop)) {
                throw new Error(
                    "Expected error to have own `" + prop + "` property"
                )
            }

            if (e[prop] !== expected) {
                throw new Error("Expected e." + prop + " to equal " +
                    assert.inspect(expected) + ", but found " +
                    assert.inspect(e[prop]))
            }
        }

        it("correctly sets existing properties", function () {
            var e = new assert.AssertionError("it failed", 1, 2)

            checkValue(e, "message", "it failed")
            checkValue(e, "actual", 1, true)
            checkValue(e, "expected", 2, true)
        })

        it("correctly sets missing `actual`", function () {
            var e = new assert.AssertionError("it failed")

            checkValue(e, "message", "it failed")
            checkValue(e, "actual", undefined, true)
            checkValue(e, "expected", undefined, true)
        })

        it("correctly sets missing `expected`", function () {
            var e = new assert.AssertionError("it failed", 1)

            checkValue(e, "message", "it failed")
            checkValue(e, "actual", 1, true)
            checkValue(e, "expected", undefined, true)
        })

        it("correctly sets missing `message`", function () {
            var e = new assert.AssertionError(undefined, 1, 2)

            checkValue(e, "message", "")
            checkValue(e, "actual", 1, true)
            checkValue(e, "expected", 2, true)
        })
    })

    function assertFail(func, result) {
        try {
            func()
        } catch (e) {
            if (e.message !== result.message) {
                throw new assert.AssertionError(
                    "(`message`) Expected " + assert.inspect(e.message) +
                    " to equal " + assert.inspect(result.message)
                )
            }
            if (e.actual !== result.actual) {
                throw new assert.AssertionError(
                    "(`actual`) Expected " + assert.inspect(e.actual) +
                    " to equal " + assert.inspect(result.actual)
                )
            }
            if (e.expected !== result.expected) {
                throw new assert.AssertionError(
                    "(`expected`) Expected " + assert.inspect(e.expected) +
                    " to equal " + assert.inspect(result.expected)
                )
            }
            return
        }

        throw new Error("Expected assertion to throw")
    }

    describe("assert()", function () {
        it("works with no message", function () {
            assert.assert(true)
            assert.assert(1)
            assert.assert(Infinity)
            assert.assert("foo")
            assert.assert({})
            assert.assert([])
            assert.assert(new Date())
            // eslint-disable-next-line no-undef
            if (typeof Symbol === "function") assert.assert(Symbol())

            function failSimple(arg) {
                assertFail(function () { assert.assert(arg) }, {message: ""})
            }

            failSimple(undefined)
            failSimple(null)
            failSimple(false)
            failSimple(0)
            failSimple("")
            failSimple(NaN)
        })

        it("works with simple messages", function () {
            assert.assert(true, "message")
            assert.assert(1, "message")
            assert.assert(Infinity, "message")
            assert.assert("foo", "message")
            assert.assert({}, "message")
            assert.assert([], "message")
            assert.assert(new Date(), "message")
            // eslint-disable-next-line no-undef
            if (typeof Symbol === "function") assert.assert(Symbol(), "message")

            function failSimple(arg) {
                assertFail(function () {
                    assert.assert(arg, "message")
                }, {message: "message"})
            }

            failSimple(undefined)
            failSimple(null)
            failSimple(false)
            failSimple(0)
            failSimple("")
            failSimple(NaN)
        })

        it("escapes the message with no expected/actual", function () {
            function failSimple(arg) {
                assertFail(function () {
                    assert.assert(arg, "{expected} {actual}")
                }, {message: "{expected} {actual}"})
            }

            failSimple(undefined)
            failSimple(null)
            failSimple(false)
            failSimple(0)
            failSimple("")
            failSimple(NaN)
        })

        it("substitutes the values for expected/actual only", function () {
            var template =
                "{ignore me} Expected {expected}, {test} found {actual} {nope}"

            var expected = {
                message: "{ignore me} Expected 1, {test} found 0 {nope}",
                actual: 0,
                expected: 1,
            }

            function fail(arg) {
                assertFail(function () {
                    assert.assert(arg, template, 0, 1)
                }, expected)
            }

            fail(undefined)
            fail(null)
            fail(false)
            fail(0)
            fail("")
            fail(NaN)
        })
    })

    describe("fail()", function () {
        it("works with no message", function () {
            assertFail(function () { assert.fail() }, {message: ""})
        })

        it("works with simple messages", function () {
            assertFail(function () {
                assert.fail("message")
            }, {message: "message"})
        })

        it("escapes the message with no expected/actual", function () {
            assertFail(function () {
                assert.fail("{expected} {actual}")
            }, {message: "{expected} {actual}"})
        })

        it("substitutes the values for expected/actual only", function () {
            assertFail(function () {
                assert.fail(
                    "{ignore me} Expected {expected}, " +
                    "{test} found {actual} {nope}",
                    0, 1
                )
            }, {
                message: "{ignore me} Expected 1, {test} found 0 {nope}",
                actual: 0, expected: 1,
            })
        })

        it("permits message escaping", function () {
            assertFail(function () {
                assert.fail(
                    "Expected \\{expected}, found {actual}",
                    0, 1
                )
            }, {
                message: "Expected {expected}, found 0",
                actual: 0, expected: 1,
            })
        })
    })

    describe("failFormat()", function () {
        it("works with simple messages", function () {
            assertFail(function () {
                assert.failFormat("message", {})
            }, {message: "message"})
        })

        it("escapes the message with no expected/actual", function () {
            assertFail(function () {
                assert.failFormat("{expected} {actual}", {})
            }, {message: "{expected} {actual}"})
        })

        it("substitutes the values for given parameters only", function () {
            assertFail(function () {
                assert.failFormat(
                    "{ignore me} Expected {expected}, " +
                    "{test} found {actual} {nope}",
                    {actual: 0, expected: 1, test: undefined}
                )
            }, {
                message: "{ignore me} Expected 1, undefined found 0 {nope}",
                actual: 0, expected: 1,
            })
        })

        it("permits message escaping", function () {
            assertFail(function () {
                assert.failFormat(
                    "Expected \\{expected}, found {actual}",
                    {actual: 0, expected: 1}
                )
            }, {
                message: "Expected {expected}, found 0",
                actual: 0, expected: 1,
            })

            assertFail(function () {
                assert.failFormat(
                    "Expected {expected}, \\{test} found {actual}",
                    {actual: 0, expected: 1}
                )
            }, {
                message: "Expected 1, {test} found 0",
                actual: 0, expected: 1, test: "hi",
            })
        })

        it("uses the `prettify` parameter", function () {
            var actual = {value: 0}
            var expected = {value: 1}
            var test = {value: undefined}

            function prettify(value) {
                return value.value
            }

            assertFail(function () {
                assert.failFormat(
                    "Expected {expected}, found {actual}",
                    {actual: actual, expected: expected},
                    prettify
                )
            }, {
                message: "Expected 1, found 0",
                actual: actual, expected: expected,
            })

            assertFail(function () {
                assert.failFormat(
                    "Expected {expected}, {test} found {actual}",
                    {actual: actual, expected: expected, test: test},
                    prettify
                )
            }, {
                message: "Expected 1, undefined found 0",
                actual: actual, expected: expected,
            })
        })
    })
})
