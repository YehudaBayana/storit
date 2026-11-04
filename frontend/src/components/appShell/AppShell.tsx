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
  Divider,
} from "@mantine/core";
import { ColorSchemeToggle } from "../ColorSchemeToggle/ColorSchemeToggle";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { FiHome, FiVideo, FiFolder, FiLogOut, FiTrash2 } from "react-icons/fi";
import { FloatingVideoPlayer } from "@/features/videos/components/FloatingVideoPlayer";
import { useGetCurrentUser, useLogout } from "@/features/auth/query/useAuth";
import { useRouter } from "next/navigation";
import { useFolders } from "@/features/folders/query/useFolders";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: FiHome },
  { label: "Videos", href: "/videos", icon: FiVideo },
  { label: "Folders", href: "/folders", icon: FiFolder },
];

export function ResizableAppShell({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const resize = useAppShellResize({
    navbar: { min: 200, max: 500 },
    header: { min: 48, max: 120 },
  });

  const { data: currentUser } = useGetCurrentUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { data: foldersData } = useFolders();
  const router = useRouter();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.push("/auth");
      },
    });
  };

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
        <Stack gap="xs" style={{ flex: 1, overflowY: "auto" }}>
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

          <Divider my="xs" />

          <NavLink
            component={Link}
            href="/folders"
            label="My Library"
            leftSection={<FiFolder size="1.2rem" />}
            onClick={() => {
              if (opened) toggle();
            }}
          />

          {(foldersData ?? []).map((folder) => (
            <NavLink
              key={folder.id}
              component={Link}
              href={`/folders?id=${folder.id}`}
              label={folder.name}
              leftSection={<FiFolder size="1.2rem" />}
              style={{ paddingLeft: "1.5rem" }}
              onClick={() => {
                if (opened) toggle();
              }}
            />
          ))}

          <Divider my="xs" />

          <NavLink
            component={Link}
            href="/folders?trash=true"
            label="Trash"
            leftSection={<FiTrash2 size="1.2rem" />}
            onClick={() => {
              if (opened) toggle();
            }}
          />
        </Stack>

        <Stack gap="sm" mt="auto">
          <Divider />
          {currentUser?.user?.email && (
            <Text size="sm" c="dimmed" truncate>
              {currentUser.user.email}
            </Text>
          )}
          <Button
            variant="subtle"
            color="red"
            leftSection={<FiLogOut size="1.2rem" />}
            onClick={handleLogout}
            loading={isLoggingOut}
            fullWidth
            justify="flex-start"
          >
            Logout
          </Button>
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>

      {/* Global floating video player rendered inside AppShell */}
      <FloatingVideoPlayer />
    </AppShell>
  );
}
