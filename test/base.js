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

    describe("ok()", function () {
        it("works", function () {
            assert.ok(true)
            assert.ok(1)
            assert.ok(Infinity)
            assert.ok("foo")
            assert.ok({})
            assert.ok([])
            assert.ok(new Date())
            if (typeof Symbol === "function") assert.ok(Symbol())

            util.fail("ok")
            util.fail("ok", undefined)
            util.fail("ok", null)
            util.fail("ok", false)
            util.fail("ok", 0)
            util.fail("ok", "")
            util.fail("ok", NaN)
        })
    })

    describe("notOk()", function () {
        it("works", function () {
            util.fail("notOk", true)
            util.fail("notOk", 1)
            util.fail("notOk", Infinity)
            util.fail("notOk", "foo")
            util.fail("notOk", {})
            util.fail("notOk", [])
            util.fail("notOk", new Date())
            if (typeof Symbol === "function") util.fail("notOk", Symbol())

            assert.notOk()
            assert.notOk(undefined)
            assert.notOk(null)
            assert.notOk(false)
            assert.notOk(0)
            assert.notOk("")
            assert.notOk(NaN)
        })
    })

    describe("equal()", function () {
        it("works", function () {
            assert.equal(0, 0)
            assert.equal(1, 1)
            assert.equal(null, null)
            assert.equal(undefined, undefined)
            assert.equal(Infinity, Infinity)
            assert.equal(NaN, NaN)
            assert.equal("", "")
            assert.equal("foo", "foo")

            var obj = {}

            assert.equal(obj, obj)

            util.fail("equal", {}, {})
            util.fail("equal", null, undefined)
            util.fail("equal", 0, 1)
            util.fail("equal", 1, "1")
        })
    })

    describe("notEqual()", function () {
        it("works", function () {
            util.fail("notEqual", 0, 0)
            util.fail("notEqual", 1, 1)
            util.fail("notEqual", null, null)
            util.fail("notEqual", undefined, undefined)
            util.fail("notEqual", Infinity, Infinity)
            util.fail("notEqual", NaN, NaN)
            util.fail("notEqual", "", "")
            util.fail("notEqual", "foo", "foo")

            var obj = {}

            util.fail("notEqual", obj, obj)

            assert.notEqual({}, {})
            assert.notEqual(null, undefined)
            assert.notEqual(0, 1)
            assert.notEqual(1, "1")
        })
    })

    describe("equalLoose()", function () {
        it("works", function () {
            assert.equalLoose(0, 0)
            assert.equalLoose(1, 1)
            assert.equalLoose(null, null)
            assert.equalLoose(undefined, undefined)
            assert.equalLoose(Infinity, Infinity)
            assert.equalLoose(NaN, NaN)
            assert.equalLoose("", "")
            assert.equalLoose("foo", "foo")
            assert.equalLoose(null, undefined)
            assert.equalLoose(1, "1")

            var obj = {}

            assert.equalLoose(obj, obj)

            util.fail("equalLoose", {}, {})
            util.fail("equalLoose", 0, 1)
        })
    })

    describe("notEqualLoose()", function () {
        it("works", function () {
            util.fail("notEqualLoose", 0, 0)
            util.fail("notEqualLoose", 1, 1)
            util.fail("notEqualLoose", null, null)
            util.fail("notEqualLoose", undefined, undefined)
            util.fail("notEqualLoose", Infinity, Infinity)
            util.fail("notEqualLoose", NaN, NaN)
            util.fail("notEqualLoose", "", "")
            util.fail("notEqualLoose", "foo", "foo")
            util.fail("notEqualLoose", null, undefined)
            util.fail("notEqualLoose", 1, "1")

            var obj = {}

            util.fail("notEqualLoose", obj, obj)

            assert.notEqualLoose({}, {})
            assert.notEqualLoose(0, 1)
        })
    })

    describe("deepEqual()", function () {
        it("works", function () {
            assert.deepEqual(0, 0)
            assert.deepEqual(1, 1)
            assert.deepEqual(null, null)
            assert.deepEqual(undefined, undefined)
            assert.deepEqual(Infinity, Infinity)
            assert.deepEqual(NaN, NaN)
            assert.deepEqual("", "")
            assert.deepEqual("foo", "foo")

            var obj = {}

            assert.deepEqual(obj, obj)

            assert.deepEqual({}, {})
            util.fail("deepEqual", null, undefined)
            util.fail("deepEqual", 0, 1)
            util.fail("deepEqual", 1, "1")
            assert.deepEqual({a: [2, 3], b: [4]}, {a: [2, 3], b: [4]})
        })
    })

    describe("notDeepEqual()", function () {
        it("works", function () {
            util.fail("notDeepEqual", 0, 0)
            util.fail("notDeepEqual", 1, 1)
            util.fail("notDeepEqual", null, null)
            util.fail("notDeepEqual", undefined, undefined)
            util.fail("notDeepEqual", Infinity, Infinity)
            util.fail("notDeepEqual", NaN, NaN)
            util.fail("notDeepEqual", "", "")
            util.fail("notDeepEqual", "foo", "foo")

            var obj = {}

            util.fail("notDeepEqual", obj, obj)

            util.fail("notDeepEqual", {}, {})
            assert.notDeepEqual(null, undefined)
            assert.notDeepEqual(0, 1)
            assert.notDeepEqual(1, "1")
            util.fail("notDeepEqual", {a: [2, 3], b: [4]}, {a: [2, 3], b: [4]})
        })
    })

    function F() { this.value = 1 }
    F.prototype.prop = 1

    describe("hasOwn()", function () {
        it("works", function () {
            assert.hasOwn({prop: 1}, "prop")
            assert.hasOwn({prop: 1}, "prop", 1)
            assert.hasOwn(new F(), "value", 1)

            util.fail("hasOwn", {prop: 1}, "toString")
            util.fail("hasOwn", {prop: 1}, "value")
            util.fail("hasOwn", {prop: 1}, "prop", 2)
            util.fail("hasOwn", {prop: 1}, "prop", "1")
            util.fail("hasOwn", new F(), "prop")
            util.fail("hasOwn", new F(), "prop", 1)
            util.fail("hasOwn", new F(), "value", 2)
        })
    })

    describe("notHasOwn()", function () {
        it("works", function () {
            util.fail("notHasOwn", {prop: 1}, "prop")
            util.fail("notHasOwn", {prop: 1}, "prop", 1)
            util.fail("notHasOwn", new F(), "value", 1)

            assert.notHasOwn({prop: 1}, "toString")
            assert.notHasOwn({prop: 1}, "value")
            assert.notHasOwn({prop: 1}, "prop", 2)
            assert.notHasOwn({prop: 1}, "prop", "1")
            assert.notHasOwn(new F(), "prop")
            assert.notHasOwn(new F(), "prop", 1)
            assert.notHasOwn(new F(), "value", 2)
        })
    })

    describe("hasOwnLoose()", function () {
        it("works", function () {
            assert.hasOwnLoose({prop: 1}, "prop", 1)
            assert.hasOwnLoose(new F(), "value", 1)
            assert.hasOwnLoose({prop: 1}, "prop", "1")

            util.fail("hasOwnLoose", {prop: 1}, "prop", 2)
            util.fail("hasOwnLoose", new F(), "prop", 1)
            util.fail("hasOwnLoose", new F(), "value", 2)
        })
    })

    describe("notHasOwnLoose()", function () {
        it("works", function () {
            util.fail("notHasOwnLoose", {prop: 1}, "prop", 1)
            util.fail("notHasOwnLoose", new F(), "value", 1)
            util.fail("notHasOwnLoose", {prop: 1}, "prop", "1")

            assert.notHasOwnLoose({prop: 1}, "prop", 2)
            assert.notHasOwnLoose(new F(), "prop", 1)
            assert.notHasOwnLoose(new F(), "value", 2)
        })
    })

    describe("hasKey()", function () {
        it("works", function () {
            assert.hasKey({prop: 1}, "prop")
            assert.hasKey({prop: 1}, "prop", 1)
            assert.hasKey(new F(), "value", 1)
            assert.hasKey({prop: 1}, "toString")
            assert.hasKey(new F(), "prop")
            assert.hasKey(new F(), "prop", 1)

            util.fail("hasKey", {prop: 1}, "value")
            util.fail("hasKey", {prop: 1}, "prop", 2)
            util.fail("hasKey", {prop: 1}, "prop", "1")
            util.fail("hasKey", new F(), "value", 2)
        })
    })

    describe("notHasKey()", function () {
        it("works", function () {
            util.fail("notHasKey", {prop: 1}, "prop")
            util.fail("notHasKey", {prop: 1}, "prop", 1)
            util.fail("notHasKey", new F(), "value", 1)
            util.fail("notHasKey", {prop: 1}, "toString")
            util.fail("notHasKey", new F(), "prop")
            util.fail("notHasKey", new F(), "prop", 1)

            assert.notHasKey({prop: 1}, "value")
            assert.notHasKey({prop: 1}, "prop", 2)
            assert.notHasKey({prop: 1}, "prop", "1")
            assert.notHasKey(new F(), "value", 2)
        })
    })

    describe("hasKeyLoose()", function () {
        it("works", function () {
            assert.hasKeyLoose({prop: 1}, "prop", 1)
            assert.hasKeyLoose(new F(), "value", 1)
            assert.hasKeyLoose(new F(), "prop", 1)
            assert.hasKeyLoose({prop: 1}, "prop", "1")

            util.fail("hasKeyLoose", {prop: 1}, "prop", 2)
            util.fail("hasKeyLoose", new F(), "value", 2)
        })
    })

    describe("notHasKeyLoose()", function () {
        it("works", function () {
            util.fail("notHasKeyLoose", {prop: 1}, "prop", 1)
            util.fail("notHasKeyLoose", new F(), "value", 1)
            util.fail("notHasKeyLoose", new F(), "prop", 1)
            util.fail("notHasKeyLoose", {prop: 1}, "prop", "1")

            assert.notHasKeyLoose({prop: 1}, "prop", 2)
            assert.notHasKeyLoose(new F(), "value", 2)
        })
    })

    if (typeof Map !== "undefined") {
        describe("has()", function () {
            it("works", function () {
                assert.has(new Map([["prop", 1]]), "prop")
                assert.has(new Map([["prop", 1]]), "prop", 1)

                util.fail("has", new Map([["prop", 1]]), "value")
                util.fail("has", new Map([["prop", 1]]), "prop", 2)
                util.fail("has", new Map([["prop", 1]]), "prop", "1")
            })
        })

        describe("notHas()", function () {
            it("works", function () {
                util.fail("notHas", new Map([["prop", 1]]), "prop")
                util.fail("notHas", new Map([["prop", 1]]), "prop", 1)

                assert.notHas(new Map([["prop", 1]]), "value")
                assert.notHas(new Map([["prop", 1]]), "prop", 2)
                assert.notHas(new Map([["prop", 1]]), "prop", "1")
            })
        })

        describe("hasLoose()", function () {
            it("works", function () {
                assert.hasLoose(new Map([["prop", 1]]), "prop", 1)
                assert.hasLoose(new Map([["prop", 1]]), "prop", "1")

                util.fail("hasLoose", new Map([["prop", 1]]), "prop", 2)
            })
        })

        describe("notHasLoose()", function () {
            it("works", function () {
                util.fail("notHasLoose", new Map([["prop", 1]]), "prop", 1)
                util.fail("notHasLoose", new Map([["prop", 1]]), "prop", "1")

                assert.notHasLoose(new Map([["prop", 1]]), "prop", 2)
            })
        })
    }
})
