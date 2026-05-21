import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";
import type { CorvinaDeviceGetResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: CorvinaDeviceGetResponseOutput | null | undefined;
  };
}

function formatTs(ts: Date | string | null | undefined): string {
  if (!ts) {
    return "—";
  }
  try {
    return new Date(ts).toISOString().replace("T", " ").slice(0, 19);
  } catch {
    return String(ts);
  }
}

export function DeviceDetailContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const isMcp = platform === Platform.MCP;
  const device = field.value;

  if (!responseOnly || !device) {
    return <Box />;
  }

  const connectedLabel =
    device.connected === null
      ? "unknown"
      : device.connected
        ? t("get.widget.labels.online")
        : t("get.widget.labels.offline");

  if (isMcp) {
    const lines = [
      `Device #${device.deviceId} (org #${device.orgId}): ${device.label}`,
      `  hwId: ${device.hwId}`,
      `  connected: ${connectedLabel}`,
    ];
    if (device.orgResourceId) {
      lines.push(`  orgResourceId: ${device.orgResourceId}`);
    }
    if (device.firstRegistration) {
      lines.push(`  firstRegistration: ${formatTs(device.firstRegistration)}`);
    }
    if (device.lastConnection) {
      lines.push(`  lastConnection: ${formatTs(device.lastConnection)}`);
    }
    if (device.lastDisconnection) {
      lines.push(`  lastDisconnection: ${formatTs(device.lastDisconnection)}`);
    }
    if (device.lastSeenIp) {
      lines.push(`  lastSeenIp: ${device.lastSeenIp}`);
    }
    if (device.groups.length > 0) {
      lines.push(`  groups: ${device.groups.join(", ")}`);
    }
    return (
      <Box flexDirection="column">
        <Text>{lines.join("\n")}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box gap={2} marginBottom={1}>
        <Text dimColor>#{device.deviceId}</Text>
        <Text bold>{device.label}</Text>
        {device.connected !== null && (
          <Text color={device.connected ? "green" : "gray"}>
            {`● ${connectedLabel}`}
          </Text>
        )}
      </Box>
      <Box gap={2}>
        <Text dimColor>{t("get.widget.labels.hwId")}:</Text>
        <Text>{device.hwId}</Text>
      </Box>
      {device.orgResourceId && (
        <Box gap={2}>
          <Text dimColor>{t("get.widget.labels.orgResourceId")}:</Text>
          <Text dimColor>{device.orgResourceId}</Text>
        </Box>
      )}
      {device.firstRegistration && (
        <Box gap={2}>
          <Text dimColor>{t("get.widget.labels.firstRegistration")}:</Text>
          <Text>{formatTs(device.firstRegistration)}</Text>
        </Box>
      )}
      {device.lastConnection && (
        <Box gap={2}>
          <Text dimColor>{t("get.widget.labels.lastConnection")}:</Text>
          <Text>{formatTs(device.lastConnection)}</Text>
        </Box>
      )}
      {device.lastDisconnection && (
        <Box gap={2}>
          <Text dimColor>{t("get.widget.labels.lastDisconnection")}:</Text>
          <Text>{formatTs(device.lastDisconnection)}</Text>
        </Box>
      )}
      {device.lastSeenIp && (
        <Box gap={2}>
          <Text dimColor>{t("get.widget.labels.lastSeenIp")}:</Text>
          <Text>{device.lastSeenIp}</Text>
        </Box>
      )}
      {device.groups.length > 0 && (
        <Box gap={2}>
          <Text dimColor>{t("get.widget.labels.groups")}:</Text>
          <Text>{device.groups.join(", ")}</Text>
        </Box>
      )}
    </Box>
  );
}

DeviceDetailContainer.cliWidget = true as const;
