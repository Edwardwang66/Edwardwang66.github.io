import { chooseActiveProject, isTapLockActive } from "./projectActivation.js";

describe("chooseActiveProject", () => {
  const base = {
    ids: ["01", "02"],
    activeId: "01",
    readingLine: 320,
    direction: 1,
    hysteresisPx: 64,
  };

  it("holds at 63px and switches at the exact 64px boundary", () => {
    expect(
      chooseActiveProject({
        ...base,
        centersById: new Map([
          ["01", 384],
          ["02", 321],
        ]),
      })
    ).toBe("01");

    expect(
      chooseActiveProject({
        ...base,
        centersById: new Map([
          ["01", 385],
          ["02", 321],
        ]),
      })
    ).toBe("02");
  });

  it("selects the nearest valid item when the current center is missing", () => {
    expect(
      chooseActiveProject({
        ids: ["01", "02", "03"],
        activeId: "01",
        centersById: new Map([
          ["02", Number.NaN],
          ["03", 330],
          ["outside", 320],
        ]),
        readingLine: 320,
        direction: 1,
      })
    ).toBe("03");
  });

  it("resolves equal candidates by direction, then document order", () => {
    const options = {
      ids: ["01", "02", "03"],
      activeId: "missing",
      centersById: new Map([
        ["01", 300],
        ["02", 340],
        ["03", 360],
      ]),
      readingLine: 320,
      hysteresisPx: 0,
    };

    expect(chooseActiveProject({ ...options, direction: 1 })).toBe("02");
    expect(chooseActiveProject({ ...options, direction: -1 })).toBe("01");
    expect(chooseActiveProject({ ...options, direction: 0 })).toBe("01");
  });

  it("preserves the active ID when there is no valid alternative", () => {
    expect(
      chooseActiveProject({
        ids: ["01", "02"],
        activeId: "01",
        centersById: new Map([["outside", 320]]),
        readingLine: 320,
        direction: 1,
      })
    ).toBe("01");
  });
});

describe("isTapLockActive", () => {
  const lock = { startedAt: 100, scrollY: 200 };

  it("locks through 899ms and releases at 900ms", () => {
    expect(isTapLockActive(lock, { now: 999, scrollY: 200 })).toBe(true);
    expect(isTapLockActive(lock, { now: 1000, scrollY: 200 })).toBe(false);
  });

  it("locks through 96px and releases beyond it in either direction", () => {
    expect(isTapLockActive(lock, { now: 200, scrollY: 296 })).toBe(true);
    expect(isTapLockActive(lock, { now: 200, scrollY: 297 })).toBe(false);
    expect(isTapLockActive(lock, { now: 200, scrollY: 103 })).toBe(false);
  });

  it("treats a missing lock as inactive", () => {
    expect(isTapLockActive(null, { now: 0, scrollY: 0 })).toBe(false);
  });
});
