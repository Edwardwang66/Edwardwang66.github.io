import { act } from "react";
import { render, screen } from "@testing-library/react";
import { setMediaQuery } from "../test/setup.js";
import { useMediaPreference } from "./useMediaPreference.js";

function Probe() {
  const motion = useMediaPreference("(prefers-reduced-motion: reduce)");
  const transparency = useMediaPreference(
    "(prefers-reduced-transparency: reduce)"
  );
  const contrast = useMediaPreference("(prefers-contrast: more)");
  return (
    <output>
      {String(motion)}:{String(transparency)}:{String(contrast)}
    </output>
  );
}

it("updates motion, transparency, and contrast independently", () => {
  render(<Probe />);

  act(() => setMediaQuery("(prefers-reduced-transparency: reduce)", true));
  expect(screen.getByText("false:true:false")).toBeInTheDocument();

  act(() => setMediaQuery("(prefers-contrast: more)", true));
  expect(screen.getByText("false:true:true")).toBeInTheDocument();

  act(() => setMediaQuery("(prefers-reduced-motion: reduce)", true));
  expect(screen.getByText("true:true:true")).toBeInTheDocument();
});
