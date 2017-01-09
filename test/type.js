"use strict"

var assert = require("../index")
var util = require("../test-util")

/* global Symbol */

describe("clean-assert (type)", function () {
    function testType(name, callback, raw) {
        var positive = raw ? name.toLowerCase() : "is" + name
        var negated = raw ? "not" + name : "not" + name

        describe(positive + "()", function () {
            it("works", function () {
                callback(assert[positive], util.fail.bind(undefined, positive))
            })
        })

        describe(negated + "()", function () {
            it("works", function () {
                callback(util.fail.bind(undefined, negated), assert[negated])
            })
        })
    }

    testType("Boolean", function (is, not) {
        is(true)
        is(false)
        not(0)
        not(1)
        not(NaN)
        not(Infinity)
        not("foo")
        not("")
        not(null)
        not({})
        not([])
        not(function () {})
        not(undefined)
        not()
        if (typeof Symbol === "function") not(Symbol())
    })

    testType("Number", function (is, not) {
        not(true)
        not(false)
        is(0)
        is(1)
        is(NaN)
        is(Infinity)
        not("foo")
        not("")
        not(null)
        not({})
        not([])
        not(function () {})
        not(undefined)
        not()
        if (typeof Symbol === "function") not(Symbol())
    })

    testType("Function", function (is, not) {
        not(true)
        not(false)
        not(0)
        not(1)
        not(NaN)
        not(Infinity)
        not("foo")
        not("")
        not(null)
        not({})
        not([])
        is(function () {})
        not(undefined)
        not()
        if (typeof Symbol === "function") not(Symbol())
    })

    testType("Object", function (is, not) {
        not(true)
        not(false)
        not(0)
        not(1)
        not(NaN)
        not(Infinity)
        not("foo")
        not("")
        not(null)
        is({})
        is([])
        not(function () {})
        not(undefined)
        not()
        if (typeof Symbol === "function") not(Symbol())
    })

    testType("String", function (is, not) {
        not(true)
        not(false)
        not(0)
        not(1)
        not(NaN)
        not(Infinity)
        is("foo")
        is("")
        not(null)
        not({})
        not([])
        not(function () {})
        not(undefined)
        not()
        if (typeof Symbol === "function") not(Symbol())
    })

    testType("Symbol", function (is, not) {
        not(true)
        not(false)
        not(0)
        not(1)
        not(NaN)
        not(Infinity)
        not("foo")
        not("")
        not(null)
        not({})
        not([])
        not(function () {})
        not(undefined)
        not()
        if (typeof Symbol === "function") is(Symbol())
    })

    testType("Exists", function (is, not) {
        is(true)
        is(false)
        is(0)
        is(1)
        is(NaN)
        is(Infinity)
        is("foo")
        is("")
        not(null)
        is({})
        is([])
        is(function () {})
        not(undefined)
        not()
        if (typeof Symbol === "function") is(Symbol())
    }, true)

    testType("Array", function (is, not) {
        not(true)
        not(false)
        not(0)
        not(1)
        not(NaN)
        not(Infinity)
        not("foo")
        not("")
        not(null)
        not({})
        is([])
        not(function () {})
        not(undefined)
        not()
        if (typeof Symbol === "function") not(Symbol())
    })

    describe("is()", function () {
        it("works", function () {
            function A() {}
            assert.is(A, new A())
            assert.is(Object, new A())

            function B() {}
            B.prototype = Object.create(A.prototype)
            B.prototype.constructor = B

            assert.is(B, new B())
            assert.is(A, new B())

            util.fail("is", B, new A())
            util.fail("is", RegExp, [])
        })
    })

    describe("not()", function () {
        it("works", function () {
            function A() {}
            util.fail("not", A, new A())
            util.fail("not", Object, new A())

            function B() {}
            B.prototype = Object.create(A.prototype)
            B.prototype.constructor = B

            util.fail("not", B, new B())
            util.fail("not", A, new B())

            assert.not(B, new A())
            assert.not(RegExp, [])
        })
    })
})
