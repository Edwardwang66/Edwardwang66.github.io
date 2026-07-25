import { expect, test } from "@playwright/test";
import {
  expectNoHorizontalOverflow,
  openProject,
} from "./helpers.js";

function overlaps(a, b) {
  return !(
    a.x + a.width <= b.x ||
    b.x + b.width <= a.x ||
    a.y + a.height <= b.y ||
    b.y + b.height <= a.y
  );
}

function watchBrowserErrors(page) {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push({
        source: "console",
        text: message.text(),
        url: message.location().url,
      });
    }
  });
  page.on("pageerror", (error) => {
    errors.push({ source: "pageerror", text: error.message });
  });
  return errors;
}

test("desktop Curry stays fixed, quiet, and waves only once", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const curry = page.locator(".curry-companion");
  await expect(curry).toBeVisible();
  await expect(curry).toHaveAttribute("aria-hidden", "true");
  await expect(curry).toHaveAttribute("data-state", "idle");
  await expect(curry).toHaveAttribute("data-motion", "eligible");

  const before = await curry.boundingBox();
  expect(before.width).toBeCloseTo(76, 1);
  expect(before.height).toBeCloseTo(82.333, 1);
  expect(1440 - (before.x + before.width)).toBeCloseTo(20, 1);
  expect(1000 - (before.y + before.height)).toBeCloseTo(20, 1);

  const socials = await page.locator(".hero-socials").boundingBox();
  expect(overlaps(before, socials)).toBe(false);
  await expectNoHorizontalOverflow(page);

  const beforeScrollY = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 900);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(beforeScrollY + 500);
  const preWave = await curry.boundingBox();
  expect(preWave.x).toBeCloseTo(before.x, 1);
  expect(preWave.y).toBeCloseTo(before.y, 1);

  await curry.hover();
  await expect(curry).toHaveAttribute("data-state", "wave");
  const waveEvidence = await curry.evaluate(
    (node) =>
      new Promise((resolve, reject) => {
        const run = async () => {
          const animation = node
            .getAnimations()
            .find((candidate) => candidate.animationName === "curry-wave");
          if (!animation) {
            reject(new Error("Curry Wave animation was not found"));
            return;
          }
          await animation.ready;
          animation.pause();
          const duration = Number(
            animation.effect.getComputedTiming().duration
          );
          const samples = [];
          for (const currentTime of [1, 221, 441, 661]) {
            animation.currentTime = currentTime;
            await new Promise(requestAnimationFrame);
            const style = getComputedStyle(node);
            const rect = node.getBoundingClientRect();
            samples.push({
              backgroundX: Number.parseFloat(style.backgroundPositionX),
              display: style.display,
              height: rect.height,
              opacity: Number.parseFloat(style.opacity),
              visibility: style.visibility,
              width: rect.width,
              x: rect.x,
              y: rect.y,
            });
          }
          animation.currentTime = 0;
          const settled = new Promise((settle, fail) => {
            let timeout;
            const observer = new MutationObserver(() => {
              if (node.dataset.state !== "wave") {
                window.clearTimeout(timeout);
                observer.disconnect();
                settle();
              }
            });
            observer.observe(node, {
              attributes: true,
              attributeFilter: ["data-state"],
            });
            timeout = window.setTimeout(() => {
              observer.disconnect();
              fail(new Error("Curry Wave did not settle within 2 seconds"));
            }, 2_000);
          });
          const startedAt = performance.now();
          animation.play();
          await settled;
          resolve({
            duration,
            elapsed: performance.now() - startedAt,
            samples,
          });
        };
        run().catch(reject);
      })
  );
  expect(waveEvidence.duration).toBe(880);
  expect(waveEvidence.elapsed).toBeGreaterThanOrEqual(840);
  expect(waveEvidence.elapsed).toBeLessThanOrEqual(1050);
  expect(waveEvidence.samples.map(({ backgroundX }) => backgroundX)).toEqual([
    0, -76, -152, -228,
  ]);
  for (const sample of waveEvidence.samples) {
    expect(sample.display).not.toBe("none");
    expect(sample.visibility).toBe("visible");
    expect(sample.opacity).toBe(1);
    expect(sample.x).toBeCloseTo(preWave.x, 1);
    expect(sample.y).toBeCloseTo(preWave.y, 1);
    expect(sample.width).toBeCloseTo(preWave.width, 1);
    expect(sample.height).toBeCloseTo(preWave.height, 1);
  }
  await expect
    .poll(() => curry.getAttribute("data-state"))
    .toBe("idle");

  await page.mouse.move(0, 0);
  await curry.hover();
  await page.waitForTimeout(120);
  await expect(curry).toHaveAttribute("data-state", "idle");
});

