"use strict"

/* global Promise */

var type = require("./lib/type")
var equal = require("./lib/equal")
var throwsAsync = require("./lib/throws-async")
var has = require("./lib/has")
var includes = require("./lib/includes")
var hasKeys = require("./lib/has-keys")

function unary(method) {
    return function (value) {
        return Promise.resolve(value).then(method)
    }
}

function binary(method) {
    return function (value, expected) {
        return Promise.resolve(value).then(function (value) {
            method(value, expected)
        })
    }
}

function ternary(method) {
    return function (value, a, b) {
        return Promise.resolve(value).then(function (value) {
            method(value, a, b)
        })
    }
}

function optTernary(method) {
    return function (object, a, b) {
        if (arguments.length >= 3) {
            return Promise.resolve(object).then(function (object) {
                method(object, a, b)
            })
        } else {
            return Promise.resolve(object).then(function (object) {
                method(object, a)
            })
        }
    }
}

exports.ok = unary(type.ok)
exports.notOk = unary(type.notOk)
exports.isBoolean = unary(type.isBoolean)
exports.notBoolean = unary(type.notBoolean)
exports.isFunction = unary(type.isFunction)
exports.notFunction = unary(type.notFunction)
exports.isNumber = unary(type.isNumber)
exports.notNumber = unary(type.notNumber)
exports.isObject = unary(type.isObject)
exports.notObject = unary(type.notObject)
exports.isString = unary(type.isString)
exports.notString = unary(type.notString)
exports.isSymbol = unary(type.isSymbol)
exports.notSymbol = unary(type.notSymbol)
exports.exists = unary(type.exists)
exports.notExists = unary(type.notExists)
exports.isArray = unary(type.isArray)
exports.notArray = unary(type.notArray)
exports.isIterable = unary(type.isIterable)
exports.notIterable = unary(type.notIterable)

exports.is = function (Type, object) {
    return Promise.resolve(object).then(function (object) {
        type.is(Type, object)
    })
}

exports.not = function (Type, object) {
    return Promise.resolve(object).then(function (object) {
        type.not(Type, object)
    })
}

exports.equal = binary(equal.equal)
exports.notEqual = binary(equal.notEqual)
exports.equalLoose = binary(equal.equalLoose)
exports.notEqualLoose = binary(equal.notEqualLoose)
exports.deepEqual = binary(equal.deepEqual)
exports.notDeepEqual = binary(equal.notDeepEqual)
exports.match = binary(equal.match)
exports.notMatch = binary(equal.notMatch)
exports.atLeast = binary(equal.atLeast)
exports.atMost = binary(equal.atMost)
exports.above = binary(equal.above)
exports.below = binary(equal.below)
exports.between = ternary(equal.between)
exports.closeTo = ternary(equal.closeTo)
exports.notCloseTo = ternary(equal.notCloseTo)

exports.throws = throwsAsync.throws
exports.throwsMatch = throwsAsync.throwsMatch

exports.hasOwn = optTernary(has.hasOwn)
exports.notHasOwn = optTernary(has.notHasOwn)
exports.hasOwnLoose = optTernary(has.hasOwnLoose)
exports.notHasOwnLoose = optTernary(has.notHasOwnLoose)
exports.hasKey = optTernary(has.hasKey)
exports.notHasKey = optTernary(has.notHasKey)
exports.hasKeyLoose = optTernary(has.hasKeyLoose)
exports.notHasKeyLoose = optTernary(has.notHasKeyLoose)
exports.has = optTernary(has.has)
exports.notHas = optTernary(has.notHas)
exports.hasLoose = optTernary(has.hasLoose)
exports.notHasLoose = optTernary(has.notHasLoose)

exports.includes = binary(includes.includes)
exports.includesDeep = binary(includes.includesDeep)
exports.includesMatch = binary(includes.includesMatch)
exports.includesAny = binary(includes.includesAny)
exports.includesAnyDeep = binary(includes.includesAnyDeep)
exports.includesAnyMatch = binary(includes.includesAnyMatch)
exports.notIncludesAll = binary(includes.notIncludesAll)
exports.notIncludesAllDeep = binary(includes.notIncludesAllDeep)
exports.notIncludesAllMatch = binary(includes.notIncludesAllMatch)
exports.notIncludes = binary(includes.notIncludes)
exports.notIncludesDeep = binary(includes.notIncludesDeep)
exports.notIncludesMatch = binary(includes.notIncludesMatch)

exports.hasKeys = binary(hasKeys.hasKeys)
exports.hasKeysDeep = binary(hasKeys.hasKeysDeep)
exports.hasKeysMatch = binary(hasKeys.hasKeysMatch)
exports.hasKeysAny = binary(hasKeys.hasKeysAny)
exports.hasKeysAnyDeep = binary(hasKeys.hasKeysAnyDeep)
exports.hasKeysAnyMatch = binary(hasKeys.hasKeysAnyMatch)
exports.notHasKeysAll = binary(hasKeys.notHasKeysAll)
exports.notHasKeysAllDeep = binary(hasKeys.notHasKeysAllDeep)
exports.notHasKeysAllMatch = binary(hasKeys.notHasKeysAllMatch)
exports.notHasKeys = binary(hasKeys.notHasKeys)
exports.notHasKeysDeep = binary(hasKeys.notHasKeysDeep)
exports.notHasKeysMatch = binary(hasKeys.notHasKeysMatch)
