import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { profile } from "../data/portfolio.js";
import { setMediaQuery } from "../test/setup.js";
import SocialLinks from "./SocialLinks.jsx";

function renderSocials() {
  return render(<SocialLinks socials={profile.socials} />);
}

it("renders four links and two disclosure buttons in approved order", () => {
  const { container } = renderSocials();
  const controls = [
    ...container.querySelectorAll(".hero-socials > li > :is(a, button)"),
  ];
  expect(controls.map((control) => control.textContent)).toEqual([
    "GitHub",
    "LinkedIn",
    "Email",
    "Instagram",
    "Douyin",
    "RedNote",
  ]);
  expect(controls.slice(0, 4).every((node) => node.tagName === "A")).toBe(true);
  expect(controls.slice(4).every((node) => node.tagName === "BUTTON")).toBe(true);

  expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute(
    "href",
    "https://www.instagram.com/edwardwang15/"
  );
  expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute(
    "target",
    "_blank"
  );
  expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute(
    "rel",
    "noreferrer"
  );

  for (const label of ["Douyin", "RedNote"]) {
    const button = screen.getByRole("button", { name: label });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute(
      "aria-controls",
      `social-profile-card-${label.toLowerCase()}`
    );
  }
});

it("toggles touch cards and leaves only one expanded", async () => {
  setMediaQuery("(hover: hover) and (pointer: fine)", false);
  const user = userEvent.setup();
  renderSocials();

  await user.click(screen.getByRole("button", { name: "Douyin" }));
  expect(screen.getByRole("button", { name: "Douyin" })).toHaveAttribute(
    "aria-expanded",
    "true"
  );
  expect(
    screen.getByRole("region", { name: "Douyin" })
  ).toHaveAttribute("data-state", "open");
  expect(screen.getByText("@Edward")).toBeInTheDocument();
  expect(screen.getByText("891461075")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "RedNote" }));
  expect(screen.getByRole("button", { name: "Douyin" })).toHaveAttribute(
    "aria-expanded",
    "false"
  );
  expect(screen.getByRole("button", { name: "RedNote" })).toHaveAttribute(
    "aria-expanded",
    "true"
  );

  await user.keyboard("{Escape}");
  expect(screen.getByRole("button", { name: "RedNote" })).toHaveAttribute(
    "aria-expanded",
    "false"
  );
});

it("lets a repeated touch on one profile control close its card", async () => {
  setMediaQuery("(hover: hover) and (pointer: fine)", false);
  const user = userEvent.setup();
  renderSocials();
  const douyin = screen.getByRole("button", { name: "Douyin" });

  await user.click(douyin);
  expect(douyin).toHaveAttribute("aria-expanded", "true");
  await user.click(douyin);
  expect(douyin).toHaveAttribute("aria-expanded", "false");
});

it("opens on fine-pointer hover and stays open while entering the card", () => {
  setMediaQuery("(hover: hover) and (pointer: fine)", true);
  const { container } = renderSocials();
  const button = screen.getByRole("button", { name: "Douyin" });
  const root = container.querySelector(".social-links");
  const card = container.querySelector("#social-profile-card-douyin");

  fireEvent.pointerEnter(button);
  expect(button).toHaveAttribute("aria-expanded", "true");
  fireEvent.pointerLeave(root, { relatedTarget: card });
  expect(button).toHaveAttribute("aria-expanded", "true");
  fireEvent.pointerLeave(root, { relatedTarget: document.body });
  expect(button).toHaveAttribute("aria-expanded", "false");
});

it("keeps a fine-pointer disclosure closed after Escape restores trigger focus", () => {
  setMediaQuery("(hover: hover) and (pointer: fine)", true);
  renderSocials();
  const button = screen.getByRole("button", { name: "Douyin" });

  fireEvent.pointerEnter(button);
  expect(button).toHaveAttribute("aria-expanded", "true");

  fireEvent.keyDown(document, { key: "Escape" });
  expect(button).toHaveFocus();
  expect(button).toHaveAttribute("aria-expanded", "false");
});

