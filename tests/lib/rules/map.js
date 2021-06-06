/**
 * @fileoverview replace lodash map to native
 * @author Adamov A.
 */
"use strict";

var rule = require("../../../lib/rules/map"),

    RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();
ruleTester.run("map", rule, {

    valid: [
        {
            code: `[1,2].map(fn)`,
        },
        {
            code: `_.map({a: 1, b: 2}, fn)`,
        }
    ],

    invalid: [
        {
            code: `_.map([1,2,3], fn)`,
            errors: [{
                suggestions: [{
                    desc: "replace lodash map to native",
                    output: `[1,2,3].map(fn)`
                }],
            }],
        },
        {
            code: `var arr = [1,2]; _.map(arr, fn);`,
            errors: [{
                suggestions: [{
                    desc: "replace lodash map to native",
                    output: `var arr = [1,2]; Array.isArray(arr) ? arr.map(fn) : _.map(arr, fn);`
                }],
            }],
        }
    ],
});
