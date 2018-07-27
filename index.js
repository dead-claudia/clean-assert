"use strict"

/**
 * Core TDD-style assertions. These are done by a composition of DSLs, since
 * there is *so* much repetition. Also, this is split into several namespaces to
 * keep the file size manageable.
 */

var match = require("./match")
var inspect = require("./inspect")

var hasOwn = Object.prototype.hasOwnProperty

var AssertionError

// PhantomJS, IE, and possibly Edge don't set the stack trace until the error is
// thrown. Note that this prefers an existing stack first, since non-native
// errors likely already contain this.
function getStack(e) {
    var stack = e.stack

    if (!(e instanceof Error) || stack != null) return stack

    try {
        throw e
    } catch (e) {
        return e.stack
    }
}

try {
    AssertionError = new Function([ // eslint-disable-line no-new-func
        "'use strict';",
        "class AssertionError extends Error {",
        "    constructor(message, actual, expected) {",
        "        super(message)",
        "        this.actual = actual",
        "        this.expected = expected",
        "    }",
        "",
        "    get name() {",
        "        return 'AssertionError'",
        "    }",
        "}",
        // check native subclassing support
        "new AssertionError('message', 1, 2)",
        "return AssertionError",
    ].join("\n"))()
} catch (e) {
    AssertionError = typeof Error.captureStackTrace === "function"
        ? function AssertionError(message, actual, expected) {
            this.message = message || ""
            this.expected = expected
            this.actual = actual
            Error.captureStackTrace(this, this.constructor)
        }
        : function AssertionError(message, actual, expected) {
            this.message = message || ""
            this.expected = expected
            this.actual = actual
            var e = new Error(message)

            e.name = "AssertionError"
            this.stack = getStack(e)
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

/* eslint-disable no-self-compare */
// For better NaN handling
function strictIs(a, b) {
    return a === b || a !== a && b !== b
}

function looseIs(a, b) {
    return a == b || a !== a && b !== b // eslint-disable-line eqeqeq
}

/* eslint-enable no-self-compare */

var templateRegexp = /(.?)\{(.+?)\}/g

exports.escape = escape
function escape(string) {
    if (typeof string !== "string") {
        throw new TypeError("`string` must be a string")
    }

    return string.replace(templateRegexp, function (m, pre) {
        return pre + "\\" + m.slice(1)
    })
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

    if (typeof prettify !== "function") {
        throw new TypeError("`prettify` must be a function if passed")
    }

    return message.replace(templateRegexp, function (m, pre, prop) {
        if (pre === "\\") {
            return m.slice(1)
        } else if (hasOwn.call(opts, prop)) {
            return pre + prettify(opts[prop], {depth: 5})
        } else {
            return pre + m
        }
    })
}

// The basic assert, like `assert.ok`, but gives you an optional message.
exports.assert = assert
function assert(test, message, actual, expected) {
    if (!test) {
        if (arguments.length > 2) {
            message = format(message, {
                actual: actual, expected: expected,
            })
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

function isReferenceType(object) {
    return object != null && (
        typeof object === "function" ||
        typeof object === "object"
    )
}

var symbolIterator = "@@iterator"

/* eslint-disable no-undef */
if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    symbolIterator = Symbol.iterator
}
/* eslint-enable no-undef */

function isIterable(object) {
    return typeof object[symbolIterator] === "function"
}

var from = Array.from || function (iter) {
    var array = []
    var iterator = iter[symbolIterator]()
    var step

    while (!(step = iterator.next()).done) {
        array.push(step.value)
    }

    return array
}

function castIfIterable(array) {
    if (Array.isArray(array)) return array
    if (!isIterable(array)) return array
    return from(array)
}

function castIterableChecked(array) {
    if (Array.isArray(array)) return array
    if (!isIterable(array)) return undefined
    return from(array)
}

function throwsMatchTest(matcher, e) {
    if (typeof matcher === "string") return e.message === matcher
    if (typeof matcher === "function") return !!matcher(e)
    if (matcher instanceof RegExp) return !!matcher.test(e.message)

    var keys = Object.keys(matcher)

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i]

        if (!(key in e) || !strictIs(matcher[key], e[key])) return false
    }

    return true
}

function isPlainObject(object) {
    return object == null || Object.getPrototypeOf(object) === Object.prototype
}

function checkNumber(value, name) {
    if (typeof value !== "number") {
        throw new TypeError("`" + name + "` must be a number")
    }
}

exports.inspect = inspect
exports.matchLoose = match.loose
exports.matchStrict = match.strict

exports.ok = function (x) {
    assert(x, "Expected {actual} to be truthy", x)
}

exports.notOk = function (x) {
    assert(!x, "Expected {actual} to be falsy", x)
}

exports.isBoolean = function (x) {
    assert(typeof x === "boolean", "Expected {actual} to be a boolean", x)
}

exports.notBoolean = function (x) {
    assert(typeof x !== "boolean", "Expected {actual} to not be a boolean", x)
}

exports.isFunction = function (x) {
    assert(typeof x === "function", "Expected {actual} to be a function", x)
}

exports.notFunction = function (x) {
    assert(typeof x !== "function", "Expected {actual} to not be a function", x)
}

exports.isNumber = function (x) {
    assert(typeof x === "number", "Expected {actual} to not be a number", x)
}

exports.notNumber = function (x) {
    assert(typeof x !== "number", "Expected {actual} to be a number", x)
}

exports.isObject = function (x) {
    assert(
        typeof x === "object" && x != null,
        "Expected {actual} to not be an object", x
    )
}

exports.notObject = function (x) {
    assert(
        typeof x !== "object" || x == null,
        "Expected {actual} to be an object", x
    )
}

exports.isString = function (x) {
    assert(typeof x === "string", "Expected {actual} to not be a string", x)
}

exports.notString = function (x) {
    assert(typeof x !== "string", "Expected {actual} to be a string", x)
}

exports.isSymbol = function (x) {
    assert(typeof x === "symbol", "Expected {actual} to not be a symbol", x)
}

exports.notSymbol = function (x) {
    assert(typeof x !== "symbol", "Expected {actual} to be a symbol", x)
}

exports.exists = function (x) {
    assert(x != null, "Expected {actual} to exist", x)
}

exports.notExists = function (x) {
    assert(x == null, "Expected {actual} to not exist", x)
}

exports.isArray = function (x) {
    assert(Array.isArray(x), "Expected {actual} to not be an array", x)
}

exports.notArray = function (x) {
    assert(!Array.isArray(x), "Expected {actual} to be an array", x)
}

exports.isIterable = function (x) {
    assert(
        isReferenceType(x) && isIterable(x),
        "Expected {actual} to not be an iterable", x
    )
}

exports.notIterable = function (x) {
    assert(
        !isReferenceType(x) || !isIterable(x),
        "Expected {actual} to be an iterable", x
    )
}

exports.is = function (Type, object) {
    if (typeof Type !== "function") {
        throw new TypeError("`Type` must be a function")
    }

    if (!(object instanceof Type)) {
        failFormat(
            "Expected {object} to be an instance of {expected}",
            {actual: object.constructor, expected: Type, object: object}
        )
    }
}

exports.not = function (Type, object) {
    if (typeof Type !== "function") {
        throw new TypeError("`Type` must be a function")
    }

    if (object instanceof Type) {
        failFormat(
            "Expected {object} to not be an instance of {expected}",
            {actual: object.constructor, expected: Type, object: object}
        )
    }
}

exports.equal = function (actual, expected) {
    assert(strictIs(actual, expected),
        "Expected {actual} to equal {expected}",
        actual, expected
    )
}

exports.notEqual = function (actual, expected) {
    assert(!strictIs(actual, expected),
        "Expected {actual} to not equal {expected}",
        actual, expected
    )
}

exports.equalLoose = function (actual, expected) {
    assert(looseIs(actual, expected),
        "Expected {actual} to loosely equal {expected}",
        actual, expected
    )
}

exports.notEqualLoose = function (actual, expected) {
    assert(!looseIs(actual, expected),
        "Expected {actual} to not loosely equal {expected}",
        actual, expected
    )
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

    // The negation is to address NaNs as well, without writing a ton of special
    // case boilerplate
    if (!(actual >= lower && actual <= upper)) {
        failFormat(
            "Expected {actual} to be between {lower} and {upper}",
            {actual: actual, lower: lower, upper: upper}
        )
    }
}

exports.deepEqual = function (actual, expected) {
    assert(match.strict(actual, expected),
        "Expected {actual} to deeply equal {expected}",
        actual, expected
    )
}

exports.notDeepEqual = function (actual, expected) {
    assert(!match.strict(actual, expected),
        "Expected {actual} to not deeply equal {expected}",
        actual, expected
    )
}

exports.match = function (actual, expected) {
    assert(match.loose(actual, expected),
        "Expected {actual} to match {expected}",
        actual, expected
    )
}

exports.notMatch = function (actual, expected) {
    assert(!match.loose(actual, expected),
        "Expected {actual} to not match {expected}",
        actual, expected
    )
}

// Uses division to allow for a more robust comparison of floats. Also, this
// handles near-zero comparisons correctly, as well as a zero tolerance (i.e.
// exact comparison).
function closeTo(actual, expected, tolerance) {
    if (tolerance === Infinity || actual === expected) return true
    if (tolerance === 0) return false
    if (actual === 0) return Math.abs(expected) < tolerance
    if (expected === 0) return Math.abs(actual) < tolerance
    return Math.abs(expected / actual - 1) < tolerance
}

// Note: these two always _fail when dealing with NaNs.
exports.closeTo = function (actual, expected, tolerance) {
    checkNumber(actual, "actual")
    checkNumber(expected, "expected")
    if (tolerance == null) tolerance = 1e-10
    checkNumber(tolerance, "tolerance")

    if (tolerance < 0) {
        throw new RangeError("`tolerance` must be non-negative")
    }

    assert(
        // eslint-disable-next-line no-self-compare
        actual === actual && expected === expected &&
        closeTo(actual, expected, tolerance),
        "Expected {actual} to be close to {expected}",
        actual, expected
    )
}

exports.notCloseTo = function (actual, expected, tolerance) {
    checkNumber(actual, "actual")
    checkNumber(expected, "expected")
    if (tolerance == null) tolerance = 1e-10
    checkNumber(tolerance, "tolerance")

    if (tolerance < 0) {
        throw new RangeError("`tolerance` must be non-negative")
    }

    assert(
        // eslint-disable-next-line no-self-compare
        actual === actual && expected === expected &&
        !closeTo(actual, expected, tolerance),
        "Expected {actual} to not be close to {expected}",
        actual, expected
    )
}

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

    try {
        callback() // eslint-disable-line callback-return
    } catch (e) {
        assert(Type == null || e instanceof Type,
            "Expected callback to throw an instance of {expected}, " +
            "but found {actual}",
            e, Type
        )
        return
    }

    throw new AssertionError("Expected callback to throw")
}

exports.throwsMatch = function (matcher, callback) {
    if (typeof matcher !== "string" &&
            typeof matcher !== "function" &&
            !(matcher instanceof RegExp) &&
            !isPlainObject(matcher)) {
        throw new TypeError(
            "`matcher` must be a string, function, RegExp, or object")
    }

    if (typeof callback !== "function") {
        throw new TypeError("`callback` must be a function")
    }

    try {
        callback() // eslint-disable-line callback-return
    } catch (e) {
        assert(throwsMatchTest(matcher, e),
            "Expected callback to throw an error that matches " +
            "{expected}, but found {actual}",
            e, matcher
        )
        return
    }

    throw new AssertionError("Expected callback to throw.")
}

function has(_) { // eslint-disable-line max-len, max-params
    return function (object, key, value) {
        if (arguments.length >= 3) {
            if (!_.has(object, key) || !strictIs(_.get(object, key), value)) {
                failFormat(_.messages[0], {
                    expected: value,
                    actual: object[key],
                    key: key,
                    object: object,
                })
            }
        } else if (!_.has(object, key)) {
            failFormat(_.messages[1], {
                expected: value,
                actual: object[key],
                key: key,
                object: object,
            })
        }
    }
}

function hasLoose(_) {
    return function (object, key, value) {
        if (!_.has(object, key) || !looseIs(_.get(object, key), value)) {
            failFormat(_.messages[0], {
                expected: value,
                actual: object[key],
                key: key,
                object: object,
            })
        }
    }
}

function notHas(_) { // eslint-disable-line max-len, max-params
    return function (object, key, value) {
        if (arguments.length >= 3) {
            if (_.has(object, key) && strictIs(_.get(object, key), value)) {
                failFormat(_.messages[2], {
                    expected: value,
                    actual: object[key],
                    key: key,
                    object: object,
                })
            }
        } else if (_.has(object, key)) {
            failFormat(_.messages[3], {
                expected: value,
                actual: object[key],
                key: key,
                object: object,
            })
        }
    }
}

function notHasLoose(_) { // eslint-disable-line max-len, max-params
    return function (object, key, value) {
        if (_.has(object, key) && looseIs(_.get(object, key), value)) {
            failFormat(_.messages[2], {
                expected: value,
                actual: object[key],
                key: key,
                object: object,
            })
        }
    }
}

function hasOwnKey(object, key) { return hasOwn.call(object, key) }
function hasInKey(object, key) { return key in object }
function hasInColl(object, key) { return object.has(key) }
function hasObjectGet(object, key) { return object[key] }
function hasCollGet(object, key) { return object.get(key) }

function createHas(has, get, messages) {
    return {has: has, get: get, messages: messages}
}

var hasOwnMethods = createHas(hasOwnKey, hasObjectGet, [
    "Expected {object} to have own key {key} equal to {expected}, but found {actual}", // eslint-disable-line max-len
    "Expected {actual} to have own key {expected}",
    "Expected {object} to not have own key {key} equal to {actual}",
    "Expected {actual} to not have own key {expected}",
])

var hasKeyMethods = createHas(hasInKey, hasObjectGet, [
    "Expected {object} to have key {key} equal to {expected}, but found {actual}", // eslint-disable-line max-len
    "Expected {actual} to have key {expected}",
    "Expected {object} to not have key {key} equal to {actual}",
    "Expected {actual} to not have key {expected}",
])

var hasMethods = createHas(hasInColl, hasCollGet, [
    "Expected {object} to have key {key} equal to {expected}, but found {actual}", // eslint-disable-line max-len
    "Expected {actual} to have key {expected}",
    "Expected {object} to not have key {key} equal to {actual}",
    "Expected {actual} to not have key {expected}",
])

exports.hasOwn = has(hasOwnMethods)
exports.notHasOwn = notHas(hasOwnMethods)
exports.hasOwnLoose = hasLoose(hasOwnMethods)
exports.notHasOwnLoose = notHasLoose(hasOwnMethods)

exports.hasKey = has(hasKeyMethods)
exports.notHasKey = notHas(hasKeyMethods)
exports.hasKeyLoose = hasLoose(hasKeyMethods)
exports.notHasKeyLoose = notHasLoose(hasKeyMethods)

exports.has = has(hasMethods)
exports.notHas = notHas(hasMethods)
exports.hasLoose = hasLoose(hasMethods)
exports.notHasLoose = notHasLoose(hasMethods)

/**
 * There's 2 sets of 12 permutations here for `includes` and `hasKeys`, instead
 * of N sets of 2 (which would fit the `foo`/`notFoo` idiom better), so it's
 * easier to just make a couple separate DSLs and use that to define everything.
 *
 * Here's the top level:
 *
 * - shallow
 * - strict deep
 * - structural deep
 *
 * And the second level:
 *
 * - includes all/not missing some
 * - includes some/not missing all
 * - not including all/missing some
 * - not including some/missing all
 *
 * Here's an example using the naming scheme for `hasKeys*`
 *
 *               |     shallow     |    strict deep      |   structural deep
 * --------------|-----------------|---------------------|----------------------
 * includes all  | `hasKeys`       | `hasKeysDeep`       | `hasKeysMatch`
 * includes some | `hasKeysAny`    | `hasKeysAnyDeep`    | `hasKeysAnyMatch`
 * missing some  | `notHasKeysAll` | `notHasKeysAllDeep` | `notHasKeysAllMatch`
 * missing all   | `notHasKeys`    | `notHasKeysDeep`    | `notHasKeysMatch`
 *
 * Note that the `hasKeys` shallow comparison variants are also overloaded to
 * consume either an array (in which it simply checks against a list of keys) or
 * an object (where it does a full deep comparison).
 */

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
        if ((iter = castIterableChecked(iter)) == null) {
            throw new TypeError("`iter` must be an iterable")
        }

        values = castIfIterable(values)

        if (testIncludes(iter, values, func, all) === invert) {
            failFormat(message, {actual: iter, values: values})
        }
    }
}

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
    } else {
        return hasKeysTest(strictIs, all, object, keys)
    }
}

