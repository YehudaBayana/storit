import { FlexDriver } from "./Flex.driver";

describe("Flex", () => {
  it("renders configurable direction, gap, and semantic element", () => {
    const driver = new FlexDriver();
    driver.render({
      dataHook: "toolbar-layout",
      direction: "row-reverse",
      gap: 4,
      as: "section",
    });
    expect(driver.getTagName("toolbar-layout")).toBe("SECTION");
    expect(driver.getClassName("toolbar-layout")).toContain("flex-row-reverse");
    expect(driver.getClassName("toolbar-layout")).toContain("gap-4");
  });

  it("applies position, inset, and z props", () => {
    const driver = new FlexDriver();
    driver.render({ position: "absolute", inset: "y-0", z: "40" });
    expect(driver.getClassName()).toContain("absolute");
    expect(driver.getClassName()).toContain("inset-y-0");
    expect(driver.getClassName()).toContain("z-40");
  });

  it("applies overflow and group props", () => {
    const driver = new FlexDriver();
    driver.render({ overflow: "hidden", group: true });
    expect(driver.getClassName()).toContain("overflow-hidden");
    expect(driver.getClassName()).toContain("group");
  });
});
