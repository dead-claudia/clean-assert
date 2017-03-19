"use strict"

/* global Promise */

var type = require("./lib/type")
var equal = require("./lib/equal")
var throws = require("./lib/throws")
var has = require("./lib/has")
var includes = require("./lib/includes")
var hasKeys = require("./lib/has-keys")

function makeAsyncApi(api) {
    return Object.keys(api).reduce(function (asyncApi, method) {
        asyncApi[method] = createAsyncMethodProxy(api[method])

        return asyncApi
    }, {})
}

function createAsyncMethodProxy(method) {
    return function proxy(expr) {
        var args = [undefined]

        for (var i = 1; i < arguments.length; i++) {
            args.push(arguments[i])
        }

        return Promise.resolve(expr)
            .then(function (value) {
                args[0] = value

                method.apply(undefined, args)
            }
        )
    }
}

module.exports = makeAsyncApi({
    ok: type.ok,
    notOk: type.notOk,
    isBoolean: type.isBoolean,
    notBoolean: type.notBoolean,
    isFunction: type.isFunction,
    notFunction: type.notFunction,
    isNumber: type.isNumber,
    notNumber: type.notNumber,
    isObject: type.isObject,
    notObject: type.notObject,
    isString: type.isString,
    notString: type.notString,
    isSymbol: type.isSymbol,
    notSymbol: type.notSymbol,
    exists: type.exists,
    notExists: type.notExists,
    isArray: type.isArray,
    notArray: type.notArray,
    is: type.is,
    not: type.not,

    equal: equal.equal,
    notEqual: equal.notEqual,
    equalLoose: equal.equalLoose,
    notEqualLoose: equal.notEqualLoose,
    deepEqual: equal.deepEqual,
    notDeepEqual: equal.notDeepEqual,
    match: equal.match,
    notMatch: equal.notMatch,
    atLeast: equal.atLeast,
    atMost: equal.atMost,
    above: equal.above,
    below: equal.below,
    between: equal.between,
    closeTo: equal.closeTo,
    notCloseTo: equal.notCloseTo,

    throws: throws.throws,
    throwsMatch: throws.throwsMatch,

    hasOwn: has.hasOwn,
    notHasOwn: has.notHasOwn,
    hasOwnLoose: has.hasOwnLoose,
    notHasOwnLoose: has.notHasOwnLoose,
    hasKey: has.hasKey,
    notHasKey: has.notHasKey,
    hasKeyLoose: has.hasKeyLoose,
    notHasKeyLoose: has.notHasKeyLoose,
    has: has.has,
    notHas: has.notHas,
    hasLoose: has.hasLoose,
    notHasLoose: has.notHasLoose,

    includes: includes.includes,
    includesDeep: includes.includesDeep,
    includesMatch: includes.includesMatch,
    includesAny: includes.includesAny,
    includesAnyDeep: includes.includesAnyDeep,
    includesAnyMatch: includes.includesAnyMatch,
    notIncludesAll: includes.notIncludesAll,
    notIncludesAllDeep: includes.notIncludesAllDeep,
    notIncludesAllMatch: includes.notIncludesAllMatch,
    notIncludes: includes.notIncludes,
    notIncludesDeep: includes.notIncludesDeep,
    notIncludesMatch: includes.notIncludesMatch,

    hasKeys: hasKeys.hasKeys,
    hasKeysDeep: hasKeys.hasKeysDeep,
    hasKeysMatch: hasKeys.hasKeysMatch,
    hasKeysAny: hasKeys.hasKeysAny,
    hasKeysAnyDeep: hasKeys.hasKeysAnyDeep,
    hasKeysAnyMatch: hasKeys.hasKeysAnyMatch,
    notHasKeysAll: hasKeys.notHasKeysAll,
    notHasKeysAllDeep: hasKeys.notHasKeysAllDeep,
    notHasKeysAllMatch: hasKeys.notHasKeysAllMatch,
    notHasKeys: hasKeys.notHasKeys,
    notHasKeysDeep: hasKeys.notHasKeysDeep,
    notHasKeysMatch: hasKeys.notHasKeysMatch,
})
