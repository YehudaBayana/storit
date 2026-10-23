"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetCurrentUser } from "@/features/auth/query/useAuth";
import { Box, Button, Flex, Text } from "@/components/ui";

interface RequireAuthProps {
  children: React.ReactNode;
  dataHook?: string;
}

export default function RequireAuth({ children, dataHook = "require-auth" }: RequireAuthProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isError, isPending, isLoading, refetch } = useGetCurrentUser();

  const unauthorized = !isLoading && !isPending && !isError && data === null;

  useEffect(() => {
    if (unauthorized) {
      router.replace(`/auth?next=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, router, unauthorized]);

  if (isPending || unauthorized) {
    return (
      <Flex
        as="main"
        align="center"
        justify="center"
        h="screen"
        dataHook={dataHook}
        aria-live="polite"
      >
        <Text>Loading...</Text>
      </Flex>
    );
  }

  if (isError) {
    return (
      <Flex
        as="main"
        direction="col"
        align="center"
        justify="center"
        gap={4}
        h="screen"
        dataHook={dataHook}
      >
        <Text role="alert" dataHook={`${dataHook}-error`}>
          Unable to verify your session. Please try again.
        </Text>
        <Button variant="outline" onClick={() => void refetch()} dataHook={`${dataHook}-retry`}>
          Retry
        </Button>
      </Flex>
    );
  }

  if (!data?.user) {
    return null;
  }

  return <Box dataHook={dataHook}>{children}</Box>;
}
