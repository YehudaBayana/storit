import { InputDriver } from "./Input.driver";

describe("Input Component", () => {
  let driver: InputDriver;

  beforeEach(() => {
    driver = new InputDriver();
  });

  it("updates its value when typed into", () => {
    driver.render({});
    driver.type("hello world");
    expect(driver.value).toBe("hello world");
  });

  it("applies error styling when hasError is true", () => {
    driver.render({ hasError: true });
    expect(driver.element.classList.contains("border-red-500")).toBe(true);
  });
});
