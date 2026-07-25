import { expect } from "@playwright/test";

export async function expandedProjectIds(page) {
  return page.locator("[data-project-trigger]").evaluateAll((triggers) =>
    triggers
      .filter((trigger) => trigger.getAttribute("aria-expanded") === "true")
      .map((trigger) => trigger.dataset.projectId)
  );
}

export async function expectNoHorizontalOverflow(page) {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

export async function expectEditorialFonts(page) {
  const loaded = await page.evaluate(async () => {
    await document.fonts.ready;
    return {
      serif: document.fonts.check('32px "Source Serif Pro"'),
      sans: document.fonts.check('16px "Inter"'),
      headingFamily: getComputedStyle(document.querySelector("h1")).fontFamily,
      bodyFamily: getComputedStyle(document.body).fontFamily,
    };
  });
  expect(loaded.serif).toBe(true);
  expect(loaded.sans).toBe(true);
  expect(loaded.headingFamily).toContain("Source Serif Pro");
  expect(loaded.bodyFamily).toContain("Inter");
}

export async function installProgrammaticScrollSpy(page) {
  await page.evaluate(() => {
    window.__programmaticScrollCalls = [];
    const nativeScrollTo = window.scrollTo.bind(window);
    const nativeScrollIntoView = Element.prototype.scrollIntoView;
    window.scrollTo = (...args) => {
      window.__programmaticScrollCalls.push({ method: "scrollTo", args });
      return nativeScrollTo(...args);
    };
    Element.prototype.scrollIntoView = function scrollIntoView(...args) {
      window.__programmaticScrollCalls.push({
        method: "scrollIntoView",
        args,
      });
      return nativeScrollIntoView.apply(this, args);
    };
  });
}

export async function projectTriggerCenter(page, id) {
  return page
    .locator(`[data-project-trigger][data-project-id="${id}"]`)
    .evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return rect.top + rect.height / 2;
    });
}

export async function readingLine(page) {
  return page.evaluate(() => window.innerHeight * 0.42);
}

export async function mediaBox(locator) {
  return locator.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  });
}

export async function waitForDisclosureSettled(page, id) {
  await expect
    .poll(async () =>
      page
        .locator(`#project-panel-${id}`)
        .evaluate((panel) => ({
          hidden: panel.hidden,
          height: panel.style.height,
        }))
    )
    .toMatchObject({ hidden: false, height: "auto" });
}

export async function openProject(page, id) {
  const trigger = page.locator(
    `[data-project-trigger][data-project-id="${id}"]`
  );
  if ((await trigger.getAttribute("aria-expanded")) !== "true") {
    await trigger.click();
  }
  await page.locator(`#project-panel-${id} a[href="#project-${id}"]`).click();
  await expect(page.locator("#project-title")).toBeVisible();
}
