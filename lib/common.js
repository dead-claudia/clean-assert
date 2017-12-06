"use strict"

// Note: this contains utilities that don't make sense to include with
// `clean-assert-util`.

var util = require("clean-assert-util")

exports.isReferenceType = function (object) {
    return object != null && (
        typeof object === "function" ||
        typeof object === "object"
    )
}

var symbolIterator = "@@iterator"

if (typeof global.Symbol === "function" &&
        typeof global.Symbol.iterator === "symbol") {
    symbolIterator = global.Symbol.iterator
}

exports.isIterable = function (object) {
    return typeof object[symbolIterator] === "function"
}

exports.forOf = function (iter, func) { // eslint-disable-line consistent-return
    // Note: this is based on Babel's output.
    var done = true
    var thrown = false
    var error, iterator, step

    try {
        iterator = iter[symbolIterator]()
        while (!(done = (step = iterator.next()).done)) {
            var item = step.value

            if (func(item)) return true
            done = true
        }

        return false
    } catch (e) {
        thrown = true
        error = e
    } finally {
        try {
            if (!done && iterator.return) iterator.return()
        } finally {
            if (thrown) throw error
        }
    }
}

exports.getName = function (func) {
    var name = func.name

    if (name == null) name = func.displayName
    if (name) return util.escape(name)
    return "<anonymous>"
}

exports.throwsMatchTest = function (matcher, e) {
    if (typeof matcher === "string") return e.message === matcher
    if (typeof matcher === "function") return !!matcher(e)
    if (matcher instanceof RegExp) return !!matcher.test(e.message)

    var keys = Object.keys(matcher)

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i]

        if (!(key in e) || !util.strictIs(matcher[key], e[key])) return false
    }

    return true
}

exports.isPlainObject = function (object) {
    return object == null || Object.getPrototypeOf(object) === Object.prototype
}
