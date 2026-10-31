import { StackDriver } from "./Stack.driver";

describe("Stack Component", () => {
  let driver: StackDriver;

  beforeEach(() => {
    driver = new StackDriver();
  });

  it("renders children correctly in a column by default", () => {
    driver.render({ children: <span>Test Item</span> });
    expect(driver.element).toBeInTheDocument();
    expect(driver.hasClass("flex-col")).toBe(true);
  });

  it("applies row direction when specified", () => {
    driver.render({ direction: "row", children: <span>Test Item</span> });
    expect(driver.hasClass("flex-row")).toBe(true);
  });
});