it("preserves a keyboard-owned disclosure across fine-pointer leave", async () => {
  setMediaQuery("(hover: hover) and (pointer: fine)", true);
  const user = userEvent.setup();
  const { container } = renderSocials();
  const root = container.querySelector(".social-links");
  const douyin = screen.getByRole("button", { name: "Douyin" });
  const redNote = screen.getByRole("button", { name: "RedNote" });

  for (const label of ["GitHub", "LinkedIn", "Email", "Instagram"]) {
    await user.tab();
    expect(screen.getByRole("link", { name: label })).toHaveFocus();
  }
  await user.tab();
  expect(douyin).toHaveFocus();
  expect(douyin).toHaveAttribute("aria-expanded", "true");

  fireEvent.pointerLeave(root, { relatedTarget: document.body });
  expect(douyin).toHaveAttribute("aria-expanded", "true");

  await user.tab();
  expect(redNote).toHaveFocus();
  expect(douyin).toHaveAttribute("aria-expanded", "false");
  expect(redNote).toHaveAttribute("aria-expanded", "true");
});

it("opens on focus, switches on the other profile control, and closes outside", async () => {
  const user = userEvent.setup();
  renderSocials();

  for (const label of ["GitHub", "LinkedIn", "Email", "Instagram"]) {
    await user.tab();
    expect(screen.getByRole("link", { name: label })).toHaveFocus();
  }
  await user.tab();
  expect(screen.getByRole("button", { name: "Douyin" })).toHaveAttribute(
    "aria-expanded",
    "true"
  );
  await user.tab();
  expect(screen.getByRole("button", { name: "RedNote" })).toHaveAttribute(
    "aria-expanded",
    "true"
  );
  await user.tab();
  expect(screen.getByRole("button", { name: "RedNote" })).toHaveAttribute(
    "aria-expanded",
    "false"
  );
});

it("closes on an outside pointer action", async () => {
  setMediaQuery("(hover: hover) and (pointer: fine)", false);
  const user = userEvent.setup();
  renderSocials();
  await user.click(screen.getByRole("button", { name: "Douyin" }));
  fireEvent.pointerDown(document.body);
  expect(screen.getByRole("button", { name: "Douyin" })).toHaveAttribute(
    "aria-expanded",
    "false"
  );
});

it("keeps identity text when the profile image fails", async () => {
  setMediaQuery("(hover: hover) and (pointer: fine)", false);
  const user = userEvent.setup();
  renderSocials();
  await user.click(screen.getByRole("button", { name: "Douyin" }));
  fireEvent.error(
    screen.getByRole("img", { name: "Edward's Douyin profile card" })
  );
  expect(
    screen.getByRole("img", {
      name: "Edward's Douyin profile card — Image unavailable",
    })
  ).toBeInTheDocument();
  expect(screen.getByText("@Edward")).toBeInTheDocument();
  expect(screen.getByText("891461075")).toBeInTheDocument();
});

it("clamps the active card within the measured social container", async () => {
  setMediaQuery("(hover: hover) and (pointer: fine)", false);
  const user = userEvent.setup();
  const { container } = renderSocials();
  const root = container.querySelector(".social-links");
  const redNote = screen.getByRole("button", { name: "RedNote" });
  const card = container.querySelector("#social-profile-card-rednote");

  vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
    x: 24, left: 24, right: 324, width: 300,
    y: 0, top: 0, bottom: 80, height: 80, toJSON() {},
  });
  vi.spyOn(redNote, "getBoundingClientRect").mockReturnValue({
    x: 280, left: 280, right: 324, width: 44,
    y: 36, top: 36, bottom: 80, height: 44, toJSON() {},
  });
  Object.defineProperty(card, "offsetWidth", {
    configurable: true,
    value: 280,
  });

  await user.click(redNote);
  expect(card.style.getPropertyValue("--social-card-left")).toBe("20px");
  expect(within(card).getByText("943036106")).toBeInTheDocument();
});
