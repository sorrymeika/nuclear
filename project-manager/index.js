
require("@babel/register")({
    cache: true,
    "presets": ["@babel/preset-env"],
    "plugins": [require("@babel/plugin-syntax-dynamic-import").default,
        [require("@babel/plugin-proposal-decorators").default, { "legacy": true }],
        [require("@babel/plugin-proposal-class-properties").default, { "loose": false }],],
});
exports.useProjectManager = require('./useProjectManager').useProjectManager;