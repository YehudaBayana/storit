"use client";

import React from "react";
import { Badge, Box, Flex, Text } from "@/components/ui";
import { usePathname } from "next/navigation";
import { sections, sidebarItems } from "../sidebar/items";
import Sidebar from "../sidebar/Sidebar";

interface DashboardShellProps {
  children: React.ReactNode;
  dataHook?: string;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();

  const activeId = sidebarItems.find((item) => item.href === pathname)?.id || "home";
  // Helper to resolve title in the top bar
  const getHeaderTitle = () => {
    if (pathname === "/") return "Home";
    if (pathname === "/videos") return "Videos";
    if (pathname === "/search") return "Search";
    if (pathname === "/playlists") return "Playlists";
    if (pathname?.startsWith("/playlists/")) return "Playlist";
    if (pathname === "/auth/liked") return "Favorites";
    return "cloud storage";
  };

  return (
    <Flex>
      {/* Mobile Navigation Drawer (includes its own backdrop) */}
      {/* <Drawer
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        placement="left"
        size="sm"
        dataHook={`${dataHook}-mobile-drawer`}
      > */}
      <Sidebar sections={sections} activeId={activeId} />

      {/* Main Content Area */}
      <Flex direction="col">
        {/* Top Header Navigation */}
        <Flex as="header" align="center" justify="between">
          {/* Left: Mobile Toggle & View Title */}
          <Flex align="center" gap={"md"}>
            <Box>
              {/* <IconButton
                size="sm"
                variant="ghost"
                onClick={() => setIsMobileSidebarOpen(true)}
                aria-label="Open menu"
                dataHook={`${dataHook}-open-menu`}
                icon="☰"
              /> */}
            </Box>
            <Text>{getHeaderTitle()}</Text>
          </Flex>

          {/* Right: Theme Toggle + Server indicator badge */}
          <Flex align="center" gap={"md"}>
            {/* Server indicator badge */}
            <Badge
              // variant="surface"
              size="sm"
              // pill
              // icon={<StatusDot variant="success" pulse />}
              // dataHook={`${dataHook}-live-badge`}
            >
              Live Connection
            </Badge>
          </Flex>
        </Flex>

        {/* Dynamic Scrollable Content Pane */}
        <Box>{children}</Box>
      </Flex>
    </Flex>
  );
}
