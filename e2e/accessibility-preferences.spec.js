import { expect, test } from "@playwright/test";
import { expandedProjectIds } from "./helpers.js";

test("keyboard focus stays visible and disclosure semantics remain related", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  const outline = await page.locator(":focus").evaluate((node) =>
    getComputedStyle(node).outlineStyle
  );
  expect(outline).not.toBe("none");

  const trigger = page.locator('[data-project-trigger][data-project-id="lab-robotic-arm"]');
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const panelId = await trigger.getAttribute("aria-controls");
  const panel = page.locator(`#${panelId}`);
  await expect(panel).toHaveAttribute("aria-labelledby", await trigger.getAttribute("id"));
  await expect(trigger).toBeFocused();
});

test("programmatic project heading focus does not resemble a control", async ({ page }) => {
  await page.goto("/");
  const openProject = page.getByRole("link", { name: "Open project", exact: true });
  await openProject.focus();
  await page.keyboard.press("Enter");
  const title = page.locator("#project-title");
  await expect(title).toBeFocused();
  expect(
    await title.evaluate((node) => getComputedStyle(node).outlineStyle)
  ).toBe("none");
});

test("reduced motion keeps disclosure immediate and the status dot static", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator('[data-project-trigger][data-project-id="lab-robotic-arm"]').click();
  await expect.poll(() => expandedProjectIds(page)).toEqual(["lab-robotic-arm"]);
  await expect(page.locator("#project-panel-off-road-vehicle")).toHaveAttribute(
    "hidden",
    ""
  );
  await expect(page.locator(".status-dot")).toHaveCSS("animation-name", "none");
});

test("navigation remains opaque and unblurred", async ({ page }) => {
  await page.goto("/");
  const material = await page.locator(".site-nav").evaluate((node) => ({
    backdrop: getComputedStyle(node).backdropFilter,
    background: getComputedStyle(node).backgroundColor,
    border: getComputedStyle(node).borderBottomStyle,
  }));
  expect(material.backdrop).toBe("none");
  expect(material.background).toBe("rgb(255, 255, 255)");
  expect(material.border).toBe("solid");
});
