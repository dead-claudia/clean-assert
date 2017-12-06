"use strict"

/* global Promise */

var util = require("../test-util")
var assert = require("../index")

// Polyfill Promise
require("es6-promise/auto")

describe("clean-assert/async", function () {
    describe("async with equal lib", function () {
        it("checks resolved value equality", function () {
            return assert.async.equal(Promise.resolve(1), 1)
        })

        it("checks resolved string equality", function () {
            return assert.async.equal(Promise.resolve("value"), "value")
        })

        it("checks simple value equality", function () {
            return assert.async.equal(1, 1)
        })

        it("checks simple strings equality", function () {
            return assert.async.equal("simple value", "simple value")
        })

        it("checks `notEqual` with resolved value", function () {
            return assert.async.notEqual(Promise.resolve(1), 2)
        })
    })

    describe("async with type lib", function () {
        it("checks `ok` with resolved true", function () {
            return assert.async.ok(Promise.resolve(true))
        })

        it("checks `notOk` with resolved null", function () {
            return assert.async.notOk(Promise.resolve(null))
        })
    })

    describe("failed cases", function () {
        it("should fails with wrong assertion", function () {
            return util.failAsync("equal", Promise.resolve(1), 2)
        })

        it("rejections should be passed through untouched", function () {
            var untouched = new Error("untouched")

            return assert.async.equal(Promise.reject(untouched), 2)
                .catch(function (e) {
                    assert.equal(e, untouched)
                })
        })
    })
})
