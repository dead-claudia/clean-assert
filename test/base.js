"use strict"

var assert = require("../index")
var util = require("../test-util")

/* global Map, Symbol */

describe("clean-assert (base)", function () {
    describe("assert()", function () {
        it("works", function () {
            function fail(arg, message) {
                try {
                    assert.assert(arg, message)
                    throw new Error("Expected assertion to throw")
                } catch (e) {
                    assert.equal(e.message, message)
                }
            }

            assert.assert(true)
            assert.assert(1)
            assert.assert(Infinity)
            assert.assert("foo")
            assert.assert({})
            assert.assert([])
            assert.assert(new Date())
            if (typeof Symbol === "function") assert.assert(Symbol())

            fail(undefined, "message")
            fail(null, "message")
            fail(false, "message")
            fail(0, "message")
            fail("", "message")
            fail(NaN, "message")
        })

        it("escapes the message", function () {
            util.fail("assert", undefined, "{test}")
            util.fail("assert", null, "{test}")
            util.fail("assert", false, "{test}")
            util.fail("assert", 0, "{test}")
            util.fail("assert", "", "{test}")
            util.fail("assert", NaN, "{test}")
        })
    })

    util.test("ok", function (ok, fail) {
        return [
            function () { return ok(true) },
            function () { return ok(1) },
            function () { return ok(Infinity) },
            function () { return ok("foo") },
            function () { return ok({}) },
            function () { return ok([]) },
            function () { return ok(new Date()) },
            function () {
                if (typeof Symbol === "function") return ok(Symbol())
                return undefined
            },

            function () { fail() },
            function () { fail(undefined) },
            function () { fail(null) },
            function () { fail(false) },
            function () { fail(0) },
            function () { fail("") },
            function () { fail(NaN) },
        ]
    })

    util.test("notOk", function (notOk, fail) {
        return [
            function () { return fail(true) },
            function () { return fail(1) },
            function () { return fail(Infinity) },
            function () { return fail("foo") },
            function () { return fail({}) },
            function () { return fail([]) },
            function () { return fail(new Date()) },
            function () {
                if (typeof Symbol === "function") return fail(Symbol())
                return undefined
            },

            function () { return notOk() },
            function () { return notOk(undefined) },
            function () { return notOk(null) },
            function () { return notOk(false) },
            function () { return notOk(0) },
            function () { return notOk("") },
            function () { return notOk(NaN) },
        ]
    })

    util.test("equal", function (equal, fail) {
        return [
            function () { return equal(0, 0) },
            function () { return equal(1, 1) },
            function () { return equal(null, null) },
            function () { return equal(undefined, undefined) },
            function () { return equal(Infinity, Infinity) },
            function () { return equal(NaN, NaN) },
            function () { return equal("", "") },
            function () { return equal("foo", "foo") },
            function () {
                var obj = {}

                equal(obj, obj)
            },

            function () { return fail("equal", {}, {}) },
            function () { return fail("equal", null, undefined) },
            function () { return fail("equal", 0, 1) },
            function () { return fail("equal", 1, "1") },
        ]
    })

    util.test("notEqual", function (notEqual, fail) {
        return [
            function () { return fail(0, 0) },
            function () { return fail(1, 1) },
            function () { return fail(null, null) },
            function () { return fail(undefined, undefined) },
            function () { return fail(Infinity, Infinity) },
            function () { return fail(NaN, NaN) },
            function () { return fail("", "") },
            function () { return fail("foo", "foo") },
            function () {
                var obj = {}

                fail(obj, obj)
            },

            function () { return notEqual({}, {}) },
            function () { return notEqual(null, undefined) },
            function () { return notEqual(0, 1) },
            function () { return notEqual(1, "1") },
        ]
    })

    util.test("equalLoose", function (equalLoose, fail) {
        return [
            function () { return equalLoose(0, 0) },
            function () { return equalLoose(1, 1) },
            function () { return equalLoose(null, null) },
            function () { return equalLoose(undefined, undefined) },
            function () { return equalLoose(Infinity, Infinity) },
            function () { return equalLoose(NaN, NaN) },
            function () { return equalLoose("", "") },
            function () { return equalLoose("foo", "foo") },
            function () { return equalLoose(null, undefined) },
            function () { return equalLoose(1, "1") },
            function () {
                var obj = {}

                return equalLoose(obj, obj)
            },

            function () { return fail({}, {}) },
            function () { return fail(0, 1) },
        ]
    })

    util.test("notEqualLoose", function (notEqualLoose, fail) {
        return [
            function () { return fail(0, 0) },
            function () { return fail(1, 1) },
            function () { return fail(null, null) },
            function () { return fail(undefined, undefined) },
            function () { return fail(Infinity, Infinity) },
            function () { return fail(NaN, NaN) },
            function () { return fail("", "") },
            function () { return fail("foo", "foo") },
            function () { return fail(null, undefined) },
            function () { return fail(1, "1") },
            function () {
                var obj = {}

                return fail(obj, obj)
            },

            function () { return notEqualLoose({}, {}) },
            function () { return notEqualLoose(0, 1) },
        ]
    })

    util.test("deepEqual", function (deepEqual, fail) {
        return [
            function () { return deepEqual(0, 0) },
            function () { return deepEqual(1, 1) },
            function () { return deepEqual(null, null) },
            function () { return deepEqual(undefined, undefined) },
            function () { return deepEqual(Infinity, Infinity) },
            function () { return deepEqual(NaN, NaN) },
            function () { return deepEqual("", "") },
            function () { return deepEqual("foo", "foo") },
            function () {
                var obj = {}

                return deepEqual(obj, obj)
            },

            function () { return deepEqual({}, {}) },
            function () { return fail(null, undefined) },
            function () { return fail(0, 1) },
            function () { return fail(1, "1") },
            function () {
                return deepEqual({a: [2, 3], b: [4]}, {a: [2, 3], b: [4]})
            },
        ]
    })

    util.test("notDeepEqual", function (notDeepEqual, fail) {
        return [
            function () { return fail(0, 0) },
            function () { return fail(1, 1) },
            function () { return fail(null, null) },
            function () { return fail(undefined, undefined) },
            function () { return fail(Infinity, Infinity) },
            function () { return fail(NaN, NaN) },
            function () { return fail("", "") },
            function () { return fail("foo", "foo") },
            function () {
                var obj = {}

                return fail(obj, obj)
            },

            function () { return fail({}, {}) },
            function () { return notDeepEqual(null, undefined) },
            function () { return notDeepEqual(0, 1) },
            function () { return notDeepEqual(1, "1") },
            function () {
                return fail({a: [2, 3], b: [4]}, {a: [2, 3], b: [4]})
            },
        ]
    })

    function F() { this.value = 1 }
    F.prototype.prop = 1

    util.test("hasOwn", function (hasOwn, fail) {
        return [
            function () { return hasOwn({prop: 1}, "prop") },
            function () { return hasOwn({prop: 1}, "prop", 1) },
            function () { return hasOwn(new F(), "value", 1) },

            function () { return fail({prop: 1}, "toString") },
            function () { return fail({prop: 1}, "value") },
            function () { return fail({prop: 1}, "prop", 2) },
            function () { return fail({prop: 1}, "prop", "1") },
            function () { return fail(new F(), "prop") },
            function () { return fail(new F(), "prop", 1) },
            function () { return fail(new F(), "value", 2) },
        ]
    })

    util.test("notHasOwn", function (notHasOwn, fail) {
        return [
            function () { return fail({prop: 1}, "prop") },
            function () { return fail({prop: 1}, "prop", 1) },
            function () { return fail(new F(), "value", 1) },

            function () { return notHasOwn({prop: 1}, "toString") },
            function () { return notHasOwn({prop: 1}, "value") },
            function () { return notHasOwn({prop: 1}, "prop", 2) },
            function () { return notHasOwn({prop: 1}, "prop", "1") },
            function () { return notHasOwn(new F(), "prop") },
            function () { return notHasOwn(new F(), "prop", 1) },
            function () { return notHasOwn(new F(), "value", 2) },
        ]
    })

    util.test("hasOwnLoose", function (hasOwnLoose, fail) {
        return [
            function () { return hasOwnLoose({prop: 1}, "prop", 1) },
            function () { return hasOwnLoose(new F(), "value", 1) },
            function () { return hasOwnLoose({prop: 1}, "prop", "1") },

            function () { return fail({prop: 1}, "prop", 2) },
            function () { return fail(new F(), "prop", 1) },
            function () { return fail(new F(), "value", 2) },
        ]
    })

    util.test("notHasOwnLoose", function (notHasOwnLoose, fail) {
        return [
            function () { return fail({prop: 1}, "prop", 1) },
            function () { return fail(new F(), "value", 1) },
            function () { return fail({prop: 1}, "prop", "1") },

            function () { return notHasOwnLoose({prop: 1}, "prop", 2) },
            function () { return notHasOwnLoose(new F(), "prop", 1) },
            function () { return notHasOwnLoose(new F(), "value", 2) },
        ]
    })

    util.test("hasKey", function (hasKey, fail) {
        return [
            function () { return hasKey({prop: 1}, "prop") },
            function () { return hasKey({prop: 1}, "prop", 1) },
            function () { return hasKey(new F(), "value", 1) },
            function () { return hasKey({prop: 1}, "toString") },
            function () { return hasKey(new F(), "prop") },
            function () { return hasKey(new F(), "prop", 1) },

            function () { return fail({prop: 1}, "value") },
            function () { return fail({prop: 1}, "prop", 2) },
            function () { return fail({prop: 1}, "prop", "1") },
            function () { return fail(new F(), "value", 2) },
        ]
    })

    util.test("notHasKey", function (notHasKey, fail) {
        return [
            function () { return fail({prop: 1}, "prop") },
            function () { return fail({prop: 1}, "prop", 1) },
            function () { return fail(new F(), "value", 1) },
            function () { return fail({prop: 1}, "toString") },
            function () { return fail(new F(), "prop") },
            function () { return fail(new F(), "prop", 1) },

            function () { return notHasKey({prop: 1}, "value") },
            function () { return notHasKey({prop: 1}, "prop", 2) },
            function () { return notHasKey({prop: 1}, "prop", "1") },
            function () { return notHasKey(new F(), "value", 2) },
        ]
    })

    util.test("hasKeyLoose", function (hasKeyLoose, fail) {
        return [
            function () { return hasKeyLoose({prop: 1}, "prop", 1) },
            function () { return hasKeyLoose(new F(), "value", 1) },
            function () { return hasKeyLoose(new F(), "prop", 1) },
            function () { return hasKeyLoose({prop: 1}, "prop", "1") },

            function () { return fail({prop: 1}, "prop", 2) },
            function () { return fail(new F(), "value", 2) },
        ]
    })

    util.test("notHasKeyLoose", function (notHasKeyLoose, fail) {
        return [
            function () { return fail({prop: 1}, "prop", 1) },
            function () { return fail(new F(), "value", 1) },
            function () { return fail(new F(), "prop", 1) },
            function () { return fail({prop: 1}, "prop", "1") },

            function () { return notHasKeyLoose({prop: 1}, "prop", 2) },
            function () { return notHasKeyLoose(new F(), "value", 2) },
        ]
    })

    if (typeof Map !== "undefined") {
        util.test("has", function (has, fail) {
            return [
                function () { return has(new Map([["prop", 1]]), "prop") },
                function () { return has(new Map([["prop", 1]]), "prop", 1) },

                function () { return fail(new Map([["prop", 1]]), "value") },
                function () { return fail(new Map([["prop", 1]]), "prop", 2) },
                function () {
                    return fail(new Map([["prop", 1]]), "prop", "1")
                },
            ]
        })

        util.test("notHas", function (notHas, fail) {
            return [
                function () { return fail(new Map([["prop", 1]]), "prop") },
                function () { return fail(new Map([["prop", 1]]), "prop", 1) },

                function () { return notHas(new Map([["prop", 1]]), "value") },
                function () {
                    return notHas(new Map([["prop", 1]]), "prop", 2)
                },
                function () {
                    return notHas(new Map([["prop", 1]]), "prop", "1")
                },
            ]
        })

        util.test("hasLoose", function (hasLoose, fail) {
            return [
                function () {
                    return hasLoose(new Map([["prop", 1]]), "prop", 1)
                },
                function () {
                    return hasLoose(new Map([["prop", 1]]), "prop", "1")
                },

                function () { return fail(new Map([["prop", 1]]), "prop", 2) },
            ]
        })

        util.test("notHasLoose", function (notHasLoose, fail) {
            return [
                function () { return fail(new Map([["prop", 1]]), "prop", 1) },
                function () {
                    return fail(new Map([["prop", 1]]), "prop", "1")
                },

                function () {
                    return notHasLoose(new Map([["prop", 1]]), "prop", 2)
                },
            ]
        })
    }
})
