"use strict"

/* eslint-env mocha */

// eslint-disable-next-line max-statements
describe("clean-assert (match impl)", function () {
    var check, assert

    /* eslint-disable no-undef, global-require */

    if (typeof require === "function") {
        check = global.check
        assert = require("../index")
    } else {
        assert = match
    }

    /* eslint-enable no-undef, global-require */

    function checkMethod(method, expected, a, b) {
        var actual = assert[method](a, b)

        if (actual !== expected) {
            assert.fail(
                "(assert." + method + ") Expected {expected} to be {actual}",
                {expected: expected, actual: actual}
            )
        }
    }

    // This is injected from the benchmark, but not from Karma.
    check = check || function (name, a, b, opts) {
        it(name + " (loose)", function () {
            checkMethod("matchLoose", opts.loose, a, b)
        })

        it(name + " (strict)", function () {
            checkMethod("matchStrict", opts.strict, a, b)
        })
    }

    var obj1 = {}

    check("identical", obj1, obj1, {strict: true, loose: true})

    check("equal",
        {a: [2, 3], b: [4]},
        {a: [2, 3], b: [4]},
        {strict: true, loose: true})

    check("not equal",
        {x: 5, y: [6]},
        {x: 5, y: 6},
        {strict: false, loose: false})

    check("nested nulls",
        [null, null, null],
        [null, null, null],
        {strict: true, loose: true})

    check("loosely equal",
        [{a: 3}, {b: 4}],
        [{a: "3"}, {b: "4"}],
        {strict: false, loose: false})

    check("same numbers", 3, 3, {
        strict: true,
        loose: true,
    })

    check("different numbers", 1, 3, {
        strict: false,
        loose: false,
    })

    check("same strings", "beep", "beep", {
        strict: true,
        loose: true,
    })

    check("different strings", "beep", "beep", {
        strict: true,
        loose: true,
    })

    check("string + number", "3", 3, {
        strict: false,
        loose: false,
    })

    check("number + string", 3, "3", {
        strict: false,
        loose: false,
    })

    check("different string + number", "3", 5, {
        strict: false,
        loose: false,
    })

    check("different number + string", 3, "5", {
        strict: false,
        loose: false,
    })

    check("string + [number]", "3", [3], {
        strict: false,
        loose: false,
    })

    check("number + [string]", 3, ["3"], {
        strict: false,
        loose: false,
    })

    function toArgs() { return arguments }

    check("same arguments",
        toArgs(1, 2, 3),
        toArgs(1, 2, 3),
        {strict: true, loose: true})

    check("different arguments",
        toArgs(1, 2, 3),
        toArgs(3, 2, 1),
        {strict: false, loose: false})

    check("similar arguments + array",
        toArgs(1, 2, 3),
        [1, 2, 3],
        {strict: false, loose: false})

    check("similar array + arguments",
        [1, 2, 3],
        toArgs(1, 2, 3),
        {strict: false, loose: false})

    check("similar arguments + array-like",
        toArgs(1, 2, 3),
        {length: 3, 0: 1, 1: 2, 2: 3},
        {strict: false, loose: false})

    check("similar array-like + arguments",
        {length: 3, 0: 1, 1: 2, 2: 3},
        toArgs(1, 2, 3),
        {strict: false, loose: false})

    check("same date",
        new Date("Fri Dec 20 2013 16:21:18 GMT-0800 (PST)"),
        new Date("Fri Dec 20 2013 16:21:18 GMT-0800 (PST)"),
        {strict: true, loose: true})

    check("different date",
        new Date("Thu, 01 Jan 1970 00:00:00 GMT"),
        new Date("Fri Dec 20 2013 16:21:18 GMT-0800 (PST)"),
        {strict: false, loose: false})

    var Buffer = global.Buffer

    if (typeof Buffer === "function") {
        check("same Buffers", new Buffer("xyz"), new Buffer("xyz"), {
            strict: true,
            loose: true,
        })

        check("different Buffers", new Buffer("abc"), new Buffer("xyz"), {
            strict: false,
            loose: false,
        })
    }

    var Int8Array = global.Int8Array
    var Int16Array = global.Int16Array
    var Int32Array = global.Int32Array
    var Uint8Array = global.Uint8Array
    var Uint8ClampedArray = global.Uint8ClampedArray
    var Uint16Array = global.Uint16Array
    var Uint32Array = global.Uint32Array
    var Float32Array = global.Float32Array
    var Float64Array = global.Float64Array
    var DataView = global.DataView

    if (typeof Int8Array === "function") {
        check("same Int8Arrays",
            new Int8Array([1, 2, 3]),
            new Int8Array([1, 2, 3]),
            {strict: true, loose: true})

        check("different Int8Arrays",
            new Int8Array([1, 2, 3]),
            new Int8Array([4, 5, 6]),
            {strict: false, loose: false})
    }

    if (typeof Int16Array === "function") {
        check("same Int16Arrays",
            new Int16Array([1, 2, 3]),
            new Int16Array([1, 2, 3]),
            {strict: true, loose: true})

        check("different Int16Arrays",
            new Int16Array([1, 2, 3]),
            new Int16Array([4, 5, 6]),
            {strict: false, loose: false})
    }

    if (typeof Int32Array === "function") {
        check("same Int32Arrays",
            new Int32Array([1, 2, 3]),
            new Int32Array([1, 2, 3]),
            {strict: true, loose: true})

        check("different Int32Arrays",
            new Int32Array([1, 2, 3]),
            new Int32Array([4, 5, 6]),
            {strict: false, loose: false})
    }

    if (typeof Uint8Array === "function") {
        check("same Uint8Arrays",
            new Uint8Array([1, 2, 3]),
            new Uint8Array([1, 2, 3]),
            {strict: true, loose: true})

        check("different Uint8Arrays",
            new Uint8Array([1, 2, 3]),
            new Uint8Array([4, 5, 6]),
            {strict: false, loose: false})
    }

    if (typeof Uint8ClampedArray === "function") {
        check("same Uint8Arrays",
            new Uint8ClampedArray([1, 2, 3]),
            new Uint8ClampedArray([1, 2, 3]),
            {strict: true, loose: true})

        check("different Uint8Arrays",
            new Uint8ClampedArray([1, 2, 3]),
            new Uint8ClampedArray([4, 5, 6]),
            {strict: false, loose: false})
    }

    if (typeof Uint16Array === "function") {
        check("same Uint16Arrays",
            new Uint16Array([1, 2, 3]),
            new Uint16Array([1, 2, 3]),
            {strict: true, loose: true})

        check("different Uint16Arrays",
            new Uint16Array([1, 2, 3]),
            new Uint16Array([4, 5, 6]),
            {strict: false, loose: false})
    }

    if (typeof Uint32Array === "function") {
        check("same Uint32Arrays",
            new Uint32Array([1, 2, 3]),
            new Uint32Array([1, 2, 3]),
            {strict: true, loose: true})

        check("different Uint32Arrays",
            new Uint32Array([1, 2, 3]),
            new Uint32Array([4, 5, 6]),
            {strict: false, loose: false})
    }

    if (typeof Float32Array === "function") {
        check("same Float32Arrays",
            new Float32Array([1, 2, 3]),
            new Float32Array([1, 2, 3]),
            {strict: true, loose: true})

        check("different Float32Arrays",
            new Float32Array([1, 2, 3]),
            new Float32Array([4, 5, 6]),
            {strict: false, loose: false})
    }

    if (typeof Float64Array === "function") {
        check("same Float64Arrays",
            new Float64Array([1, 2, 3]),
            new Float64Array([1, 2, 3]),
            {strict: true, loose: true})

        check("different Float64Arrays",
            new Float64Array([1, 2, 3]),
            new Float64Array([4, 5, 6]),
            {strict: false, loose: false})
    }

    if (typeof Int32Array === "function" && typeof DataView === "function") {
        check("same DataViews",
            new DataView(new Int32Array([1, 2, 3, 4, 5]).buffer),
            new DataView(new Int32Array([1, 2, 3, 4, 5]).buffer),
            {strict: true, loose: true})

        check("different DataViews",
            new DataView(new Int32Array([1, 2, 3, 4, 5]).buffer),
            new DataView(new Int32Array([5, 4, 3, 2, 1]).buffer),
            {strict: false, loose: false})
    }

    check("boolean + array", true, [], {
        strict: false,
        loose: false,
    })

    check("both null", null, null, {
        strict: true,
        loose: true,
    })

    check("both undefined", undefined, undefined, {
        strict: true,
        loose: true,
    })

    check("null + undefined", null, undefined, {
        strict: false,
        loose: false,
    })

    check("undefined + null", undefined, null, {
        strict: false,
        loose: false,
    })

    function A() { this.prop = 1 }
    function B() { this.prop = 1 }

    check("same prototypes", new A(), new A(), {
        strict: true,
        loose: true,
    })

    check("different prototypes", new A(), new B(), {
        strict: false,
        loose: true,
    })

    check("object + string", "foo", {bar: 1}, {
        strict: false,
        loose: false,
    })

    check("string + object", {foo: 1}, "bar", {
        strict: false,
        loose: false,
    })

    check("same strings", "foo", "foo", {
        strict: true,
        loose: true,
    })

    check("different strings", "foo", "bar", {
        strict: false,
        loose: false,
    })

    check("differing keys", {a: 1, b: 2}, {b: 1, c: 2}, {
        strict: false,
        loose: false,
    })

    var Symbol = global.Symbol

    if (typeof Symbol === "function") {
        var symbol = Symbol("foo")

        check("same symbols", symbol, symbol, {
            strict: true,
            loose: true,
        })

        check("similar symbols", Symbol("foo"), Symbol("foo"), {
            strict: false,
            loose: true,
        })

        check("different symbols", Symbol("foo"), Symbol("bar"), {
            strict: false,
            loose: false,
        })
    }

    function bar() {}
    function load() {}

    function register(ext, value, load, use) {
        return {
            ext: ext,
            value: value,
            require: load,
            use: use,
            loaded: false,
            original: false,
        }
    }

    function simple(module, load) {
        return {module: module, load: load, loaded: false}
    }

    function Register(ext, value, load, use) {
        this.ext = ext
        this.value = value
        this.require = load
        this.loaded = false
        this.use = use
        this.original = false
    }

    function Simple(module, load) {
        this.module = module
        this.require = load
        this.loaded = false
    }

    function Ext(ext) {
        this.ext = ext
    }

    function Id(id) {
        this.id = id
    }

    var Map = global.Map
    var Set = global.Set

    if (typeof Map === "function") {
        check("empty maps", new Map(), new Map(), {
            strict: true,
            loose: true,
        })

        check("maps with same primitive keys",
            new Map([["foo", "bar"]]),
            new Map([["foo", "bar"]]),
            {strict: true, loose: true})

        check("maps with different primitive keys",
            new Map([["foo", "bar"]]),
            new Map([["bar", "bar"]]),
            {strict: false, loose: false})

        check("maps with different primitive values",
            new Map([["foo", "bar"]]),
            new Map([["foo", "foo"]]),
            {strict: false, loose: false})

        check("maps with different primitive both",
            new Map([["foo", "bar"]]),
            new Map([["bar", "foo"]]),
            {strict: false, loose: false})

        check("maps with loosely same primitive key",
            new Map([[1, "foo"]]),
            new Map([["1", "foo"]]),
            {strict: false, loose: false})

        check("maps with loosely same primitive value",
            new Map([["foo", 1]]),
            new Map([["foo", "1"]]),
            {strict: false, loose: false})

        check("maps with loosely same primitive both",
            new Map([["1", 1]]),
            new Map([[1, "1"]]),
            {strict: false, loose: false})

        check("maps with many same primitive keys",
            new Map([["foo", "bar"], ["bar", 1], [1, 2], [true, 3]]),
            new Map([["foo", "bar"], ["bar", 1], [1, 2], [true, 3]]),
            {strict: true, loose: true})

        check("maps with many different primitive keys",
            new Map([["foo", "bar"], ["bar", 1], [1, 2], [true, 3]]),
            new Map([["foo", "bar"], ["bar", 2], ["15", 2], [false, 4]]),
            {strict: false, loose: false})

        var mapObj = {foo: "bar"}

        check("maps with identical keys",
            new Map([[mapObj, "bar"]]),
            new Map([[mapObj, "bar"]]),
            {strict: true, loose: true})

        check("maps with structurally similar keys",
            new Map([[{foo: "bar"}, "bar"]]),
            new Map([[{foo: "bar"}, "bar"]]),
            {strict: true, loose: true})

        check("maps with structurally different keys",
            new Map([[{foo: "bar"}, "bar"]]),
            new Map([[{bar: "foo"}, "bar"]]),
            {strict: false, loose: false})

        check("maps with structurally similar values",
            new Map([["bar", {foo: "bar"}]]),
            new Map([["bar", {foo: "bar"}]]),
            {strict: true, loose: true})

        check("maps with structurally different values",
            new Map([["bar", {foo: "bar"}]]),
            new Map([["bar", {bar: "foo"}]]),
            {strict: false, loose: false})

        check("maps with structurally similar both",
            new Map([[{foo: "bar"}, {foo: "bar"}]]),
            new Map([[{foo: "bar"}, {foo: "bar"}]]),
            {strict: true, loose: true})

        check("maps with structurally different both",
            new Map([[{foo: "bar"}, {foo: "bar"}]]),
            new Map([[{bar: "foo"}, {bar: "foo"}]]),
            {strict: false, loose: false})

        check("maps with inner functions",
            new Map([[{foo: "bar", bar: bar}, {foo: "bar", bar: bar}]]),
            new Map([[{foo: "bar", bar: bar}, {foo: "bar", bar: bar}]]),
            {strict: true, loose: true})
    }

    if (typeof Set === "function") {
        check("empty sets", new Set(), new Set(), {
            strict: true,
            loose: true,
        })

        check("sets with same primitive values",
            new Set(["foo", "bar"]),
            new Set(["foo", "bar"]),
            {strict: true, loose: true})

        check("sets with different primitive values",
            new Set(["foo", "bar"]),
            new Set(["bar", "bar"]),
            {strict: false, loose: false})

        check("sets with loosely same primitive value",
            new Set([1, "foo"]),
            new Set(["1", "foo"]),
            {strict: false, loose: false})

        check("sets with many same primitive values",
            new Set(["foo", "bar", "bar", 1, 1, 2, true, 3]),
            new Set(["foo", "bar", "bar", 1, 1, 2, true, 3]),
            {strict: true, loose: true})

        check("sets with many different primitive values",
            new Set(["foo", "bar", "bar", 1, 1, 2, true, 3]),
            new Set(["foo", "bar", "bar", 2, "15", 2, false, 4]),
            {strict: false, loose: false})

        var setObj = {foo: "bar"}

        check("sets with identical values",
            new Set([setObj, "bar"]),
            new Set([setObj, "bar"]),
            {strict: true, loose: true})

        check("sets with structurally similar values",
            new Set([{foo: "bar"}, "bar"]),
            new Set([{foo: "bar"}, "bar"]),
            {strict: true, loose: true})

        check("sets with structurally different values",
            new Set([{foo: "bar"}, "bar"]),
            new Set([{bar: "foo"}, "bar"]),
            {strict: false, loose: false})
    }

    // Derived from a previously failing test
    /* eslint-disable max-len */

    if (typeof Set === "function") {
        check("really complex maps with objects",
            new Map([
                [".my-shell", register(".my-shell", "@company/my-shell/register", load, true)],
                [".js", register(".js", "./babel-register-wrapper", load, true)],
                [0, simple("./util/env.my-shell", load)],
                [".ls", register(".ls", ["livescript", "LiveScript"], load, false)],
                [".coffee", register(".coffee", ["coffee-script/register", "coffee-script"], load, false)],
            ]),
            new Map([
                [".my-shell", register(".my-shell", "@company/my-shell/register", load, true)],
                [".js", register(".js", "./babel-register-wrapper", load, true)],
                [".ls", register(".ls", ["livescript", "LiveScript"], load, false)],
                [".coffee", register(".coffee", ["coffee-script/register", "coffee-script"], load, false)],
                [0, simple("./util/env.my-shell", load)],
            ]),
            {strict: true, loose: true})

        check("really complex maps with classes",
            new Map([
                [".my-shell", new Register(".my-shell", "@company/my-shell/register", load, true)],
                [".js", new Register(".js", "./babel-register-wrapper", load, true)],
                [0, new Simple("./util/env.my-shell", load)],
                [".ls", new Register(".ls", ["livescript", "LiveScript"], load, false)],
                [".coffee", new Register(".coffee", ["coffee-script/register", "coffee-script"], load, false)],
            ]),
            new Map([
                [".my-shell", new Register(".my-shell", "@company/my-shell/register", load, true)],
                [".js", new Register(".js", "./babel-register-wrapper", load, true)],
                [".ls", new Register(".ls", ["livescript", "LiveScript"], load, false)],
                [".coffee", new Register(".coffee", ["coffee-script/register", "coffee-script"], load, false)],
                [0, new Simple("./util/env.my-shell", load)],
            ]),
            {strict: true, loose: true})

        var map1 = new Map()
        var map2 = new Map()

        map1.set("foo", map1)
        map2.set("foo", map2)

        check("maps with circular references", map1, map2, {
            strict: true,
            loose: true,
        })
    }

    if (typeof Set === "function") {
        check("complex sets with differently ordered primitive + object",
            new Set([
                [".my-shell", register(".my-shell", "@company/my-shell/register", load, true)],
                [".js", register(".js", "./babel-register-wrapper", load, true)],
                [0, simple("./util/env.my-shell", load)],
                [".ls", register(".ls", ["livescript", "LiveScript"], load, false)],
                [".coffee", register(".coffee", ["coffee-script/register", "coffee-script"], load, false)],
            ]),
            new Set([
                [".my-shell", register(".my-shell", "@company/my-shell/register", load, true)],
                [".js", register(".js", "./babel-register-wrapper", load, true)],
                [".ls", register(".ls", ["livescript", "LiveScript"], load, false)],
                [".coffee", register(".coffee", ["coffee-script/register", "coffee-script"], load, false)],
                [0, simple("./util/env.my-shell", load)],
            ]),
            {strict: true, loose: true})

        check("complex sets with differently ordered primitive + class",
            new Set([
                [".my-shell", new Register(".my-shell", "@company/my-shell/register", load, true)],
                [".js", new Register(".js", "./babel-register-wrapper", load, true)],
                [0, new Simple("./util/env.my-shell", load)],
                [".ls", new Register(".ls", ["livescript", "LiveScript"], load, false)],
                [".coffee", new Register(".coffee", ["coffee-script/register", "coffee-script"], load, false)],
            ]),
            new Set([
                [".my-shell", new Register(".my-shell", "@company/my-shell/register", load, true)],
                [".js", new Register(".js", "./babel-register-wrapper", load, true)],
                [".ls", new Register(".ls", ["livescript", "LiveScript"], load, false)],
                [".coffee", new Register(".coffee", ["coffee-script/register", "coffee-script"], load, false)],
                [0, new Simple("./util/env.my-shell", load)],
            ]),
            {strict: true, loose: true})

        check("complex sets with differently ordered object + object",
            new Set([
                [{ext: ".my-shell"}, register(".my-shell", "@company/my-shell/register", load, true)],
                [{ext: ".js"}, register(".js", "./babel-register-wrapper", load, true)],
                [{id: 0}, simple("./util/env.my-shell", load)],
                [{ext: ".ls"}, register(".ls", ["livescript", "LiveScript"], load, false)],
                [{ext: ".coffee"}, register(".coffee", ["coffee-script/register", "coffee-script"], load, false)],
            ]),
            new Set([
                [{ext: ".my-shell"}, register(".my-shell", "@company/my-shell/register", load, true)],
                [{ext: ".js"}, register(".js", "./babel-register-wrapper", load, true)],
                [{ext: ".ls"}, register(".ls", ["livescript", "LiveScript"], load, false)],
                [{ext: ".coffee"}, register(".coffee", ["coffee-script/register", "coffee-script"], load, false)],
                [{id: 0}, simple("./util/env.my-shell", load)],
            ]),
            {strict: true, loose: true})

        check("complex sets with differently ordered object + class",
            new Set([
                [{ext: ".my-shell"}, new Register(".my-shell", "@company/my-shell/register", load, true)],
                [{ext: ".js"}, new Register(".js", "./babel-register-wrapper", load, true)],
                [{id: 0}, new Simple("./util/env.my-shell", load)],
                [{ext: ".ls"}, new Register(".ls", ["livescript", "LiveScript"], load, false)],
                [{ext: ".coffee"}, new Register(".coffee", ["coffee-script/register", "coffee-script"], load, false)],
            ]),
            new Set([
                [{ext: ".my-shell"}, new Register(".my-shell", "@company/my-shell/register", load, true)],
                [{ext: ".js"}, new Register(".js", "./babel-register-wrapper", load, true)],
                [{ext: ".ls"}, new Register(".ls", ["livescript", "LiveScript"], load, false)],
                [{ext: ".coffee"}, new Register(".coffee", ["coffee-script/register", "coffee-script"], load, false)],
                [{id: 0}, new Simple("./util/env.my-shell", load)],
            ]),
            {strict: true, loose: true})

        check("complex sets with differently ordered class + object",
            new Set([
                [new Ext(".my-shell"), register(".my-shell", "@company/my-shell/register", load, true)],
                [new Ext(".js"), register(".js", "./babel-register-wrapper", load, true)],
                [new Id(0), simple("./util/env.my-shell", load)],
                [new Ext(".ls"), register(".ls", ["livescript", "LiveScript"], load, false)],
                [new Ext(".coffee"), register(".coffee", ["coffee-script/register", "coffee-script"], load, false)],
            ]),
            new Set([
                [new Ext(".my-shell"), register(".my-shell", "@company/my-shell/register", load, true)],
                [new Ext(".js"), register(".js", "./babel-register-wrapper", load, true)],
                [new Ext(".ls"), register(".ls", ["livescript", "LiveScript"], load, false)],
                [new Ext(".coffee"), register(".coffee", ["coffee-script/register", "coffee-script"], load, false)],
                [new Id(0), simple("./util/env.my-shell", load)],
            ]),
            {strict: true, loose: true})

        check("complex sets with differently ordered class + class",
            new Set([
                [new Ext(".my-shell"), new Register(".my-shell", "@company/my-shell/register", load, true)],
                [new Ext(".js"), new Register(".js", "./babel-register-wrapper", load, true)],
                [new Id(0), new Simple("./util/env.my-shell", load)],
                [new Ext(".ls"), new Register(".ls", ["livescript", "LiveScript"], load, false)],
                [new Ext(".coffee"), new Register(".coffee", ["coffee-script/register", "coffee-script"], load, false)],
            ]),
            new Set([
                [new Ext(".my-shell"), new Register(".my-shell", "@company/my-shell/register", load, true)],
                [new Ext(".js"), new Register(".js", "./babel-register-wrapper", load, true)],
                [new Ext(".ls"), new Register(".ls", ["livescript", "LiveScript"], load, false)],
                [new Ext(".coffee"), new Register(".coffee", ["coffee-script/register", "coffee-script"], load, false)],
                [new Id(0), new Simple("./util/env.my-shell", load)],
            ]),
            {strict: true, loose: true})

        var set1 = new Set()
        var set2 = new Set()

        set1.add("foo")
        set1.add(set1)
        set1.add("bar")

        set2.add("foo")
        set2.add(set2)
        set2.add("bar")

        check("sets with circular references", set1, set2, {
            strict: true,
            loose: true,
        })

        /* eslint-enable max-len */
    }

    function f() {}

    check("same functions", f, f, {
        strict: true,
        loose: true,
    })

    check("different functions", function () {}, function () {}, {
        strict: false,
        loose: false,
    })

    var circular1 = {foo: 1}
    var circular2 = {foo: 1}
    var circular3 = {foo: 1}

    circular1.a = circular1
    circular2.a = circular2
    circular3.b = circular3

    check("circular references match", circular1, circular2, {
        strict: true,
        loose: true,
    })

    check("circular references don't match", circular1, circular3, {
        strict: false,
        loose: false,
    })

    check("one circular", circular1, {foo: 1, a: {}}, {
        strict: false,
        loose: false,
    })

    check("regexps match", /foo/gim, /foo/mig, {
        strict: true,
        loose: true,
    })

    check("regexp source doesn't match", /foo/gim, /bar/mig, {
        strict: false,
        loose: false,
    })

    check("regexp flags don't match", /foo/gi, /foo/gim, {
        strict: false,
        loose: false,
    })
})
