"use strict"

/* global Promise */

var async = require("../async")

describe("clean-assert/async", function () {
    describe("async with equal lib", function () {
        it("checks resolved value equality", function () {
            return async.equal(Promise.resolve(1), 1)
        })

        it("checks resolved string equality", function () {
            return async.equal(Promise.resolve("value"), "value")
        })

        it("checks simple value equality", function () {
            return async.equal(1, 1)
        })

        it("checks simple strings equality", function () {
            return async.equal("simple value", "simple value")
        })

        it("checks \"notEqual\" with resolved value ", function () {
            return async.notEqual(Promise.resolve(1), 2)
        })
    })

    describe("async with type lib", function () {
        it("checks \"ok\" with resolved true", function () {
            return async.ok(Promise.resolve(true))
        })

        it("checks \"notOk\" with resolved null", function () {
            return async.notOk(Promise.resolve(null))
        })
    })
})
