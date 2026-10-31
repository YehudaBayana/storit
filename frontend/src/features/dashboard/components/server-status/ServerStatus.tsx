"use client";

import { useState, useEffect, useRef } from "react";
import { apiUrl } from "@/config/constants";
import { Box, Button, Flex, Text } from "@/components/ui";

interface ServicesStatus {
  database: string;
  cache: string;
}

interface HealthData {
  status: string;
  version: string;
  uptime: string;
  timestamp: string;
  services: ServicesStatus;
}

interface VersionData {
  commitHash: string;
  commitDate: string;
}

export default function ServerStatus() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking");
  const [data, setData] = useState<HealthData | null>(null);
  const [versionData, setVersionData] = useState<VersionData | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const checkHealth = async () => {
    setIsRefreshing(true);
    const startTime = performance.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const [healthResponse, versionResponse] = await Promise.all([
        fetch(`${apiUrl}/api/health`, {
          signal: controller.signal,
          cache: "no-store",
        }),
        fetch(`${apiUrl}/api/version`, {
          signal: controller.signal,
          cache: "no-store",
        }).catch(() => null),
      ]);

      clearTimeout(timeoutId);

      const endTime = performance.now();

      if (healthResponse.ok) {
        const body: HealthData = await healthResponse.json();
        if (body.status === "OK") {
          setStatus("online");
          setData(body);
          setLatency(Math.round(endTime - startTime));
        } else {
          setStatus("offline");
          setData(null);
          setLatency(null);
        }
      } else {
        setStatus("offline");
        setData(null);
        setLatency(null);
      }

      if (versionResponse && versionResponse.ok) {
        const versionBody: VersionData = await versionResponse.json();
        setVersionData(versionBody);
      } else {
        setVersionData(null);
      }
    } catch (error) {
      console.error("Failed to perform server health check:", error);
      setStatus("offline");
      setData(null);
      setVersionData(null);
      setLatency(null);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkHealth();
    // Poll the backend health every 100 seconds
    const interval = setInterval(checkHealth, 10000000);
    return () => clearInterval(interval);
  }, []);

  // Handle click outside to close the panel
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const statusLabel =
    status === "online"
      ? "Backend Connected"
      : status === "offline"
        ? "Backend Disconnected"
        : "Connecting...";

  return (
    <Box ref={panelRef}>
      <Button
        variant="secondary"
        size="sm"
        onClick={togglePanel}
        aria-label="Toggle server health status"
        aria-expanded={isOpen}
      >
        <Text>{statusLabel}</Text>
        {status === "online" && latency !== null && <Text>({latency}ms)</Text>}
      </Button>

      {isOpen && (
        <Box>
          <Flex direction="col" gap={"sm"}>
            <Flex justify="between">
              <Text>Status:</Text>
              <Text>{status}</Text>
            </Flex>

            {status === "online" && latency !== null && (
              <Flex justify="between">
                <Text>Latency:</Text>
                <Text>{latency}ms</Text>
              </Flex>
            )}

            {data && (
              <>
                <Flex justify="between">
                  <Text>Uptime:</Text>
                  <Text>{data.uptime}</Text>
                </Flex>
              </>
            )}

            {versionData && (
              <>
                <Flex justify="between">
                  <Text variant="default">Commit:</Text>
                  <Text variant="default">{versionData.commitHash}</Text>
                </Flex>
                <Flex justify="between">
                  <Text variant="default">Commit Date:</Text>
                  <Text>{versionData.commitDate}</Text>
                </Flex>
              </>
            )}
          </Flex>

          <Button variant="secondary" size="sm" onClick={checkHealth}>
            {isRefreshing ? "Checking..." : "Refresh Status"}
          </Button>
        </Box>
      )}
    </Box>
  );
}
