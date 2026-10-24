"use client";

import Container from "@/components/ui/layout/Container";
import ServerStatus from "@/features/dashboard/components/ServerStatus";
import Box from "@/components/ui/layout/Box";

interface HomeViewProps {
  dataHook?: string;
}

export default function HomeView({ dataHook = "home-view" }: HomeViewProps) {
  return (
    <Box dataHook={dataHook}>
      <Container size="xl">
        <ServerStatus />
      </Container>
    </Box>
  );
}
