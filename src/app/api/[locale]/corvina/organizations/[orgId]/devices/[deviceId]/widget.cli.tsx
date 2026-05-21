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

export function DeviceDetailContainer({ field }: CliWidgetProps): JSX.Element {
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
      `Device #${device.deviceId} (org #${device.orgId}): ${device.label}`,
      `  hwId: ${device.hwId}`,
    ];
    if (device.orgResourceId) {
      lines.push(`  orgResourceId: ${device.orgResourceId}`);
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
    </Box>
  );
}

DeviceDetailContainer.cliWidget = true as const;
