import { expect, test } from "@playwright/test";
import {
  expandedProjectIds,
  expectEditorialFonts,
  expectNoHorizontalOverflow,
  mediaBox,
  openProject,
} from "./helpers.js";

const viewports = [
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
  { width: 768, height: 1024 },
  { width: 632, height: 661 },
  { width: 520, height: 844 },
  { width: 519, height: 844 },
  { width: 390, height: 844 },
  { width: 375, height: 667 },
];

for (const viewport of viewports) {
  test(`responsive contract at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expectNoHorizontalOverflow(page);
    await expectEditorialFonts(page);
    await expect(page.locator("h1:visible")).toHaveCount(1);
    expect(await expandedProjectIds(page)).toEqual(["planning-control"]);
    expect(
      await page
        .locator(".hero-socials > li > :is(a, button)")
        .allTextContents()
    ).toEqual([
      "GitHub",
      "LinkedIn",
      "Email",
      "Instagram",
      "Douyin",
      "RedNote",
    ]);
    await expectNoHorizontalOverflow(page);

    const targets = page.locator(
      ".brand-control, .nav-control, [data-project-trigger]"
    );
    for (let index = 0; index < (await targets.count()); index += 1) {
      const box = await targets.nth(index).boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
    }

    const portrait = await page
      .locator('.portrait[data-size="hero"]')
      .boundingBox();
    const heroCopy = await page.locator(".hero-copy").boundingBox();
    const socials = await page.locator(".hero-socials").boundingBox();
    const brand = await page.locator(".brand-control").boundingBox();
    const primaryNav = await page.locator(".primary-nav").boundingBox();

    expect(Math.abs(brand.y - primaryNav.y)).toBeLessThan(12);
    await expect(page.locator(".brand-name")).toBeVisible();

    if (viewport.width >= 520) {
      expect(portrait.x).toBeGreaterThan(heroCopy.x + heroCopy.width);
      expect(portrait.width).toBe(viewport.width >= 640 ? 256 : 160);
    } else {
      expect(portrait.y).toBeGreaterThan(socials.y + socials.height);
      expect(portrait.width).toBe(160);
      expect(
        Math.abs(portrait.x + portrait.width / 2 - viewport.width / 2)
      ).toBeLessThan(4);
    }

    if (viewport.width >= 900) {
      await expect(page.locator(".contact-control")).toBeVisible();
    } else if (viewport.width < 768) {
      await expect(page.locator(".contact-control")).toBeHidden();
    }

    if (viewport.width < 640) {
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
    } else if (viewport.width >= 1024) {
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
