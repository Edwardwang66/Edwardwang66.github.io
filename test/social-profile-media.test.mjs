import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { profile } from "../src/data/portfolio.js";

const assets = [
  {
    label: "Douyin",
    file: "public/social/douyin-profile.jpg",
    src: "/social/douyin-profile.jpg",
    width: 1125,
    height: 1680,
  },
  {
    label: "RedNote",
    file: "public/social/rednote-profile.jpg",
    src: "/social/rednote-profile.jpg",
    width: 987,
    height: 1347,
  },
];

const startOfFrameMarkers = new Set([
  0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7,
  0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
]);

function jpegDimensions(bytes) {
  let offset = 2;
  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = bytes[offset + 1];
    offset += 2;
    if (marker === 0xd8 || marker === 0xd9) continue;
    const length = bytes.readUInt16BE(offset);
    if (startOfFrameMarkers.has(marker)) {
      return {
        width: bytes.readUInt16BE(offset + 5),
        height: bytes.readUInt16BE(offset + 3),
      };
    }
    offset += length;
  }
  throw new Error("JPEG start-of-frame marker not found");
}

describe("social profile media contract", () => {
  it("keeps both supplied cards local, bounded, and exact", async () => {
    for (const asset of assets) {
      const bytes = await readFile(asset.file);
      expect([...bytes.subarray(0, 2)]).toEqual([0xff, 0xd8]);
      expect(jpegDimensions(bytes)).toEqual({
        width: asset.width,
        height: asset.height,
      });
      expect(bytes.length).toBeLessThanOrEqual(3 * 1024 * 1024);

      const social = profile.socials.find(
        ({ label }) => label === asset.label
      );
      expect(social.image.src).toBe(asset.src);
      expect(social.image.width).toBe(asset.width);
      expect(social.image.height).toBe(asset.height);
    }
  });
});
