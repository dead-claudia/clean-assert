"use strict"

/* globals Promise:true */

function makeAsyncApi(api) {
    return Object.keys(api).reduce(function (asyncApi, method) {
        if (isWrapableMethod(method, api)) {
            asyncApi[method] = createAsyncMethodProxy(api[method])
        }

        return asyncApi
    }, {})
}

function isWrapableMethod(method, api) {
    return method !== "async" &&
        method !== "AssertionError" &&
        typeof api[method] === "function"
}

function createAsyncMethodProxy(method) {
    return function proxy(expr) {
        var rest = Array.from(arguments).slice(1)

        return Promise.resolve(expr)
            .then(function (value) {
                method.apply(undefined, [value].concat(rest))
            }
        )
    }
}

module.exports = makeAsyncApi