function isEmpty(object) {
    for (var key in object) {
        if (hasOwn.call(object, key)) return false
    }

    return true
}

function hasKeysTest(func, all, object, keys) {
    if (isEmpty(keys)) return undefined
    if (object === keys) return true

    for (var key in keys) {
        if (hasOwn.call(keys, key)) {
            var test = hasOwn.call(object, key) && func(keys[key], object[key])

            if (test !== all) return test
        }
    }

    return all
}

function makeHasOverload(all, invert, message) {
    return function (object, keys) {
        if (!isReferenceType(object)) {
            throw new TypeError("`object` must be an object")
        }

        if (!isReferenceType(keys)) {
            throw new TypeError("`keys` must be an object or array")
        }

        keys = castIfIterable(keys)

        // exclusive or to invert the result if `invert` is true
        // boolean equality is equivalent to exclusive or
        if (hasOverloadTest(all, object, keys) === invert) {
            failFormat(message, {actual: object, keys: keys})
        }
    }
}

function makeHasKeys(func, all, invert, message) {
    return function (object, keys) {
        if (!isReferenceType(object)) {
            throw new TypeError("`object` must be an object")
        }

        if (!isReferenceType(keys)) {
            throw new TypeError("`keys` must be an object")
        }

        // exclusive or to invert the result if `invert` is true
        // boolean equality is equivalent to exclusive or
        if (hasKeysTest(func, all, object, keys) === invert) {
            failFormat(message, {actual: object, keys: keys})
        }
    }
}

