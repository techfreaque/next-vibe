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
import type {
  CorvinaDeviceTagsResponseOutput,
  CorvinaDeviceTagsWriteResponseOutput,
} from "./definition";

interface TagsCliWidgetProps {
  field: { value: CorvinaDeviceTagsResponseOutput | null | undefined };
}

interface UpdateCliWidgetProps {
  field: { value: CorvinaDeviceTagsWriteResponseOutput | null | undefined };
}

export function DeviceTagsContainer({
  field,
}: TagsCliWidgetProps): JSX.Element {
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
      const ts =
        tag.latestTimestamp != null
          ? new Date(tag.latestTimestamp).toISOString()
          : null;
      const valuePart = tag.latestValue != null ? ` = ${tag.latestValue}` : "";
      const tsPart = ts ? ` [${ts}]` : "";
      lines.push(`  ${tag.modelPath}${valuePart}${tsPart}`);
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
        tags.map((tag) => {
          const ts =
            tag.latestTimestamp != null
              ? new Date(tag.latestTimestamp).toLocaleString()
              : null;
          return (
            <Box key={tag.modelPath} flexDirection="column" marginBottom={0}>
              <Box gap={2}>
                <Text bold color="cyan">
                  {tag.modelPath}
                </Text>
                {tag.latestValue != null ? (
                  <Text>
                    {chalk.dim("=")} {tag.latestValue}
                  </Text>
                ) : (
                  <Text dimColor>—</Text>
                )}
              </Box>
              {ts && <Text dimColor> {ts}</Text>}
            </Box>
          );
        })
      )}
    </Box>
  );
}

DeviceTagsContainer.cliWidget = true as const;

export function TagUpdateContainer({
  field,
}: UpdateCliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const isMcp = platform === Platform.MCP;
  const value = field.value;

  if (!responseOnly || !value) {
    return <Box />;
  }

  if (isMcp) {
    return (
      <Box>
        <Text>Tag value updated successfully.</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text bold color="green">
        ✓ Tag value written
      </Text>
    </Box>
  );
}

TagUpdateContainer.cliWidget = true as const;
