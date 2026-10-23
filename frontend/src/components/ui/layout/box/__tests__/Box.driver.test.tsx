import { BoxDriver } from "./Box.driver";

describe("Box", () => {
  it("renders its configurable root as the requested element", () => {
    const driver = new BoxDriver();
    driver.render({ dataHook: "content-box", as: "section", p: 4 });
    expect(driver.getTagName("content-box")).toBe("SECTION");
    expect(driver.getClassName("content-box")).toContain("p-4");
  });

  it("applies position, inset, and z props", () => {
    const driver = new BoxDriver();
    driver.render({ position: "fixed", inset: "0", z: "50" });
    expect(driver.getClassName()).toContain("fixed");
    expect(driver.getClassName()).toContain("inset-0");
    expect(driver.getClassName()).toContain("z-50");
  });

  it("applies overflow props", () => {
    const driver = new BoxDriver();
    driver.render({ overflow: "hidden", overflowY: "auto" });
    expect(driver.getClassName()).toContain("overflow-hidden");
    expect(driver.getClassName()).toContain("overflow-y-auto");
  });

  it("applies aspect ratio and group props", () => {
    const driver = new BoxDriver();
    driver.render({ aspect: "video", group: true });
    expect(driver.getClassName()).toContain("aspect-video");
    expect(driver.getClassName()).toContain("group");
  });
});
