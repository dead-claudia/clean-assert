"use strict"

/* eslint-env mocha */
/* global Promise */

var assert = require("./index")
var AssertionError = assert.AssertionError

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

exports.asyncFail = function (name) {
    var args = []

    for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i])
    }

    return Promise.resolve(assert.async[name].apply(undefined, args))
    .then(
        function () {
            throw new AssertionError(
                "Expected t." + name + " to throw an AssertionError",
                AssertionError)
        },
        function (e) {
            if (e instanceof AssertionError) return

            throw e
        }
    )
}
