import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow, mediaBox, openProject } from "./helpers.js";

test("failed archived DoorKey evidence is named and can recover", async ({ page }) => {
  await page.route("**/ece276b/pr1/doorkey-poster.png", (route) => route.abort());
  await page.goto("/");
  await page
    .locator('[data-project-trigger][data-project-id="planning-control"]')
    .click();
  await expect(
    page.getByRole("img", { name: /DoorKey grid environment.*image unavailable/ })
  ).toBeVisible();
  await page.unroute("**/ece276b/pr1/doorkey-poster.png");
  await page.reload();
  await page
    .locator('[data-project-trigger][data-project-id="planning-control"]')
    .click();
  await expect(
    page.getByRole("img", {
      name: "DoorKey grid environment used for discrete planning",
    })
  ).toBeVisible();
});

for (const product of [
  {
    id: "easy-a-radar",
    live: "https://easy-a-radar.vercel.app/",
    asset: "/products/easy-a-radar.png",
  },
  {
    id: "stock-research-dashboard",
    live: "https://stock-analysis-ten-phi.vercel.app/",
    asset: "/products/stock-research-dashboard.png",
  },
]) {
  test(`${product.id} renders a local complete product story`, async ({ page }) => {
    await page.goto("/");
    await openProject(page, product.id);
    await expect(page.locator(`img[src="${product.asset}"]`)).toBeVisible();
    for (const heading of [
      "Overview",
      "Problem",
      "System",
      "What shipped",
      "Reliability and limits",
      "Stack",
      "Links",
    ]) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }
    await expect(page.getByRole("link", { name: "Live Site" })).toHaveAttribute(
      "href",
      product.live
    );
  });
}

