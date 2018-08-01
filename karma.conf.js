/* eslint-env node */
"use strict"

module.exports = function (config) {
    config.set({
        basePath: __dirname,
        restartOnFileChange: true,

        // browsers: ["Chrome", "Firefox"]
        frameworks: ["browserify", "mocha"],

        customLaunchers: {
            ChromeTravisCI: {
                base: "Chrome",
                flags: ["--no-sandbox"],
            },
        },

        files: [
            "./test/**/*.js",
        ],

        preprocessors: {
            "./test/**/*.js": ["browserify"],
        },

        singleRun: !!process.env.TRAVIS,
    })
}
