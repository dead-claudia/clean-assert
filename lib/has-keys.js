"use strict"

var match = require("clean-match")
var util = require("clean-assert-util")
var common = require("./common")
var hasOwn = Object.prototype.hasOwnProperty

// Note: `undefined` is returned if no keys needed compared - this is
// conveniently *never* equal to `invert`.
function hasOverloadTest(all, object, keys) {
    if (Array.isArray(keys)) {
        if (keys.length === 0) return undefined

        for (var i = 0; i < keys.length; i++) {
            var test = hasOwn.call(object, keys[i])

            if (test !== all) return !all
        }

        return all
    } else if (common.isIterable(keys)) {
        var hit = false

        if (common.forOf(keys, function (key) {
            hit = true
            return hasOwn.call(object, key) !== all
        })) {
            return !all
        }

        return hit ? all : undefined
    } else {
        return hasKeysTest(util.strictIs, all, object, keys)
    }
}

function hasKeysTest(func, all, object, keys) {
    var list = Object.keys(keys)

    if (list.length === 0) return undefined
    if (object === keys) return true

    for (var i = 0; i < list.length; i++) {
        var key = list[i]
        var test = hasOwn.call(object, key) && func(keys[key], object[key])

        if (test !== all) return test
    }

    return all
}

function makeHasOverload(all, invert, message) {
    return function (object, keys) {
        if (!common.isReferenceType(object)) {
            throw new TypeError("`object` must be an object")
        }

        if (!common.isReferenceType(keys)) {
            throw new TypeError("`keys` must be an object or array")
        }

        // exclusive or to invert the result if `invert` is true
        // boolean equality is equivalent to exclusive or
        if (hasOverloadTest(all, object, keys) === invert) {
            util.fail(message, {actual: object, keys: keys})
        }
    }
}

function makeHasKeys(func, all, invert, message) {
    return function (object, keys) {
        if (!common.isReferenceType(object)) {
            throw new TypeError("`object` must be an object")
        }

        if (!common.isReferenceType(keys)) {
            throw new TypeError("`keys` must be an object")
        }

        // exclusive or to invert the result if `invert` is true
        // boolean equality is equivalent to exclusive or
        if (hasKeysTest(func, all, object, keys) === invert) {
            util.fail(message, {actual: object, keys: keys})
        }
    }
}

/* eslint-disable max-len */

exports.hasKeys = makeHasOverload(true, false, "Expected {actual} to have all keys in {keys}")
exports.hasKeysDeep = makeHasKeys(match.strict, true, false, "Expected {actual} to have all keys in {keys}")
exports.hasKeysMatch = makeHasKeys(match.loose, true, false, "Expected {actual} to match all keys in {keys}")
exports.hasKeysAny = makeHasOverload(false, false, "Expected {actual} to have any key in {keys}")
exports.hasKeysAnyDeep = makeHasKeys(match.strict, false, false, "Expected {actual} to have any key in {keys}")
exports.hasKeysAnyMatch = makeHasKeys(match.loose, false, false, "Expected {actual} to match any key in {keys}")
exports.notHasKeysAll = makeHasOverload(true, true, "Expected {actual} to not have all keys in {keys}")
exports.notHasKeysAllDeep = makeHasKeys(match.strict, true, true, "Expected {actual} to not have all keys in {keys}")
exports.notHasKeysAllMatch = makeHasKeys(match.loose, true, true, "Expected {actual} to not match all keys in {keys}")
exports.notHasKeys = makeHasOverload(false, true, "Expected {actual} to not have any key in {keys}")
exports.notHasKeysDeep = makeHasKeys(match.strict, false, true, "Expected {actual} to not have any key in {keys}")
exports.notHasKeysMatch = makeHasKeys(match.loose, false, true, "Expected {actual} to not match any key in {keys}")
