import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import { AlarmStatus } from "../enums";
import type endpoints from "./definition";
import type { AlarmSearchResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: AlarmSearchResponseOutput | null | undefined };
}

export function AlarmSearchContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.POST>();
  const isMcp = platform === Platform.MCP;
  const value = field.value;

  if (!responseOnly || !value) {
    return <Box />;
  }

  const alarms = value.alarms ?? [];
  const total = value.totalElements ?? alarms.length;

  if (isMcp) {
    const lines = [`Alarms (${total}):`];
    for (const alarm of alarms) {
      const sev =
        alarm.severity !== null && alarm.severity !== undefined
          ? `sev:${alarm.severity}`
          : "sev:?";
      const status =
        alarm.status !== null && alarm.status !== undefined
          ? t(alarm.status)
          : "unknown";
      const ts = alarm.eventTimestamp
        ? new Date(alarm.eventTimestamp).toISOString()
        : "";
      const device = alarm.deviceLabel ?? alarm.deviceId ?? "";
      lines.push(`  [${sev}] ${alarm.name} | ${status} | ${device} | ${ts}`);
    }
    if (alarms.length === 0) {
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
        <Text dimColor>({total})</Text>
      </Box>
      {alarms.length === 0 ? (
        <Text dimColor>{t("post.widget.noAlarmsFound")}</Text>
      ) : (
        alarms.map((alarm) => {
          const isActive = alarm.status === AlarmStatus.ACTIVE;
          const sevColor =
            (alarm.severity ?? 0) >= 4
              ? "red"
              : (alarm.severity ?? 0) >= 2
                ? "yellow"
                : "cyan";
          const ts = alarm.eventTimestamp
            ? new Date(alarm.eventTimestamp).toLocaleString()
            : null;
          return (
            <Box key={alarm.id} gap={2} marginBottom={0}>
              <Text bold color={sevColor}>
                [{alarm.severity ?? "?"}]
              </Text>
              <Text bold={isActive}>{alarm.name}</Text>
              {alarm.deviceLabel && <Text dimColor>{alarm.deviceLabel}</Text>}
              <Text color={isActive ? "red" : "green"}>
                {isActive
                  ? chalk.red(t("post.enums.alarmStatus.active"))
                  : chalk.dim(t("post.enums.alarmStatus.notActive"))}
              </Text>
              {ts && <Text dimColor>{ts}</Text>}
            </Box>
          );
        })
      )}
    </Box>
  );
}

AlarmSearchContainer.cliWidget = true as const;
