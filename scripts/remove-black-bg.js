const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');
const { PNG } = require('pngjs');

const inputPath = path.resolve(__dirname, '..', 'public', 'eto-logo.jpg');
const outputPath = path.resolve(__dirname, '..', 'public', 'eto-logo-transparent.png');

const jpgBuffer = fs.readFileSync(inputPath);
const decoded = jpeg.decode(jpgBuffer, { useTArray: true });
const { width, height, data } = decoded;

const isDark = (i, threshold) => {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  return r <= threshold && g <= threshold && b <= threshold;
};

const threshold = 32;
const visited = new Uint8Array(width * height);
const queue = [];

const push = (x, y) => {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const idx = y * width + x;
  if (visited[idx]) return;
  const pixel = idx * 4;
  if (!isDark(pixel, threshold)) return;
  visited[idx] = 1;
  queue.push(idx);
};

for (let x = 0; x < width; x += 1) {
  push(x, 0);
  push(x, height - 1);
}
for (let y = 0; y < height; y += 1) {
  push(0, y);
  push(width - 1, y);
}

for (let q = 0; q < queue.length; q += 1) {
  const idx = queue[q];
  const x = idx % width;
  const y = Math.floor(idx / width);
  push(x + 1, y);
  push(x - 1, y);
  push(x, y + 1);
  push(x, y - 1);
}

const png = new PNG({ width, height });

for (let i = 0; i < width * height; i += 1) {
  const p = i * 4;
  png.data[p] = data[p];
  png.data[p + 1] = data[p + 1];
  png.data[p + 2] = data[p + 2];
  png.data[p + 3] = visited[i] ? 0 : 255;
}

const out = PNG.sync.write(png);
fs.writeFileSync(outputPath, out);
console.log(`Wrote transparent logo: ${outputPath}`);
