import { IconButtonDriver } from "./IconButton.driver";

describe("IconButton", () => {
  let driver: IconButtonDriver;

  beforeEach(() => {
    driver = new IconButtonDriver();
  });

  it("supports a custom root hook and invokes its action", () => {
    const onClick = jest.fn();
    driver.render({ dataHook: "play-control", onClick });
    driver.click("play-control");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disables while loading and applies variant, size, and rounded styles", () => {
    driver.render({ loading: true, variant: "danger", size: "lg", rounded: true });
    expect(driver.isDisabled()).toBe(true);
    expect(driver.getClassName()).toContain("bg-rose-600");
    expect(driver.getClassName()).toContain("w-12 h-12");
    expect(driver.getClassName()).toContain("rounded-full");
  });

  it("hides until group hover when hideUntilGroupHover is set", () => {
    driver.render({ hideUntilGroupHover: true });
    expect(driver.getClassName()).toContain("opacity-0");
    expect(driver.getClassName()).toContain("group-hover:opacity-100");
  });

  it("shows only on group hover when showOnGroupHover is set", () => {
    driver.render({ showOnGroupHover: true });
    expect(driver.getClassName()).toContain("hidden");
    expect(driver.getClassName()).toContain("group-hover:inline-flex");
  });
});
