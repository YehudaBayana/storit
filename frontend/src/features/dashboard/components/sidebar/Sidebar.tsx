"use client";

import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Link,
  Modal,
  Stack,
  Text,
} from "@/components/ui";
import { usePathname } from "next/navigation";
import { useGetCurrentUser, useLogout } from "@/features/auth/query/useAuth";

interface SidebarProps {
  dataHook?: string;
}

export default function Sidebar({ dataHook = "dashboard-sidebar" }: SidebarProps) {
  const pathname = usePathname();
  const { mutate: logout } = useLogout();
  const { data: currentUser } = useGetCurrentUser(); // Ensure user data is fetched to determine if logged in

  // Create playlist modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/videos", label: "Videos", icon: "🎥" },
    { href: "/auth/liked", label: "Favorites", icon: "♥" },
    { href: "/auth/history", label: "History", icon: "🕘" },
  ];

  return (
    <Flex
      direction="col"
      h="full"
      w="full"
      border="right"
      bg="bg-[var(--bg-secondary)]"
      dataHook={dataHook}
    >
      {/* Brand Header */}
      <Flex align="center" gap={3} p={6} border="bottom">
        <Flex
          align="center"
          justify="center"
          w="9"
          h="9"
          rounded="xl"
          bg="bg-gradient-to-br from-emerald-500 to-teal-500"
        >
          🎵
        </Flex>
        <Flex direction="col">
          <Heading level={1} size="md" weight="extrabold">
            DANCE JOURNAL
          </Heading>
          <Text variant="caption" color="primary">
            PRIVATE ARCHIVE
          </Text>
        </Flex>
      </Flex>

      {/* Navigation */}
      <Flex direction="col" gap={1} px={3} py={4} border="bottom">
        {navItems.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            variant="nav"
            active={pathname === item.href}
            leftIcon={item.icon}
            dataHook={`${dataHook}-nav-${index}`}
          >
            {item.label}
          </Link>
        ))}
      </Flex>

      {/* Journal section */}
      <Flex direction="col" grow minW="0" px={3} py={4}>
        <Box px={4} mb={2}>
          <Text variant="caption" weight="bold" color="muted">
            Recent Videos
          </Text>
        </Box>

        <Box grow overflowY="auto">
          <Stack gap={2}>
            <Card variant="dashed" padding="sm">
              <Text variant="caption" color="muted" align="center">
                No videos yet. Upload your first practice session.
              </Text>
            </Card>
            {currentUser?.user ? (
              <Button variant="secondary" fullWidth onClick={() => logout()}>
                Logout
              </Button>
            ) : (
              <Link href="/auth" variant="primary" dataHook={`${dataHook}-login`}>
                Login
              </Link>
            )}
          </Stack>
        </Box>
      </Flex>

      {/* Bottom Profile/Watermark */}
      <Box p={4} border="top" bg="bg-[var(--bg-surface)]">
        <Flex align="center" gap={3}>
          <Avatar name="Yehuda Bayana" size="sm" />
          <Flex direction="col" minW="0" grow>
            <Text variant="body-sm" weight="semibold" truncate>
              {currentUser?.user.email}
            </Text>
            <Text variant="caption" color="muted">
              Developer Mode
            </Text>
          </Flex>
        </Flex>
      </Box>

      {/* Create Playlist Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md"
        dataHook={`${dataHook}-create-modal`}
      >
        <Modal.Header onClose={() => setIsModalOpen(false)}>Create New Playlist</Modal.Header>
      </Modal>
    </Flex>
  );
}
