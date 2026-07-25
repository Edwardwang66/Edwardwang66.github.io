import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const assets = [
  ["public/ece276a/gifs/pr1-orientation.gif", "GIF", 15 * 1024 * 1024],
  ["public/ece276a/gifs/pr2-lidar-slam.gif", "GIF", 15 * 1024 * 1024],
  ["public/ece276a/gifs/pr3-visual-inertial-slam.gif", "GIF", 15 * 1024 * 1024],
  ["public/ece276a/posters/pr1-orientation.png", "PNG", 2 * 1024 * 1024],
  ["public/ece276a/posters/pr2-lidar-slam.png", "PNG", 2 * 1024 * 1024],
  ["public/ece276a/posters/pr3-visual-inertial-slam.png", "PNG", 2 * 1024 * 1024],
];

test("ECE276A media assets have valid signatures and bounded size", async () => {
  for (const [path, kind, maxBytes] of assets) {
    const bytes = await readFile(path);
    const metadata = await stat(path);
    if (kind === "GIF") {
      assert.match(bytes.subarray(0, 6).toString("ascii"), /^GIF8[79]a$/);
    } else {
      assert.deepEqual(
        [...bytes.subarray(0, 8)],
        [137, 80, 78, 71, 13, 10, 26, 10]
      );
    }
    assert.ok(metadata.size <= maxBytes, `${path} exceeds ${maxBytes}`);
  }
});

test("Portfolio declares all GIFs, posters, and reduced-motion classes", async () => {
  const source = await readFile("src/Portfolio.jsx", "utf8");
  for (const [path] of assets) {
    assert.ok(source.includes(path.replace(/^public/, "")), path);
  }
  assert.ok(source.includes('type: "course-gifs"'));
  assert.ok(source.includes("motion-reduce:hidden"));
  assert.ok(source.includes("motion-reduce:block"));
});
