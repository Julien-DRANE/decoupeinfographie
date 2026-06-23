const test = require("node:test");
const assert = require("node:assert/strict");

const DetectionCore = require("../detection-core.js");

function rgba(width, height, color) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let index = 0; index < width * height; index += 1) {
    data[index * 4] = color.r;
    data[index * 4 + 1] = color.g;
    data[index * 4 + 2] = color.b;
    data[index * 4 + 3] = color.a ?? 255;
  }
  return data;
}

test("detectZonesFromImageData finds a foreground block on a plain background", () => {
  const width = 20;
  const height = 20;
  const data = rgba(width, height, { r: 255, g: 255, b: 255 });
  for (let y = 5; y < 12; y += 1) {
    for (let x = 6; x < 14; x += 1) {
      const index = (y * width + x) * 4;
      data[index] = 20;
      data[index + 1] = 20;
      data[index + 2] = 20;
    }
  }

  const result = DetectionCore.detectZonesFromImageData(
    data,
    width,
    height,
    { mode: "components" },
    { threshold: 60, minArea: 10, padding: 1, mergeDistance: 0 }
  );

  assert.equal(result.filteredBoxes.length, 1);
  assert.deepEqual(
    {
      x: result.filteredBoxes[0].x,
      y: result.filteredBoxes[0].y,
      width: result.filteredBoxes[0].width,
      height: result.filteredBoxes[0].height,
    },
    { x: 5, y: 4, width: 10, height: 9 }
  );
  assert.equal(result.diagnostics.keptCount, 1);
});

test("mergeNearbyBoxes combines boxes inside the configured distance", () => {
  const boxes = [
    { x: 0, y: 0, width: 5, height: 5, area: 25 },
    { x: 8, y: 0, width: 5, height: 5, area: 25 },
  ];

  assert.equal(DetectionCore.mergeNearbyBoxes(boxes, 2).length, 2);
  assert.deepEqual(DetectionCore.mergeNearbyBoxes(boxes, 3)[0], { x: 0, y: 0, width: 13, height: 5, area: 50 });
});
