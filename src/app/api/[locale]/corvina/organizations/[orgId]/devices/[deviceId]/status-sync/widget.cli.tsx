import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";
import type { StatusSyncResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: StatusSyncResponseOutput | null | undefined };
}

export function StatusSyncContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const isMcp = platform === Platform.MCP;
  const value = field.value;

  if (!responseOnly || !value) {
    return <Box />;
  }

  if (isMcp) {
    return (
      <Box>
        <Text>{t("get.widget.successDescription")}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text bold color="green">
        {t("get.widget.successTitle")}
      </Text>
    </Box>
  );
}

StatusSyncContainer.cliWidget = true as const;
