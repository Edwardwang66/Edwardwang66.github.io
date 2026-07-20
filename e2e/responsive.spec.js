import { expect, test } from "@playwright/test";
import {
  expandedProjectIds,
  expectEditorialFonts,
  expectNoHorizontalOverflow,
  mediaBox,
  openProject,
} from "./helpers.js";

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 1024, height: 900 },
  { width: 390, height: 844 },
  { width: 320, height: 700 },
]) {
  test(`responsive contract at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expectNoHorizontalOverflow(page);
    await expectEditorialFonts(page);
    await expect(page.locator("h1:visible")).toHaveCount(1);
    expect(await expandedProjectIds(page)).toEqual(["off-road-vehicle"]);

    const targets = page.locator(
      ".brand-control, .nav-control, [data-project-trigger]"
    );
    for (let index = 0; index < (await targets.count()); index += 1) {
      const box = await targets.nth(index).boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
    }

    const portrait = await mediaBox(page.locator('.portrait[data-size="hero"]'));
    if (viewport.width < 640) {
      expect(portrait.width).toBeLessThanOrEqual(144);
      const evidence = await mediaBox(
        page.locator(".archive-evidence img, .archive-evidence .media-fallback").first()
      );
      expect(evidence.height).toBeLessThanOrEqual(220);
      await page.getByRole("button", { name: "About" }).click();
      const aboutPortrait = await mediaBox(
        page.locator('.portrait[data-size="about"]')
      );
      expect(aboutPortrait.width).toBeLessThanOrEqual(160);
      await expectNoHorizontalOverflow(page);
    } else {
      const shell = await page.locator(".page-shell").evaluate((node) => {
        const style = getComputedStyle(node);
        return {
          content:
            node.getBoundingClientRect().width -
            Number.parseFloat(style.paddingLeft) -
            Number.parseFloat(style.paddingRight),
        };
      });
      expect(shell.content).toBeLessThanOrEqual(944.5);
      expect(shell.content).toBeGreaterThan(900);
    }
  });
}

test("tablet project facts keep a two-column editorial rhythm", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/");
  await openProject(page, "planning-control");
  const columns = await page.locator(".project-fact").evaluateAll((facts) =>
    [...new Set(facts.map((fact) => Math.round(fact.getBoundingClientRect().left)))]
  );
  expect(columns).toHaveLength(2);
});
