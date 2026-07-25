import { render, screen } from "@testing-library/react";
import { socialIcons } from "./socialIcons.js";

it("uses a monochrome custom Douyin mark and the approved RedNote outline", () => {
  const Douyin = socialIcons.douyin;
  const RedNote = socialIcons.rednote;
  const { container } = render(
    <>
      <Douyin aria-label="Douyin icon" />
      <RedNote aria-label="RedNote icon" />
    </>
  );

  expect(screen.getByLabelText("Douyin icon")).toHaveAttribute(
    "data-icon",
    "douyin"
  );
  expect(container.querySelector('[data-icon="douyin"] path')).toHaveAttribute(
    "fill",
    "currentColor"
  );
  expect(screen.getByLabelText("RedNote icon")).toBeInTheDocument();
});
