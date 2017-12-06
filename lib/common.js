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

var from = Array.from || function (iter) {
    var array = []
    var iterator = iter[symbolIterator]()
    var step

    while (!(step = iterator.next()).done) {
        array.push(step.value)
    }

    return array
}

exports.castIfIterable = function (array) {
    if (Array.isArray(array)) return array
    if (!exports.isIterable(array)) return array
    return from(array)
}

exports.castIterableChecked = function (array) {
    if (Array.isArray(array)) return array
    if (!exports.isIterable(array)) return undefined
    return from(array)
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