test("Curry unmounts on About and project views", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".curry-companion")).toHaveCount(1);

  await page.getByRole("button", { name: "About" }).click();
  await expect(page.locator(".curry-companion")).toHaveCount(0);

  await page.getByRole("button", { name: "Work", exact: true }).click();
  await expect(page.locator(".curry-companion")).toHaveCount(1);
  const firstId = await page
    .locator("[data-project-trigger]")
    .first()
    .evaluate((node) => node.dataset.projectId);
  await openProject(page, firstId);
  await expect(page.locator(".curry-companion")).toHaveCount(0);
});

test("mobile Curry is smaller and fully static", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const curry = page.locator(".curry-companion");
  await expect(curry).toBeVisible();
  await expect(curry).toHaveAttribute("data-motion", "static");
  await expect(curry).toHaveAttribute("data-state", "idle");
  const box = await curry.boundingBox();
  expect(box.width).toBeCloseTo(52, 1);
  expect(box.height).toBeCloseTo(56.333, 1);
  expect(390 - (box.x + box.width)).toBeCloseTo(12, 1);
  expect(844 - (box.y + box.height)).toBeCloseTo(12, 1);
  expect(
    await curry.evaluate((node) => ({
      animation: getComputedStyle(node).animationName,
      backgroundX: Number.parseFloat(
        getComputedStyle(node).backgroundPositionX
      ),
      backgroundY: Number.parseFloat(
        getComputedStyle(node).backgroundPositionY
      ),
      pointerEvents: getComputedStyle(node).pointerEvents,
    }))
  ).toEqual({
    animation: "none",
    backgroundX: 0,
    backgroundY: 0,
    pointerEvents: "none",
  });
  await expectNoHorizontalOverflow(page);
});

test("reduced motion keeps desktop Curry on a static Idle frame", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const curry = page.locator(".curry-companion");
  await expect(curry).toHaveAttribute("data-motion", "static");
  await expect(curry).toHaveAttribute("data-state", "idle");
  expect(
    await curry.evaluate((node) => ({
      animation: getComputedStyle(node).animationName,
      backgroundX: Number.parseFloat(
        getComputedStyle(node).backgroundPositionX
      ),
      backgroundY: Number.parseFloat(
        getComputedStyle(node).backgroundPositionY
      ),
      pointerEvents: getComputedStyle(node).pointerEvents,
    }))
  ).toEqual({
    animation: "none",
    backgroundX: 0,
    backgroundY: 0,
    pointerEvents: "none",
  });
});

test("normal navigation stays free of console and page errors", async ({
  page,
}) => {
  const errors = watchBrowserErrors(page);
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "About" }).click();
  await expect(page.locator("#about-title")).toBeVisible();
  await page.getByRole("button", { name: "Work", exact: true }).click();
  const firstId = await page
    .locator("[data-project-trigger]")
    .first()
    .evaluate((node) => node.dataset.projectId);
  await openProject(page, firstId);
  await page.waitForLoadState("networkidle");
  expect(errors).toEqual([]);
});

test("failed Curry media disappears without affecting the hero", async ({
  page,
}) => {
  await page.route("**/pet/curry-companion.webp", (route) =>
    route.abort()
  );
  await page.goto("/");
  await expect(page.locator(".curry-companion")).toHaveCount(0);
  await expect(page.locator(".home-hero")).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("loading Curry does not change hero geometry", async ({ page }) => {
  let releaseAsset;
  let assetRequested = false;
  const assetGate = new Promise((resolve) => {
    releaseAsset = resolve;
  });
  await page.route("**/pet/curry-companion.webp", async (route) => {
    assetRequested = true;
    await assetGate;
    await route.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const before = await page.locator(".home-hero").boundingBox();
  await expect.poll(() => assetRequested).toBe(true);
  releaseAsset();
  await expect(page.locator(".curry-companion")).toBeVisible();
  const after = await page.locator(".home-hero").boundingBox();
  expect(after).toEqual(before);
});
