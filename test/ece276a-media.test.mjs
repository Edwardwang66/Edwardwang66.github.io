import { readFile, stat } from "node:fs/promises";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { projects } from "../src/data/portfolio.js";

const assets = [
  ["public/ece276a/gifs/pr1-orientation.gif", "GIF", 15 * 1024 * 1024],
  ["public/ece276a/gifs/pr2-lidar-slam.gif", "GIF", 15 * 1024 * 1024],
  ["public/ece276a/gifs/pr3-visual-inertial-slam.gif", "GIF", 15 * 1024 * 1024],
  ["public/ece276a/posters/pr1-orientation.png", "PNG", 2 * 1024 * 1024],
  ["public/ece276a/posters/pr2-lidar-slam.png", "PNG", 2 * 1024 * 1024],
  ["public/ece276a/posters/pr3-visual-inertial-slam.png", "PNG", 2 * 1024 * 1024],
];

const expectedMedia = [
  ["/ece276a/gifs/pr1-orientation.gif", "/ece276a/posters/pr1-orientation.png"],
  ["/ece276a/gifs/pr2-lidar-slam.gif", "/ece276a/posters/pr2-lidar-slam.png"],
  [
    "/ece276a/gifs/pr3-visual-inertial-slam.gif",
    "/ece276a/posters/pr3-visual-inertial-slam.png",
  ],
];

const triptychPath = "public/ece276a/ece276a-editorial-triptych.png";
const triptychMaxBytes = 2 * 1024 * 1024;
const formerTopStripGlyphs = [
  [46, 53],
  [563, 79],
  [1003, 76],
  [1035, 156],
];

describe("ECE 276A visualization contract", () => {
  it("keeps all authored assets valid and bounded", async () => {
    for (const [path, kind, maxBytes] of assets) {
      const bytes = await readFile(path);
      const metadata = await stat(path);

      if (kind === "GIF") {
        expect(bytes.subarray(0, 6).toString("ascii")).toMatch(/^GIF8[79]a$/);
      } else {
        expect([...bytes.subarray(0, 8)]).toEqual([
          137, 80, 78, 71, 13, 10, 26, 10,
        ]);
      }
      expect(metadata.size).toBeLessThanOrEqual(maxBytes);
    }
  });

  it("keeps the editorial triptych at its exact production contract", async () => {
    const bytes = await readFile(triptychPath);
    const file = await stat(triptychPath);
    const metadata = await sharp(triptychPath).metadata();

    expect([...bytes.subarray(0, 8)]).toEqual([
      137, 80, 78, 71, 13, 10, 26, 10,
    ]);
    expect(metadata).toMatchObject({
      format: "png",
      width: 1560,
      height: 840,
    });
    expect(file.size).toBeLessThanOrEqual(triptychMaxBytes);
  });

  it("removes source text strips from all three triptych panels", async () => {
    const { data, info } = await sharp(triptychPath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    for (const [x, y] of formerTopStripGlyphs) {
      const offset = (y * info.width + x) * info.channels;
      expect(Math.min(...data.subarray(offset, offset + 3))).toBeGreaterThan(
        80
      );
    }
  });

  it("shows exactly three GIFs with exact poster pairs and no reports", () => {
    const project = projects.find(({ id }) => id === "state-estimation");
    const evidence = [
      project.leadEvidence,
      ...project.selectedEvidence,
      ...project.moreEvidence,
    ].filter(Boolean);

    expect(
      project.selectedEvidence.map(({ src, poster }) => [src, poster])
    ).toEqual(expectedMedia);
    expect(project.selectedEvidence).toHaveLength(3);
    expect(project.selectedEvidence.every(({ kind }) => kind === "gif")).toBe(
      true
    );
    expect(evidence.some(({ kind }) => kind === "pdf")).toBe(false);
  });
});
