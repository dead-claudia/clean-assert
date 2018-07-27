"use strict"

var assert = require("../index")

describe("clean-assert (assertion error)", function () {
    var AssertionError = assert.AssertionError
    var hasOwn = Object.prototype.hasOwnProperty

    it("is an error", function () {
        if (!(new AssertionError() instanceof Error)) {
            throw new Error("Expected AssertionError to subclass Error")
        }
    })

    function checkValue(e, prop, expected, own) {
        if (own && !hasOwn.call(e, prop)) {
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
        var e = new AssertionError("it failed", 1, 2)

        checkValue(e, "message", "it failed")
        checkValue(e, "actual", 1, true)
        checkValue(e, "expected", 2, true)
    })

    it("correctly sets missing `actual`", function () {
        var e = new AssertionError("it failed")

        checkValue(e, "message", "it failed")
        checkValue(e, "actual", undefined, true)
        checkValue(e, "expected", undefined, true)
    })

    it("correctly sets missing `expected`", function () {
        var e = new AssertionError("it failed", 1)

        checkValue(e, "message", "it failed")
        checkValue(e, "actual", 1, true)
        checkValue(e, "expected", undefined, true)
    })

    it("correctly sets missing `message`", function () {
        var e = new AssertionError(undefined, 1, 2)

        checkValue(e, "message", "")
        checkValue(e, "actual", 1, true)
        checkValue(e, "expected", 2, true)
    })
})
