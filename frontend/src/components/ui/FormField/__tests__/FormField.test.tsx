import { FormFieldDriver } from "./FormField.driver";

describe("FormField Component", () => {
  let driver: FormFieldDriver;

  beforeEach(() => {
    driver = new FormFieldDriver();
  });

  it("renders the label correctly", () => {
    driver.render({ label: "Email Address", children: <input /> });
    expect(driver.labelText).toBe("Email Address");
  });

  it("displays the error message when provided", () => {
    driver.render({ label: "Username", error: "Username is required", children: <input /> });
    expect(driver.errorText).toBe("Username is required");
  });
});
