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

var equalsAnyTemplates = [
    "Expected {actual} to equal one of {coll}",
    "Expected {actual} to not equal one of {coll}",
]

function makeEqualsAny(type, index) {
    return function (actual, coll) {
        checkCollection(coll, "coll")

        if (comparison.simpleIncludes(
            comparison.arrayFrom(coll), actual, type
        ) === (index !== 0)) {
            failFormat(
                equalsAnyTemplates[index],
                {actual: actual, coll: coll}
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
 * Pretty much all the assertion methods fit within a single multi-dimensional
 * matrix documented within `docs/README.md`.
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

exports.equalsAny = makeEqualsAny(match.loose, 0)
exports.equalsNone = makeEqualsAny(match.loose, 1)

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

exports.exactlyEqualsAny = makeEqualsAny(comparison.sameValueZero, 0)
exports.exactlyEqualsNone = makeEqualsAny(comparison.sameValueZero, 1)

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

exports.deeplyEqualsAny = makeEqualsAny(match.strict, 0)
exports.deeplyEqualsNone = makeEqualsAny(match.strict, 1)

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
