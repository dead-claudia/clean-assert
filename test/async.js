"use strict"

/* globals Promise:true */

var assert = require("../index")

function dumbAsyncValue(value) {
    return new Promise(function (resolve) {
        return resolve(value)
    })
}

function wrappedMethodPredicate(method) {
    return method !== "async" &&
        method !== "AssertionError" &&
        typeof assert[method] === "function"
}

function excludedMethodPredicate(method) {
    return method === "async" ||
        method === "AssertionError" ||
        typeof assert[method] !== "function"
}

describe("clean-assert (async)", function () {
    describe("api methods", function () {
        var wrapped = Object.keys(assert).filter(wrappedMethodPredicate)
        var excluded = Object.keys(assert).filter(excludedMethodPredicate)

        wrapped.forEach(function (method) {
            it(
                "#" + method + "() should be presented in async api",
                function () {
                    assert.isFunction(assert.async[method])
                }
            )
        })

        excluded.forEach(function (method) {
            it(
                "#" + method + "() should not be presented in async api",
                function () {
                    assert.notExists(assert.async[method])
                }
            )
        })
    })

    describe("async with equal lib", function () {
        it("checks resolved value equality", function () {
            return assert.async.equal(dumbAsyncValue(1), 1)
        })

        it("checks resolved string equality", function () {
            return assert.async.equal(dumbAsyncValue("value"), "value")
        })

        it("checks simple value equality", function () {
            return assert.async.equal(1, 1)
        })

        it("checks simple strings equality", function () {
            return assert.async.equal("simple value", "simple value")
        })

        it("checks \"notEqual\" with resolved value ", function () {
            return assert.async.notEqual(dumbAsyncValue(1), 2)
        })
    })

    describe("async with type lib", function () {
        it("checks \"ok\" with resolved true", function () {
            return assert.async.ok(dumbAsyncValue(true))
        })

        it("checks \"notOk\" with resolved null", function () {
            return assert.async.notOk(dumbAsyncValue(null))
        })
    })
})
