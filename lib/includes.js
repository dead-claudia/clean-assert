"use strict"

var match = require("clean-match")
var util = require("clean-assert-util")
var common = require("./common")

function includesArrayValue(array, value, func) {
    for (var i = 0; i < array.length; i++) {
        if (func(value, array[i])) return true
    }

    return false
}

function includesArrayAny(array, values, func) {
    var i, j, value

    for (i = 0; i < array.length; i++) {
        value = array[i]
        for (j = 0; j < values.length; j++) {
            if (func(value, values[j])) return true
        }
    }

    return false
}

function includesArrayAll(array, values, func) {
    var i, j, k, value
    var count = values.length
    var hit = new Array(count)

    for (i = 0; i < count; i++) hit[i] = i

    for (i = 0; i < array.length; i++) {
        value = array[i]

        for (j = 0; j < count; j++) {
            if (func(value, values[hit[j]])) {
                for (k = j; k < count; k++) hit[k] = hit[k + 1]
                if (--count === 0) return true
            }
        }
    }

    return false
}

function testIncludes(array, values, func, all) {
    // Cheap cases first
    if (array === values) return true
    if (Array.isArray(values)) {
        if (values.length === 0) return undefined
        if (!all) return includesArrayAny(array, values, func)
        if (array.length < values.length) return false
        return includesArrayAll(array, values, func)
    } else {
        if (all && array.length === 0) return false
        return includesArrayValue(array, values, func)
    }
}

function defineIncludes(func, all, invert, message) {
    return function (iter, values) {
        if ((iter = common.castIterableChecked(iter)) == null) {
            throw new TypeError("`iter` must be an iterable")
        }

        values = common.castIfIterable(values)

        if (testIncludes(iter, values, func, all) === invert) {
            util.fail(message, {actual: iter, values: values})
        }
    }
}

/* eslint-disable max-len */

exports.includes = defineIncludes(util.strictIs, true, false, "Expected {actual} to have all values in {values}")
exports.includesDeep = defineIncludes(match.strict, true, false, "Expected {actual} to match all values in {values}")
exports.includesMatch = defineIncludes(match.loose, true, false, "Expected {actual} to match all values in {values}")
exports.includesAny = defineIncludes(util.strictIs, false, false, "Expected {actual} to have any value in {values}")
exports.includesAnyDeep = defineIncludes(match.strict, false, false, "Expected {actual} to match any value in {values}")
exports.includesAnyMatch = defineIncludes(match.loose, false, false, "Expected {actual} to match any value in {values}")
exports.notIncludesAll = defineIncludes(util.strictIs, true, true, "Expected {actual} to not have all values in {values}")
exports.notIncludesAllDeep = defineIncludes(match.strict, true, true, "Expected {actual} to not match all values in {values}")
exports.notIncludesAllMatch = defineIncludes(match.loose, true, true, "Expected {actual} to not match all values in {values}")
exports.notIncludes = defineIncludes(util.strictIs, false, true, "Expected {actual} to not have any value in {values}")
exports.notIncludesDeep = defineIncludes(match.strict, false, true, "Expected {actual} to not match any value in {values}")
exports.notIncludesMatch = defineIncludes(match.loose, false, true, "Expected {actual} to not match any value in {values}")
