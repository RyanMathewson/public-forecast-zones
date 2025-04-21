import * as fs from 'fs';
import * as path from 'path';

// 👇 Path to your big GeoJSON file
const inputFile = './z_18mr25.json';
// 👇 Directory to store split files
const outputDir = path.resolve(__dirname, 'output_states');

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
    console.warn(`⚠️ Feature ${i} is missing STATE:`, feature.properties);
  }
});

for (const state in grouped) {
  const featureCollection = {
    type: 'FeatureCollection',
    features: grouped[state],
  };
  const outputPath = path.join(outputDir, `${state}.geojson`);
  fs.writeFileSync(outputPath, JSON.stringify(featureCollection, null, 2));
  console.log(`✅ Wrote ${grouped[state].length} features to ${state}.geojson`);
}

console.log(`🎉 Done! Files written to: ${outputDir}`);
