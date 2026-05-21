import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";
import type { DeviceUpdateResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: DeviceUpdateResponseOutput | null | undefined };
}

export function DeviceUpdateContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.PATCH>();
  const isMcp = platform === Platform.MCP;
  const value = field.value;

  if (!responseOnly || !value) {
    return <Box />;
  }

  if (isMcp) {
    const lines = [
      t("patch.widget.successDescription"),
      `id: ${value.id}`,
      `hwId: ${value.hwId}`,
      `label: ${value.labelResult}`,
    ];
    if (value.orgResourceId !== null && value.orgResourceId !== undefined) {
      lines.push(`orgResourceId: ${value.orgResourceId}`);
    }
    return (
      <Box flexDirection="column">
        <Text>{lines.join("\n")}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text bold color="green">
        {t("patch.widget.successTitle")}
      </Text>
      <Box gap={2}>
        <Text dimColor>{t("patch.response.hwId")}:</Text>
        <Text>{value.hwId}</Text>
      </Box>
      <Box gap={2}>
        <Text dimColor>{t("patch.response.label")}:</Text>
        <Text>{value.labelResult}</Text>
      </Box>
    </Box>
  );
}

DeviceUpdateContainer.cliWidget = true as const;
