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

test("reduced motion is immediate and independent", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".project-archive")).toHaveAttribute(
    "data-reduced-motion",
    "true"
  );
  await page.locator('[data-project-trigger][data-project-id="lab-robotic-arm"]').click();
  await expect.poll(() => expandedProjectIds(page)).toEqual(["lab-robotic-arm"]);
  await expect(page.locator("#project-panel-lab-robotic-arm")).toHaveCSS(
    "height",
    /auto|[1-9]/
  );
  await expect(page.locator(".site-nav")).toHaveAttribute(
    "data-reduced-transparency",
    "false"
  );
  await expect(page.locator(".site-nav")).toHaveAttribute(
    "data-increased-contrast",
    "false"
  );
});

test("reduced transparency removes blur without borrowing reduced motion", async ({ browser }) => {
  let context = await browser.newContext();
  let page = await context.newPage();
  let path = "cdp";
  try {
    const session = await context.newCDPSession(page);
    await session.send("Emulation.setEmulatedMedia", {
      features: [
        { name: "prefers-reduced-transparency", value: "reduce" },
      ],
    });
  } catch {
    path = "matchMedia-init";
    await context.close();
    context = await browser.newContext();
    await context.addInitScript(() => {
      const nativeMatchMedia = window.matchMedia.bind(window);
      window.matchMedia = (query) => {
        if (query !== "(prefers-reduced-transparency: reduce)") {
          return nativeMatchMedia(query);
        }
        return {
          media: query,
          matches: true,
          onchange: null,
          addEventListener() {},
          removeEventListener() {},
          addListener() {},
          removeListener() {},
          dispatchEvent: () => true,
        };
      };
    });
    page = await context.newPage();
  }
  await page.goto("http://127.0.0.1:4173/");
  const nav = page.locator(".site-nav");
  await expect(nav).toHaveAttribute("data-reduced-transparency", "true");
  const material = await nav.evaluate((node) => ({
    backdrop: getComputedStyle(node).backdropFilter,
    background: getComputedStyle(node).backgroundColor,
  }));
  expect(material.backdrop).toBe("none");
  expect(material.background).toContain("0.96");
  await expect(nav).toHaveAttribute("data-increased-contrast", "false");
  console.log(`reduced-transparency-path=${path}`);
  await context.close();
});

test("increased contrast adds a defined edge independently", async ({ page }) => {
  await page.emulateMedia({ contrast: "more" });
  await page.goto("/");
  const nav = page.locator(".site-nav");
  await expect(nav).toHaveAttribute("data-increased-contrast", "true");
  await expect(nav).toHaveAttribute("data-reduced-transparency", "false");
  expect(
    await nav.evaluate((node) => getComputedStyle(node).borderBottomStyle)
  ).toBe("solid");
});
