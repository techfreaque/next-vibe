import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";
import type { AlarmSeverityResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: AlarmSeverityResponseOutput | null | undefined };
}

const BAR_MAX = 20;

function makeBar(count: number, max: number): string {
  const filled = max > 0 ? Math.round((count / max) * BAR_MAX) : 0;
  return "█".repeat(filled) + "░".repeat(BAR_MAX - filled);
}

export function AlarmSeverityContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.POST>();
  const isMcp = platform === Platform.MCP;
  const value = field.value;

  if (!responseOnly || !value) {
    return <Box />;
  }

  const items = [...(value.data ?? [])].toSorted(
    (a, b) => a.severity - b.severity,
  );
  const maxCount = items.reduce((m, i) => Math.max(m, i.count), 0);

  if (isMcp) {
    const lines = [`Alarm severity counts:`];
    for (const item of items) {
      lines.push(`  severity ${item.severity}: ${item.count}`);
    }
    if (items.length === 0) {
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
        <Text bold>{t("post.widget.title")}</Text>
      </Box>
      {items.length === 0 ? (
        <Text dimColor>{t("post.widget.noData")}</Text>
      ) : (
        items.map((item) => {
          const sevColor =
            item.severity >= 4 ? "red" : item.severity >= 2 ? "yellow" : "cyan";
          return (
            <Box key={item.severity} gap={2}>
              <Text bold color={sevColor}>
                {t("post.widget.severity")} {item.severity}
              </Text>
              <Text color={sevColor}>{makeBar(item.count, maxCount)}</Text>
              <Text>{item.count}</Text>
            </Box>
          );
        })
      )}
    </Box>
  );
}

AlarmSeverityContainer.cliWidget = true as const;
