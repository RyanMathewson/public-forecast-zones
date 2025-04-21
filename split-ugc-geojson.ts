import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

const inputFile = './z_18mr25.json';
const outputDir = path.resolve(__dirname, 'z_18mr25');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const rawData = fs.readFileSync(inputFile, 'utf-8');
const geojson = JSON.parse(rawData);

console.log(`Total features: ${geojson.features.length}`);

const grouped: Record<string, any[]> = {};

geojson.features.forEach((feature: any, i: number) => {
  const state = feature.properties?.STATE;
  if (state && typeof state === 'string') {
    if (!grouped[state]) grouped[state] = [];
    grouped[state].push(feature);
  } else {
    console.warn(`⚠️ Feature ${i} is missing STATE`);
  }
});

for (const state in grouped) {
  const featureCollection = {
    type: 'FeatureCollection',
    features: grouped[state],
  };

  const jsonData = JSON.stringify(featureCollection); // minified
  const outputPath = path.join(outputDir, `${state}.geojson`);
  const gzipPath = `${outputPath}.gz`;

  // Write .geojson
  fs.writeFileSync(outputPath, jsonData);

  // Write .geojson.gz
  const gzipped = zlib.gzipSync(jsonData);
  fs.writeFileSync(gzipPath, gzipped);

  console.log(`✅ Wrote ${grouped[state].length} features to ${state}.geojson and ${state}.geojson.gz`);
}

console.log(`🎉 Done! Files written to: ${outputDir}`);
