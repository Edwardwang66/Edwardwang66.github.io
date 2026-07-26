import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(
  root,
  "public/ece276a/ece276a-editorial-triptych.png"
);

const width = 1560;
const height = 840;
const padding = 36;
const gutter = 9;
const panelWidth = 490;
const panelHeight = 768;
const radius = 12;
const markSize = 36;
const markInset = 18;

const panels = [
  {
    source: "public/ece276a/posters/pr1-orientation.png",
    label: "01",
    focalX: 0.32,
    focalY: 0.55,
  },
  {
    source: "public/ece276a/posters/pr2-lidar-slam.png",
    label: "02",
    focalX: 0.5,
    focalY: 0.48,
  },
  {
    source: "public/ece276a/posters/pr3-visual-inertial-slam.png",
    label: "03",
    focalX: 0.48,
    focalY: 0.5,
  },
];

const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));

function roundedMask() {
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg"
      width="${panelWidth}" height="${panelHeight}">
      <rect width="${panelWidth}" height="${panelHeight}"
        rx="${radius}" fill="#ffffff"/>
    </svg>
  `);
}

function sequenceMark(label) {
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg"
      width="${markSize}" height="${markSize}">
      <circle cx="18" cy="18" r="18" fill="#a78032"/>
      <text x="18" y="18" text-anchor="middle" dominant-baseline="central"
        fill="#ffffff" font-family="Arial, sans-serif" font-size="12"
        font-weight="700">${label}</text>
    </svg>
  `);
}

async function cropPanel({ source, focalX, focalY }) {
  const sourcePath = path.join(root, source);
  const metadata = await sharp(sourcePath).metadata();
  const scale = Math.max(
    panelWidth / metadata.width,
    panelHeight / metadata.height
  );
  const resizedWidth = Math.ceil(metadata.width * scale);
  const resizedHeight = Math.ceil(metadata.height * scale);
  const left = clamp(
    Math.round((resizedWidth - panelWidth) * focalX),
    0,
    resizedWidth - panelWidth
  );
  const top = clamp(
    Math.round((resizedHeight - panelHeight) * focalY),
    0,
    resizedHeight - panelHeight
  );

  return sharp(sourcePath)
    .resize(resizedWidth, resizedHeight, { fit: "fill" })
    .extract({
      left,
      top,
      width: panelWidth,
      height: panelHeight,
    })
    .composite([{ input: roundedMask(), blend: "dest-in" }])
    .png()
    .toBuffer();
}

await mkdir(path.dirname(output), { recursive: true });

const composites = [];
for (const [index, panel] of panels.entries()) {
  const left = padding + index * (panelWidth + gutter);
  const top = padding;
  composites.push({
    input: await cropPanel(panel),
    left,
    top,
  });
  composites.push({
    input: sequenceMark(panel.label),
    left: left + panelWidth - markSize - markInset,
    top: top + panelHeight - markSize - markInset,
  });
}

await sharp({
  create: {
    width,
    height,
    channels: 4,
    background: "#17364c",
  },
})
  .composite(composites)
  .png({
    compressionLevel: 9,
    adaptiveFiltering: true,
  })
  .toFile(output);

const result = await sharp(output).metadata();
if (result.width !== width || result.height !== height || result.format !== "png") {
  throw new Error(
    `Unexpected ECE 276A triptych output: ${result.width}x${result.height} ${result.format}`
  );
}

console.log(
  `Built ${path.relative(root, output)} (${result.width}x${result.height})`
);
