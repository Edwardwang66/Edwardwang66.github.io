import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const assetPath = "public/pet/curry-companion.webp";
const provenancePath =
  "public/pet/curry-companion.provenance.json";

function readUint24LE(bytes, offset) {
  return (
    bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16)
  );
}

function webpMetadata(bytes) {
  expect(bytes.subarray(0, 4).toString("ascii")).toBe("RIFF");
  expect(bytes.subarray(8, 12).toString("ascii")).toBe("WEBP");

  let offset = 12;
  while (offset + 8 <= bytes.length) {
    const type = bytes.subarray(offset, offset + 4).toString("ascii");
    const length = bytes.readUInt32LE(offset + 4);
    const data = offset + 8;

    if (type === "VP8X") {
      return {
        width: readUint24LE(bytes, data + 4) + 1,
        height: readUint24LE(bytes, data + 7) + 1,
        alpha: Boolean(bytes[data] & 0x10),
      };
    }

    if (type === "VP8L") {
      expect(bytes[data]).toBe(0x2f);
      const bits = bytes.readUInt32LE(data + 1);
      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >> 14) & 0x3fff) + 1,
        alpha: Boolean((bits >> 28) & 0x1),
      };
    }

    offset = data + length + (length % 2);
  }

  throw new Error("Unsupported WebP container");
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

describe("Curry companion asset contract", () => {
  it("ships one bounded RGBA WebP with exact geometry and provenance", async () => {
    const [asset, provenanceText] = await Promise.all([
      readFile(assetPath),
      readFile(provenancePath, "utf8"),
    ]);
    const provenance = JSON.parse(provenanceText);

    expect(webpMetadata(asset)).toEqual({
      width: 768,
      height: 416,
      alpha: true,
    });
    expect(asset.length).toBeLessThanOrEqual(400 * 1024);
    expect(provenance).toEqual({
      slug: "curry-dog-winter",
      source: {
        packageUrl:
          "https://codex-pets.net/api/pets/curry-dog-winter/download?v=1784697885793",
        url:
          "https://codex-pets.net/assets/pets/v/1784697885793/curry-dog-winter/spritesheet.webp",
        version: "1784697885793",
        displayName: "咖喱狗 Curry",
        spriteVersionNumber: 2,
        manifestSha256: expect.stringMatching(/^[a-f0-9]{64}$/),
        sha256: expect.stringMatching(/^[a-f0-9]{64}$/),
        width: 1536,
        height: 2288,
        columns: 8,
        rows: 11,
        cellWidth: 192,
        cellHeight: 208,
      },
      derivative: {
        path: "/pet/curry-companion.webp",
        sha256: sha256(asset),
        bytes: asset.length,
        width: 768,
        height: 416,
        columns: 8,
        rows: 4,
        cellWidth: 96,
        cellHeight: 104,
        states: ["idle", "wave", "look-right", "look-left"],
      },
    });
  });
});
