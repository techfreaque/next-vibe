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
  NotificationCreateResponseOutput,
  NotificationListResponseOutput,
} from "./definition";

interface ListWidgetProps {
  field: {
    value: NotificationListResponseOutput | null | undefined;
  };
}

interface CreateWidgetProps {
  field: {
    value: NotificationCreateResponseOutput | null | undefined;
  };
}

export function NotificationListContainer({
  field,
}: ListWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const data = field.value;

  if (!responseOnly || !data) {
    return <Box />;
  }

  const { configs, totalElements } = data;
  const isMcp = platform === Platform.MCP;

  if (isMcp) {
    const lines = [
      `notification configs (${configs.length}/${totalElements}):`,
    ];
    for (const c of configs) {
      const days: string[] = [];
      if (c.beforeDays !== null) {
        days.push(`before:${c.beforeDays}d`);
      }
      if (c.afterDays !== null) {
        days.push(`after:${c.afterDays}d`);
      }
      const daysStr = days.length > 0 ? ` [${days.join(" ")}]` : "";
      const bcc = c.emailBcc !== null ? ` bcc:${c.emailBcc}` : "";
      lines.push(`  config #${c.id}: ${c.event}${daysStr}${bcc}`);
    }
    return (
      <Box flexDirection="column">
        <Text>{lines.join("\n")}</Text>
      </Box>
    );
  }

  if (configs.length === 0) {
    return (
      <Box marginTop={1}>
        <Text dimColor>{t("get.widget.emptyState")}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box gap={2} marginBottom={1}>
        <Text bold>{t("get.widget.title")}</Text>
        <Text dimColor>
          ({configs.length}/{totalElements})
        </Text>
      </Box>
      {configs.map((c) => (
        <Box key={c.id} gap={2} marginBottom={0}>
          <Text dimColor>#{c.id}</Text>
          <Text bold>{c.event}</Text>
          {c.beforeDays !== null && (
            <Text dimColor>
              {chalk.cyan(`${t("get.widget.labels.before")}:${c.beforeDays}d`)}
            </Text>
          )}
          {c.afterDays !== null && (
            <Text dimColor>
              {chalk.cyan(`${t("get.widget.labels.after")}:${c.afterDays}d`)}
            </Text>
          )}
          {c.emailBcc !== null && (
            <Text
              dimColor
            >{`${t("get.widget.labels.bcc")}:${c.emailBcc}`}</Text>
          )}
        </Box>
      ))}
    </Box>
  );
}

NotificationListContainer.cliWidget = true as const;

export function NotificationCreateContainer({
  field,
}: CreateWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const config = field.value;

  if (!responseOnly || !config) {
    return <Box />;
  }

  if (platform === Platform.MCP) {
    const days: string[] = [];
    if (config.beforeDays !== null) {
      days.push(`before:${config.beforeDays}d`);
    }
    if (config.afterDays !== null) {
      days.push(`after:${config.afterDays}d`);
    }
    const daysStr = days.length > 0 ? ` [${days.join(" ")}]` : "";
    const bcc = config.emailBcc !== null ? ` bcc:${config.emailBcc}` : "";
    return (
      <Box flexDirection="column">
        <Text>{`Created config #${config.id}: ${config.event}${daysStr}${bcc}`}</Text>
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

NotificationCreateContainer.cliWidget = true as const;
