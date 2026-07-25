import { expect, test } from "@playwright/test";
import { mediaBox, openProject } from "./helpers.js";

test("failed homepage evidence is named and can recover", async ({ page }) => {
  await page.route("**/ece276b/pr1/doorkey-poster.png", (route) => route.abort());
  await page.goto("/");
  await expect(
    page.getByRole("img", { name: /DoorKey grid environment.*image unavailable/ })
  ).toBeVisible();
  await page.unroute("**/ece276b/pr1/doorkey-poster.png");
  await page.reload();
  await expect(
    page.getByRole("img", {
      name: "DoorKey grid environment used for discrete planning",
    })
  ).toBeVisible();
});

test("videos, GIFs, and low-resolution evidence obey their lifecycle", async ({ page }) => {
  await page.goto("/");
  await openProject(page, "lab-robotic-arm");
  const videos = page.locator("video");
  await expect(videos).toHaveCount(2);
  for (let index = 0; index < 2; index += 1) {
    const video = videos.nth(index);
    await expect(video).toHaveAttribute("controls", "");
    await expect(video).toHaveAttribute("playsinline", "");
    await expect(video).toHaveAttribute("preload", "metadata");
    expect(await video.evaluate((node) => node.autoplay)).toBe(false);
    expect(await video.evaluate((node) => node.paused)).toBe(true);
  }

  await page.getByRole("button", { name: "Work", exact: true }).click();
  await openProject(page, "planning-control");
  expect(await page.locator('img[src$=".gif"]').count()).toBe(0);
  await page.getByRole("button", { name: "Play animation" }).first().click();
  await expect(page.locator('img[src$=".gif"]')).toHaveCount(1);
  await page.getByRole("button", { name: "Stop animation" }).click();
  await expect(page.locator('img[src$=".gif"]')).toHaveCount(0);

  const doorKey = await mediaBox(
    page.locator('[data-media-role="low-resolution"]').first()
  );
  expect(doorKey.width).toBeLessThanOrEqual(520);
});

test("course reports stay hidden while additional GIF evidence mounts on request", async ({ page }) => {
  await page.goto("/");
  await openProject(page, "state-estimation");
  await expect(page.locator('a[href$=".pdf"]')).toHaveCount(0);
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(
    page.locator('.selected-evidence [data-media-kind="gif"]')
  ).toHaveCount(3);
  await expect(page.locator('img[src*="/ece276a/gifs/"]')).toHaveCount(0);
  await page
    .locator(".selected-evidence")
    .getByRole("button", { name: "Play animation" })
    .first()
    .click();
  await expect(page.locator('img[src*="/ece276a/gifs/"]')).toHaveCount(1);

  await page.getByRole("button", { name: "Work", exact: true }).click();
  await openProject(page, "planning-control");
  await expect(page.locator('a[href$=".pdf"]')).toHaveCount(0);
  const toggle = page.getByRole("button", { name: /More evidence \(/ });
  await toggle.click();
  await expect(page.locator(".more-evidence-body")).toBeVisible();
  await expect(
    page.locator('.more-evidence-body [data-media-kind="gif"]')
  ).toHaveCount(6);
  await toggle.click();
  await expect(page.locator(".more-evidence-body")).toHaveCount(0);
});

test("text-only projects have no fabricated media surface", async ({ page }) => {
  await page.goto("/");
  for (const id of ["drug-delivery-ml", "embedded-digital"]) {
    if (await page.locator("#home-title").count()) {
      await openProject(page, id);
    }
    await expect(
      page.locator(
        "[data-media-kind], .lead-evidence, .selected-evidence, .media-fallback, video, iframe"
      )
    ).toHaveCount(0);
    await page.getByRole("button", { name: "Work", exact: true }).click();
  }
});
