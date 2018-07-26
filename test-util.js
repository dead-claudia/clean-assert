"use strict"

/* global Symbol */
/* eslint-env mocha */

var assert = require("./index")
var AssertionError = assert.AssertionError

exports.symbolIterator = "@@iterator"

if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    exports.symbolIterator = Symbol.iterator
}

exports.identity = function (x) {
    return x
}

exports.toArray = function () {
    var args = new Array(arguments.length)

    for (var i = 0; i < arguments.length; i++) {
        args[i] = arguments[i]
    }

    return args
}

exports.iterable = function () {
    var object = {}
    var entries = exports.toArray.apply(undefined, arguments)

    object[exports.symbolIterator] = function () {
        return {
            index: 0,
            next: function () {
                if (this.index === entries.length) {
                    return {done: true, value: undefined}
                } else {
                    return {done: false, value: entries[this.index++]}
                }
            },
        }
    }
    return object
}

exports.test = function (name, func) {
    describe(name + "()", function () {
        it("works", function () {
            var method = assert[name]
            var steps = func(method, function () {
                // Silently swallowing exceptions is bad, so we can't use
                // traditional assertions to test.
                try {
                    method.apply(undefined, arguments)
                } catch (e) {
                    if (e instanceof AssertionError) return
                    throw e
                }

                throw new AssertionError(
                    "Expected t." + name + " to throw an AssertionError",
                    AssertionError)
            })

            for (var i = 0; i < steps.length; i++) {
                if (steps[i] != null) steps[i]()
            }
        })
    })
}

exports.fail = function (name) {
    var args = []

    for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i])
    }

    // Silently swallowing exceptions is bad, so we can't use traditional
    // Thallium assertions to test.
    try {
        assert[name].apply(undefined, args)
    } catch (e) {
        if (e instanceof AssertionError) return
        throw e
    }

    throw new AssertionError(
        "Expected t." + name + " to throw an AssertionError",
        AssertionError)
}
