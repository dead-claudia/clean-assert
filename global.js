(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
/* eslint-disable no-undef, global-require */
"use strict"

if (typeof define === "function" && define.amd) {
    define("clean-assert", function () { return require("./index") })
} else {
    global.assert = require("./index")
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./index":2}],2:[function(require,module,exports){
"use strict"

/**
 * Core TDD-style assertions. These are done by a composition of DSLs, since
 * there is *so* much repetition.
 */

var match = require("./lib/match")
var comparison = require("./lib/comparison")
var inspect = require("./lib/inspect")

exports.inspect = inspect

exports.matchLoose = match.loose
exports.matchStrict = match.strict

var hasOwn = Object.prototype.hasOwnProperty
var AssertionError

try {
    AssertionError = new Function( // eslint-disable-line no-new-func
        "class AssertionError extends Error{" +
            "constructor(m,a,e){super(m);this.actual=a;this.expected=e}" +
            "get name(){return'AssertionError'}" +
        "}" +
        // check native subclassing support
        "if('a'!=new AssertionError('a',1,2).message)throw'';" +
        "return AssertionError"
    )()
} catch (e) {
    // Take advantage of V8's always-exposed stack trace API.
    AssertionError = typeof Error.captureStackTrace === "function"
        ? function AssertionError(message, actual, expected) {
            this.message = message || ""
            this.expected = expected
            this.actual = actual
            Error.captureStackTrace(this, AssertionError)
        }
        : function AssertionError(message, actual, expected) {
            var e = new Error(message)

            e.name = "AssertionError"

            this.message = e.message
            this.expected = expected
            this.actual = actual
            this.stack = e.stack

            // PhantomJS, IE, and possibly Edge don't set the stack trace until
            // the error is thrown. Note that this prefers an existing stack
            // first, since most everyone else already contains this.
            if (this.stack == null) {
                try {
                    throw e
                } catch (e) {
                    this.stack = e.stack
                }
            }
        }

    AssertionError.prototype = Object.create(Error.prototype)

    Object.defineProperty(AssertionError.prototype, "constructor", {
        configurable: true,
        writable: true,
        enumerable: false,
        value: AssertionError,
    })

    Object.defineProperty(AssertionError.prototype, "name", {
        configurable: true,
        writable: true,
        enumerable: false,
        value: "AssertionError",
    })
}
exports.AssertionError = AssertionError

exports.escape = function (string) {
    if (typeof string !== "string") {
        throw new TypeError("`string` must be a string")
    }

    return string.replace(/\{.+?\}/g, function (m) { return "\\" + m })
}

// This formats the assertion error messages.
exports.format = format
function format(message, opts, prettify) {
    if (prettify == null) prettify = inspect

    if (typeof message !== "string") {
        throw new TypeError("`message` must be a string")
    }

    if (typeof opts !== "object" || opts === null) {
        throw new TypeError("`opts` must be an object")
    }

    checkCallable(prettify, "prettify")

    return message.replace(/\\?\{.+?\}/g, function (m) {
        if (m[0] === "\\") return m.slice(1)
        var prop = m.slice(1, -1)

        if (!hasOwn.call(opts, prop)) return m
        return prettify(opts[prop], {depth: 5})
    })
}

// The basic assert, like `assert.ok`, but gives you an optional message.
exports.assert = assert
function assert(test, message, actual, expected) {
    if (!test) {
        if (arguments.length > 2) {
            message = format(message, {actual: actual, expected: expected})
        }
        throw new AssertionError(message, actual, expected)
    }
}

exports.fail = fail
function fail(message, actual, expected) {
    if (arguments.length <= 1) throw new AssertionError(message)
    throw new AssertionError(
        format(message, {actual: actual, expected: expected}),
        actual, expected
    )
}

exports.failFormat = failFormat
function failFormat(message, opts, prettify) {
    throw new AssertionError(
        format(message, opts, prettify),
        opts.actual, opts.expected
    )
}

function checkNumber(value, name) {
    if (typeof value !== "number") {
        throw new TypeError("`" + name + "` must be a number")
    }
}

function checkCallable(value, name) {
    if (typeof value !== "function") {
        throw new TypeError("`" + name + "` must be a function")
    }
}

function isCollection(value) {
    return value != null && (
        typeof value[comparison.symbolIterator] === "function" ||
        typeof value.length === "number"
    )
}

function checkCollection(value, name) {
    if (!isCollection(value)) {
        throw new TypeError("`" + name + "` must be an iterable or array-like")
    }
}

function isReferenceType(object) {
    return object != null && (
        typeof object === "function" ||
        typeof object === "object"
    )
}

function checkReferenceType(value, name) {
    if (!isReferenceType(value)) {
        throw new TypeError("`" + name + "` must be an iterable or array-like")
    }
}

/* eslint-disable max-len */
var hasMessages = [
    "Expected {object} to have own key {key} equal to {expected}, but found {actual}",
    "Expected {object} to have own key {expected}",
    "Expected {object} to not have own key {key} equal to {actual}",
    "Expected {object} to not have own key {expected}",
    "Expected {object} to have key {key} equal to {expected}, but found {actual}",
    "Expected {object} to have key {expected}",
    "Expected {object} to not have key {key} equal to {actual}",
    "Expected {object} to not have key {expected}",
]
/* eslint-enable max-len */

function makeHas(test, get, is, index) {
    return function (object, key, value) {
        var invert = (index & 2) !== 0

        if ((test(object, key) && is(get(object, key), value)) === invert) {
            failFormat(hasMessages[index], {
                actual: object[key], expected: value,
                object: object, key: key,
            })
        }
    }
}

function makeHasOverload(test, get, is, index) {
    return function (object, key, value) {
        var invert = (index & 2) !== 0

        if (arguments.length >= 3) {
            if ((test(object, key) && is(get(object, key), value)) === invert) {
                failFormat(hasMessages[index], {
                    actual: object[key], expected: value,
                    object: object, key: key,
                })
            }
        } else if (test(object, key) === invert) {
            failFormat(hasMessages[index + 1], {
                actual: object[key], expected: value,
                object: object, key: key,
            })
        }
    }
}

function testHasOwn(object, key) { return hasOwn.call(object, key) }
function testHasIn(object, key) { return key in object }
function testHasKey(object, key) { return object.has(key) }
function getProperty(object, key) { return object[key] }
function getMethod(object, key) { return object.get(key) }

var includesTemplates = [
    "Expected {coll} to include {expected}",
    "Expected {coll} to not include {expected}",
]

function makeIncludes(type, mask) {
    return function (coll, expected) {
        checkCollection(coll, "coll")

        if (comparison.simpleIncludes(
            comparison.arrayFrom(coll), expected, type
        ) === ((mask & 1) !== 0)) {
            failFormat(
                includesTemplates[mask >>> 1],
                {coll: coll, expected: expected}
            )
        }
    }
}

var includesMultiTemplates = [
    "Expected {coll} to include all values in {expected}",
    "Expected {coll} to exclude all values in {expected}",
    "Expected {coll} to include any value in {expected}",
    "Expected {coll} to exclude any value in {expected}",
]

function makeIncludesMulti(type, mask) {
    return function (coll, expected) {
        checkCollection(coll, "coll")
        checkCollection(expected, "expected")

        if (comparison.includesDeepCheck(
            comparison.arrayFrom(coll),
            comparison.arrayFrom(expected),
            type, (mask & 1) !== 0
        ) === ((mask & 2) !== 0)) {
            failFormat(
                includesMultiTemplates[mask],
                {coll: coll, expected: expected}
            )
        }
    }
}

var hasKeysMessages = [
    "Expected {object} to have all keys in {expected}, but found {actual}",
    "Expected {object} to have any key in {expected}, but found {actual}",
    "Expected {object} to lack all keys in {expected}, but found {actual}",
    "Expected {object} to lack any key in {expected}, but found {actual}",
]

function makeHasKeys(mask, test, get, is) {
    return function (object, expected) {
        checkReferenceType(object, "object")

        if (!isReferenceType(expected) && typeof expected !== "string") {
            throw new TypeError(
                "`expected` must be an object, iterable, or array-like"
            )
        }

        var checkKeysOnly = isCollection(expected)

        // exclusive or to invert the result if `invert` is true
        // boolean equality is equivalent to exclusive or
        if ((
            checkKeysOnly
                ? comparison.hasKeysTest(
                    object, comparison.arrayFrom(expected),
                    test, (mask & 1) !== 0
                )
                : object === expected || comparison.hasKeysCheck(
                    object, expected,
                    test, get, is, (mask & 1) !== 0
                )
        ) === ((mask & 2) !== 0)) {
            var actual

            if (checkKeysOnly) {
                actual = Object.keys(expected)
                var count = 0

                for (var i = 0; i < actual.length; i++) {
                    if (test(object, actual[i])) actual[count++] = actual[i]
                }

                actual.length = count
            } else {
                actual = Object.create(null)

                for (var key in expected) {
                    if (hasOwn.call(expected, key) && test(object, key)) {
                        actual[key] = get(object, key)
                    }
                }
            }

            failFormat(
                hasKeysMessages[mask],
                {object: object, actual: actual, expected: expected}
            )
        }
    }
}

/**
 * Pretty much all the assertion methods fit within a single 2x3x14 matrix:
 *
 * Top level: (truth, falsehood)
 *
 * - Is true (like `assert.ok`)
 * - Not true (like `assert.notOk`)
 *
 * Second level: (match type)
 *
 * - Structural via `matchLoose` (like `assert.includes`)
 * - Exact via [SameValueZero][1] (like `assert.exactlyIncludes`)
 * - Deep via `matchStrict` (like `assert.deeplyIncludes`)
 *
 * Third level: (match location)
 *
 * - Equality (like `assert.equals`)
 * - Has own key (like `assert.hasOwn(object, k)`)
 * - Has accessible key (like `assert.hasIn(object, k)`)
 * - Has map/set key (like `assert.hasKey(object, k)`)
 * - Has own key set to a value (like `assert.hasOwn(object, k, v)`)
 * - Has accessible key set to a value (like `assert.hasIn(object, k, v)`)
 * - Has map/set key (like `assert.hasKey(object, k, v)`)
 * - Includes single value (like `assert.includes`)
 * - Includes all values (like `assert.includesAll`)
 * - Includes any value (like `assert.includesAny`)
 * - Has all own keys (like `assert.hasAllOwn(object, [...keys])`)
 * - Has any own key (like `assert.hasAnyOwn(object, [...keys])`)
 * - Has all own pairs (like `assert.hasAllOwn(object, {...pairs})`)
 * - Has any own pair (like `assert.hasAnyOwn(object, {...pairs})`)
 * - Has all accessible keys (like `assert.hasAllIn(object, [...keys])`)
 * - Has any accessible key (like `assert.hasAnyIn(object, [...keys])`)
 * - Has all accessible pairs (like `assert.hasAllIn(object, {...pairs})`)
 * - Has any accessible pair (like `assert.hasAnyIn(object, {...pairs})`)
 * - Has all map keys (like `assert.hasAllKeys(object, [...keys])`)
 * - Has any map key (like `assert.hasAnyKey(object, [...keys])`)
 * - Has all map pairs (like `assert.hasAllKeys(object, {...pairs})`)
 * - Has any map pair (like `assert.hasAnyKey(object, {...pairs})`)
 *
 * Not all assertion methods have variants in each of these:
 *
 * - `assert` has no inverse.
 * - `fail` and `failFormat` just fail unconditionally.
 * - `throws` and `throwsMatching` have no inverse, since it usually makes more
 *   sense to just let the exception propagate instead. You get to keep the
 *   stack trace this way, which is all around just generally more helpful for
 *   debugging.
 * - Most methods have inverses named after single-word or two-word antonyms:
 *   - "includes" becomes "excludes"
 *   - "has" becomes "lacks"
 *   - `atLeast` becomes `below`
 *   - `atMost` becomes `above`
 * - Several methods only have one match type/location: `atLeast`/`below`,
 *   `atMost`/`above`, `ok`/`notOk`, `is`/`not`, `maybeIs`/`maybeNot`,
 *   `between`/`notBetween`, and `closeTo`/`notCloseTo`.
 *
 * In total, this is a little over 100 separate, dedicated assertions
 *
 * [1]: http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero
 */

exports.ok = function (x) {
    assert(x != null, "Expected {actual} to not be null or undefined", x)
}

exports.notOk = function (x) {
    assert(x == null, "Expected {actual} to be null or undefined", x)
}

exports.is = function (Type, object) {
    if (object == null || !comparison.isType(Type, object)) {
        if (typeof Type === "string") {
            fail(
                "Expected {actual} to be " +
                (/^[aeiou]/.test(Type) ? "a " : "an ") + Type,
                object, undefined
            )
        } else {
            failFormat(
                "Expected {object} to be an instance of {expected}",
                {actual: object.constructor, expected: Type, object: object}
            )
        }
    }
}

exports.not = function (Type, object) {
    if (object != null && comparison.isType(Type, object)) {
        if (typeof Type === "string") {
            fail(
                "Expected {actual} to not be " +
                (/^[aeiou]/.test(Type) ? "a " : "an ") + Type,
                object, undefined
            )
        } else {
            failFormat(
                "Expected {object} to not be an instance of {expected}",
                {actual: object.constructor, expected: Type, object: object}
            )
        }
    }
}

exports.possibly = function (Type, object) {
    if (object != null && !comparison.isType(Type, object)) {
        if (typeof Type === "string") {
            fail(
                "Expected {actual} to possibly be " +
                (/^[aeiou]/.test(Type) ? "a " : "an ") + Type,
                object, undefined
            )
        } else {
            failFormat(
                "Expected {object} to possibly be an instance of {expected}",
                {actual: object.constructor, expected: Type, object: object}
            )
        }
    }
}

exports.notPossibly = function (Type, object) {
    if (object == null || comparison.isType(Type, object)) {
        if (typeof Type === "string") {
            fail(
                "Expected {actual} to not possibly be " +
                (/^[aeiou]/.test(Type) ? "a " : "an ") + Type,
                object, undefined
            )
        } else {
            failFormat(
                "Expected {object} to not possibly be " +
                "an instance of {expected}",
                {actual: object.constructor, expected: Type, object: object}
            )
        }
    }
}

exports.atLeast = function (actual, expected) {
    checkNumber(actual, "actual")
    checkNumber(expected, "expected")
    assert(
        actual >= expected,
        "Expected {actual} to be at least {expected}",
        actual, expected
    )
}

exports.atMost = function (actual, expected) {
    checkNumber(actual, "actual")
    checkNumber(expected, "expected")
    assert(
        actual <= expected,
        "Expected {actual} to be at most {expected}",
        actual, expected
    )
}

exports.above = function (actual, expected) {
    checkNumber(actual, "actual")
    checkNumber(expected, "expected")
    assert(
        actual > expected,
        "Expected {actual} to be above {expected}",
        actual, expected
    )
}

exports.below = function (actual, expected) {
    checkNumber(actual, "actual")
    checkNumber(expected, "expected")
    assert(
        actual < expected,
        "Expected {actual} to be below {expected}",
        actual, expected
    )
}

exports.between = function (actual, lower, upper) {
    checkNumber(actual, "actual")
    checkNumber(lower, "lower")
    checkNumber(upper, "upper")

    if (
        // eslint-disable-next-line no-self-compare
        actual !== actual || lower !== lower || upper !== upper ||
        actual < lower || actual > upper
    ) {
        failFormat(
            "Expected {actual} to be between {lower} and {upper}",
            {actual: actual, lower: lower, upper: upper}
        )
    }
}

// Note: this is high enough to cover roundoff and other highly inaccurate
// computations that frequently end up in application code (where precision
// isn't always important), but not so high it fails to address truly non-equal
// values. It was chosen through a bit of trial and error.
var defaultTolerance = 1e-8

// Note: these two always fail when dealing with NaNs.
exports.closeTo = function (actual, expected, tolerance) {
    checkNumber(actual, "actual")
    checkNumber(expected, "expected")
    if (tolerance == null) tolerance = defaultTolerance
    checkNumber(tolerance, "tolerance")
    if (tolerance < 0) throw new RangeError("`tolerance` must be non-negative")

    assert(
        // eslint-disable-next-line no-self-compare
        actual === actual && expected === expected && tolerance === tolerance &&
        comparison.closeTo(actual, expected, tolerance),
        "Expected {actual} to be close to {expected}",
        actual, expected
    )
}

exports.notCloseTo = function (actual, expected, tolerance) {
    checkNumber(actual, "actual")
    checkNumber(expected, "expected")
    if (tolerance == null) tolerance = defaultTolerance
    checkNumber(tolerance, "tolerance")
    if (tolerance < 0) throw new RangeError("`tolerance` must be non-negative")

    assert(
        // eslint-disable-next-line no-self-compare
        actual === actual && expected === expected && tolerance === tolerance &&
        !comparison.closeTo(actual, expected, tolerance),
        "Expected {actual} to not be close to {expected}",
        actual, expected
    )
}

exports.notBetween = function (actual, lower, upper) {
    checkNumber(actual, "actual")
    checkNumber(lower, "lower")
    checkNumber(upper, "upper")

    if (
        // eslint-disable-next-line no-self-compare
        actual !== actual || lower !== lower || upper !== upper ||
        actual >= lower && actual <= upper
    ) {
        failFormat(
            "Expected {actual} to not be between {lower} and {upper}",
            {actual: actual, lower: lower, upper: upper}
        )
    }
}

exports.equal = function (actual, expected) {
    assert(match.loose(actual, expected),
        "Expected {actual} to equal {expected}",
        actual, expected
    )
}

exports.notEqual = function (actual, expected) {
    assert(!match.loose(actual, expected),
        "Expected {actual} to not equal {expected}",
        actual, expected
    )
}

exports.hasOwn = makeHasOverload(testHasOwn, getProperty, match.loose, 0x0)
exports.lacksOwn = makeHasOverload(testHasOwn, getProperty, match.loose, 0x2)

exports.hasIn = makeHasOverload(testHasIn, getProperty, match.loose, 0x4)
exports.lacksIn = makeHasOverload(testHasIn, getProperty, match.loose, 0x6)

exports.hasKey = makeHasOverload(testHasKey, getMethod, match.loose, 0x0)
exports.lacksKey = makeHasOverload(testHasKey, getMethod, match.loose, 0x6)

exports.includes = makeIncludes(match.loose, 0x0)
exports.excludes = makeIncludes(match.loose, 0x1)

exports.includesAll = makeIncludesMulti(match.loose, 0x0)
exports.excludesAll = makeIncludesMulti(match.loose, 0x2)

exports.includesAny = makeIncludesMulti(match.loose, 0x1)
exports.excludesAny = makeIncludesMulti(match.loose, 0x3)

exports.hasAllOwn = makeHasKeys(0x0, testHasOwn, getProperty, match.loose)
exports.lacksAllOwn = makeHasKeys(0x2, testHasOwn, getProperty, match.loose)

exports.hasAnyOwn = makeHasKeys(0x1, testHasOwn, getProperty, match.loose)
exports.lacksAnyOwn = makeHasKeys(0x3, testHasOwn, getProperty, match.loose)

exports.hasAllIn = makeHasKeys(0x0, testHasIn, getProperty, match.loose)
exports.lacksAllIn = makeHasKeys(0x2, testHasIn, getProperty, match.loose)

exports.hasAnyIn = makeHasKeys(0x1, testHasIn, getProperty, match.loose)
exports.lacksAnyIn = makeHasKeys(0x3, testHasIn, getProperty, match.loose)

exports.hasAllKeys = makeHasKeys(0x0, testHasKey, getMethod, match.loose)
exports.lacksAllKeys = makeHasKeys(0x2, testHasKey, getMethod, match.loose)

exports.hasAnyKey = makeHasKeys(0x1, testHasKey, getMethod, match.loose)
exports.lacksAnyKey = makeHasKeys(0x3, testHasKey, getMethod, match.loose)

exports.throws = function (Type, callback) {
    if (!isReferenceType(Type) && typeof Type !== "string") {
        throw new TypeError(
            "`Type` must be a string, function, or object with " +
            "`Symbol.hasInstance`"
        )
    }

    checkCallable(callback, "callback")

    try {
        callback() // eslint-disable-line callback-return
    } catch (e) {
        assert(comparison.isType(Type, e),
            "Expected callback to throw an instance of {expected}, " +
            "but found {actual}",
            e, Type
        )
        return
    }

    throw new AssertionError("Expected callback to throw")
}

exports.throwsMatching = function (matcher, callback) {
    var type

    if (typeof matcher === "string") {
        type = 0
    } else if (typeof matcher === "function") {
        type = 1
    } else if (matcher instanceof RegExp) {
        type = 2
    } else if (
        matcher != null &&
        Object.getPrototypeOf(matcher) === Object.prototype
    ) {
        type = 3
    } else {
        throw new TypeError(
            "`matcher` must be a string, function, RegExp, or object"
        )
    }

    checkCallable(callback, "callback")

    try {
        callback() // eslint-disable-line callback-return
    } catch (e) {
        if (type === 0) {
            assert(e.message === matcher,
                "Expected callback to throw an error with message " +
                "{expected}, but found {actual}",
                e, matcher
            )
        } else if (type === 1) {
            assert(
                matcher(e),
                "Expected callback to throw an error matching " +
                "{expected}, but found {actual}",
                e, matcher
            )
        } else if (type === 2) {
            assert(
                matcher.test(e.message),
                "Expected callback to throw an error with message " +
                "matching {expected}, but found {actual}",
                e, matcher
            )
        } else {
            assert(
                comparison.hasKeysCheck(
                    e, matcher,
                    testHasIn, getProperty, match.loose, false
                ),
                "Expected callback to throw an error matching " +
                "{expected}, but found {actual}",
                e, matcher
            )
        }
        return
    }

    fail("Expected callback to throw an error", undefined, matcher)
}

exports.exactlyEqual = function (actual, expected) {
    assert(comparison.sameValueZero(actual, expected),
        "Expected {actual} to exactly equal {expected}",
        actual, expected
    )
}

exports.exactlyNotEqual = function (actual, expected) {
    assert(!comparison.sameValueZero(actual, expected),
        "Expected {actual} to not exactly equal {expected}",
        actual, expected
    )
}

/* eslint-disable max-len */
exports.exactlyHasOwn = makeHas(testHasOwn, getProperty, comparison.sameValueZero, 0x0)
exports.exactlyLacksOwn = makeHas(testHasOwn, getProperty, comparison.sameValueZero, 0x2)

exports.exactlyHasIn = makeHas(testHasIn, getProperty, comparison.sameValueZero, 0x4)
exports.exactlyLacksIn = makeHas(testHasIn, getProperty, comparison.sameValueZero, 0x6)

exports.exactlyHasKey = makeHas(testHasKey, getMethod, comparison.sameValueZero, 0x4)
exports.exactlyLacksKey = makeHas(testHasKey, getMethod, comparison.sameValueZero, 0x6)

exports.exactlyIncludes = makeIncludes(comparison.sameValueZero, 0x0)
exports.exactlyExcludes = makeIncludes(comparison.sameValueZero, 0x1)

exports.exactlyIncludesAll = makeIncludesMulti(comparison.sameValueZero, 0x0)
exports.exactlyExcludesAll = makeIncludesMulti(comparison.sameValueZero, 0x2)

exports.exactlyIncludesAny = makeIncludesMulti(comparison.sameValueZero, 0x1)
exports.exactlyExcludesAny = makeIncludesMulti(comparison.sameValueZero, 0x3)

exports.exactlyHasAllOwn = makeHasKeys(0x0, testHasOwn, getProperty, comparison.sameValueZero)
exports.exactlyLacksAllOwn = makeHasKeys(0x2, testHasOwn, getProperty, comparison.sameValueZero)

exports.exactlyHasAnyOwn = makeHasKeys(0x1, testHasOwn, getProperty, comparison.sameValueZero)
exports.exactlyLacksAnyOwn = makeHasKeys(0x3, testHasOwn, getProperty, comparison.sameValueZero)

exports.exactlyHasAllIn = makeHasKeys(0x0, testHasIn, getProperty, comparison.sameValueZero)
exports.exactlyLacksAllIn = makeHasKeys(0x2, testHasIn, getProperty, comparison.sameValueZero)

exports.exactlyHasAnyIn = makeHasKeys(0x1, testHasIn, getProperty, comparison.sameValueZero)
exports.exactlyLacksAnyIn = makeHasKeys(0x3, testHasIn, getProperty, comparison.sameValueZero)

exports.exactlyHasAllKeys = makeHasKeys(0x0, testHasKey, getMethod, comparison.sameValueZero)
exports.exactlyLacksAllKeys = makeHasKeys(0x2, testHasKey, getMethod, comparison.sameValueZero)

exports.exactlyHasAnyKey = makeHasKeys(0x1, testHasKey, getMethod, comparison.sameValueZero)
exports.exactlyLacksAnyKey = makeHasKeys(0x3, testHasKey, getMethod, comparison.sameValueZero)
/* eslint-enable max-len */

exports.deeplyEqual = function (actual, expected) {
    assert(match.strict(actual, expected),
        "Expected {actual} to deeply equal {expected}",
        actual, expected
    )
}

exports.deeplyNotEqual = function (actual, expected) {
    assert(!match.strict(actual, expected),
        "Expected {actual} to deeply equal {expected}",
        actual, expected
    )
}

exports.deeplyHasOwn = makeHas(testHasOwn, getProperty, match.strict, 0x0)
exports.deeplyLacksOwn = makeHas(testHasOwn, getProperty, match.strict, 0x2)

exports.deeplyHasIn = makeHas(testHasIn, getProperty, match.strict, 0x4)
exports.deeplyLacksIn = makeHas(testHasIn, getProperty, match.strict, 0x6)

exports.deeplyHasKey = makeHas(testHasKey, getMethod, match.strict, 0x4)
exports.deeplyLacksKey = makeHas(testHasKey, getMethod, match.strict, 0x6)

exports.deeplyIncludes = makeIncludes(match.strict, 0x0)
exports.deeplyExcludes = makeIncludes(match.strict, 0x1)

exports.deeplyIncludesAll = makeIncludesMulti(match.strict, 0x0)
exports.deeplyExcludesAll = makeIncludesMulti(match.strict, 0x2)

exports.deeplyIncludesAny = makeIncludesMulti(match.strict, 0x1)
exports.deeplyExcludesAny = makeIncludesMulti(match.strict, 0x3)

/* eslint-disable max-len */
exports.deeplyHasAllOwn = makeHasKeys(0x0, testHasOwn, getProperty, match.strict)
exports.deeplyLacksAllOwn = makeHasKeys(0x2, testHasOwn, getProperty, match.strict)

exports.deeplyHasAnyOwn = makeHasKeys(0x1, testHasOwn, getProperty, match.strict)
exports.deeplyLacksAnyOwn = makeHasKeys(0x3, testHasOwn, getProperty, match.strict)

exports.deeplyHasAllIn = makeHasKeys(0x0, testHasIn, getProperty, match.strict)
exports.deeplyLacksAllIn = makeHasKeys(0x2, testHasIn, getProperty, match.strict)

exports.deeplyHasAnyIn = makeHasKeys(0x1, testHasIn, getProperty, match.strict)
exports.deeplyLacksAnyIn = makeHasKeys(0x3, testHasIn, getProperty, match.strict)

exports.deeplyHasAllKeys = makeHasKeys(0x0, testHasKey, getMethod, match.strict)
exports.deeplyLacksAllKeys = makeHasKeys(0x2, testHasKey, getMethod, match.strict)

exports.deeplyHasAnyKey = makeHasKeys(0x1, testHasKey, getMethod, match.strict)
exports.deeplyLacksAnyKey = makeHasKeys(0x3, testHasKey, getMethod, match.strict)
/* eslint-enable max-len */

},{"./lib/comparison":4,"./lib/inspect":3,"./lib/match":5}],3:[function(require,module,exports){
"use strict"

// See https://github.com/substack/node-browserify/issues/1674

module.exports = require("util-inspect")

},{"util-inspect":12}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
(function (global){
"use strict"

/* global Symbol, Uint8Array, DataView, ArrayBuffer, ArrayBufferView, Map,
Set */

/**
 * Deep matching algorithm, with zero dependencies. Note the following:
 *
 * - This is relatively performance-tuned, although it prefers high
 *   correctness. Patch with care, since performance is a concern.
 * - This does pack a *lot* of features, which should explain the length.
 * - Some of the duplication is intentional. It's generally commented, but
 *   it's mainly for performance, since the engine needs its type info.
 * - Polyfilled core-js Symbols from cross-origin contexts will never
 *   register as being actual Symbols.
 *
 * And in case you're wondering about the longer functions and occasional
 * repetition, it's because V8's inliner isn't always intelligent enough to
 * deal with the super highly polymorphic data this often deals with, and JS
 * doesn't have compile-time macros.
 */

var objectToString = Object.prototype.toString
var hasOwn = Object.prototype.hasOwnProperty

var supportsUnicode = hasOwn.call(RegExp.prototype, "unicode")
var supportsSticky = hasOwn.call(RegExp.prototype, "sticky")

// Legacy engines have several issues when it comes to `typeof`.
var isFunction = (function () {
    function SlowIsFunction(value) {
        if (value == null) return false

        var tag = objectToString.call(value)

        return tag === "[object Function]" ||
            tag === "[object GeneratorFunction]" ||
            tag === "[object AsyncFunction]" ||
            tag === "[object Proxy]"
    }

    function isPoisoned(object) {
        return object != null && typeof object !== "function"
    }

    // In Safari 10, `typeof Proxy === "object"`
    if (isPoisoned(global.Proxy)) return SlowIsFunction

    // In Safari 8, several typed array constructors are
    // `typeof C === "object"`
    if (isPoisoned(global.Int8Array)) return SlowIsFunction

    // In old V8, RegExps are callable
    if (typeof /x/ === "function") return SlowIsFunction // eslint-disable-line

    // Leave this for normal things. It's easily inlined.
    return function isFunction(value) {
        return typeof value === "function"
    }
})()

// Set up our own buffer check. We should always accept the polyfill, even
// in Node. Note that it uses `global.Buffer` to avoid including `buffer` in
// the bundle.

var BufferNative = 0
var BufferPolyfill = 1
var BufferSafari = 2

var bufferSupport = (function () {
    function FakeBuffer() {}
    FakeBuffer.isBuffer = function () { return true }

    // Only Safari 5-7 has ever had this issue.
    if (new FakeBuffer().constructor !== FakeBuffer) return BufferSafari
    if (!isFunction(global.Buffer)) return BufferPolyfill
    if (!isFunction(global.Buffer.isBuffer)) return BufferPolyfill
    // Avoid global polyfills
    if (global.Buffer.isBuffer(new FakeBuffer())) return BufferPolyfill
    return BufferNative
})()

var globalIsBuffer = bufferSupport === BufferNative
    ? global.Buffer.isBuffer
    : undefined

exports.isBuffer = isBuffer
function isBuffer(object) {
    if (bufferSupport === BufferNative && globalIsBuffer(object)) {
        return true
    } else if (bufferSupport === BufferSafari && object._isBuffer) {
        return true
    }

    var B = object.constructor

    if (!isFunction(B)) return false
    if (!isFunction(B.isBuffer)) return false
    return B.isBuffer(object)
}

// core-js' symbols are objects, and some old versions of V8 erroneously had
// `typeof Symbol() === "object"`.
var symbolsAreObjects = isFunction(global.Symbol) &&
    typeof Symbol() === "object"

// `context` is a bit field, with the following bits. This is not as much
// for performance than to just reduce the number of parameters I need to be
// throwing around.
var Strict = 1
var Initial = 2
var SameProto = 4

exports.loose = function (a, b) {
    return match(a, b, Initial, undefined, undefined)
}

exports.strict = function (a, b) {
    return match(a, b, Strict | Initial, undefined, undefined)
}

// Feature-test delayed stack additions and extra keys. PhantomJS and IE
// both wait until the error was actually thrown first, and assign them as
// own properties, which is unhelpful for assertions. This returns a
// function to speed up cases where `Object.keys` is sufficient (e.g. in
// Chrome/FF/Node).
//
// This wouldn't be necessary if those engines would make the stack a
// getter, and record it when the error was created, not when it was thrown.
// It specifically filters out errors and only checks existing descriptors,
// just to keep the mess from affecting everything (it's not fully correct,
// but it's necessary).
var requiresProxy = (function () {
    var test = new Error()
    var old = Object.create(null)

    Object.keys(test).forEach(function (key) { old[key] = true })

    try {
        throw test
    } catch (_) {
        // ignore
    }

    return Object.keys(test).some(function (key) { return !old[key] })
})()

function isIgnored(object, key) {
    switch (key) {
    case "line": if (typeof object.line !== "number") return false; break
    case "sourceURL":
        if (typeof object.sourceURL !== "string") return false; break
    case "stack": if (typeof object.stack !== "string") return false; break
    default: return false
    }

    var desc = Object.getOwnPropertyDescriptor(object, key)

    return !desc.configurable && desc.enumerable && !desc.writable
}

// This is only invoked with errors, so it's not going to present a
// significant slow down.
function getKeysStripped(object) {
    var keys = Object.keys(object)
    var count = 0

    for (var i = 0; i < keys.length; i++) {
        if (!isIgnored(object, keys[i])) keys[count++] = keys[i]
    }

    keys.length = count
    return keys
}

// Way faster, since typed array indices are always dense and contain
// numbers.

// Setup for `isBufferOrView` and `isView`
var ArrayBufferNone = 0
var ArrayBufferLegacy = 1
var ArrayBufferCurrent = 2

var arrayBufferSupport = (function () {
    if (!isFunction(global.Uint8Array)) return ArrayBufferNone
    if (!isFunction(global.DataView)) return ArrayBufferNone
    if (!isFunction(global.ArrayBuffer)) return ArrayBufferNone
    if (isFunction(global.ArrayBuffer.isView)) return ArrayBufferCurrent
    if (isFunction(global.ArrayBufferView)) return ArrayBufferLegacy
    return ArrayBufferNone
})()

// If typed arrays aren't supported (they weren't technically part of
// ES5, but many engines implemented Khronos' spec before ES6), then
// just fall back to generic buffer detection.

function floatIs(a, b) {
    // So NaNs are considered equal.
    return a === b || a !== a && b !== b // eslint-disable-line no-self-compare, max-len
}

function matchView(a, b) {
    var count = a.length

    if (count !== b.length) return false

    while (count) {
        count--
        if (!floatIs(a[count], b[count])) return false
    }

    return true
}

var isView = (function () {
    if (arrayBufferSupport === ArrayBufferNone) return undefined
    // ES6 typed arrays
    if (arrayBufferSupport === ArrayBufferCurrent) return ArrayBuffer.isView
    // legacy typed arrays
    return function isView(object) {
        return object instanceof ArrayBufferView
    }
})()

// Support checking maps and sets deeply. They are object-like enough to
// count, and are useful in their own right. The code is rather messy, but
// mainly to keep the order-independent checking from becoming insanely
// slow.
var supportsMap = isFunction(global.Map)
var supportsSet = isFunction(global.Set)

// One of the sets and both maps' keys are converted to arrays for faster
// handling.
function keyList(map) {
    var list = new Array(map.size)
    var i = 0
    var iter = map.keys()

    for (var next = iter.next(); !next.done; next = iter.next()) {
        list[i++] = next.value
    }

    return list
}

// The pair of arrays are aligned in a single O(n^2) operation (mod deep
// matching and rotation), adapting to O(n) when they're already aligned.
function matchKey(current, akeys, start, end, context, left, right) { // eslint-disable-line max-params, max-len
    for (var i = start + 1; i < end; i++) {
        var key = akeys[i]

        if (match(current, key, context, left, right)) {
            // TODO: once engines actually optimize `copyWithin`, use that
            // instead. It'll be much faster than this loop.
            while (i > start) akeys[i] = akeys[--i]
            akeys[i] = key
            return true
        }
    }

    return false
}

function matchValues(a, b, akeys, bkeys, end, context, left, right) { // eslint-disable-line max-params, max-len
    for (var i = 0; i < end; i++) {
        if (
            !match(a.get(akeys[i]), b.get(bkeys[i]), context, left, right)
        ) {
            return false
        }
    }

    return true
}

// Possibly expensive order-independent key-value match. First, try to avoid
// it by conservatively assuming everything is in order - a cheap O(n) is
// always nicer than an expensive O(n^2).
function matchMap(a, b, context, left, right) { // eslint-disable-line max-params, max-len
    var end = a.size
    var akeys = keyList(a)
    var bkeys = keyList(b)
    var i = 0

    while (i !== end && match(akeys[i], bkeys[i], context, left, right)) {
        i++
    }

    if (i === end) {
        return matchValues(a, b, akeys, bkeys, end, context, left, right)
    }

    // Don't compare the same key twice
    if (!matchKey(bkeys[i], akeys, i, end, context, left, right)) {
        return false
    }

    // If the above fails, while we're at it, let's sort them as we go, so
    // the key order matches.
    while (++i < end) {
        var key = bkeys[i]

        // Adapt if the keys are already in order, which is frequently the
        // case.
        if (!match(key, akeys[i], context, left, right) &&
                !matchKey(key, akeys, i, end, context, left, right)) {
            return false
        }
    }

    return matchValues(a, b, akeys, bkeys, end, context, left, right)
}

function hasAllIdentical(alist, b) {
    for (var i = 0; i < alist.length; i++) {
        if (!b.has(alist[i])) return false
    }

    return true
}

// Compare the values structurally, and independent of order.
function searchFor(avalue, objects, context, left, right) { // eslint-disable-line max-params, max-len
    for (var j in objects) {
        if (hasOwn.call(objects, j)) {
            if (match(avalue, objects[j], context, left, right)) {
                delete objects[j]
                return true
            }
        }
    }

    return false
}

function hasStructure(value, context) {
    return typeof value === "object" && value !== null ||
            !(context & Strict) && typeof value === "symbol"
}

// The set algorithm is structured a little differently. It takes one of the
// sets into an array, does a cheap identity check, then does the deep
// check.
function matchSet(a, b, context, left, right) { // eslint-disable-line max-params, max-len
    // This is to try to avoid an expensive structural match on the keys.
    // Test for identity first.
    var alist = keyList(a)

    if (hasAllIdentical(alist, b)) return true

    var iter = b.values()
    var count = 0
    var objects

    // Gather all the objects
    for (var next = iter.next(); !next.done; next = iter.next()) {
        var bvalue = next.value

        if (hasStructure(bvalue, context)) {
            // Create the objects map lazily. Note that this also grabs
            // Symbols when not strictly matching, since their description
            // is compared.
            if (count === 0) objects = Object.create(null)
            objects[count++] = bvalue
        }
    }

    // If everything is a primitive, then abort.
    if (count === 0) return false

    // Iterate the object, removing each one remaining when matched (and
    // aborting if none can be).
    for (var i = 0; i < count; i++) {
        var avalue = alist[i]

        if (hasStructure(avalue, context) &&
                !searchFor(avalue, objects, context, left, right)) {
            return false
        }
    }

    return true
}

function matchRegExp(a, b) {
    return a.source === b.source &&
        a.global === b.global &&
        a.ignoreCase === b.ignoreCase &&
        a.multiline === b.multiline &&
        (!supportsUnicode || a.unicode === b.unicode) &&
        (!supportsSticky || a.sticky === b.sticky)
}

function matchPrepareDescend(a, b, context, left, right) { // eslint-disable-line max-params, max-len
    // Check for circular references after the first level, where it's
    // redundant. Note that they have to point to the same level to actually
    // be considered deeply equal.
    if (!(context & Initial)) {
        var leftIndex = left.indexOf(a)
        var rightIndex = right.indexOf(b)

        if (leftIndex !== rightIndex) return false
        if (leftIndex >= 0) return true

        left.push(a)
        right.push(b)

        var result = matchInner(a, b, context, left, right)

        left.pop()
        right.pop()

        return result
    } else {
        return matchInner(a, b, context & ~Initial, [a], [b])
    }
}

function matchSameProto(a, b, context, left, right) { // eslint-disable-line max-params, max-len
    if (symbolsAreObjects && a instanceof Symbol) {
        return !(context & Strict) && a.toString() === b.toString()
    }

    if (a instanceof RegExp) return matchRegExp(a, b)
    if (a instanceof Date) return a.valueOf() === b.valueOf()
    if (arrayBufferSupport !== ArrayBufferNone) {
        if (a instanceof DataView) {
            return matchView(
                new Uint8Array(a.buffer, a.byteOffset, a.byteLength),
                new Uint8Array(b.buffer, b.byteOffset, b.byteLength))
        }
        if (a instanceof ArrayBuffer) {
            return matchView(new Uint8Array(a), new Uint8Array(b))
        }
        if (isView(a)) return matchView(a, b)
    }

    if (isBuffer(a)) return matchView(a, b)

    if (Array.isArray(a)) {
        if (a.length !== b.length) return false
        if (a.length === 0) return true
    } else if (supportsMap && a instanceof Map) {
        if (a.size !== b.size) return false
        if (a.size === 0) return true
    } else if (supportsSet && a instanceof Set) {
        if (a.size !== b.size) return false
        if (a.size === 0) return true
    } else if (objectToString.call(a) === "[object Arguments]") {
        if (objectToString.call(b) !== "[object Arguments]") return false
        if (a.length !== b.length) return false
        if (a.length === 0) return true
    } else if (objectToString.call(b) === "[object Arguments]") {
        return false
    }

    return matchPrepareDescend(a, b, context, left, right)
}

// Most special cases require both types to match, and if only one of them
// are, the objects themselves don't match.
function matchDifferentProto(a, b, context, left, right) { // eslint-disable-line max-params, max-len
    if (symbolsAreObjects) {
        if (a instanceof Symbol || b instanceof Symbol) return false
    }
    if (context & Strict) return false
    if (arrayBufferSupport !== ArrayBufferNone) {
        if (a instanceof ArrayBuffer || b instanceof ArrayBuffer) {
            return false
        }
        if (isView(a) || isView(b)) return false
    }
    if (Array.isArray(a) || Array.isArray(b)) return false
    if (supportsMap && (a instanceof Map || b instanceof Map)) return false
    if (supportsSet && (a instanceof Set || b instanceof Set)) return false
    if (objectToString.call(a) === "[object Arguments]") {
        if (objectToString.call(b) !== "[object Arguments]") return false
        if (a.length !== b.length) return false
        if (a.length === 0) return true
    }
    if (objectToString.call(b) === "[object Arguments]") return false
    return matchPrepareDescend(a, b, context, left, right)
}

function match(a, b, context, left, right) { // eslint-disable-line max-params, max-len
    if (a === b) return true
    // NaNs are equal
    if (a !== a) return b !== b // eslint-disable-line no-self-compare
    if (a === null || b === null) return false
    if (typeof a === "symbol" && typeof b === "symbol") {
        return !(context & Strict) && a.toString() === b.toString()
    }
    if (typeof a !== "object" || typeof b !== "object") return false

    // Usually, both objects have identical prototypes, and that allows for
    // half the type checking.
    if (Object.getPrototypeOf(a) === Object.getPrototypeOf(b)) {
        return matchSameProto(a, b, context | SameProto, left, right)
    } else {
        return matchDifferentProto(a, b, context, left, right)
    }
}

function matchArrayLike(a, b, context, left, right) { // eslint-disable-line max-params, max-len
    for (var i = 0; i < a.length; i++) {
        if (!match(a[i], b[i], context, left, right)) return false
    }

    return true
}

// PhantomJS and SlimerJS both have mysterious issues where `Error` is
// sometimes erroneously of a different `window`, and it shows up in the
// tests. This means I have to use a much slower algorithm to detect Errors.
//
// PhantomJS: https://github.com/petkaantonov/bluebird/issues/1146
// SlimerJS: https://github.com/laurentj/slimerjs/issues/400
//
// (Yes, the PhantomJS bug is detailed in the Bluebird issue tracker.)
var checkCrossOrigin = (function () {
    if (global.window == null || global.window.navigator == null) {
        return false
    }
    return /slimerjs|phantomjs/i.test(global.window.navigator.userAgent)
})()

var errorStringTypes = {
    "[object Error]": true,
    "[object EvalError]": true,
    "[object RangeError]": true,
    "[object ReferenceError]": true,
    "[object SyntaxError]": true,
    "[object TypeError]": true,
    "[object URIError]": true,
}

function isProxiedError(object) {
    while (object != null) {
        if (hasOwn.call(errorStringTypes, objectToString.call(object))) {
            return true
        }
        object = Object.getPrototypeOf(object)
    }

    return false
}

function matchInner(a, b, context, left, right) { // eslint-disable-line max-statements, max-params, max-len
    var akeys, bkeys
    var isUnproxiedError = false

    if (context & SameProto) {
        if (Array.isArray(a)) {
            return matchArrayLike(a, b, context, left, right)
        }

        if (supportsMap && a instanceof Map) {
            return matchMap(a, b, context, left, right)
        }

        if (supportsSet && a instanceof Set) {
            return matchSet(a, b, context, left, right)
        }

        if (objectToString.call(a) === "[object Arguments]") {
            return matchArrayLike(a, b, context, left, right)
        }

        if (requiresProxy &&
                (checkCrossOrigin ? isProxiedError(a)
                    : a instanceof Error)) {
            akeys = getKeysStripped(a)
            bkeys = getKeysStripped(b)
        } else {
            akeys = Object.keys(a)
            bkeys = Object.keys(b)
            isUnproxiedError = a instanceof Error
        }
    } else {
        if (objectToString.call(a) === "[object Arguments]") {
            return matchArrayLike(a, b, context, left, right)
        }

        // If we require a proxy, be permissive and check the `toString`
        // type. This is so it works cross-origin in PhantomJS in
        // particular.
        if (checkCrossOrigin ? isProxiedError(a) : a instanceof Error) {
            return false
        }
        akeys = Object.keys(a)
        bkeys = Object.keys(b)
    }

    var count = akeys.length

    if (count !== bkeys.length) return false

    // Shortcut if there's nothing to match
    if (count === 0) return true

    var i

    if (isUnproxiedError) {
        // Shortcut if the properties are different.
        for (i = 0; i < count; i++) {
            if (akeys[i] !== "stack") {
                if (!hasOwn.call(b, akeys[i])) return false
            }
        }

        // Verify that all the akeys' values matched.
        for (i = 0; i < count; i++) {
            if (akeys[i] !== "stack" &&
                    !match(a[akeys[i]], b[akeys[i]],
                        context, left, right)) {
                return false
            }
        }
    } else {
        // Shortcut if the properties are different.
        for (i = 0; i < count; i++) {
            if (!hasOwn.call(b, akeys[i])) return false
        }

        // Verify that all the akeys' values matched.
        for (i = 0; i < count; i++) {
            if (!match(a[akeys[i]], b[akeys[i]], context, left, right)) {
                return false
            }
        }
    }

    return true
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
module.exports = function (xs, f) {
    if (xs.map) return xs.map(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = xs[i];
        if (hasOwn.call(xs, i)) res.push(f(x, i, xs));
    }
    return res;
};

var hasOwn = Object.prototype.hasOwnProperty;

},{}],7:[function(require,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;

module.exports = function (xs, f, acc) {
    var hasAcc = arguments.length >= 3;
    if (hasAcc && xs.reduce) return xs.reduce(f, acc);
    if (xs.reduce) return xs.reduce(f);
    
    for (var i = 0; i < xs.length; i++) {
        if (!hasOwn.call(xs, i)) continue;
        if (!hasAcc) {
            acc = xs[i];
            hasAcc = true;
            continue;
        }
        acc = f(acc, xs[i], i);
    }
    return acc;
};

},{}],8:[function(require,module,exports){

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach (obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};


},{}],9:[function(require,module,exports){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],10:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],11:[function(require,module,exports){
(function (global){
/*! JSON v3.3.0 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
;(function (root) {
  // Detect the `define` function exposed by asynchronous module loaders. The
  // strict `define` check is necessary for compatibility with `r.js`.
  var isLoader = typeof define === "function" && define.amd;

  // Use the `global` object exposed by Node (including Browserify via
  // `insert-module-globals`), Narwhal, and Ringo as the default context.
  // Rhino exports a `global` function instead.
  var freeGlobal = typeof global == "object" && global;
  if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal)) {
    root = freeGlobal;
  }

  // Public: Initializes JSON 3 using the given `context` object, attaching the
  // `stringify` and `parse` functions to the specified `exports` object.
  function runInContext(context, exports) {
    context || (context = root["Object"]());
    exports || (exports = root["Object"]());

    // Native constructor aliases.
    var Number = context["Number"] || root["Number"],
        String = context["String"] || root["String"],
        Object = context["Object"] || root["Object"],
        Date = context["Date"] || root["Date"],
        SyntaxError = context["SyntaxError"] || root["SyntaxError"],
        TypeError = context["TypeError"] || root["TypeError"],
        Math = context["Math"] || root["Math"],
        nativeJSON = context["JSON"] || root["JSON"];

    // Delegate to the native `stringify` and `parse` implementations.
    if (typeof nativeJSON == "object" && nativeJSON) {
      exports.stringify = nativeJSON.stringify;
      exports.parse = nativeJSON.parse;
    }

    // Convenience aliases.
    var objectProto = Object.prototype,
        getClass = objectProto.toString,
        isProperty, forEach, undef;

    // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
    var isExtended = new Date(-3509827334573292);
    try {
      // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
      // results for certain dates in Opera >= 10.53.
      isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
        // Safari < 2.0.2 stores the internal millisecond time value correctly,
        // but clips the values returned by the date methods to the range of
        // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
        isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
    } catch (exception) {}

    // Internal: Determines whether the native `JSON.stringify` and `parse`
    // implementations are spec-compliant. Based on work by Ken Snyder.
    function has(name) {
      if (has[name] !== undef) {
        // Return cached feature test result.
        return has[name];
      }
      var isSupported;
      if (name == "bug-string-char-index") {
        // IE <= 7 doesn't support accessing string characters using square
        // bracket notation. IE 8 only supports this for primitives.
        isSupported = "a"[0] != "a";
      } else if (name == "json") {
        // Indicates whether both `JSON.stringify` and `JSON.parse` are
        // supported.
        isSupported = has("json-stringify") && has("json-parse");
      } else {
        var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
        // Test `JSON.stringify`.
        if (name == "json-stringify") {
          var stringify = exports.stringify, stringifySupported = typeof stringify == "function" && isExtended;
          if (stringifySupported) {
            // A test function object with a custom `toJSON` method.
            (value = function () {
              return 1;
            }).toJSON = value;
            try {
              stringifySupported =
                // Firefox 3.1b1 and b2 serialize string, number, and boolean
                // primitives as object literals.
                stringify(0) === "0" &&
                // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
                // literals.
                stringify(new Number()) === "0" &&
                stringify(new String()) == '""' &&
                // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
                // does not define a canonical JSON representation (this applies to
                // objects with `toJSON` properties as well, *unless* they are nested
                // within an object or array).
                stringify(getClass) === undef &&
                // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
                // FF 3.1b3 pass this test.
                stringify(undef) === undef &&
                // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
                // respectively, if the value is omitted entirely.
                stringify() === undef &&
                // FF 3.1b1, 2 throw an error if the given value is not a number,
                // string, array, object, Boolean, or `null` literal. This applies to
                // objects with custom `toJSON` methods as well, unless they are nested
                // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
                // methods entirely.
                stringify(value) === "1" &&
                stringify([value]) == "[1]" &&
                // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
                // `"[null]"`.
                stringify([undef]) == "[null]" &&
                // YUI 3.0.0b1 fails to serialize `null` literals.
                stringify(null) == "null" &&
                // FF 3.1b1, 2 halts serialization if an array contains a function:
                // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
                // elides non-JSON values from objects and arrays, unless they
                // define custom `toJSON` methods.
                stringify([undef, getClass, null]) == "[null,null,null]" &&
                // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
                // where character escape codes are expected (e.g., `\b` => `\u0008`).
                stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
                // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
                stringify(null, value) === "1" &&
                stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
                // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
                // serialize extended years.
                stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
                // The milliseconds are optional in ES 5, but required in 5.1.
                stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
                // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
                // four-digit years instead of six-digit years. Credits: @Yaffle.
                stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
                // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
                // values less than 1000. Credits: @Yaffle.
                stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
            } catch (exception) {
              stringifySupported = false;
            }
          }
          isSupported = stringifySupported;
        }
        // Test `JSON.parse`.
        if (name == "json-parse") {
          var parse = exports.parse;
          if (typeof parse == "function") {
            try {
              // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
              // Conforming implementations should also coerce the initial argument to
              // a string prior to parsing.
              if (parse("0") === 0 && !parse(false)) {
                // Simple parsing test.
                value = parse(serialized);
                var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
                if (parseSupported) {
                  try {
                    // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                    parseSupported = !parse('"\t"');
                  } catch (exception) {}
                  if (parseSupported) {
                    try {
                      // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                      // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                      // certain octal literals.
                      parseSupported = parse("01") !== 1;
                    } catch (exception) {}
                  }
                  if (parseSupported) {
                    try {
                      // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                      // points. These environments, along with FF 3.1b1 and 2,
                      // also allow trailing commas in JSON objects and arrays.
                      parseSupported = parse("1.") !== 1;
                    } catch (exception) {}
                  }
                }
              }
            } catch (exception) {
              parseSupported = false;
            }
          }
          isSupported = parseSupported;
        }
      }
      return has[name] = !!isSupported;
    }

    if (!has("json")) {
      // Common `[[Class]]` name aliases.
      var functionClass = "[object Function]",
          dateClass = "[object Date]",
          numberClass = "[object Number]",
          stringClass = "[object String]",
          arrayClass = "[object Array]",
          booleanClass = "[object Boolean]";

      // Detect incomplete support for accessing string characters by index.
      var charIndexBuggy = has("bug-string-char-index");

      // Define additional utility methods if the `Date` methods are buggy.
      if (!isExtended) {
        var floor = Math.floor;
        // A mapping between the months of the year and the number of days between
        // January 1st and the first of the respective month.
        var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        // Internal: Calculates the number of days between the Unix epoch and the
        // first day of the given month.
        var getDay = function (year, month) {
          return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
        };
      }

      // Internal: Determines if a property is a direct property of the given
      // object. Delegates to the native `Object#hasOwnProperty` method.
      if (!(isProperty = objectProto.hasOwnProperty)) {
        isProperty = function (property) {
          var members = {}, constructor;
          if ((members.__proto__ = null, members.__proto__ = {
            // The *proto* property cannot be set multiple times in recent
            // versions of Firefox and SeaMonkey.
            "toString": 1
          }, members).toString != getClass) {
            // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
            // supports the mutable *proto* property.
            isProperty = function (property) {
              // Capture and break the objectgs prototype chain (see section 8.6.2
              // of the ES 5.1 spec). The parenthesized expression prevents an
              // unsafe transformation by the Closure Compiler.
              var original = this.__proto__, result = property in (this.__proto__ = null, this);
              // Restore the original prototype chain.
              this.__proto__ = original;
              return result;
            };
          } else {
            // Capture a reference to the top-level `Object` constructor.
            constructor = members.constructor;
            // Use the `constructor` property to simulate `Object#hasOwnProperty` in
            // other environments.
            isProperty = function (property) {
              var parent = (this.constructor || constructor).prototype;
              return property in this && !(property in parent && this[property] === parent[property]);
            };
          }
          members = null;
          return isProperty.call(this, property);
        };
      }

      // Internal: A set of primitive types used by `isHostType`.
      var PrimitiveTypes = {
        "boolean": 1,
        "number": 1,
        "string": 1,
        "undefined": 1
      };

      // Internal: Determines if the given object `property` value is a
      // non-primitive.
      var isHostType = function (object, property) {
        var type = typeof object[property];
        return type == "object" ? !!object[property] : !PrimitiveTypes[type];
      };

      // Internal: Normalizes the `for...in` iteration algorithm across
      // environments. Each enumerated key is yielded to a `callback` function.
      forEach = function (object, callback) {
        var size = 0, Properties, members, property;

        // Tests for bugs in the current environment's `for...in` algorithm. The
        // `valueOf` property inherits the non-enumerable flag from
        // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
        (Properties = function () {
          this.valueOf = 0;
        }).prototype.valueOf = 0;

        // Iterate over a new instance of the `Properties` class.
        members = new Properties();
        for (property in members) {
          // Ignore all properties inherited from `Object.prototype`.
          if (isProperty.call(members, property)) {
            size++;
          }
        }
        Properties = members = null;

        // Normalize the iteration algorithm.
        if (!size) {
          // A list of non-enumerable properties inherited from `Object.prototype`.
          members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
          // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
          // properties.
          forEach = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, length;
            var hasProperty = !isFunction && typeof object.constructor != "function" && isHostType(object, "hasOwnProperty") ? object.hasOwnProperty : isProperty;
            for (property in object) {
              // Gecko <= 1.0 enumerates the `prototype` property of functions under
              // certain conditions; IE does not.
              if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
                callback(property);
              }
            }
            // Manually invoke the callback for each non-enumerable property.
            for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
          };
        } else if (size == 2) {
          // Safari <= 2.0.4 enumerates shadowed properties twice.
          forEach = function (object, callback) {
            // Create a set of iterated properties.
            var members = {}, isFunction = getClass.call(object) == functionClass, property;
            for (property in object) {
              // Store each property name to prevent double enumeration. The
              // `prototype` property of functions is not enumerated due to cross-
              // environment inconsistencies.
              if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
                callback(property);
              }
            }
          };
        } else {
          // No bugs detected; use the standard `for...in` algorithm.
          forEach = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, isConstructor;
            for (property in object) {
              if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
                callback(property);
              }
            }
            // Manually invoke the callback for the `constructor` property due to
            // cross-environment inconsistencies.
            if (isConstructor || isProperty.call(object, (property = "constructor"))) {
              callback(property);
            }
          };
        }
        return forEach(object, callback);
      };

      // Public: Serializes a JavaScript `value` as a JSON string. The optional
      // `filter` argument may specify either a function that alters how object and
      // array members are serialized, or an array of strings and numbers that
      // indicates which properties should be serialized. The optional `width`
      // argument may be either a string or number that specifies the indentation
      // level of the output.
      if (!has("json-stringify")) {
        // Internal: A map of control characters and their escaped equivalents.
        var Escapes = {
          92: "\\\\",
          34: '\\"',
          8: "\\b",
          12: "\\f",
          10: "\\n",
          13: "\\r",
          9: "\\t"
        };

        // Internal: Converts `value` into a zero-padded string such that its
        // length is at least equal to `width`. The `width` must be <= 6.
        var leadingZeroes = "000000";
        var toPaddedString = function (width, value) {
          // The `|| 0` expression is necessary to work around a bug in
          // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
          return (leadingZeroes + (value || 0)).slice(-width);
        };

        // Internal: Double-quotes a string `value`, replacing all ASCII control
        // characters (characters with code unit values between 0 and 31) with
        // their escaped equivalents. This is an implementation of the
        // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
        var unicodePrefix = "\\u00";
        var quote = function (value) {
          var result = '"', index = 0, length = value.length, useCharIndex = !charIndexBuggy || length > 10;
          var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
          for (; index < length; index++) {
            var charCode = value.charCodeAt(index);
            // If the character is a control character, append its Unicode or
            // shorthand escape sequence; otherwise, append the character as-is.
            switch (charCode) {
              case 8: case 9: case 10: case 12: case 13: case 34: case 92:
                result += Escapes[charCode];
                break;
              default:
                if (charCode < 32) {
                  result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                  break;
                }
                result += useCharIndex ? symbols[index] : value.charAt(index);
            }
          }
          return result + '"';
        };

        // Internal: Recursively serializes an object. Implements the
        // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
        var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
          var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
          try {
            // Necessary for host object support.
            value = object[property];
          } catch (exception) {}
          if (typeof value == "object" && value) {
            className = getClass.call(value);
            if (className == dateClass && !isProperty.call(value, "toJSON")) {
              if (value > -1 / 0 && value < 1 / 0) {
                // Dates are serialized according to the `Date#toJSON` method
                // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
                // for the ISO 8601 date time string format.
                if (getDay) {
                  // Manually compute the year, month, date, hours, minutes,
                  // seconds, and milliseconds if the `getUTC*` methods are
                  // buggy. Adapted from @Yaffle's `date-shim` project.
                  date = floor(value / 864e5);
                  for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
                  for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
                  date = 1 + date - getDay(year, month);
                  // The `time` value specifies the time within the day (see ES
                  // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
                  // to compute `A modulo B`, as the `%` operator does not
                  // correspond to the `modulo` operation for negative numbers.
                  time = (value % 864e5 + 864e5) % 864e5;
                  // The hours, minutes, seconds, and milliseconds are obtained by
                  // decomposing the time within the day. See section 15.9.1.10.
                  hours = floor(time / 36e5) % 24;
                  minutes = floor(time / 6e4) % 60;
                  seconds = floor(time / 1e3) % 60;
                  milliseconds = time % 1e3;
                } else {
                  year = value.getUTCFullYear();
                  month = value.getUTCMonth();
                  date = value.getUTCDate();
                  hours = value.getUTCHours();
                  minutes = value.getUTCMinutes();
                  seconds = value.getUTCSeconds();
                  milliseconds = value.getUTCMilliseconds();
                }
                // Serialize extended years correctly.
                value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
                  "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
                  // Months, dates, hours, minutes, and seconds should have two
                  // digits; milliseconds should have three.
                  "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
                  // Milliseconds are optional in ES 5.0, but required in 5.1.
                  "." + toPaddedString(3, milliseconds) + "Z";
              } else {
                value = null;
              }
            } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
              // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
              // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
              // ignores all `toJSON` methods on these objects unless they are
              // defined directly on an instance.
              value = value.toJSON(property);
            }
          }
          if (callback) {
            // If a replacement function was provided, call it to obtain the value
            // for serialization.
            value = callback.call(object, property, value);
          }
          if (value === null) {
            return "null";
          }
          className = getClass.call(value);
          if (className == booleanClass) {
            // Booleans are represented literally.
            return "" + value;
          } else if (className == numberClass) {
            // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
            // `"null"`.
            return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
          } else if (className == stringClass) {
            // Strings are double-quoted and escaped.
            return quote("" + value);
          }
          // Recursively serialize objects and arrays.
          if (typeof value == "object") {
            // Check for cyclic structures. This is a linear search; performance
            // is inversely proportional to the number of unique nested objects.
            for (length = stack.length; length--;) {
              if (stack[length] === value) {
                // Cyclic structures cannot be serialized by `JSON.stringify`.
                throw TypeError();
              }
            }
            // Add the object to the stack of traversed objects.
            stack.push(value);
            results = [];
            // Save the current indentation level and indent one additional level.
            prefix = indentation;
            indentation += whitespace;
            if (className == arrayClass) {
              // Recursively serialize array elements.
              for (index = 0, length = value.length; index < length; index++) {
                element = serialize(index, value, callback, properties, whitespace, indentation, stack);
                results.push(element === undef ? "null" : element);
              }
              result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
            } else {
              // Recursively serialize object members. Members are selected from
              // either a user-specified list of property names, or the object
              // itself.
              forEach(properties || value, function (property) {
                var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                if (element !== undef) {
                  // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                  // is not the empty string, let `member` {quote(property) + ":"}
                  // be the concatenation of `member` and the `space` character."
                  // The "`space` character" refers to the literal space
                  // character, not the `space` {width} argument provided to
                  // `JSON.stringify`.
                  results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                }
              });
              result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
            }
            // Remove the object from the traversed object stack.
            stack.pop();
            return result;
          }
        };

        // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
        exports.stringify = function (source, filter, width) {
          var whitespace, callback, properties, className;
          if (typeof filter == "function" || typeof filter == "object" && filter) {
            if ((className = getClass.call(filter)) == functionClass) {
              callback = filter;
            } else if (className == arrayClass) {
              // Convert the property names array into a makeshift set.
              properties = {};
              for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
            }
          }
          if (width) {
            if ((className = getClass.call(width)) == numberClass) {
              // Convert the `width` to an integer and create a string containing
              // `width` number of space characters.
              if ((width -= width % 1) > 0) {
                for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
              }
            } else if (className == stringClass) {
              whitespace = width.length <= 10 ? width : width.slice(0, 10);
            }
          }
          // Opera <= 7.54u2 discards the values associated with empty string keys
          // (`""`) only if they are used directly within an object member list
          // (e.g., `!("" in { "": 1})`).
          return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
        };
      }

      // Public: Parses a JSON source string.
      if (!has("json-parse")) {
        var fromCharCode = String.fromCharCode;

        // Internal: A map of escaped control characters and their unescaped
        // equivalents.
        var Unescapes = {
          92: "\\",
          34: '"',
          47: "/",
          98: "\b",
          116: "\t",
          110: "\n",
          102: "\f",
          114: "\r"
        };

        // Internal: Stores the parser state.
        var Index, Source;

        // Internal: Resets the parser state and throws a `SyntaxError`.
        var abort = function () {
          Index = Source = null;
          throw SyntaxError();
        };

        // Internal: Returns the next token, or `"$"` if the parser has reached
        // the end of the source string. A token may be a string, number, `null`
        // literal, or Boolean literal.
        var lex = function () {
          var source = Source, length = source.length, value, begin, position, isSigned, charCode;
          while (Index < length) {
            charCode = source.charCodeAt(Index);
            switch (charCode) {
              case 9: case 10: case 13: case 32:
                // Skip whitespace tokens, including tabs, carriage returns, line
                // feeds, and space characters.
                Index++;
                break;
              case 123: case 125: case 91: case 93: case 58: case 44:
                // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
                // the current position.
                value = charIndexBuggy ? source.charAt(Index) : source[Index];
                Index++;
                return value;
              case 34:
                // `"` delimits a JSON string; advance to the next character and
                // begin parsing the string. String tokens are prefixed with the
                // sentinel `@` character to distinguish them from punctuators and
                // end-of-string tokens.
                for (value = "@", Index++; Index < length;) {
                  charCode = source.charCodeAt(Index);
                  if (charCode < 32) {
                    // Unescaped ASCII control characters (those with a code unit
                    // less than the space character) are not permitted.
                    abort();
                  } else if (charCode == 92) {
                    // A reverse solidus (`\`) marks the beginning of an escaped
                    // control character (including `"`, `\`, and `/`) or Unicode
                    // escape sequence.
                    charCode = source.charCodeAt(++Index);
                    switch (charCode) {
                      case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
                        // Revive escaped control characters.
                        value += Unescapes[charCode];
                        Index++;
                        break;
                      case 117:
                        // `\u` marks the beginning of a Unicode escape sequence.
                        // Advance to the first character and validate the
                        // four-digit code point.
                        begin = ++Index;
                        for (position = Index + 4; Index < position; Index++) {
                          charCode = source.charCodeAt(Index);
                          // A valid sequence comprises four hexdigits (case-
                          // insensitive) that form a single hexadecimal value.
                          if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                            // Invalid Unicode escape sequence.
                            abort();
                          }
                        }
                        // Revive the escaped character.
                        value += fromCharCode("0x" + source.slice(begin, Index));
                        break;
                      default:
                        // Invalid escape sequence.
                        abort();
                    }
                  } else {
                    if (charCode == 34) {
                      // An unescaped double-quote character marks the end of the
                      // string.
                      break;
                    }
                    charCode = source.charCodeAt(Index);
                    begin = Index;
                    // Optimize for the common case where a string is valid.
                    while (charCode >= 32 && charCode != 92 && charCode != 34) {
                      charCode = source.charCodeAt(++Index);
                    }
                    // Append the string as-is.
                    value += source.slice(begin, Index);
                  }
                }
                if (source.charCodeAt(Index) == 34) {
                  // Advance to the next character and return the revived string.
                  Index++;
                  return value;
                }
                // Unterminated string.
                abort();
              default:
                // Parse numbers and literals.
                begin = Index;
                // Advance past the negative sign, if one is specified.
                if (charCode == 45) {
                  isSigned = true;
                  charCode = source.charCodeAt(++Index);
                }
                // Parse an integer or floating-point value.
                if (charCode >= 48 && charCode <= 57) {
                  // Leading zeroes are interpreted as octal literals.
                  if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
                    // Illegal octal literal.
                    abort();
                  }
                  isSigned = false;
                  // Parse the integer component.
                  for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
                  // Floats cannot contain a leading decimal point; however, this
                  // case is already accounted for by the parser.
                  if (source.charCodeAt(Index) == 46) {
                    position = ++Index;
                    // Parse the decimal component.
                    for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                    if (position == Index) {
                      // Illegal trailing decimal.
                      abort();
                    }
                    Index = position;
                  }
                  // Parse exponents. The `e` denoting the exponent is
                  // case-insensitive.
                  charCode = source.charCodeAt(Index);
                  if (charCode == 101 || charCode == 69) {
                    charCode = source.charCodeAt(++Index);
                    // Skip past the sign following the exponent, if one is
                    // specified.
                    if (charCode == 43 || charCode == 45) {
                      Index++;
                    }
                    // Parse the exponential component.
                    for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                    if (position == Index) {
                      // Illegal empty exponent.
                      abort();
                    }
                    Index = position;
                  }
                  // Coerce the parsed value to a JavaScript number.
                  return +source.slice(begin, Index);
                }
                // A negative sign may only precede numbers.
                if (isSigned) {
                  abort();
                }
                // `true`, `false`, and `null` literals.
                if (source.slice(Index, Index + 4) == "true") {
                  Index += 4;
                  return true;
                } else if (source.slice(Index, Index + 5) == "false") {
                  Index += 5;
                  return false;
                } else if (source.slice(Index, Index + 4) == "null") {
                  Index += 4;
                  return null;
                }
                // Unrecognized token.
                abort();
            }
          }
          // Return the sentinel `$` character if the parser has reached the end
          // of the source string.
          return "$";
        };

        // Internal: Parses a JSON `value` token.
        var get = function (value) {
          var results, hasMembers;
          if (value == "$") {
            // Unexpected end of input.
            abort();
          }
          if (typeof value == "string") {
            if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
              // Remove the sentinel `@` character.
              return value.slice(1);
            }
            // Parse object and array literals.
            if (value == "[") {
              // Parses a JSON array, returning a new JavaScript array.
              results = [];
              for (;; hasMembers || (hasMembers = true)) {
                value = lex();
                // A closing square bracket marks the end of the array literal.
                if (value == "]") {
                  break;
                }
                // If the array literal contains elements, the current token
                // should be a comma separating the previous element from the
                // next.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "]") {
                      // Unexpected trailing `,` in array literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each array element.
                    abort();
                  }
                }
                // Elisions and leading commas are not permitted.
                if (value == ",") {
                  abort();
                }
                results.push(get(value));
              }
              return results;
            } else if (value == "{") {
              // Parses a JSON object, returning a new JavaScript object.
              results = {};
              for (;; hasMembers || (hasMembers = true)) {
                value = lex();
                // A closing curly brace marks the end of the object literal.
                if (value == "}") {
                  break;
                }
                // If the object literal contains members, the current token
                // should be a comma separator.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "}") {
                      // Unexpected trailing `,` in object literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each object member.
                    abort();
                  }
                }
                // Leading commas are not permitted, object property names must be
                // double-quoted strings, and a `:` must separate each property
                // name and value.
                if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                  abort();
                }
                results[value.slice(1)] = get(lex());
              }
              return results;
            }
            // Unexpected token encountered.
            abort();
          }
          return value;
        };

        // Internal: Updates a traversed object member.
        var update = function (source, property, callback) {
          var element = walk(source, property, callback);
          if (element === undef) {
            delete source[property];
          } else {
            source[property] = element;
          }
        };

        // Internal: Recursively traverses a parsed JSON object, invoking the
        // `callback` function for each value. This is an implementation of the
        // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
        var walk = function (source, property, callback) {
          var value = source[property], length;
          if (typeof value == "object" && value) {
            // `forEach` can't be used to traverse an array in Opera <= 8.54
            // because its `Object#hasOwnProperty` implementation returns `false`
            // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
            if (getClass.call(value) == arrayClass) {
              for (length = value.length; length--;) {
                update(value, length, callback);
              }
            } else {
              forEach(value, function (property) {
                update(value, property, callback);
              });
            }
          }
          return callback.call(source, property, value);
        };

        // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
        exports.parse = function (source, callback) {
          var result, value;
          Index = 0;
          Source = "" + source;
          result = get(lex());
          // If a JSON string contains multiple tokens, it is invalid.
          if (lex() != "$") {
            abort();
          }
          // Reset the parser state.
          Index = Source = null;
          return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
        };
      }
    }

    exports["runInContext"] = runInContext;
    return exports;
  }

  if (typeof exports == "object" && exports && !exports.nodeType && !isLoader) {
    // Export for CommonJS environments.
    runInContext(root, exports);
  } else {
    // Export for web browsers and JavaScript engines.
    var nativeJSON = root.JSON;
    var JSON3 = runInContext(root, (root["JSON3"] = {
      // Public: Restores the original value of the global `JSON` object and
      // returns a reference to the `JSON3` object.
      "noConflict": function () {
        root.JSON = nativeJSON;
        return JSON3;
      }
    }));

    root.JSON = {
      "parse": JSON3.parse,
      "stringify": JSON3.stringify
    };
  }

  // Export for asynchronous module loaders.
  if (isLoader) {
    define(function () {
      return JSON3;
    });
  }
}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],12:[function(require,module,exports){

/**
 * Module dependencies.
 */

var map = require('array-map');
var indexOf = require('indexof');
var isArray = require('isarray');
var forEach = require('foreach');
var reduce = require('array-reduce');
var getObjectKeys = require('object-keys');
var JSON = require('json3');

/**
 * Make sure `Object.keys` work for `undefined`
 * values that are still there, like `document.all`.
 * http://lists.w3.org/Archives/Public/public-html/2009Jun/0546.html
 *
 * @api private
 */

function objectKeys(val){
  if (Object.keys) return Object.keys(val);
  return getObjectKeys(val);
}

/**
 * Module exports.
 */

module.exports = inspect;

/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 * @license MIT (© Joyent)
 */
/* legacy: obj, showHidden, depth, colors*/

function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    _extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}

// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};

function stylizeNoColor(str, styleType) {
  return str;
}

function isBoolean(arg) {
  return typeof arg === 'boolean';
}

function isUndefined(arg) {
  return arg === void 0;
}

function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}

function isFunction(arg) {
  return typeof arg === 'function';
}

function isString(arg) {
  return typeof arg === 'string';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isNull(arg) {
  return arg === null;
}

function hasOwn(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function arrayToHash(array) {
  var hash = {};

  forEach(array, function(val, idx) {
    hash[val] = true;
  });

  return hash;
}

function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwn(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  forEach(keys, function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}

function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}

function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = objectKeys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden && Object.getOwnPropertyNames) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (indexOf(keys, 'message') >= 0 || indexOf(keys, 'description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = map(keys, function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}

function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = { value: value[key] };
  if (Object.getOwnPropertyDescriptor) {
    desc = Object.getOwnPropertyDescriptor(value, key) || desc;
  }
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwn(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (indexOf(ctx.seen, desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = map(str.split('\n'), function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + map(str.split('\n'), function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}

function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}

function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = reduce(output, function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}

function _extend(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = objectKeys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
}

},{"array-map":6,"array-reduce":7,"foreach":8,"indexof":9,"isarray":10,"json3":11,"object-keys":14}],13:[function(require,module,exports){
"use strict";

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

var isFunction = function (fn) {
	return (typeof fn === 'function' && !(fn instanceof RegExp)) || toString.call(fn) === '[object Function]';
};

module.exports = function forEach(obj, fn) {
	if (!isFunction(fn)) {
		throw new TypeError('iterator must be a function');
	}
	var i, k,
		isString = typeof obj === 'string',
		l = obj.length,
		context = arguments.length > 2 ? arguments[2] : null;
	if (l === +l) {
		for (i = 0; i < l; i++) {
			if (context === null) {
				fn(isString ? obj.charAt(i) : obj[i], i, obj);
			} else {
				fn.call(context, isString ? obj.charAt(i) : obj[i], i, obj);
			}
		}
	} else {
		for (k in obj) {
			if (hasOwn.call(obj, k)) {
				if (context === null) {
					fn(obj[k], k, obj);
				} else {
					fn.call(context, obj[k], k, obj);
				}
			}
		}
	}
};


},{}],14:[function(require,module,exports){
"use strict";

// modified from https://github.com/es-shims/es5-shim
var has = Object.prototype.hasOwnProperty,
	toString = Object.prototype.toString,
	forEach = require('./foreach'),
	isArgs = require('./isArguments'),
	hasDontEnumBug = !({'toString': null}).propertyIsEnumerable('toString'),
	hasProtoEnumBug = (function () {}).propertyIsEnumerable('prototype'),
	dontEnums = [
		"toString",
		"toLocaleString",
		"valueOf",
		"hasOwnProperty",
		"isPrototypeOf",
		"propertyIsEnumerable",
		"constructor"
	];

var keysShim = function keys(object) {
	var isObject = object !== null && typeof object === 'object',
		isFunction = toString.call(object) === '[object Function]',
		isArguments = isArgs(object),
		theKeys = [];

	if (!isObject && !isFunction && !isArguments) {
		throw new TypeError("Object.keys called on a non-object");
	}

	if (isArguments) {
		forEach(object, function (value, index) {
			theKeys.push(index);
		});
	} else {
		var name,
			skipProto = hasProtoEnumBug && isFunction;

		for (name in object) {
			if (!(skipProto && name === 'prototype') && has.call(object, name)) {
				theKeys.push(name);
			}
		}
	}

	if (hasDontEnumBug) {
		var ctor = object.constructor,
			skipConstructor = ctor && ctor.prototype === object;

		forEach(dontEnums, function (dontEnum) {
			if (!(skipConstructor && dontEnum === 'constructor') && has.call(object, dontEnum)) {
				theKeys.push(dontEnum);
			}
		});
	}
	return theKeys;
};

keysShim.shim = function shimObjectKeys() {
	if (!Object.keys) {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;


},{"./foreach":13,"./isArguments":15}],15:[function(require,module,exports){
"use strict";

var toString = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toString.call(value);
	var isArguments = str === '[object Arguments]';
	if (!isArguments) {
		isArguments = str !== '[object Array]'
			&& value !== null
			&& typeof value === 'object'
			&& typeof value.length === 'number'
			&& value.length >= 0
			&& toString.call(value.callee) === '[object Function]';
	}
	return isArguments;
};


},{}]},{},[1]);
