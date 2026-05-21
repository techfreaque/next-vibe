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

export function DeviceDeleteCliContainer(): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.DELETE>();
  const isMcp = platform === Platform.MCP;

  if (!responseOnly) {
    return <Box />;
  }

  if (isMcp) {
    return (
      <Box>
        <Text>{t("delete.widget.deletedMcp")}</Text>
      </Box>
    );
  }

  return (
    <Box marginTop={1} gap={1}>
      <Text>{chalk.green("✓")}</Text>
      <Text bold>{t("delete.widget.deleted")}</Text>
    </Box>
  );
}

DeviceDeleteCliContainer.cliWidget = true as const;
