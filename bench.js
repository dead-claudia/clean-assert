/* eslint-env node */
"use strict"

var match = require("./clean-match.js")

// Note: this is a thin wrapper around the tests, injecting a different checker
// to just reuse them for benchmarking.

function loop(list) {
    var end = list.length

    for (var count = 0; count < 2000; count++) {
        for (var i = 0; i < end; i++) (0, list[i])()
    }
}

if (process.argv[2] !== "prof") {
    var benchmark = require("benchmark") // eslint-disable-line global-require
    var suite = new benchmark.Suite("match")

    init(suite)

    // Prime the matcher functions with all the different benchmarks, so
    // they are optimized with a diverse set of values.
    console.log()
    console.log("Priming with 2000 iterations")
    var end = suite.length

    for (var count = 0; count < 2000; count++) {
        for (var i = 0; i < end; i++) (0, suite[i].fn)()
    }

    suite.on("cycle", function (event) {
        console.log(event.target + "")
    })

    suite.run()
} else {
    var funcs = []

    init({add: function (_, func) { funcs.push(func) }})

    console.log()
    console.log("Priming with 2000 iterations")
    loop(funcs)

    console.log("Running with 2000 iterations")
    loop(funcs)
}

function init(suite) { // eslint-disable-line max-statements
    var suiteInit

    global.describe = function (_, init) {
        suiteInit = init
    }

    global.check = function (name, a, b, opts) {
        if (typeof name !== "string") {
            throw new TypeError("`name` must be a string")
        }

        if (opts == null) {
            throw new TypeError("`opts` must be an object")
        }

        if (typeof opts.loose !== "boolean") {
            throw new TypeError("`opts.loose` must be a boolean")
        }

        if (typeof opts.strict !== "boolean") {
            throw new TypeError("`opts.strict` must be a boolean")
        }

        if (match.strict(a, b) !== opts.strict) {
            throw new Error(name + " failed - please fix strict")
        }

        if (match.loose(a, b) !== opts.loose) {
            throw new Error(name + " failed - please fix match")
        }

        suite.add(name, function () {
            var localA = a
            var localB = b

            match.strict(localA, localB)
            match.loose(localA, localB)
        })
    }

    require("./test.js") // eslint-disable-line global-require
    suiteInit()
}
