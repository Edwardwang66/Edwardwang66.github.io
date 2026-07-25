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

  await page.mouse.wheel(0, 900);
  const afterScroll = await curry.boundingBox();
  expect(afterScroll.x).toBeCloseTo(before.x, 1);
  expect(afterScroll.y).toBeCloseTo(before.y, 1);

  await curry.hover();
  await expect(curry).toHaveAttribute("data-state", "wave");
  const waveSamples = await curry.evaluate(
    (node) =>
      new Promise((resolve, reject) => {
        const samples = [];
        const startedAt = performance.now();

        function sample() {
          const style = getComputedStyle(node);
          const state = node.dataset.state;
          if (state === "wave") {
            const rect = node.getBoundingClientRect();
            samples.push({
              backgroundX: Number.parseFloat(style.backgroundPositionX),
              display: style.display,
              height: rect.height,
              opacity: Number.parseFloat(style.opacity),
              visibility: style.visibility,
              width: rect.width,
            });
          } else if (samples.length) {
            resolve(samples);
            return;
          }

          if (performance.now() - startedAt > 2_000) {
            reject(new Error("Curry Wave did not settle within 2 seconds"));
            return;
          }
          requestAnimationFrame(sample);
        }

        sample();
      })
  );
  expect(waveSamples.length).toBeGreaterThan(20);
  for (const sample of waveSamples) {
    expect(sample.backgroundX).toBeGreaterThanOrEqual(-228.1);
    expect(sample.backgroundX).toBeLessThanOrEqual(0.1);
    expect(sample.display).not.toBe("none");
    expect(sample.visibility).toBe("visible");
    expect(sample.opacity).toBe(1);
    expect(sample.width).toBeCloseTo(76, 1);
    expect(sample.height).toBeCloseTo(82.333, 1);
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
      pointerEvents: getComputedStyle(node).pointerEvents,
    }))
  ).toEqual({ animation: "none", pointerEvents: "none" });
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
      pointerEvents: getComputedStyle(node).pointerEvents,
    }))
  ).toEqual({ animation: "none", pointerEvents: "none" });
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
