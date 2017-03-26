/* eslint-env node */
"use strict"

module.exports = function (config) {
    config.set({
        basePath: __dirname,
        restartOnFileChange: true,

        // browsers: ["Chrome", "Firefox", "PhantomJS"]
        frameworks: ["browserify", "mocha"],

        customLaunchers: {
            ChromeTravisCI: {
                base: "Chrome",
                flags: ["--no-sandbox"],
            },

            PhantomJSDebug: {
                base: "PhantomJS",
                debug: true,
            },
        },

        files: [
            "https://cdnjs.cloudflare.com/ajax/libs/es6-promise/4.1.0/es6-promise.auto.min.js",
            "./test/**/*.js",
        ],
        preprocessors: {
            "./test/**/*.js": ["browserify"],
        },
        singleRun: !!process.env.TRAVIS,
    })
}
