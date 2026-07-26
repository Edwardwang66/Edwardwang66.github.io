import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { projects } from "../src/data/portfolio.js";

const records = [
  {
    id: "easy-a-radar",
    file: "public/products/easy-a-radar.png",
    url: "/products/easy-a-radar.png",
  },
  {
    id: "stock-research-dashboard",
    file: "public/products/stock-research-dashboard.png",
    url: "/products/stock-research-dashboard.png",
  },
];

function pngDimensions(bytes) {
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}

describe("live product media contract", () => {
  it("keeps both verified screenshots local, bounded, and exact", async () => {
    for (const { id, file, url } of records) {
      const bytes = await readFile(file);
      expect([...bytes.subarray(0, 8)]).toEqual([
        137, 80, 78, 71, 13, 10, 26, 10,
      ]);
      expect(pngDimensions(bytes)).toEqual({ width: 1440, height: 1000 });
      expect(bytes.length).toBeLessThanOrEqual(3 * 1024 * 1024);

      const project = projects.find((record) => record.id === id);
      expect(project.homeEvidence.src).toBe(url);
      expect(project.leadEvidence.src).toBe(url);
      expect(project.homeEvidence).not.toBe(project.leadEvidence);
    }
  });
});
