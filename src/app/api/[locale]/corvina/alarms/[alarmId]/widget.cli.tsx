import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import { AlarmStatus } from "../enums";
import type searchDef from "../search/definition";
import type endpoints from "./definition";
import type { AlarmDetailResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: AlarmDetailResponseOutput | null | undefined };
}

export function AlarmDetailContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const tEnum = useWidgetTranslation<typeof searchDef.POST>();
  const isMcp = platform === Platform.MCP;
  const value = field.value;

  if (!responseOnly || !value) {
    return <Box />;
  }

  const isActive = value.status === AlarmStatus.ACTIVE;

  if (isMcp) {
    const raw: Array<[string, string | number | Date | null | undefined]> = [
      ["alarm", value.alarmId],
      ["name", value.name],
      ["severity", value.severity ?? "?"],
      [
        "status",
        value.status !== null && value.status !== undefined
          ? tEnum(value.status)
          : "unknown",
      ],
      [
        "action",
        value.action !== null && value.action !== undefined
          ? tEnum(value.action)
          : null,
      ],
      ["device", value.deviceLabel ?? value.deviceId],
      ["tag", value.tag],
      ["eventTimestamp", value.eventTimestamp],
      ["updatedAt", value.updatedAt],
      ["acknowledgedDate", value.acknowledgedDate],
      ["org", value.orgResourceId],
      ["user", value.user],
      ["comment", value.comment],
    ];
    const lines: string[] = raw
      .filter(([, v]) => v !== null && v !== undefined && v !== "")
      .map(([k, v]) => `${k}=${String(v)}`);
    return (
      <Box flexDirection="column">
        <Text>{lines.join("\n")}</Text>
      </Box>
    );
  }

  const formatTs = (ts: Date | string | null | undefined): string =>
    ts ? new Date(ts).toLocaleString() : t("get.widget.noData");

  return (
    <Box flexDirection="column" marginTop={1} gap={0}>
      <Box gap={2}>
        <Text bold color={isActive ? "red" : "green"}>
          [{value.severity ?? "?"}]
        </Text>
        <Text bold>{value.name}</Text>
        {value.deviceLabel && <Text dimColor>{value.deviceLabel}</Text>}
      </Box>

      <Box flexDirection="column" marginTop={1}>
        <Text dimColor>
          {t("get.response.deviceId")}:{" "}
          <Text>{value.deviceId ?? t("get.widget.noData")}</Text>
        </Text>
        <Text dimColor>
          {t("get.response.tag")}:{" "}
          <Text>{value.tag ?? t("get.widget.noData")}</Text>
        </Text>
        <Text dimColor>
          {t("get.response.status")}:{" "}
          <Text color={isActive ? "red" : "green"}>
            {value.status !== null && value.status !== undefined
              ? tEnum(value.status)
              : t("get.widget.noData")}
          </Text>
        </Text>
        <Text dimColor>
          {t("get.response.eventTimestamp")}:{" "}
          <Text>{formatTs(value.eventTimestamp)}</Text>
        </Text>
        <Text dimColor>
          {t("get.response.updatedAt")}:{" "}
          <Text>{formatTs(value.updatedAt)}</Text>
        </Text>
        {value.user && (
          <Text dimColor>
            {t("get.response.user")}: <Text>{value.user}</Text>
          </Text>
        )}
        {value.comment && (
          <Text dimColor>
            {t("get.response.comment")}: <Text>{value.comment}</Text>
          </Text>
        )}
      </Box>
    </Box>
  );
}

AlarmDetailContainer.cliWidget = true as const;
