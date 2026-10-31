import React from "react";
import { render } from "@testing-library/react";
import Sidebar, { SidebarSection } from "../Sidebar";
import { SidebarDriver } from "./Sidebar.driver";
import { IoFolderOutline, IoStarOutline } from "react-icons/io5";

describe("Sidebar Component", () => {
  const sections: SidebarSection[] = [
    {
      title: "Files",
      items: [
        { id: "all-files", label: "All Files", href: "/files", icon: IoFolderOutline },
        { id: "starred", label: "Starred", href: "/starred", icon: IoStarOutline, badge: "3" },
      ],
    },
  ];

  it("should render sections and highlight the active item", () => {
    render(
      <Sidebar
        testId="app-sidebar"
        sections={sections}
        activeId="all-files"
        logo={<span className="font-bold text-lg">Cloudy</span>}
      />,
    );

    const driver = new SidebarDriver("app-sidebar");

    expect(driver.exists()).toBe(true);
    expect(driver.isItemActive("all-files")).toBe(true);
    expect(driver.isItemActive("starred")).toBe(false);
  });
});
