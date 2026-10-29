"use client";

import React, { useState } from "react";
import { Badge, Box, Button, Drawer, Flex, IconButton, StatusDot, Text } from "@/components/ui";
import Sidebar from "@/features/dashboard/components/Sidebar";
import { usePathname } from "next/navigation";
import { useTheme } from "@/shared/context/ThemeContext";

interface DashboardShellProps {
  children: React.ReactNode;
  dataHook?: string;
}

export default function DashboardShell({
  children,
  dataHook = "dashboard-shell",
}: DashboardShellProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { themeDefinition, toggleTheme } = useTheme();

  // Helper to resolve title in the top bar
  const getHeaderTitle = () => {
    if (pathname === "/") return "Home";
    if (pathname === "/auth/videos") return "Videos";
    if (pathname === "/search") return "Search";
    if (pathname === "/playlists") return "Playlists";
    if (pathname?.startsWith("/playlists/")) return "Playlist";
    if (pathname === "/auth/liked") return "Favorites";
    return "Dance Journal";
  };

  return (
    <Flex
      dataHook={dataHook}
      w="screen"
      h="screen"
      overflow="hidden"
      position="relative"
      bg="bg-[var(--bg-primary)]"
    >
      {/* Mobile Navigation Drawer (includes its own backdrop) */}
      <Drawer
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        placement="left"
        size="sm"
        dataHook={`${dataHook}-mobile-drawer`}
      >
        <Sidebar />
      </Drawer>

      {/* Desktop Sidebar */}
      <Box hideOn="mobile" h="full" w="64">
        <Sidebar />
      </Box>

      {/* Main Content Area */}
      <Flex direction="col" grow minW="0" h="full" position="relative">
        {/* Top Header Navigation */}
        <Flex
          as="header"
          align="center"
          justify="between"
          w="full"
          h="16"
          px={6}
          border="bottom"
          bg="bg-[var(--bg-secondary)]"
          position="relative"
          z="30"
        >
          {/* Left: Mobile Toggle & View Title */}
          <Flex align="center" gap={3}>
            <Box hideOn="desktop">
              <IconButton
                size="sm"
                variant="ghost"
                onClick={() => setIsMobileSidebarOpen(true)}
                aria-label="Open menu"
                dataHook={`${dataHook}-open-menu`}
                icon="☰"
              />
            </Box>
            <Text variant="body" weight="bold">
              {getHeaderTitle()}
            </Text>
          </Flex>

          {/* Right: Theme Toggle + Server indicator badge */}
          <Flex align="center" gap={3}>
            {/* Theme Toggle Button */}
            <Button
              variant="secondary"
              size="sm"
              pill
              onClick={toggleTheme}
              leftIcon={themeDefinition.icon}
              aria-label={`Switch theme (current: ${themeDefinition.label})`}
              title="Switch to next theme"
              dataHook={`${dataHook}-theme-toggle`}
            >
              {themeDefinition.label}
            </Button>

            {/* Server indicator badge */}
            <Badge
              variant="surface"
              size="sm"
              pill
              icon={<StatusDot variant="success" pulse />}
              dataHook={`${dataHook}-live-badge`}
            >
              Live Connection
            </Badge>
          </Flex>
        </Flex>

        {/* Dynamic Scrollable Content Pane */}
        <Box grow overflowY="auto" pb={32} minW="0" dataHook={`${dataHook}-content`}>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
