import React from "react";
import { render } from "@testing-library/react";
import { Tabs } from "../Tabs";
import { TabsDriver } from "./Tabs.driver";

describe("Tabs Component", () => {
  const tabItems = [
    { id: "overview", label: "Overview", content: <p>Overview Tab Body</p> },
    { id: "settings", label: "Settings", content: <p>Settings Tab Body</p> },
  ];

  it("should switch content correctly when clicking tabs", () => {
    render(<Tabs items={tabItems} testId="settings-tabs" />);
    const driver = new TabsDriver("settings-tabs");

    expect(driver.exists()).toBe(true);
    expect(driver.activeContent).toContain("Overview Tab Body");

    driver.clickTab("settings");
    expect(driver.activeContent).toContain("Settings Tab Body");
  });
});
