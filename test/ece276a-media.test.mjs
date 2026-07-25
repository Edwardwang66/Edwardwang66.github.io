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

function extractBetween(source, startMarker, endMarker, label) {
  const start = source.indexOf(startMarker);
  assert.notEqual(start, -1, `${label}: missing ${startMarker}`);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(end, -1, `${label}: missing ${endMarker}`);
  return source.slice(start, end);
}

function countMatches(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

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

test("state-estimation declares exactly three GIFs and three retained PDFs", async () => {
  const source = await readFile("src/Portfolio.jsx", "utf8");
  const project = extractBetween(
    source,
    'id: "state-estimation"',
    'id: "drug-delivery-ml"',
    "state-estimation project"
  );
  const media = extractBetween(
    project,
    "media: {",
    "\n    },\n  },",
    "state-estimation media"
  );
  const gifs = extractBetween(media, "gifs: [", "files: [", "GIF entries");
  const files = extractBetween(
    media,
    "files: [",
    "\n      ],",
    "PDF file entries"
  );

  assert.ok(media.includes('type: "course-gifs"'));
  assert.equal(countMatches(gifs, /^\s{8}\{$/gm), 3, "expected three GIF entries");
  assert.equal(countMatches(gifs, /^\s+src: "/gm), 3, "expected three GIF sources");
  assert.equal(countMatches(gifs, /^\s+poster: "/gm), 3, "expected three posters");

  const expectedGifPairs = [
    ["/ece276a/gifs/pr1-orientation.gif", "/ece276a/posters/pr1-orientation.png"],
    ["/ece276a/gifs/pr2-lidar-slam.gif", "/ece276a/posters/pr2-lidar-slam.png"],
    [
      "/ece276a/gifs/pr3-visual-inertial-slam.gif",
      "/ece276a/posters/pr3-visual-inertial-slam.png",
    ],
  ];
  for (const [src, poster] of expectedGifPairs) {
    assert.equal(countMatches(gifs, new RegExp(src.replaceAll("/", "\\/"), "g")), 1, src);
    assert.equal(
      countMatches(gifs, new RegExp(poster.replaceAll("/", "\\/"), "g")),
      1,
      poster
    );
  }

  const expectedPdfs = [
    ["PR1 - Pose Estimation", "/ece276a/ece276_pr1.pdf"],
    ["PR2 - Sensor Fusion", "/ece276a/pr2.pdf"],
    ["PR3 - State Estimation Report", "/ece276a/pr3_report.pdf"],
  ];
  assert.equal(
    countMatches(files, /\{\s*name: "[^"]+", src: "[^"]+"\s*\}/g),
    3,
    "expected three PDF file entries"
  );
  for (const [name, src] of expectedPdfs) {
    assert.ok(files.includes(`{ name: "${name}", src: "${src}" }`), src);
  }
});

test("course-gifs rendering preserves GIF, PDF, and reduced-motion wiring", async () => {
  const source = await readFile("src/Portfolio.jsx", "utf8");
  const motionAwareGif = extractBetween(
    source,
    "function MotionAwareGif",
    "function ProjectDetail",
    "MotionAwareGif function"
  );
  const courseGifsBranch = extractBetween(
    source,
    '{project.media.type === "course-gifs" && (',
    '{project.media.type === "pdfs" && (',
    "course-gifs render branch"
  );

  assert.match(
    motionAwareGif,
    /<img\s+src=\{item\.src\}\s+alt=\{item\.alt\}\s+className="[^"]*motion-reduce:hidden[^"]*"/
  );
  assert.match(
    motionAwareGif,
    /<img\s+src=\{item\.poster\}\s+alt=""\s+aria-hidden="true"\s+className="[^"]*hidden[^"]*motion-reduce:block[^"]*"/
  );
  assert.match(
    courseGifsBranch,
    /project\.media\.gifs\.map\(\(item, index\) => \([\s\S]*<MotionAwareGif item=\{item\} \/>/
  );
  assert.match(courseGifsBranch, /project\.media\.files\.map\(\(file\) => \(/);
  assert.match(courseGifsBranch, /<embed[\s\S]*src=\{`\$\{file\.src\}#toolbar=1&navpanes=0&scrollbar=1`\}/);
  assert.match(courseGifsBranch, /title=\{file\.name\}/);
});
