"use client";

import { Box, Button, Flex, Heading, Link, Text } from "@/components/ui";
import { usePathname } from "next/navigation";
import { useGetCurrentUser, useLogout } from "@/features/auth/query/useAuth";

interface SidebarProps {
  dataHook?: string;
}

export default function Sidebar({ dataHook = "dashboard-sidebar" }: SidebarProps) {
  const pathname = usePathname();
  const { mutate: logout } = useLogout();
  const { data: currentUser } = useGetCurrentUser(); // Ensure user data is fetched to determine if logged in

  const navItems = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/auth/videos", label: "Videos", icon: "🎥" },
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

      {/* Bottom Profile/Watermark */}
      <Box p={4} border="top" bg="bg-[var(--bg-surface)]">
        <Flex direction="col" minW="0" grow>
          <Text variant="body-sm" weight="semibold" truncate>
            {currentUser?.user.email}
          </Text>
          {currentUser?.user ? (
            <Button variant="secondary" fullWidth onClick={() => logout()}>
              Logout
            </Button>
          ) : (
            <Link href="/auth" variant="primary" dataHook={`${dataHook}-login`}>
              <Button>Login</Button>
            </Link>
          )}
        </Flex>
      </Box>
    </Flex>
  );
}
