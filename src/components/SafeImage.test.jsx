import { fireEvent, render, screen } from "@testing-library/react";
import SafeImage from "./SafeImage.jsx";

describe("SafeImage", () => {
  it("preserves intrinsic image attributes and eager loading", () => {
    render(
      <SafeImage
        src="/portrait.jpg"
        alt="Portrait"
        width={1080}
        height={1080}
        loading="eager"
      />
    );
    const image = screen.getByRole("img", { name: "Portrait" });
    expect(image).toHaveAttribute("src", "/portrait.jpg");
    expect(image).toHaveAttribute("width", "1080");
    expect(image).toHaveAttribute("height", "1080");
    expect(image).toHaveAttribute("loading", "eager");
    expect(image).toHaveAttribute("decoding", "async");
  });

  it("names failures and retries whenever the source changes", () => {
    const { rerender } = render(
      <SafeImage
        src="/a.jpg"
        alt="Evidence A"
        width={400}
        height={300}
        fallbackLabel="Project image unavailable"
      />
    );
    fireEvent.error(screen.getByRole("img", { name: "Evidence A" }));
    expect(
      screen.getByRole("img", {
        name: "Evidence A — Project image unavailable",
      })
    ).toBeInTheDocument();

    rerender(
      <SafeImage
        src="/b.jpg"
        alt="Evidence B"
        width={400}
        height={300}
        fallbackLabel="Project image unavailable"
      />
    );
    expect(screen.getByRole("img", { name: "Evidence B" })).toHaveAttribute(
      "src",
      "/b.jpg"
    );

    rerender(
      <SafeImage
        src="/a.jpg"
        alt="Evidence A"
        width={400}
        height={300}
        fallbackLabel="Project image unavailable"
      />
    );
    expect(screen.getByRole("img", { name: "Evidence A" })).toHaveAttribute(
      "src",
      "/a.jpg"
    );
  });
});
