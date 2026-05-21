import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";
import type { DeviceStatusResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: DeviceStatusResponseOutput | null | undefined;
  };
}

function formatLastSeen(ts: number | null | undefined): string {
  if (ts === null || ts === undefined) {
    return "—";
  }
  try {
    return new Date(ts).toISOString().replace("T", " ").slice(0, 19);
  } catch {
    return String(ts);
  }
}

export function DeviceStatusContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const isMcp = platform === Platform.MCP;
  const status = field.value;

  if (!responseOnly || !status) {
    return <Box />;
  }

  const connectedLabel = status.connected ? "online" : "offline";

  if (isMcp) {
    const lines = [
      `connected: ${connectedLabel}`,
      `lastSeen: ${formatLastSeen(status.lastSeen)}`,
      `ipAddress: ${status.ipAddress ?? "—"}`,
    ];
    return (
      <Box flexDirection="column">
        <Text>{lines.join("\n")}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box gap={2} marginBottom={1}>
        <Text color={status.connected ? "green" : "gray"}>
          {`● ${connectedLabel}`}
        </Text>
      </Box>
      <Box gap={2}>
        <Text dimColor>{t("get.response.lastSeen")}:</Text>
        <Text>{formatLastSeen(status.lastSeen)}</Text>
      </Box>
      {status.ipAddress && (
        <Box gap={2}>
          <Text dimColor>{t("get.response.ipAddress")}:</Text>
          <Text>{status.ipAddress}</Text>
        </Box>
      )}
    </Box>
  );
}

DeviceStatusContainer.cliWidget = true as const;
