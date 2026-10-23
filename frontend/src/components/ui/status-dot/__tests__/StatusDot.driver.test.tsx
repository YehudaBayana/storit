import { StatusDotDriver } from "./StatusDot.driver";

describe("StatusDot", () => {
  let driver: StatusDotDriver;

  beforeEach(() => {
    driver = new StatusDotDriver();
  });

  it("renders with default props", () => {
    driver.render({ dataHook: "dot" });
    expect(driver.exists("dot")).toBe(true);
    expect(driver.getClassName("dot")).toContain("bg-emerald-500");
  });

  it.each([
    ["success", "bg-emerald-500"],
    ["danger", "bg-rose-500"],
    ["warning", "bg-amber-500"],
    ["info", "bg-blue-500"],
    ["neutral", "bg-gray-400"],
  ] as const)("supports %s variant", (variant, expectedClass) => {
    driver.render({ variant });
    expect(driver.getClassName()).toContain(expectedClass);
  });

  it.each([
    ["sm", "w-1.5"],
    ["md", "w-2.5"],
    ["lg", "w-3.5"],
  ] as const)("supports %s size", (size, expectedClass) => {
    driver.render({ size });
    expect(driver.getClassName()).toContain(expectedClass);
  });

  it("pulses when pulse is set", () => {
    driver.render({ pulse: true });
    expect(driver.getClassName()).toContain("animate-pulse");
  });

  it("does not pulse by default", () => {
    driver.render();
    expect(driver.getClassName()).not.toContain("animate-pulse");
  });
});
