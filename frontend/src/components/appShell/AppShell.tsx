"use client";
import {
  AppShell,
  Burger,
  Button,
  Group,
  Text,
  useAppShellResize,
  NavLink,
  Stack,
} from "@mantine/core";
import { ColorSchemeToggle } from "../ColorSchemeToggle/ColorSchemeToggle";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { FiHome, FiVideo } from "react-icons/fi";
import { FloatingVideoPlayer } from "@/features/videos/components/FloatingVideoPlayer";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: FiHome },
  { label: "Videos", href: "/videos", icon: FiVideo },
];

export function ResizableAppShell({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const resize = useAppShellResize({
    navbar: { min: 200, max: 500 },
    header: { min: 48, max: 120 },
  });

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
      resize={resize}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group h="100%">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text size="sm">Storit</Text>
          </Group>
          <ColorSchemeToggle />
          <Button onClick={resize.resetAll} variant="default" size="xs">
            Reset layout
          </Button>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Stack gap="xs" style={{ flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              component={Link}
              href={item.href}
              label={item.label}
              leftSection={<item.icon size="1.2rem" />}
              onClick={() => {
                if (opened) toggle();
              }}
            />
          ))}
        </Stack>
        <Text size="sm" c="dimmed" mt="auto">
          Drag the right edge of the navbar, or focus it and use arrow keys, to resize it.
        </Text>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
      
      {/* Global floating video player rendered inside AppShell */}
      <FloatingVideoPlayer />
    </AppShell>
  );
}
