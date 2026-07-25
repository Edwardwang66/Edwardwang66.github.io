import { createHash } from "node:crypto";
import {
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const SOURCE = {
  width: 1536,
  height: 2288,
  columns: 8,
  rows: 11,
  cellWidth: 192,
  cellHeight: 208,
};
const DERIVATIVE = {
  width: 768,
  height: 416,
  columns: 8,
  rows: 4,
  cellWidth: 96,
  cellHeight: 104,
  states: ["idle", "wave", "look-right", "look-left"],
};
const MAX_BYTES = 400 * 1024;

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index]?.replace(/^--/, "");
    const value = argv[index + 1];
    if (!key || value === undefined) {
      throw new Error(`Invalid argument at index ${index}`);
    }
    values[key] = value;
  }
  for (const key of [
    "source",
    "manifest",
    "package-url",
    "source-url",
    "source-version",
    "output",
    "provenance",
  ]) {
    if (!values[key]) throw new Error(`Missing --${key}`);
  }
  return values;
}

function sha256(path) {
  return createHash("sha256")
    .update(readFileSync(path))
    .digest("hex");
}

const args = parseArgs(process.argv.slice(2));
const sourcePath = resolve(args.source);
const manifestPath = resolve(args.manifest);
const outputPath = resolve(args.output);
const provenancePath = resolve(args.provenance);

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
if (
  manifest.id !== "curry-dog-winter" ||
  manifest.displayName !== "咖喱狗 Curry" ||
  manifest.spriteVersionNumber !== 2 ||
  manifest.spritesheetPath !== "spritesheet.webp"
) {
  throw new Error("Published pet.json does not match Curry Dog Winter v2");
}

const sourceProbe = await sharp(sourcePath).metadata();
if (
  sourceProbe.width !== SOURCE.width ||
  sourceProbe.height !== SOURCE.height ||
  sourceProbe.hasAlpha !== true
) {
  throw new Error(
    `Expected RGBA source ${SOURCE.width}x${SOURCE.height}, got ` +
      `${sourceProbe.width}x${sourceProbe.height}, alpha=` +
      `${sourceProbe.hasAlpha}`
  );
}

mkdirSync(dirname(outputPath), { recursive: true });
mkdirSync(dirname(provenancePath), { recursive: true });

const rowOffsets = [0, 624, 1872, 2080];
const strips = await Promise.all(
  rowOffsets.map((top) =>
    sharp(sourcePath)
      .extract({
        left: 0,
        top,
        width: SOURCE.width,
        height: SOURCE.cellHeight,
      })
      .resize(DERIVATIVE.width, DERIVATIVE.cellHeight, {
        kernel: sharp.kernel.lanczos3,
      })
      .png()
      .toBuffer()
  )
);

await sharp({
  create: {
    width: DERIVATIVE.width,
    height: DERIVATIVE.height,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite(
    strips.map((input, row) => ({
      input,
      left: 0,
      top: row * DERIVATIVE.cellHeight,
    }))
  )
  .webp({ quality: 92, alphaQuality: 100, effort: 6 })
  .toFile(outputPath);

const outputProbe = await sharp(outputPath).metadata();
if (
  outputProbe.width !== DERIVATIVE.width ||
  outputProbe.height !== DERIVATIVE.height ||
  outputProbe.hasAlpha !== true
) {
  throw new Error(
    `Expected RGBA derivative ${DERIVATIVE.width}x${DERIVATIVE.height}, got ` +
      `${outputProbe.width}x${outputProbe.height}, alpha=` +
      `${outputProbe.hasAlpha}`
  );
}

const outputBytes = readFileSync(outputPath).length;
if (outputBytes > MAX_BYTES) {
  throw new Error(
    `Derivative is ${outputBytes} bytes; maximum is ${MAX_BYTES}`
  );
}

const provenance = {
  slug: "curry-dog-winter",
  source: {
    packageUrl: args["package-url"],
    url: args["source-url"],
    version: args["source-version"],
    displayName: manifest.displayName,
    spriteVersionNumber: manifest.spriteVersionNumber,
    manifestSha256: sha256(manifestPath),
    sha256: sha256(sourcePath),
    ...SOURCE,
  },
  derivative: {
    path: "/pet/curry-companion.webp",
    sha256: sha256(outputPath),
    bytes: outputBytes,
    ...DERIVATIVE,
  },
};

writeFileSync(
  provenancePath,
  `${JSON.stringify(provenance, null, 2)}\n`,
  "utf8"
);

process.stdout.write(
  `${JSON.stringify({ ok: true, outputPath, provenancePath, outputBytes })}\n`
);
