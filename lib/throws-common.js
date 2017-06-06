"use strict"

var util = require("clean-assert-util")

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
