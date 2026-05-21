import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { NotificationTestResponseOutput } from "./definition";

interface TestWidgetProps {
  field: {
    value: NotificationTestResponseOutput | null | undefined;
  };
}

export function NotificationTestContainer({
  field,
}: TestWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const result = field.value;

  if (!responseOnly || !result) {
    return <Box />;
  }

  if (platform === Platform.MCP) {
    return (
      <Box flexDirection="column">
        <Text>{result.message}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text>{chalk.green(result.message)}</Text>
    </Box>
  );
}

NotificationTestContainer.cliWidget = true as const;
