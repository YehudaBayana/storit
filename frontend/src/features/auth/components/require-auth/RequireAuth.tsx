'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Box, Button, Flex, Text } from '@mantine/core';
import { useGetCurrentUser } from '@/features/auth/query/useAuth';

interface RequireAuthProps {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
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
      <Flex align="center" justify="center" aria-live="polite">
        <Text>Loading...</Text>
      </Flex>
    );
  }

  if (isError) {
    return (
      <Flex align="center" justify="center" gap={'lg'}>
        <Text>Unable to verify your session. Please try again.</Text>
        <Button variant="outline" onClick={() => void refetch()}>
          Retry
        </Button>
      </Flex>
    );
  }

  if (!data?.user) {
    return null;
  }

  return <Box>{children}</Box>;
}