/* eslint-disable max-len */

exports.includes = defineIncludes(strictIs, true, false, "Expected {actual} to have all values in {values}")
exports.includesDeep = defineIncludes(match.strict, true, false, "Expected {actual} to match all values in {values}")
exports.includesMatch = defineIncludes(match.loose, true, false, "Expected {actual} to match all values in {values}")
exports.includesAny = defineIncludes(strictIs, false, false, "Expected {actual} to have any value in {values}")
exports.includesAnyDeep = defineIncludes(match.strict, false, false, "Expected {actual} to match any value in {values}")
exports.includesAnyMatch = defineIncludes(match.loose, false, false, "Expected {actual} to match any value in {values}")
exports.notIncludesAll = defineIncludes(strictIs, true, true, "Expected {actual} to not have all values in {values}")
exports.notIncludesAllDeep = defineIncludes(match.strict, true, true, "Expected {actual} to not match all values in {values}")
exports.notIncludesAllMatch = defineIncludes(match.loose, true, true, "Expected {actual} to not match all values in {values}")
exports.notIncludes = defineIncludes(strictIs, false, true, "Expected {actual} to not have any value in {values}")
exports.notIncludesDeep = defineIncludes(match.strict, false, true, "Expected {actual} to not match any value in {values}")
exports.notIncludesMatch = defineIncludes(match.loose, false, true, "Expected {actual} to not match any value in {values}")

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
