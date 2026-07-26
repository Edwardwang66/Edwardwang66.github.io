import { createDisclosureSpring } from "./disclosureSpring.js";

describe("createDisclosureSpring", () => {
  it("starts with one active target and copies public state", () => {
    const spring = createDisclosureSpring(["a", "b"], "a");
    expect(spring.get("a")).toEqual({ value: 1, velocity: 0, target: 1 });
    expect(spring.get("b")).toEqual({ value: 0, velocity: 0, target: 0 });
    const snapshot = spring.get("a");
    snapshot.value = 0;
    expect(spring.get("a").value).toBe(1);
  });

  it("moves both targets without overshooting", () => {
    const spring = createDisclosureSpring(["a", "b"], "a", {
      responseSeconds: 0.4,
    });
    spring.retarget("b");
    spring.advance(0.12);
    expect(spring.get("a").value).toBeGreaterThanOrEqual(0);
    expect(spring.get("a").value).toBeLessThan(1);
    expect(spring.get("b").value).toBeGreaterThan(0);
    expect(spring.get("b").value).toBeLessThanOrEqual(1);
  });

  it("is frame-rate independent across irregular intervals", () => {
    const irregular = [
      0.011, 0.019, 0.014, 0.023, 0.009, 0.017, 0.021, 0.012, 0.016,
      0.018, 0.013, 0.024, 0.01, 0.022, 0.015, 0.02, 0.012, 0.024,
    ];
    expect(irregular.reduce((sum, value) => sum + value, 0)).toBeCloseTo(0.3);

    const stepped = createDisclosureSpring(["a", "b"], "a");
    const single = createDisclosureSpring(["a", "b"], "a");
    stepped.retarget("b");
    single.retarget("b");
    irregular.forEach((delta) => stepped.advance(delta));
    single.advance(0.3);

    expect(stepped.get("a").value).toBeCloseTo(single.get("a").value, 6);
    expect(stepped.get("a").velocity).toBeCloseTo(
      single.get("a").velocity,
      6
    );
    expect(stepped.get("b").value).toBeCloseTo(single.get("b").value, 6);
  });

  it("retargets from the live value and velocity and converges in bounds", () => {
    const spring = createDisclosureSpring(["a", "b"], "a");
    spring.retarget("b");
    spring.advance(0.1);
    const before = spring.get("a");

    spring.retarget("a");
    expect(spring.get("a").value).toBe(before.value);
    expect(spring.get("a").velocity).toBe(before.velocity);

    for (let index = 0; index < 120; index += 1) {
      spring.advance(1 / 120);
      for (const id of ["a", "b"]) {
        expect(spring.get(id).value).toBeGreaterThanOrEqual(0);
        expect(spring.get(id).value).toBeLessThanOrEqual(1);
      }
    }
    expect(spring.get("a").value).toBeCloseTo(1, 3);
    expect(spring.get("b").value).toBeCloseTo(0, 3);
  });

  it("jumps immediately and reports settlement only below both thresholds", () => {
    const spring = createDisclosureSpring(["a", "b"], "a");
    spring.retarget("b");
    expect(spring.isSettled()).toBe(false);
    spring.jumpTo("b");
    expect(spring.get("a")).toEqual({ value: 0, velocity: 0, target: 0 });
    expect(spring.get("b")).toEqual({ value: 1, velocity: 0, target: 1 });
    expect(spring.isSettled()).toBe(true);
  });

  it("rejects invalid responses and unknown active IDs", () => {
    expect(() =>
      createDisclosureSpring(["a"], "a", { responseSeconds: 0 })
    ).toThrow(RangeError);
    const spring = createDisclosureSpring(["a"], "a");
    expect(() => spring.retarget("b")).toThrow(RangeError);
  });
});
