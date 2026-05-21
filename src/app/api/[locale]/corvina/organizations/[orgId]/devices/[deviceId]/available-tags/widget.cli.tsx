import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";
import type { AvailableTagsResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: AvailableTagsResponseOutput | null | undefined };
}

export function AvailableTagsContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const isMcp = platform === Platform.MCP;
  const value = field.value;

  if (!responseOnly || !value) {
    return <Box />;
  }

  const tags = value.tags ?? [];

  if (isMcp) {
    const lines = [`${t("get.widget.title")} (${tags.length}):`];
    for (const tag of tags) {
      lines.push(`  ${tag.name}  [${tag.type}]`);
    }
    if (tags.length === 0) {
      lines.push(`  (${t("get.widget.noTagsFound")})`);
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
        <Text dimColor>({tags.length})</Text>
      </Box>
      {tags.length === 0 ? (
        <Text dimColor>{t("get.widget.noTagsFound")}</Text>
      ) : (
        tags.map((tag) => (
          <Box key={tag.name} gap={2}>
            <Text bold color="cyan">
              {tag.name}
            </Text>
            <Text dimColor>{tag.type}</Text>
          </Box>
        ))
      )}
    </Box>
  );
}

AvailableTagsContainer.cliWidget = true as const;
