/* eslint-env node */
"use strict"

module.exports = function (config) {
    config.set({
        basePath: __dirname,
        restartOnFileChange: true,

        // browsers: ["Chrome", "Firefox", "PhantomJS"]
        frameworks: ["mocha"],

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

        files: ["./clean-match.js", "./test.js"],

        singleRun: !!process.env.TRAVIS,
    })
}
