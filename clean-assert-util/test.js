/* eslint-env mocha */
"use strict"

/* global Symbol */
// This purposefully avoids involving any assertion framework.

var assertUtil = require("./index")
var inspect = require("./inspect")
var AssertionError = assertUtil.AssertionError

describe("clean-assert-util", function () {
    describe("class AssertionError", function () {
        var hasOwn = Object.prototype.hasOwnProperty

        it("is an error", function () {
            if (!(new AssertionError() instanceof Error)) {
                throw new Error("Expected AssertionError to subclass Error")
            }
        })

        function checkValue(e, prop, expected, own) {
            if (own && !hasOwn.call(e, prop)) {
                throw new Error("Expected error to have own `" + prop +
                    "` property")
            }

            if (e[prop] !== expected) {
                throw new Error("Expected e." + prop + " to equal " +
                    inspect(expected) + ", but found " +
                    inspect(e[prop]))
            }
        }

        // Otherwise, this won't work on native subclasses.
        function check(name, message, expected, actual) {
            it(name, function () {
                var e = new AssertionError(message, expected, actual)

                checkValue(e, "message", message)
                checkValue(e, "expected", expected, true)
                checkValue(e, "actual", actual, true)
            })
        }

        check("correctly sets existing properties", "message", 1, 2)
        check("correctly sets missing `actual`", "message", 1, undefined)
        check("correctly sets missing `expected`", "message", undefined, 2)
        check("correctly sets missing `message`", "", 1, 2)
    })

    function fail(arg, message) {
        try {
            assertUtil.assert(arg, message)
        } catch (e) {
            if (!(e instanceof AssertionError)) throw e
            if (e.message !== message) {
                throw new AssertionError(
                    "Expected message to be " +
                    JSON.stringify(message) +
                    ", but found " + JSON.stringify(e.message),
                    e.message, message)
            }
            return
        }

        throw new AssertionError(
            "Expected assertUtil.assert to throw an AssertionError",
            AssertionError)
    }

    describe("assert()", function () {
        it("works", function () {
            assertUtil.assert(true)
            assertUtil.assert(1)
            assertUtil.assert(Infinity)
            assertUtil.assert("foo")
            assertUtil.assert({})
            assertUtil.assert([])
            assertUtil.assert(new Date())
            if (typeof Symbol === "function") assertUtil.assert(Symbol())

            fail(undefined, "message")
            fail(null, "message")
            fail(false, "message")
            fail(0, "message")
            fail("", "message")
            fail(NaN, "message")
        })

        it("escapes the message", function () {
            fail(undefined, "{test}")
            fail(null, "{test}")
            fail(false, "{test}")
            fail(0, "{test}")
            fail("", "{test}")
            fail(NaN, "{test}")
        })
    })

    // TODO: finish tests
})
