import { createHash } from "node:crypto";
import {
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const POPULATED_FRAMES = Object.freeze({
  idle: 7,
  wave: 4,
  "look-right": 8,
  "look-left": 8,
});
const SOURCE_STATE_ROWS = Object.freeze({
  idle: 0,
  wave: 3,
  "look-right": 9,
  "look-left": 10,
});
const SOURCE = {
  width: 1536,
  height: 2288,
  columns: 8,
  rows: 11,
  cellWidth: 192,
  cellHeight: 208,
  populatedFrames: POPULATED_FRAMES,
};
const DERIVATIVE = {
  width: 768,
  height: 416,
  columns: 8,
  rows: 4,
  cellWidth: 96,
  cellHeight: 104,
  states: ["idle", "wave", "look-right", "look-left"],
  populatedFrames: POPULATED_FRAMES,
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

async function validatePopulatedFrames(path, geometry, stateRows, label) {
  const { data, info } = await sharp(path)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (const state of DERIVATIVE.states) {
    const row = stateRows[state];
    const actual = Array.from({ length: geometry.columns }, (_, column) => {
      for (
        let y = row * geometry.cellHeight;
        y < (row + 1) * geometry.cellHeight;
        y += 1
      ) {
        for (
          let x = column * geometry.cellWidth;
          x < (column + 1) * geometry.cellWidth;
          x += 1
        ) {
          if (data[(y * info.width + x) * info.channels + 3] > 0) {
            return true;
          }
        }
      }
      return false;
    });
    const expected = Array.from(
      { length: geometry.columns },
      (_, column) => column < POPULATED_FRAMES[state]
    );
    if (actual.some((populated, column) => populated !== expected[column])) {
      throw new Error(
        `${label} ${state} alpha occupancy mismatch: ` +
          `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
      );
    }
  }
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

await validatePopulatedFrames(
  sourcePath,
  SOURCE,
  SOURCE_STATE_ROWS,
  "Source"
);

mkdirSync(dirname(outputPath), { recursive: true });
mkdirSync(dirname(provenancePath), { recursive: true });

const strips = await Promise.all(
  DERIVATIVE.states.map((state) =>
    sharp(sourcePath)
      .extract({
        left: 0,
        top: SOURCE_STATE_ROWS[state] * SOURCE.cellHeight,
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

await validatePopulatedFrames(
  outputPath,
  DERIVATIVE,
  Object.fromEntries(DERIVATIVE.states.map((state, row) => [state, row])),
  "Derivative"
);

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