test("a failed live product screenshot keeps a named stable frame", async ({ page }) => {
  await page.route("**/products/easy-a-radar.png", (route) => route.abort());
  await page.goto("/");
  await expect(
    page.getByRole("img", {
      name: /Easy-A Radar course-ranking.*image unavailable/,
    })
  ).toBeVisible();
  const frame = await page
    .locator('.archive-evidence[data-media-role="live-product"]')
    .first()
    .boundingBox();
  expect(frame.width / frame.height).toBeCloseTo(13 / 7, 1);
});

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`failed product-page leads preserve their intended aspect on ${viewport.name}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);

    for (const product of [
      {
        id: "easy-a-radar",
        asset: "**/products/easy-a-radar.png",
      },
      {
        id: "stock-research-dashboard",
        asset: "**/products/stock-research-dashboard.png",
      },
    ]) {
      await page.route(product.asset, (route) => route.abort());
      await page.goto("/");
      await openProject(page, product.id);

      const fallback = page.locator(
        '.lead-evidence .project-media[data-media-role="live-product"] .media-fallback'
      );
      await expect(fallback).toBeVisible();
      const box = await mediaBox(fallback);
      expect(box.width / box.height).toBeCloseTo(1440 / 1000, 2);

      await page.unroute(product.asset);
    }
  });
}

test("successful and failed product leads keep one aspect on a short mobile viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 440 });

  for (const product of [
    {
      id: "easy-a-radar",
      asset: "**/products/easy-a-radar.png",
    },
    {
      id: "stock-research-dashboard",
      asset: "**/products/stock-research-dashboard.png",
    },
  ]) {
    await page.goto("/");
    await openProject(page, product.id);

    const image = page.locator(
      '.lead-evidence .project-media[data-media-role="live-product"] img'
    );
    await expect(image).toBeVisible();
    const imageBox = await mediaBox(image);
    expect(imageBox.width / imageBox.height).toBeCloseTo(1440 / 1000, 2);

    await page.route(product.asset, (route) => route.abort());
    await page.goto("/");
    await openProject(page, product.id);

    const fallback = page.locator(
      '.lead-evidence .project-media[data-media-role="live-product"] .media-fallback'
    );
    await expect(fallback).toBeVisible();
    const fallbackBox = await mediaBox(fallback);
    expect(fallbackBox.width / fallbackBox.height).toBeCloseTo(1440 / 1000, 2);

    await page.unroute(product.asset);
  }
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

test("live-product evidence fills the mobile archive column before its copy", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const frame = page.locator(
    '#project-panel-easy-a-radar .archive-evidence[data-media-role="live-product"]'
  );
  const copy = page.locator("#project-panel-easy-a-radar .project-panel-copy");
  const [frameBox, copyBox] = await Promise.all([frame.boundingBox(), copy.boundingBox()]);

  expect(frameBox.width).toBeGreaterThan(300);
  expect(copyBox.y).toBeGreaterThan(frameBox.y + frameBox.height);
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

test("PR2 containment does not reframe ECE 191 technical images or ECE 276A GIFs", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await openProject(page, "off-road-vehicle");

  const ece191Image = page
    .locator(
      '.selected-evidence [data-media-kind="image"][data-media-role="technical"] img'
    )
    .first();
  await expect(ece191Image).toBeVisible();
  const ece191Box = await mediaBox(ece191Image);
  expect(ece191Box.width / ece191Box.height).toBeCloseTo(954 / 702, 2);

  await page.getByRole("button", { name: "Back to Work" }).click();
  await openProject(page, "state-estimation");
  const gifs = page.locator(
    '.selected-evidence [data-media-kind="gif"][data-media-role="technical"] img'
  );
  await expect(gifs).toHaveCount(3);
  for (let index = 0; index < 3; index += 1) {
    const gif = gifs.nth(index);
    const box = await mediaBox(gif);
    expect(box.width / box.height).toBeCloseTo(16 / 9, 2);
    expect(await gif.evaluate((image) => getComputedStyle(image).aspectRatio)).not.toBe(
      "13 / 7"
    );
  }
});

for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`ECE 276A PR2 poster stays complete in archive and detail on ${viewport.name}`, async ({
    page,
  }) => {
    const consoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page
      .locator('[data-project-trigger][data-project-id="state-estimation"]')
      .click();

    const archiveImage = page.locator(
      '#project-panel-state-estimation img[src="/ece276a/posters/pr2-lidar-slam.png"]'
    );
    await expect(archiveImage).toBeVisible();
    expect(
      await archiveImage.evaluate((image) => ({
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        objectFit: getComputedStyle(image).objectFit,
      }))
    ).toEqual({
      naturalWidth: 960,
      naturalHeight: 540,
      objectFit: "contain",
    });
    const archiveBox = await mediaBox(archiveImage);
    expect(archiveBox.width / archiveBox.height).toBeCloseTo(13 / 7, 2);
    await expectNoHorizontalOverflow(page);

    await openProject(page, "state-estimation");
    const leadImage = page.locator(
      '.lead-evidence img[src="/ece276a/posters/pr2-lidar-slam.png"]'
    );
    await expect(leadImage).toBeVisible();
    expect(
      await leadImage.evaluate((image) => ({
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        objectFit: getComputedStyle(image).objectFit,
      }))
    ).toEqual({
      naturalWidth: 960,
      naturalHeight: 540,
      objectFit: "contain",
    });
    const leadBox = await mediaBox(leadImage);
    expect(leadBox.width / leadBox.height).toBeCloseTo(13 / 7, 2);
    await expectNoHorizontalOverflow(page);
    expect(consoleErrors).toEqual([]);
  });
}

test("a failed ECE 276A PR2 poster keeps a descriptive fallback", async ({ page }) => {
  await page.route("**/ece276a/posters/pr2-lidar-slam.png", (route) =>
    route.abort()
  );
  await page.goto("/");
  await page
    .locator('[data-project-trigger][data-project-id="state-estimation"]')
    .click();
  await expect(
    page.getByRole("img", {
      name: /LiDAR SLAM occupancy map with corrected robot trajectory.*image unavailable/i,
    })
  ).toBeVisible();
});
