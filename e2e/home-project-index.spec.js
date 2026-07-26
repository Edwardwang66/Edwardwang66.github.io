import { expect, test } from "@playwright/test";
import {
  expandedProjectIds,
  installProgrammaticScrollSpy,
} from "./helpers.js";

test("desktop archive stays single-open for pointer and keyboard", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect.poll(() => expandedProjectIds(page)).toEqual(["easy-a-radar"]);
  expect(
    await page.locator("[data-project-trigger]").evaluateAll((triggers) =>
      triggers.map((trigger) => trigger.dataset.projectId)
    )
  ).toEqual([
    "easy-a-radar",
    "stock-research-dashboard",
    "lab-robotic-arm",
    "planning-control",
    "state-estimation",
    "off-road-vehicle",
    "drug-delivery-ml",
    "embedded-digital",
  ]);

  const trigger02 = page.locator('[data-project-trigger][data-project-id="lab-robotic-arm"]');
  await trigger02.click();
  await expect.poll(() => expandedProjectIds(page)).toEqual(["lab-robotic-arm"]);
  await expect(trigger02).toBeFocused();
  await trigger02.click();
  await expect.poll(() => expandedProjectIds(page)).toEqual(["lab-robotic-arm"]);

  const trigger03 = page.locator('[data-project-trigger][data-project-id="state-estimation"]');
  await trigger03.focus();
  await page.keyboard.press("Enter");
  await expect.poll(() => expandedProjectIds(page)).toEqual(["state-estimation"]);
  await expect(trigger03).toBeFocused();

  const trigger04 = page.locator('[data-project-trigger][data-project-id="drug-delivery-ml"]');
  await trigger04.focus();
  await page.keyboard.press("Space");
  await expect.poll(() => expandedProjectIds(page)).toEqual(["drug-delivery-ml"]);
});

test("disclosure gains real height before it settles", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const animation = await page.evaluate(async () => {
    const trigger = document.querySelector(
      '[data-project-trigger][data-project-id="stock-research-dashboard"]'
    );
    const panel = document.querySelector(
      "#project-panel-stock-research-dashboard"
    );
    trigger.click();

    const samples = [];
    for (let frame = 0; frame < 300; frame += 1) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (panel.style.height === "auto") break;
      samples.push(Number.parseFloat(panel.style.height));
    }
    return {
      samples,
      settled: panel.style.height === "auto",
    };
  });

  expect(animation.samples.some((height) => height > 0)).toBe(true);
  expect(animation.settled).toBe(true);
  await expect(
    page.locator("#project-panel-easy-a-radar")
  ).toHaveAttribute("hidden", "");
});

test("compact controls press immediately while archive rows keep geometry", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const work = page.getByRole("button", { name: "Work", exact: true });
  const workBox = await work.boundingBox();
  await page.mouse.move(workBox.x + workBox.width / 2, workBox.y + workBox.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(50);
  const workTransform = await work.evaluate((node) => getComputedStyle(node).transform);
  expect(workTransform).not.toBe("none");
  await page.mouse.up();

  const row = page.locator('[data-project-trigger][data-project-id="lab-robotic-arm"]');
  const before = await row.boundingBox();
  await page.mouse.move(before.x + 20, before.y + 20);
  await page.mouse.down();
  await page.waitForTimeout(50);
  const during = await row.boundingBox();
  expect({ width: during.width, height: during.height }).toEqual({
    width: before.width,
    height: before.height,
  });
  expect(await row.evaluate((node) => getComputedStyle(node).transform)).toBe("none");
  await page.mouse.up();
});

test("rapid project selection remains immediate and single-open", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator('[data-project-trigger][data-project-id="lab-robotic-arm"]').click();
  await page.locator('[data-project-trigger][data-project-id="planning-control"]').click();
  await expect.poll(() => expandedProjectIds(page)).toEqual(["planning-control"]);
  await expect(page.locator("#project-panel-planning-control")).not.toHaveAttribute(
    "hidden",
    ""
  );
  await expect(page.locator("#project-panel-lab-robotic-arm")).toHaveAttribute(
    "hidden",
    ""
  );
});

test("mobile scrolling advances one project at a time without programmatic scroll", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator("#selected-work").scrollIntoViewIfNeeded();
  await installProgrammaticScrollSpy(page);
  await expect.poll(() => expandedProjectIds(page)).toEqual(["easy-a-radar"]);

  for (let attempt = 0; attempt < 12; attempt += 1) {
    if (
      (await expandedProjectIds(page)).includes(
        "stock-research-dashboard"
      )
    ) {
      break;
    }
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(50);
  }

  await expect
    .poll(() => expandedProjectIds(page))
    .toEqual(["stock-research-dashboard"]);
  expect(await page.evaluate(() => window.__programmaticScrollCalls)).toEqual(
    []
  );
});
