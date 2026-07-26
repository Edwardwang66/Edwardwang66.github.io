import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./helpers.js";

const labels = [
  "GitHub",
  "LinkedIn",
  "Email",
  "Instagram",
  "Douyin",
  "RedNote",
];

function overlaps(a, b) {
  return !(
    a.x + a.width <= b.x ||
    b.x + b.width <= a.x ||
    a.y + a.height <= b.y ||
    b.y + b.height <= a.y
  );
}

function watchBrowserErrors(page) {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push({ source: "console", text: message.text() });
    }
  });
  page.on("pageerror", (error) => {
    errors.push({ source: "pageerror", text: error.message });
  });
  return errors;
}

test("hero social rail keeps the approved order and native semantics", async ({
  page,
}) => {
  await page.goto("/");

  const controls = page.locator(".hero-socials > li > :is(a, button)");
  await expect(controls).toHaveText(labels);
  await expect(page.locator(".hero-socials > li > a")).toHaveCount(4);
  await expect(page.locator(".hero-socials > li > button")).toHaveCount(2);

  const instagram = page.getByRole("link", { name: "Instagram" });
  await expect(instagram).toHaveAttribute(
    "href",
    "https://www.instagram.com/edwardwang15/"
  );
  await expect(instagram).toHaveAttribute("target", "_blank");
  await expect(instagram).toHaveAttribute("rel", "noreferrer");
});

test("desktop social profiles stay open across pointer travel and clamp to hero copy", async ({
  page,
}) => {
  const errors = watchBrowserErrors(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const douyin = page.getByRole("button", { name: "Douyin" });
  const card = page.getByRole("region", { name: "Douyin" });
  await douyin.hover();
  await expect(douyin).toHaveAttribute("aria-expanded", "true");
  await expect(card).toHaveAttribute("data-state", "open");
  await card.hover();
  await expect(card).toHaveAttribute("data-state", "open");

  const redNote = page.getByRole("button", { name: "RedNote" });
  await redNote.hover();
  await expect(douyin).toHaveAttribute("aria-expanded", "false");
  await expect(redNote).toHaveAttribute("aria-expanded", "true");

  const [rootBox, cardBox, curryBox] = await Promise.all([
    page.locator(".social-links").boundingBox(),
    page.getByRole("region", { name: "RedNote" }).boundingBox(),
    page.locator(".curry-companion").boundingBox(),
  ]);
  expect(cardBox.x).toBeGreaterThanOrEqual(rootBox.x - 0.5);
  expect(cardBox.x + cardBox.width).toBeLessThanOrEqual(
    rootBox.x + rootBox.width + 0.5
  );
  expect(cardBox.y + cardBox.height).toBeLessThanOrEqual(rootBox.y + 0.5);
  expect(overlaps(curryBox, rootBox)).toBe(false);
  expect(overlaps(curryBox, cardBox)).toBe(false);
  await expectNoHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

test("mobile social cards toggle above a wrapping rail without overflow", async ({
  browser,
}) => {
  const context = await browser.newContext({
    baseURL: "http://127.0.0.1:4173",
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  const errors = watchBrowserErrors(page);

  try {
    await page.goto("/");

    const controls = page.locator(".hero-socials > li > :is(a, button)");
    await expect(controls).toHaveText(labels);
    const rows = await controls.evaluateAll((nodes) => [
      ...new Set(nodes.map((node) => Math.round(node.getBoundingClientRect().y))),
    ]);
    expect(rows.length).toBeGreaterThan(1);

    const douyin = page.getByRole("button", { name: "Douyin" });
    await douyin.tap();
    await expect(douyin).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("@Edward")).toBeVisible();
    await expect(page.getByText("891461075")).toBeVisible();

    const card = page.getByRole("region", { name: "Douyin" });
    const [rootBox, cardBox, curryBox] = await Promise.all([
      page.locator(".social-links").boundingBox(),
      card.boundingBox(),
      page.locator(".curry-companion").boundingBox(),
    ]);
    expect(cardBox.width).toBeLessThanOrEqual(280.5);
    expect(cardBox.x).toBeGreaterThanOrEqual(rootBox.x - 0.5);
    expect(cardBox.x + cardBox.width).toBeLessThanOrEqual(
      rootBox.x + rootBox.width + 0.5
    );
    expect(cardBox.y + cardBox.height).toBeLessThanOrEqual(rootBox.y + 0.5);
    expect(overlaps(curryBox, rootBox)).toBe(false);
    expect(overlaps(curryBox, cardBox)).toBe(false);

    await page.locator('.portrait[data-size="hero"]').tap();
    await expect(douyin).toHaveAttribute("aria-expanded", "false");
    await expectNoHorizontalOverflow(page);
    expect(errors).toEqual([]);
  } finally {
    await context.close();
  }
});

test("keyboard focus switches profile cards and Escape restores focus", async ({
  page,
}) => {
  await page.goto("/");
  const douyin = page.getByRole("button", { name: "Douyin" });
  await douyin.focus();
  await expect(douyin).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  const redNote = page.getByRole("button", { name: "RedNote" });
  await expect(redNote).toBeFocused();
  await expect(redNote).toHaveAttribute("aria-expanded", "true");
  await expect(douyin).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Escape");
  await expect(redNote).toHaveAttribute("aria-expanded", "false");
  await expect(redNote).toBeFocused();
});

test("failed profile media preserves identity and card geometry", async ({
  page,
}) => {
  await page.route("**/social/douyin-profile.jpg", (route) => route.abort());
  await page.goto("/");
  await page.getByRole("button", { name: "Douyin" }).focus();
  const card = page.getByRole("region", { name: "Douyin" });
  await expect(
    page.getByRole("img", {
      name: "Edward's Douyin profile card — Image unavailable",
    })
  ).toBeVisible();
  await expect(page.getByText("@Edward")).toBeVisible();
  await expect(page.getByText("891461075")).toBeVisible();
  const cardBox = await card.boundingBox();
  expect(cardBox.width).toBeGreaterThan(0);
  expect(cardBox.height).toBeGreaterThan(0);
});

test("reduced motion removes the profile-card transition", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Douyin" }).focus();
  const transition = await page
    .getByRole("region", { name: "Douyin" })
    .evaluate((node) => getComputedStyle(node).transitionDuration);
  expect(transition.split(",").every((value) => value.trim() === "0s")).toBe(
    true
  );
});
