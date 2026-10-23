"use client";

import { useState, useEffect, useRef } from "react";
import { apiUrl } from "@/config/constants";
import { Box, Button, Flex, IconButton, StatusDot, Text } from "@/components/ui";

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

interface ServerStatusProps {
  dataHook?: string;
}

export default function ServerStatus({ dataHook = "server-status" }: ServerStatusProps) {
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking");
  const [data, setData] = useState<HealthData | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const panelRef = useRef<HTMLElement>(null);

  const checkHealth = async () => {
    setIsRefreshing(true);
    const start = performance.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(`${apiUrl}/health`, {
        signal: controller.signal,
        cache: "no-store",
      });

      clearTimeout(timeoutId);

      const end = performance.now();

      if (res.ok) {
        const body: HealthData = await res.json();
        if (body.status === "OK") {
          setStatus("online");
          setData(body);
          setLatency(Math.round(end - start));
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
    } catch (err) {
      console.error("Failed to perform server health check:", err);
      setStatus("offline");
      setData(null);
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
          p={5}
          rounded="xl"
          border="all"
          borderTone="subtle"
          bg="bg-[var(--bg-status-panel)]"
          style={{ top: "calc(100% + 12px)", left: 0, width: "290px" }}
        >
          <Flex justify="between" align="center" border="bottom" borderTone="subtle" py={2}>
            <Text variant="caption" weight="bold" color="default" uppercase>
              System Status
            </Text>
            <IconButton
              variant="ghost"
              size="xs"
              onClick={() => setIsOpen(false)}
              aria-label="Close panel"
              icon="✕"
            />
          </Flex>

          <Flex direction="col" gap={2} py={3}>
            <Flex justify="between">
              <Text variant="small" color="muted">
                Service:
              </Text>
              <Text variant="small" weight="medium" mono>
                Soundstream API
              </Text>
            </Flex>

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
                    Version:
                  </Text>
                  <Text variant="small" weight="medium" mono>
                    {data.version}
                  </Text>
                </Flex>
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

            <Flex justify="between">
              <Text variant="small" color="muted">
                Endpoint:
              </Text>
              <Text variant="small" mono truncate title={apiUrl} style={{ maxWidth: "170px" }}>
                {apiUrl}
              </Text>
            </Flex>
          </Flex>

          {status === "online" && data?.services && (
            <Flex direction="col" gap={1} border="top" borderTone="subtle" py={3}>
              <Text variant="caption" weight="bold" color="muted" uppercase>
                Backend Services
              </Text>
              <Flex justify="between">
                <Text variant="small" color="muted">
                  Database (Postgres):
                </Text>
                <Text variant="small" weight="medium" mono color="warning">
                  {data.services.database.includes("disconnected")
                    ? "Pending Config"
                    : data.services.database}
                </Text>
              </Flex>
              <Flex justify="between">
                <Text variant="small" color="muted">
                  Cache (Redis):
                </Text>
                <Text variant="small" weight="medium" mono color="warning">
                  {data.services.cache.includes("disconnected")
                    ? "Pending Config"
                    : data.services.cache}
                </Text>
              </Flex>
            </Flex>
          )}

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
