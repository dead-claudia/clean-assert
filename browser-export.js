/* eslint-disable no-undef, global-require */
"use strict"

if (typeof define === "function" && define.amd) {
    define("clean-assert", function () { return require("./index") })
} else {
    global.assert = require("./index")
}
