const fs = require("fs");
const path = require("path");

const rawResortData = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "data/raw-resort-data.geojson"),
    "utf-8",
  ),
);

const myResorts = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "data/colorado-ski-resorts.json"),
    "utf-8",
  ),
);

function polygonCenter(coordinates) {
  const points = coordinates[0];
  const lat = points.reduce((sum, p) => sum + p[1], 0) / points.length;
  const lng = points.reduce((sum, p) => sum + p[0], 0) / points.length;
  return { lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) };
}

function toFeet(meters) {
  return Math.round(meters * 3.28084);
}

const output = myResorts.map((resort) => {
  const feature = rawResortData.features.find(
    (f) => f.properties.id === resort.id,
  );

  if (!feature) {
    console.warn(`No match found for: ${resort.name} (${resort.id})`);
    return resort;
  }

  const stats = feature.properties.statistics;

  let lat = resort.lat;
  let lng = resort.lng ?? resort.long;

  if (feature.geometry.type === "Polygon") {
    const center = polygonCenter(feature.geometry.coordinates);
    lat = center.lat;
    lng = center.lng;
  } else if (feature.geometry.type === "Point") {
    lng = feature.geometry.coordinates[0];
    lat = feature.geometry.coordinates[1];
  }

  const summitMeters = stats?.maxElevation ?? null;
  const baseMeters = stats?.minElevation ?? null;

  return {
    id: resort.id,
    name: resort.name,
    lat,
    lng,
    pass: resort.pass,
    passAccess: resort.passAccess ?? null,
    base: baseMeters ? toFeet(baseMeters) : resort.base,
    summit: summitMeters ? toFeet(summitMeters) : resort.summit,
    state: resort.state,
  };
});

const outputPath = path.join(
  process.cwd(),
  "public/colorado-resorts-enriched.json",
);
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(
  `Written ${output.length} resorts to colorado-resorts-enriched.json`,
);

const missing = output.filter((r) => r.lat === 1);
if (missing.length > 0) {
  console.warn(`\nResorts still missing coords (${missing.length}):`);
  missing.forEach((r) => console.warn(` - ${r.name}`));
}
