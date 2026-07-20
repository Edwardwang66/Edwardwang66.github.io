import { fireEvent, render, screen } from "@testing-library/react";
import Portfolio from "./Portfolio.jsx";

describe("portfolio baseline", () => {
  it("renders the current editorial shell before Original+ changes", () => {
    render(<Portfolio />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Work" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "About" })).toBeInTheDocument();
    expect(screen.getAllByText("Edward Wang").length).toBeGreaterThan(0);
  });

  it("keeps normalized text-only projects reachable during extraction", () => {
    render(<Portfolio />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /ML-Supported Nanoparticle & Cell-Membrane Selection/,
      })
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "ML-Supported Nanoparticle & Cell-Membrane Selection",
      })
    ).toBeInTheDocument();
  });
});
