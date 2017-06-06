"use strict"

/* global Promise */
/* eslint-env mocha */

var assert = require("./index")
var AssertionError = assert.AssertionError

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

            for (var i = 0; i < steps.length; i++) steps[i]()
        })
    })

    describe("async." + name + "()", function () {
        it("works", function () {
            var method = assert.async[name]
            var steps = func(method, function () {
                return method.apply(undefined, arguments)
                .then(function () {
                    throw new AssertionError(
                        "Expected t." + name + " to throw an AssertionError",
                        AssertionError)
                }, function (e) {
                    if (!(e instanceof AssertionError)) throw e
                })
            })

            return steps.reduce(
                function (p, step) { return p.then(step) },
                Promise.resolve())
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

exports.failAsync = function (name) {
    var args = []

    for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i])
    }

    return assert.async[name].apply(undefined, args)
    .then(function () {
        throw new AssertionError(
            "Expected t." + name + " to throw an AssertionError",
            AssertionError)
    }, function (e) {
        if (!(e instanceof AssertionError)) throw e
    })
}
