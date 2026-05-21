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
import type { CorvinaDevicesListResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: CorvinaDevicesListResponseOutput | null | undefined;
  };
}

export function DeviceListCliContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const isMcp = platform === Platform.MCP;
  const value = field.value;

  if (!responseOnly || !value) {
    return <Box />;
  }

  const devices = value.devices ?? [];
  const total = value.total ?? devices.length;

  if (isMcp) {
    const lines = [`Devices (${total}):`];
    for (const d of devices) {
      const conn = d.connected ? "online" : "offline";
      lines.push(`  #${d.id} ${d.label || d.name} [${d.status}] ${conn}`);
    }
    if (devices.length === 0) {
      lines.push("  (none)");
    }
    return (
      <Box flexDirection="column">
        <Text>{lines.join("\n")}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box gap={1} marginBottom={1}>
        <Text bold>{t("get.widget.title")}</Text>
        <Text dimColor>({total})</Text>
      </Box>
      {devices.length === 0 ? (
        <Text dimColor>{t("get.widget.noDevicesFound")}</Text>
      ) : (
        devices.map((d) => {
          const statusColor =
            d.status === "ACTIVE"
              ? "green"
              : d.status === "ERROR"
                ? "red"
                : undefined;
          return (
            <Box key={d.id} gap={2} marginBottom={0}>
              <Text dimColor>#{d.id}</Text>
              <Text bold>{d.label || d.name}</Text>
              <Text color={statusColor}>{d.status}</Text>
              <Text>{d.connected ? chalk.green("●") : chalk.dim("○")}</Text>
              {d.serialNumber && <Text dimColor>{d.serialNumber}</Text>}
            </Box>
          );
        })
      )}
    </Box>
  );
}

DeviceListCliContainer.cliWidget = true as const;
