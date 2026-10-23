"use client";

import Text from "@/components/ui/text/Text";
import Box from "@/components/ui/layout/Box";

interface FooterProps {
  dataHook?: string;
}

export default function Footer({ dataHook = "dashboard-footer" }: FooterProps) {
  return (
    <Box as="footer" dataHook={dataHook} py={12} px={6} border="top" borderTone="subtle">
      <Text variant="caption" color="muted" align="center">
        &copy; {new Date().getFullYear()} Storit. Built for learning backend engineering.
      </Text>
    </Box>
  );
}
