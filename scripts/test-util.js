"use strict"

/* eslint-env mocha */

var assert = require("../index")

exports.symbolIterator = "@@iterator"

// eslint-disable-next-line no-undef
if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    // eslint-disable-next-line no-undef
    exports.symbolIterator = Symbol.iterator
}

exports.toArray = toArray
function toArray() {
    var args = new Array(arguments.length)

    for (var i = 0; i < arguments.length; i++) {
        args[i] = arguments[i]
    }

    return args
}

exports.toArrayLike = toArrayLike
function toArrayLike() {
    var args = {length: arguments.length}

    for (var i = 0; i < arguments.length; i++) {
        args[i] = arguments[i]
    }

    return args
}

exports.iterable = iterable
function iterable() {
    var object = {}
    var entries = exports.toArray.apply(undefined, arguments)

    object[exports.symbolIterator] = function () {
        return {
            index: 0,
            next: function () {
                if (this.index === entries.length) {
                    return {done: true, value: undefined}
                } else {
                    return {done: false, value: entries[this.index++]}
                }
            },
        }
    }
    return object
}

exports.testSingle = testSingle
function testSingle(name, context, init) {
    if (init == null && typeof context === "function") {
        init = context
        context = undefined
    }

    if (typeof name !== "string") {
        throw new TypeError("`name` must be a string!")
    }

    var suiteName = context ? name + "() (" + context + ")" : name + "()"
    var method = assert[name]

    if (method == null) {
        throw new ReferenceError("Method assert." + name + "() does not exist!")
    }

    var steps = init(assert[name], function () {
        // Silently swallowing exceptions is bad, so we can't use
        // traditional assertions to test.
        try {
            assert[name].apply(undefined, arguments)
        } catch (e) {
            if (e instanceof assert.AssertionError) return
            throw e
        }

        throw new assert.AssertionError(
            "Expected assert." + name + "() to throw an AssertionError",
            assert.AssertionError)
    })

    describe(suiteName, function () {
        for (var name in steps) {
            if (name !== "after" && {}.hasOwnProperty.call(steps, name)) {
                var body = steps[name]

                if (body != null) it(name, body)
            }
        }

        steps = undefined
    })
}

exports.testPair = testPair
function testPair(is, not, context, init) {
    if (init == null) {
        if (typeof context === "function") {
            init = context
            context = undefined
        } else if (typeof not === "function") {
            init = not
            not = undefined
        }
    }

    if (typeof is !== "string") {
        throw new TypeError("`is` must be a string!")
    }

    if (typeof not !== "string") {
        throw new TypeError("`not` must be a string if present!")
    }

    testSingle(is, context, function (pass, fail) {
        return init(pass, fail, fail)
    })

    testSingle(not, context, function (pass, fail) {
        return init(fail, pass, fail)
    })
}

// eslint-disable-next-line no-undef
var AcceptSet = typeof Set === "function" ? Set : (function () {
    function Set(array) {
        this.length = 0
        if (array != null) {
            this.length = array.length
            for (var i = 0; i < array.length; i++) this[i] = array[i]
        }
    }

    Set.prototype.has = function (item) {
        for (var i = 0; i < this.length; i++) {
            var current = this[i]

            if (current === item) return true
            // eslint-disable-next-line no-self-compare
            if (current !== current && item !== item) return true
        }

        return false
    }

    return Set
})()

exports.test = test
function test(_, init) {
    testPair(_.method, _.negate, _.context, function (is, not) {
        var accept = new AcceptSet(_.accept)

        function check() {
            for (var i = 0; i < arguments.length; i++) {
                var label = arguments[i]
                var negate = label != null &&
                    typeof label === "object" &&
                    "not" in label

                if (negate) label = label.not
                if (accept.has(label) === negate) return false
            }

            return true
        }

        return init({
            check: check, is: is, not: not,
            test: function () {
                return check.apply(undefined, arguments) ? is : not
            },
        })
    })
}

exports.permute = permute
function permute(func) {
    func("array", toArray)
    func("iterable", iterable)
    func("array-like", toArrayLike)
}

function define(_, init, context, args) {
    test({
        method: _.method, negate: _.negate, accept: _.accept,
        context: _.context || context,
    }, function (_) {
        return init.apply(undefined, [_].concat(args))
    })
}

exports.testPermuteOne = function (_, init) {
    permute(function (desc, list) {
        define(_, init, desc, [list])
    })
}

exports.testPermuteTwo = function (_, init) {
    permute(function (listDesc, list) {
        permute(function (itemDesc, items) {
            define(_, init, listDesc + " + " + itemDesc, [list, items])
        })
    })
}
