"use strict";
const testReporter = () =>
    process.env.REPORTER === "html" ? ["lcov"] : ["text"];

const fullReport = process.env.REPORTER === "html";
const inclusionsExclusions = fullReport
    ?
    {
        include: ["src/**/*.js"],
        exclude: [
            "src/**/activityType.js",
            "src/**/activityType/*.js",
            "src/**/activityTypeParticipant.js",
            "src/**/activityLocale.js",
            "src/**/index.js",
            "test/**/*.js",
            "spec/**/*.js"]
    }
    :
    {
        exclude: ["test/**/*.js", "spec/**/*.js"]
    };

module.exports = {
    reporter: testReporter(),
    all: fullReport,
    ...inclusionsExclusions

};