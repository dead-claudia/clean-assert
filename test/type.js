"use strict"

var assert = require("../index")
var util = require("../test-util")

/* global Symbol */

describe("clean-assert (type)", function () {
    function testType(name, steps, raw) {
        util.test(raw ? name.toLowerCase() : "is" + name, steps)

        util.test("not" + name, function (method, fail) {
            return steps(fail, method)
        })
    }

    testType("Boolean", function (is, not) {
        return [
            function () { return is(true) },
            function () { return is(false) },
            function () { return not(0) },
            function () { return not(1) },
            function () { return not(NaN) },
            function () { return not(Infinity) },
            function () { return not("foo") },
            function () { return not("") },
            function () { return not(null) },
            function () { return not({}) },
            function () { return not([]) },
            function () { return not(util.iterable()) },
            function () { return not(function () {}) },
            function () { return not(undefined) },
            function () { return not() },
            typeof Symbol === "function"
                ? function () { return not(Symbol()) }
                : undefined,
        ]
    })

    testType("Number", function (is, not) {
        return [
            function () { return not(true) },
            function () { return not(false) },
            function () { return is(0) },
            function () { return is(1) },
            function () { return is(NaN) },
            function () { return is(Infinity) },
            function () { return not("foo") },
            function () { return not("") },
            function () { return not(null) },
            function () { return not({}) },
            function () { return not([]) },
            function () { return not(util.iterable()) },
            function () { return not(function () {}) },
            function () { return not(undefined) },
            function () { return not() },
            typeof Symbol === "function"
                ? function () { return not(Symbol()) }
                : undefined,
        ]
    })

    testType("Function", function (is, not) {
        return [
            function () { return not(true) },
            function () { return not(false) },
            function () { return not(0) },
            function () { return not(1) },
            function () { return not(NaN) },
            function () { return not(Infinity) },
            function () { return not("foo") },
            function () { return not("") },
            function () { return not(null) },
            function () { return not({}) },
            function () { return not([]) },
            function () { return not(util.iterable()) },
            function () { return is(function () {}) },
            function () { return not(undefined) },
            function () { return not() },
            typeof Symbol === "function"
                ? function () { return not(Symbol()) }
                : undefined,
        ]
    })

    testType("Object", function (is, not) {
        return [
            function () { return not(true) },
            function () { return not(false) },
            function () { return not(0) },
            function () { return not(1) },
            function () { return not(NaN) },
            function () { return not(Infinity) },
            function () { return not("foo") },
            function () { return not("") },
            function () { return not(null) },
            function () { return is({}) },
            function () { return is([]) },
            function () { return is(util.iterable()) },
            function () { return not(function () {}) },
            function () { return not(undefined) },
            function () { return not() },
            typeof Symbol === "function"
                ? function () { return not(Symbol()) }
                : undefined,
        ]
    })

    testType("String", function (is, not) {
        return [
            function () { return not(true) },
            function () { return not(false) },
            function () { return not(0) },
            function () { return not(1) },
            function () { return not(NaN) },
            function () { return not(Infinity) },
            function () { return is("foo") },
            function () { return is("") },
            function () { return not(null) },
            function () { return not({}) },
            function () { return not([]) },
            function () { return not(util.iterable()) },
            function () { return not(function () {}) },
            function () { return not(undefined) },
            function () { return not() },
            typeof Symbol === "function"
                ? function () { return not(Symbol()) }
                : undefined,
        ]
    })

    testType("Symbol", function (is, not) {
        return [
            function () { return not(true) },
            function () { return not(false) },
            function () { return not(0) },
            function () { return not(1) },
            function () { return not(NaN) },
            function () { return not(Infinity) },
            function () { return not("foo") },
            function () { return not("") },
            function () { return not(null) },
            function () { return not({}) },
            function () { return not([]) },
            function () { return not(util.iterable()) },
            function () { return not(function () {}) },
            function () { return not(undefined) },
            function () { return not() },
            typeof Symbol === "function"
                ? function () { return is(Symbol()) }
                : undefined,
        ]
    })

    testType("Exists", function (is, not) {
        return [
            function () { return is(true) },
            function () { return is(false) },
            function () { return is(0) },
            function () { return is(1) },
            function () { return is(NaN) },
            function () { return is(Infinity) },
            function () { return is("foo") },
            function () { return is("") },
            function () { return not(null) },
            function () { return is({}) },
            function () { return is([]) },
            function () { return is(util.iterable()) },
            function () { return is(function () {}) },
            function () { return not(undefined) },
            function () { return not() },
            typeof Symbol === "function"
                ? function () { return is(Symbol()) }
                : undefined,
        ]
    }, true)

    testType("Array", function (is, not) {
        return [
            function () { return not(true) },
            function () { return not(false) },
            function () { return not(0) },
            function () { return not(1) },
            function () { return not(NaN) },
            function () { return not(Infinity) },
            function () { return not("foo") },
            function () { return not("") },
            function () { return not(null) },
            function () { return not({}) },
            function () { return is([]) },
            function () { return not(util.iterable()) },
            function () { return not(function () {}) },
            function () { return not(undefined) },
            function () { return not() },
            typeof Symbol === "function"
                ? function () { return not(Symbol()) }
                : undefined,
        ]
    })

    testType("Iterable", function (is, not) {
        return [
            function () { return not(true) },
            function () { return not(false) },
            function () { return not(0) },
            function () { return not(1) },
            function () { return not(NaN) },
            function () { return not(Infinity) },
            function () { return not("foo") },
            function () { return not("") },
            function () { return not(null) },
            function () { return not({}) },
            typeof [][util.symbolIterator] === "function"
                ? function () { return is([]) }
                : function () { return not([]) },
            function () { return is(util.iterable()) },
            function () { return not(function () {}) },
            function () { return not(undefined) },
            function () { return not() },
            typeof Symbol === "function"
                ? function () { return not(Symbol()) }
                : undefined,
        ]
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
