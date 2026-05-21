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
import type { CorvinaDeviceTagsResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: CorvinaDeviceTagsResponseOutput | null | undefined;
  };
}

export function DeviceTagsCliContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const isMcp = platform === Platform.MCP;
  const value = field.value;

  if (!responseOnly || !value) {
    return <Box />;
  }

  const tags = value.tags ?? [];
  const total = value.total ?? tags.length;

  if (isMcp) {
    const lines = [`Tags (${total}):`];
    for (const tag of tags) {
      lines.push(`  ${tag.name}${tag.value !== null ? ` = ${tag.value}` : ""}`);
    }
    if (tags.length === 0) {
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
      {tags.length === 0 ? (
        <Text dimColor>{t("get.widget.noTagsFound")}</Text>
      ) : (
        tags.map((tag) => (
          <Box key={tag.id} gap={2}>
            <Text bold color="cyan">
              {tag.name}
            </Text>
            {tag.value !== null ? (
              <Text>
                {chalk.dim("=")} {tag.value}
              </Text>
            ) : (
              <Text dimColor>—</Text>
            )}
          </Box>
        ))
      )}
    </Box>
  );
}

DeviceTagsCliContainer.cliWidget = true as const;
