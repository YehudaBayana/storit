"use client";

import { useState, useEffect, useRef } from "react";
import { apiUrl } from "@/config/constants";
import { Box, Button, Flex, StatusDot, Text } from "@/components/ui";

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

interface ServerStatusProps {
  dataHook?: string;
}

export default function ServerStatus({ dataHook = "server-status" }: ServerStatusProps) {
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking");
  const [data, setData] = useState<HealthData | null>(null);
  const [versionData, setVersionData] = useState<VersionData | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const panelRef = useRef<HTMLElement>(null);

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
    const interval = setInterval(checkHealth, 100000);
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

  const statusVariant =
    status === "online" ? "success" : status === "offline" ? "danger" : "warning";

  const statusLabel =
    status === "online"
      ? "Backend Connected"
      : status === "offline"
        ? "Backend Disconnected"
        : "Connecting...";

  const latencyColor =
    latency !== null ? (latency < 50 ? "success" : latency < 150 ? "warning" : "danger") : "muted";

  return (
    <Box
      position="fixed"
      z="50"
      ref={panelRef}
      dataHook={dataHook}
      style={{ top: "1rem", left: "32rem" }}
    >
      <Button
        variant="secondary"
        size="sm"
        pill
        onClick={togglePanel}
        aria-label="Toggle server health status"
        aria-expanded={isOpen}
        dataHook={`${dataHook}-toggle`}
        leftIcon={<StatusDot variant={statusVariant} pulse />}
      >
        <Text
          as="span"
          variant="inherit"
          weight="medium"
          color="inherit"
          dataHook={`${dataHook}-connection`}
        >
          {statusLabel}
        </Text>
        {status === "online" && latency !== null && (
          <Text as="span" variant="small" color="muted" weight="semibold">
            ({latency}ms)
          </Text>
        )}
      </Button>

      {isOpen && (
        <Box
          dataHook={`${dataHook}-panel`}
          position="absolute"
          z="50"
          p={3}
          rounded="xl"
          border="all"
          borderTone="subtle"
          bg="bg-[var(--bg-status-panel)]"
          style={{ top: "calc(100% + 12px)", left: 0, width: "290px" }}
        >
          <Flex direction="col" gap={2} py={3}>
            <Flex justify="between">
              <Text variant="small" color="muted">
                Status:
              </Text>
              <Text variant="small" weight="bold" mono uppercase color={statusVariant}>
                {status}
              </Text>
            </Flex>

            {status === "online" && latency !== null && (
              <Flex justify="between">
                <Text variant="small" color="muted">
                  Latency:
                </Text>
                <Text variant="small" weight="bold" mono color={latencyColor}>
                  {latency}ms
                </Text>
              </Flex>
            )}

            {data && (
              <>
                <Flex justify="between">
                  <Text variant="small" color="muted">
                    Uptime:
                  </Text>
                  <Text variant="small" weight="medium" mono>
                    {data.uptime}
                  </Text>
                </Flex>
              </>
            )}

            {versionData && (
              <>
                <Flex justify="between">
                  <Text variant="small" color="muted">
                    Commit:
                  </Text>
                  <Text variant="small" weight="medium" mono dataHook={`${dataHook}-commit-hash`}>
                    {versionData.commitHash}
                  </Text>
                </Flex>
                <Flex justify="between">
                  <Text variant="small" color="muted">
                    Commit Date:
                  </Text>
                  <Text
                    variant="small"
                    weight="medium"
                    mono
                    truncate
                    title={versionData.commitDate}
                    style={{ maxWidth: "170px" }}
                    dataHook={`${dataHook}-commit-date`}
                  >
                    {versionData.commitDate}
                  </Text>
                </Flex>
              </>
            )}
          </Flex>

          <Button
            variant="secondary"
            size="sm"
            fullWidth
            onClick={checkHealth}
            loading={isRefreshing}
          >
            {isRefreshing ? "Checking..." : "Refresh Status"}
          </Button>
        </Box>
      )}
    </Box>
  );
}
