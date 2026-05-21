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
import type { CorvinaDeviceCreateResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: CorvinaDeviceCreateResponseOutput | null | undefined;
  };
}

export function DeviceCreateContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.POST>();
  const isMcp = platform === Platform.MCP;
  const value = field.value;

  if (!responseOnly || !value) {
    return <Box />;
  }

  if (isMcp) {
    const lines = [`Device created: #${value.deviceId} ${value.nameResult}`];
    if (value.labelResult) {
      lines.push(`  label: ${value.labelResult}`);
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
        <Text bold>
          {chalk.green("✓")} {t("post.widget.added")}
        </Text>
      </Box>
      <Box gap={2}>
        <Text dimColor>#{value.deviceId}</Text>
        <Text bold>{value.nameResult}</Text>
        {value.labelResult && <Text dimColor>({value.labelResult})</Text>}
      </Box>
    </Box>
  );
}

DeviceCreateContainer.cliWidget = true as const;
