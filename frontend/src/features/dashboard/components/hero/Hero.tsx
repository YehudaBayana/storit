"use client";

import { Button, Flex, Heading, Image, Text } from "@/components/ui";

interface HeroProps {
  onStartListening: () => void;
  onExploreTracks: () => void;
  dataHook?: string;
}

export default function Hero({
  onStartListening,
  onExploreTracks,
  dataHook = "dashboard-hero",
}: HeroProps) {
  return (
    <Flex
      as="section"
      dataHook={dataHook}
      align="center"
      justify="center"
      position="relative"
      h="screen"
      overflow="hidden"
    >
      {/* Background Image with Overlay */}
      <Image src="/hero.jpg" alt="Soundstream Hero" fill dimmed showSkeleton={false} lazy={false} />

      {/* Content Container */}
      <Flex direction="col" align="center" gap={10} position="relative" z="10" px={8}>
        <Flex direction="col" align="center" gap={6}>
          <Heading level={1} size="5xl" align="center" color="inherit">
            Stream Your{" "}
            <Text as="span" variant="inherit" color="gradient" weight="bold">
              World
            </Text>
          </Heading>

          <Text variant="lead" color="muted" align="center">
            Experience high-fidelity audio streaming powered by a high-performance Go backend. No
            lag, no limits, just pure sound.
          </Text>
        </Flex>

        <Flex gap={4} justify="center" wrap="wrap">
          <Button
            variant="primary"
            size="lg"
            pill
            onClick={onStartListening}
            dataHook={`${dataHook}-start-listening`}
          >
            Start Listening
          </Button>
          <Button
            variant="outline"
            size="lg"
            pill
            onClick={onExploreTracks}
            dataHook={`${dataHook}-explore-tracks`}
          >
            Explore Tracks
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
