import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type {
  NotificationDeleteResponseOutput,
  NotificationUpdateResponseOutput,
} from "./definition";

interface UpdateWidgetProps {
  field: {
    value: NotificationUpdateResponseOutput | null | undefined;
  };
}

interface DeleteWidgetProps {
  field: {
    value: NotificationDeleteResponseOutput | null | undefined;
  };
}

function renderConfigCompact(
  config: NotificationUpdateResponseOutput,
  prefix: string,
): string {
  const days: string[] = [];
  if (config.beforeDays !== null) {
    days.push(`before:${config.beforeDays}d`);
  }
  if (config.afterDays !== null) {
    days.push(`after:${config.afterDays}d`);
  }
  const daysStr = days.length > 0 ? ` [${days.join(" ")}]` : "";
  const bcc = config.emailBcc !== null ? ` bcc:${config.emailBcc}` : "";
  return `${prefix} config #${config.id}: ${config.event}${daysStr}${bcc}`;
}

export function NotificationUpdateContainer({
  field,
}: UpdateWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const config = field.value;

  if (!responseOnly || !config) {
    return <Box />;
  }

  if (platform === Platform.MCP) {
    return (
      <Box flexDirection="column">
        <Text>{renderConfigCompact(config, "Updated")}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box gap={2} marginBottom={1}>
        <Text dimColor>#{config.id}</Text>
        <Text bold>{config.event}</Text>
      </Box>
      <Box gap={2}>
        {config.beforeDays !== null && (
          <Text dimColor>{chalk.cyan(`before:${config.beforeDays}d`)}</Text>
        )}
        {config.afterDays !== null && (
          <Text dimColor>{chalk.cyan(`after:${config.afterDays}d`)}</Text>
        )}
        {config.emailBcc !== null && (
          <Text dimColor>{`bcc:${config.emailBcc}`}</Text>
        )}
      </Box>
    </Box>
  );
}

NotificationUpdateContainer.cliWidget = true as const;

export function NotificationDeleteContainer({
  field,
}: DeleteWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const config = field.value;

  if (!responseOnly || !config) {
    return <Box />;
  }

  if (platform === Platform.MCP) {
    return (
      <Box flexDirection="column">
        <Text>{renderConfigCompact(config, "Deleted")}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box gap={2} marginBottom={1}>
        <Text dimColor>#{config.id}</Text>
        <Text bold>{config.event}</Text>
        <Text>{chalk.red("DELETED")}</Text>
      </Box>
    </Box>
  );
}

NotificationDeleteContainer.cliWidget = true as const;
