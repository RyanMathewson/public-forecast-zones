"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
// 👇 Path to your big GeoJSON file
var inputFile = './z_18mr25.json';
// 👇 Directory to store split files
var outputDir = path.resolve(__dirname, 'z_18mr25');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}
var rawData = fs.readFileSync(inputFile, 'utf-8');
var geojson = JSON.parse(rawData);
console.log("Total features: ".concat(geojson.features.length));
var grouped = {};
geojson.features.forEach(function (feature, i) {
    var _a;
    var state = (_a = feature.properties) === null || _a === void 0 ? void 0 : _a.STATE;
    if (state && typeof state === 'string') {
        if (!grouped[state])
            grouped[state] = [];
        grouped[state].push(feature);
    }
    else {
        console.warn("\u26A0\uFE0F Feature ".concat(i, " is missing STATE:"), feature.properties);
    }
});
for (var state in grouped) {
    var featureCollection = {
        type: 'FeatureCollection',
        features: grouped[state],
    };
    var outputPath = path.join(outputDir, "".concat(state, ".geojson"));
    fs.writeFileSync(outputPath, JSON.stringify(featureCollection));
    console.log("\u2705 Wrote ".concat(grouped[state].length, " features to ").concat(state, ".geojson"));
}
console.log("\uD83C\uDF89 Done! Files written to: ".concat(outputDir));
