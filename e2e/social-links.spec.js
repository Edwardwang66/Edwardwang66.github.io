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

async function socialLayout(page) {
  return page.locator(".hero-socials").evaluate((list) => {
    const items = [...list.children].map((item) => item.getBoundingClientRect());
    const controls = [
      ...list.querySelectorAll(":scope > li > :is(a, button)"),
    ].map((control) => control.getBoundingClientRect());
    const style = getComputedStyle(list);

    return {
      display: style.display,
      itemWidths: items.map(({ width }) => width),
      controlLefts: controls.map(({ left }) => left),
      controlTops: controls.map(({ top }) => top),
    };
  });
}

async function footerSocialLayout(page) {
  return page.locator(".footer-socials").evaluate((list) => {
    const items = [...list.children].map((item) => item.getBoundingClientRect());
    const controls = [
      ...list.querySelectorAll(":scope > li > :is(a, button)"),
    ].map((control) => control.getBoundingClientRect());
    const style = getComputedStyle(list);

    return {
      display: style.display,
      itemWidths: items.map(({ width }) => width),
      controlLefts: controls.map(({ left }) => left),
      controlTops: controls.map(({ top }) => top),
    };
  });
}

function heroSocialRoot(page) {
  return page.locator(".hero-socials").locator("..");
}

test("hero social rail keeps the approved order and native semantics", async ({
  page,
}) => {
  await page.goto("/");

  const controls = page.locator(".hero-socials > li > :is(a, button)");
  await expect(controls).toHaveText(labels);
  await expect(page.locator(".hero-socials > li > a")).toHaveCount(4);
  await expect(page.locator(".hero-socials > li > button")).toHaveCount(2);

  const instagram = heroSocialRoot(page).getByRole("link", {
    name: "Instagram",
  });
  await expect(instagram).toHaveAttribute(
    "href",
    "https://www.instagram.com/edwardwang15/"
  );
  await expect(instagram).toHaveAttribute("target", "_blank");
  await expect(instagram).toHaveAttribute("rel", "noreferrer");
});

test("footer exposes six socials and opens profile cards upward", async ({
  page,
}) => {
  const errors = watchBrowserErrors(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.locator(".site-footer").scrollIntoViewIfNeeded();

  const controls = page.locator(
    ".footer-socials > li > :is(a, button)"
  );
  await expect(controls).toHaveText(labels);
  await expect(page.locator(".footer-socials > li > a")).toHaveCount(4);
  await expect(page.locator(".footer-socials > li > button")).toHaveCount(2);

  const douyin = page
    .locator(".site-footer")
    .getByRole("button", { name: "Douyin" });
  const douyinCard = page
    .locator(".site-footer")
    .getByRole("region", { name: "Douyin" });
  await douyin.click();
  await expect(douyinCard).toHaveAttribute("data-placement", "above");

  const [triggerBox, cardBox] = await Promise.all([
    douyin.boundingBox(),
    douyinCard.boundingBox(),
  ]);
  expect(cardBox.y + cardBox.height).toBeLessThanOrEqual(triggerBox.y);

  const redNote = page
    .locator(".site-footer")
    .getByRole("button", { name: "RedNote" });
  await redNote.click();
  await expect(douyin).toHaveAttribute("aria-expanded", "false");
  await expect(redNote).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.locator(".site-footer").getByRole("region", { name: "RedNote" })
  ).toHaveAttribute("data-placement", "above");

  await page.keyboard.press("Escape");
  await expect(redNote).toHaveAttribute("aria-expanded", "false");
  await expect(redNote).toBeFocused();
  expect(errors).toEqual([]);
});

test("phone footer socials use an aligned three-column grid", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(".site-footer").scrollIntoViewIfNeeded();

  const layout = await footerSocialLayout(page);
  expect(layout.display).toBe("grid");
  expect(
    Math.max(...layout.itemWidths) - Math.min(...layout.itemWidths)
  ).toBeLessThan(1);
  for (let column = 0; column < 3; column += 1) {
    expect(
      Math.abs(layout.controlLefts[column] - layout.controlLefts[column + 3])
    ).toBeLessThan(1);
  }
  expect(new Set(layout.controlTops.map(Math.round)).size).toBe(2);
  await expectNoHorizontalOverflow(page);
});

