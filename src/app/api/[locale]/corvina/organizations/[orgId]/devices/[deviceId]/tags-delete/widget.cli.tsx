import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";
import type { TagsDeleteResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: TagsDeleteResponseOutput | null | undefined };
}

export function TagsDeleteContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.DELETE>();
  const isMcp = platform === Platform.MCP;
  const value = field.value;

  if (!responseOnly || !value) {
    return <Box />;
  }

  if (isMcp) {
    return (
      <Box>
        <Text>
          {value.deletedCount} {t("delete.widget.deletedMessage")}
        </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box gap={2}>
        <Text bold color="green">
          {t("delete.widget.title")}:
        </Text>
        <Text>{value.deletedCount}</Text>
      </Box>
    </Box>
  );
}

TagsDeleteContainer.cliWidget = true as const;
