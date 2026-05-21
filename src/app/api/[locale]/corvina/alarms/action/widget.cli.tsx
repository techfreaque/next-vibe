import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";
import type { AlarmActionResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: AlarmActionResponseOutput | null | undefined };
}

export function AlarmActionContainer({ field }: CliWidgetProps): JSX.Element {
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
          {value.success ? "ok" : "failed"}: {value.message}
        </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text bold color={value.success ? "green" : "red"}>
        {t("post.widget.successTitle")}
      </Text>
      <Text>{value.message}</Text>
    </Box>
  );
}

AlarmActionContainer.cliWidget = true as const;