for (const viewport of [
  { width: 375, height: 667 },
  { width: 390, height: 844 },
]) {
  test(`${viewport.width}px phone socials use an aligned three-column grid`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const layout = await socialLayout(page);
    expect(layout.display).toBe("grid");
    expect(
      Math.max(...layout.itemWidths) - Math.min(...layout.itemWidths)
    ).toBeLessThan(1);

    for (let column = 0; column < 3; column += 1) {
      expect(
        Math.abs(
          layout.controlLefts[column] - layout.controlLefts[column + 3]
        )
      ).toBeLessThan(1);
    }

    expect(new Set(layout.controlTops.map(Math.round)).size).toBe(2);
    await expectNoHorizontalOverflow(page);
  });
}

for (const width of [520, 640, 1440]) {
  test(`${width}px keeps the existing non-phone social layout`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect((await socialLayout(page)).display).toBe("flex");
  });
}

test("desktop social profiles stay open across pointer travel and clamp to hero copy", async ({
  page,
}) => {
  const errors = watchBrowserErrors(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);

  const socialLinks = heroSocialRoot(page);
  const douyin = socialLinks.getByRole("button", { name: "Douyin" });
  const card = socialLinks.getByRole("region", { name: "Douyin" });
  await douyin.hover();
  await expect(douyin).toHaveAttribute("aria-expanded", "true");
  await expect(card).toHaveAttribute("data-state", "open");
  await expect(card).toHaveAttribute("data-placement", "above");
  const [initialRootBox, initialCardBox, initialHeaderBox] = await Promise.all([
    socialLinks.boundingBox(),
    card.boundingBox(),
    page.locator(".site-nav").boundingBox(),
  ]);
  expect(initialCardBox.y).toBeGreaterThanOrEqual(
    initialHeaderBox.y + initialHeaderBox.height + 7.5
  );
  expect(initialCardBox.y + initialCardBox.height).toBeLessThanOrEqual(
    initialRootBox.y + 0.5
  );
  await card.hover();
  await expect(card).toHaveAttribute("data-state", "open");

  const redNote = socialLinks.getByRole("button", { name: "RedNote" });
  await redNote.hover();
  await expect(douyin).toHaveAttribute("aria-expanded", "false");
  await expect(redNote).toHaveAttribute("aria-expanded", "true");

  const [rootBox, cardBox, curryBox, headerBox, placement] = await Promise.all([
    socialLinks.boundingBox(),
    socialLinks.getByRole("region", { name: "RedNote" }).boundingBox(),
    page.locator(".curry-companion").boundingBox(),
    page.locator(".site-nav").boundingBox(),
    socialLinks
      .getByRole("region", { name: "RedNote" })
      .getAttribute("data-placement"),
  ]);
  expect(cardBox.x).toBeGreaterThanOrEqual(rootBox.x - 0.5);
  expect(cardBox.x + cardBox.width).toBeLessThanOrEqual(
    rootBox.x + rootBox.width + 0.5
  );
  expect(cardBox.y).toBeGreaterThanOrEqual(
    headerBox.y + headerBox.height + 7.5
  );
  if (placement === "above") {
    expect(cardBox.y + cardBox.height).toBeLessThanOrEqual(rootBox.y + 0.5);
  } else {
    expect(placement).toBe("below");
    expect(cardBox.y).toBeGreaterThanOrEqual(
      rootBox.y + rootBox.height + 7.5
    );
  }
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

    const socialLinks = heroSocialRoot(page);
    const douyin = socialLinks.getByRole("button", { name: "Douyin" });
    await douyin.tap();
    await expect(douyin).toHaveAttribute("aria-expanded", "true");
    await expect(socialLinks.getByText("@Edward")).toBeVisible();
    await expect(socialLinks.getByText("891461075")).toBeVisible();

    const card = socialLinks.getByRole("region", { name: "Douyin" });
    const [rootBox, cardBox, curryBox] = await Promise.all([
      socialLinks.boundingBox(),
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
  const socialLinks = heroSocialRoot(page);
  const douyin = socialLinks.getByRole("button", { name: "Douyin" });
  await douyin.focus();
  await expect(douyin).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  const redNote = socialLinks.getByRole("button", { name: "RedNote" });
  await expect(redNote).toBeFocused();
  await expect(redNote).toHaveAttribute("aria-expanded", "true");
  await expect(douyin).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Escape");
  await expect(redNote).toHaveAttribute("aria-expanded", "false");
  await expect(redNote).toBeFocused();
});

for (const width of [640, 663]) {
  test(`${width}px keyboard card stays inside the copy with safe vertical placement`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const socialLinks = heroSocialRoot(page);
    const douyin = socialLinks.getByRole("button", { name: "Douyin" });
    for (let index = 0; index < 16; index += 1) {
      if (await douyin.evaluate((node) => node === document.activeElement)) {
        break;
      }
      await page.keyboard.press("Tab");
    }
    await expect(douyin).toBeFocused();
    await expect(douyin).toHaveAttribute("aria-expanded", "true");

    const card = socialLinks.getByRole("region", { name: "Douyin" });
    const [rootBox, cardBox, headerBox] = await Promise.all([
      socialLinks.boundingBox(),
      card.boundingBox(),
      page.locator(".site-nav").boundingBox(),
    ]);
    expect(cardBox.width).toBeLessThanOrEqual(rootBox.width + 0.5);
    expect(cardBox.x).toBeGreaterThanOrEqual(rootBox.x - 0.5);
    expect(cardBox.x + cardBox.width).toBeLessThanOrEqual(
      rootBox.x + rootBox.width + 0.5
    );
    expect(cardBox.y).toBeGreaterThanOrEqual(
      headerBox.y + headerBox.height + 7.5
    );
    const placement = await card.getAttribute("data-placement");
    if (width === 640) {
      expect(placement).toBe("below");
    }
    if (placement === "above") {
      expect(cardBox.y + cardBox.height).toBeLessThanOrEqual(rootBox.y + 0.5);
    } else {
      expect(placement).toBe("below");
      expect(cardBox.y).toBeGreaterThanOrEqual(
        rootBox.y + rootBox.height + 7.5
      );
    }

    const accountId = card.getByText("891461075");
    await accountId.scrollIntoViewIfNeeded();
    const accountBox = await accountId.boundingBox();
    expect(accountBox.y).toBeGreaterThanOrEqual(headerBox.height);
    expect(accountBox.y + accountBox.height).toBeLessThanOrEqual(900);
    await expectNoHorizontalOverflow(page);
  });
}

test("failed profile media preserves identity and card geometry", async ({
  page,
}) => {
  await page.route("**/social/douyin-profile.jpg", (route) => route.abort());
  await page.goto("/");
  const socialLinks = heroSocialRoot(page);
  await socialLinks.getByRole("button", { name: "Douyin" }).focus();
  const card = socialLinks.getByRole("region", { name: "Douyin" });
  await expect(
    socialLinks.getByRole("img", {
      name: "Edward's Douyin profile card — Image unavailable",
    })
  ).toBeVisible();
  await expect(socialLinks.getByText("@Edward")).toBeVisible();
  await expect(socialLinks.getByText("891461075")).toBeVisible();
  const cardBox = await card.boundingBox();
  expect(cardBox.width).toBeGreaterThan(0);
  expect(cardBox.height).toBeGreaterThan(0);
});

test("reduced motion removes the profile-card transition", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const socialLinks = heroSocialRoot(page);
  await socialLinks.getByRole("button", { name: "Douyin" }).focus();
  const transition = await socialLinks
    .getByRole("region", { name: "Douyin" })
    .evaluate((node) => getComputedStyle(node).transitionDuration);
  expect(transition.split(",").every((value) => value.trim() === "0s")).toBe(
    true
  );
});
