import chalk from "chalk";
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

export function DeviceDetailCliContainer({
  field,
}: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const isMcp = platform === Platform.MCP;
  const device = field.value;

  if (!responseOnly || !device) {
    return <Box />;
  }

  if (isMcp) {
    const lines = [
      `Device #${device.deviceId} (org #${device.orgId}): ${device.label || device.name}`,
      `  status: ${device.status}  connected: ${device.connected ? "yes" : "no"}`,
      `  vpn:${device.vpnEnabled ? "on" : "off"}  data:${device.dataEnabled ? "on" : "off"}`,
    ];
    if (device.serialNumber) {
      lines.push(`  serial: ${device.serialNumber}`);
    }
    if (device.firmwareVersion) {
      lines.push(`  firmware: ${device.firmwareVersion}`);
    }
    if (device.lastSeen) {
      lines.push(`  lastSeen: ${device.lastSeen}`);
    }
    return (
      <Box flexDirection="column">
        <Text>{lines.join("\n")}</Text>
      </Box>
    );
  }

  const statusColor =
    device.status === "ACTIVE"
      ? "green"
      : device.status === "ERROR"
        ? "red"
        : undefined;

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box gap={2} marginBottom={1}>
        <Text dimColor>#{device.deviceId}</Text>
        <Text bold>{device.label || device.name}</Text>
        <Text color={statusColor}>{device.status}</Text>
        <Text>{device.connected ? chalk.green("●") : chalk.dim("○")}</Text>
      </Box>
      <Box gap={2}>
        <Text>{device.vpnEnabled ? chalk.green("VPN") : chalk.dim("vpn")}</Text>
        <Text>
          {device.dataEnabled ? chalk.green("DATA") : chalk.dim("data")}
        </Text>
      </Box>
      {device.serialNumber && (
        <Box marginTop={1}>
          <Text dimColor>{device.serialNumber}</Text>
          {device.firmwareVersion && (
            <Text dimColor>
              {t("get.widget.cli.firmwarePrefix")}
              {device.firmwareVersion}
            </Text>
          )}
        </Box>
      )}
      {device.lastSeen && (
        <Box>
          <Text dimColor>
            {t("get.widget.cli.lastSeenPrefix")}
            {device.lastSeen}
          </Text>
        </Box>
      )}
    </Box>
  );
}

DeviceDetailCliContainer.cliWidget = true as const;
