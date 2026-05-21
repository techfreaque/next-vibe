import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";
import type { TagsUndeleteResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: TagsUndeleteResponseOutput | null | undefined };
}

export function TagsUndeleteContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.POST>();
  const isMcp = platform === Platform.MCP;
  const value = field.value;

  if (!responseOnly || !value) {
    return <Box />;
  }

  if (isMcp) {
    return (
      <Box>
        <Text>
          {value.undeletedCount} {t("post.widget.restoredMessage")}
        </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box gap={2}>
        <Text bold color="green">
          {t("post.widget.title")}:
        </Text>
        <Text>{value.undeletedCount}</Text>
      </Box>
    </Box>
  );
}

TagsUndeleteContainer.cliWidget = true as const;
