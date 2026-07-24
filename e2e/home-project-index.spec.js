import { expect, test } from "@playwright/test";
import {
  expandedProjectIds,
  installProgrammaticScrollSpy,
} from "./helpers.js";

test("desktop archive stays single-open for pointer and keyboard", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect.poll(() => expandedProjectIds(page)).toEqual(["planning-control"]);

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

test("mobile scrolling preserves the selected project and remains native", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator("#selected-work").scrollIntoViewIfNeeded();
  await installProgrammaticScrollSpy(page);
  expect(await expandedProjectIds(page)).toEqual(["planning-control"]);
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(150);
  expect(await expandedProjectIds(page)).toEqual(["planning-control"]);
  await page.mouse.wheel(0, -400);
  await page.waitForTimeout(150);
  expect(await expandedProjectIds(page)).toEqual(["planning-control"]);
  expect(await page.evaluate(() => window.__programmaticScrollCalls)).toEqual([]);
});
