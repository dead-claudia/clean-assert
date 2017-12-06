"use strict"

/* global Promise */

var util = require("clean-assert-util")
var common = require("./common")

exports.throws = function (Type, callback) {
    if (callback == null) {
        callback = Type
        Type = null
    }

    if (Type != null && typeof Type !== "function") {
        throw new TypeError("`Type` must be a function if passed")
    }

    if (typeof callback !== "function") {
        throw new TypeError("`callback` must be a function")
    }

    return Promise.resolve()
        .then(callback)
        .then(function () {
            throw new util.AssertionError("Expected callback to throw")
        }, function (e) {
            if (Type != null && !(e instanceof Type)) {
                util.fail(
                    "Expected callback to throw an instance of " +
                common.getName(Type) + ", but found {actual}",
                    {actual: e})
            }
        })
}

exports.throwsMatch = function (matcher, callback) {
    if (typeof matcher !== "string" &&
            typeof matcher !== "function" &&
            !(matcher instanceof RegExp) &&
            !common.isPlainObject(matcher)) {
        throw new TypeError(
            "`matcher` must be a string, function, RegExp, or object")
    }

    if (typeof callback !== "function") {
        throw new TypeError("`callback` must be a function")
    }

    return Promise.resolve()
        .then(callback)
        .then(function () {
            throw new util.AssertionError("Expected callback to throw")
        }, function (e) {
            if (!common.throwsMatchTest(matcher, e)) {
                util.fail(
                    "Expected callback to  throw an error that matches " +
                "{expected}, but found {actual}",
                    {expected: matcher, actual: e})
            }
        })
}
