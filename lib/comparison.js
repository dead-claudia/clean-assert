"use strict"

/**
 * The various non-matching comparison methods. In particular, this includes the
 * core logic of `includes`, `includesAll`, `hasAllKeys`, `hasAnyKey`, etc.
 *
 * Most of the complexity here is to optimize for a few things:
 *
 * - Arrays and non-iterators shouldn't have to allocate any sort of iterator
 *   for inclusion checks. Arrays are the common case here, but array-likes are
 *   largely compatible with the same logic.
 * - I tried to limit the number of polymorphic and megamorphic type checks.
 *   It's not to the extreme as with the object matcher, but it's not minimal.
 */

var symbolIterator = "@@iterator"
var symbolHasInstance = "@@hasInstance"

// Note: these specifically support globally polyfilled implementations as well
// as native implementations.
/* eslint-disable no-undef */
if (typeof Symbol === "function") {
    // We don't need ES6 built-ins for this, so we can just check it directly.
    if (Symbol.iterator != null) {
        symbolIterator = Symbol.iterator
    }

    // Verify it's actually supported first.
    if (Symbol.hasInstance != null) {
        symbolHasInstance = Symbol.hasInstance
    }
}
/* eslint-enable no-undef */

exports.symbolIterator = symbolIterator
exports.symbolHasInstance = symbolHasInstance

// Warning: lots of non-trivial stuff ahead. This is largely based off of this
// guide here, with a few adaptive alterations.
// https://floating-point-gui.de/errors/comparison/
//
// Specifically, here are the main deviations:
//
// - It's not *nearly* as strict when you get close to zero. Instead, it scales
//   more evenly at the cost of missing things that are almost-zero that
//   shouldn't be considered zero.
//
// - It isn't so naïve about handling special cases like infinite tolerances,
//   zero tolerances, and so on. Instead, it just auto-accepts if the tolerance
//   is infinite, and requires exact float value matching if the tolerance is
//   zero.
//
// - I made a few optimizations that weren't present in their Java snippet. For
//   example, the shortcuts are taken before most everything is computed.
//
// Or, to sum this up, edit with caution.

// Smallest normal IEEE 754 double - we can't use `Number.MIN_VALUE`, since
// that's a denormalized number.
var MIN_NORMAL = Math.pow(2, -1022)
var MAX_VALUE = Number.MAX_VALUE

exports.closeTo = function (actual, expected, tolerance) {
    if (tolerance === Infinity || actual === expected) return true
    if (tolerance === 0) return false
    var diff = Math.abs(actual - expected)

    // eslint-disable-next-line no-self-compare
    if (diff !== diff || diff === Infinity) return false

    // Relative error is less meaningful if either `actual` or `expected` are
    // zero or both are extremely close to it
    if (actual !== 0 && expected !== 0 && diff >= MIN_NORMAL) {
        var sum = Math.abs(actual) + Math.abs(expected)

        diff /= sum === Infinity ? MAX_VALUE : sum
    }

    return diff <= tolerance
}

// This checks `typeof` + `instanceof` + a few special types. It also correctly
// handles `Symbol.hasInstance`, even when transpiled.
//
// Note that `value` is never `null`/`undefined`
exports.isType = function (Type, value) {
    if (typeof Type === "string") {
        switch (Type) {
        case "array":
            return Array.isArray(value)

        case "iterable":
            return typeof value[symbolIterator] === "function"

        case "array-like":
            return typeof value.length === "number"

        case "reference":
            return typeof value === "function" || typeof value === "object"

        default:
            return typeof value === Type
        }
    } else if (Type != null && (
        typeof Type === "function" || typeof Type === "object"
    )) {
        if (symbolHasInstance in Type) return !!Type[symbolHasInstance](value)
        if (typeof Type === "function") return value instanceof Type
    }

    throw new TypeError(
        "`Type` must be a string, function, or object with `Symbol.hasInstance`"
    )
}

exports.arrayFrom = Array.from || function (array) {
    var result = []

    if (typeof array[symbolIterator] === "function") {
        var iter = array[symbolIterator]()
        var next = iter.next()

        while (!next.done) {
            result.push(next.value)
            next = iter.next()
        }
    } else {
        var length = array.length

        if (typeof length === "number") {
            length -= length % 1
            for (var i = 0; i !== length; i++) result.push(array[i])
        }
    }

    return result
}

// For a faster `NaN`-aware array inclusion test.
var arrayIncludes = [].includes || /** @this */ function (value) {
    // eslint-disable-next-line no-self-compare
    if (value === value) {
        if (Array.isArray(this)) return this.indexOf(value) >= 0
        for (var i = 0, ilen = this.length; i < ilen; i++) {
            if (this[i] === value) return true
        }
    } else {
        for (var j = 0, jlen = this.length; j < jlen; j++) {
            var current = this[j]

            // eslint-disable-next-line no-self-compare
            if (current !== current) return true
        }
    }
    return false
}

// See: http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero
exports.sameValueZero = sameValueZero
function sameValueZero(a, b) {
    // eslint-disable-next-line no-self-compare
    return a === b || a !== a && b !== b
}

// We have built-ins available for this, so why not exploit them.
exports.simpleIncludes = simpleIncludes
function simpleIncludes(array, value, func) {
    if (func === sameValueZero) return arrayIncludes.call(array, value)

    for (var i = 0; i < array.length; i++) {
        if (func(array[i], value)) return true
    }

    return false
}

function invokeMatchIndexOf(array, value, func) {
    if (func === sameValueZero) {
        // eslint-disable-next-line no-self-compare
        if (value === value) return array.indexOf(value)
        for (var i = 0; i !== array.length; i++) {
            // eslint-disable-next-line no-self-compare
            if (array[i] !== array[i]) return i
        }
    } else {
        for (var j = 0; j !== array.length; j++) {
            if (func(value, array[j])) return j
        }
    }

    return -1
}

exports.includesDeepCheck = function (array, values, func, isAny) {
    if (values.length === 0) return !isAny

    if (isAny) {
        for (var i = 0; i !== array.length; i++) {
            if (simpleIncludes(values, array[i], func)) return true
        }
    } else {
        if (array.length === 0) return true
        for (var j = 0; j !== array.length; j++) {
            var index = invokeMatchIndexOf(values, array[j], func)

            if (index >= 0) {
                values.splice(index, 1)
                if (values.length === 0) return true
            }
        }
    }

    return false
}

// eslint-disable-next-line max-params
exports.hasKeysCheck = function (object, keys, test, get, is, isAny) {
    var keyNames = Object.keys(keys)

    for (var i = 0; i < keyNames.length; i++) {
        var key = keyNames[i]
        var result = test(object, key) && is(keys[key], get(object, key))

        if (result === isAny) return isAny
    }

    return !isAny
}

exports.hasKeysTest = function (object, keys, test, isAny) {
    for (var i = 0; i !== keys.length; i++) {
        if (test(object, keys[i]) === isAny) return isAny
    }

    return !isAny
}
