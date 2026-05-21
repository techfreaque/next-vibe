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
  SecurityPolicyDetailDeleteResponseOutput,
  SecurityPolicyDetailGetResponseOutput,
  SecurityPolicyDetailPutResponseOutput,
} from "./definition";

function PolicyRow({
  isMcp,
  value,
  prefix,
}: {
  isMcp: boolean;
  value: { id: number; name: string; type: string; orgResourceId: string };
  prefix: string;
}): JSX.Element {
  if (isMcp) {
    return (
      <Box flexDirection="column">
        <Text>{`${prefix} #${value.id}: ${value.name} [${value.type}] ${value.orgResourceId}`}</Text>
      </Box>
    );
  }
  return (
    <Box flexDirection="column" marginTop={1}>
      <Box gap={2}>
        <Text dimColor>#{value.id}</Text>
        <Text bold>{value.name}</Text>
        <Text dimColor>[{value.type}]</Text>
        <Text dimColor>{value.orgResourceId}</Text>
      </Box>
    </Box>
  );
}

interface GetWidgetProps {
  field: { value: SecurityPolicyDetailGetResponseOutput | null | undefined };
}

export function SecurityPolicyDetailContainer({
  field,
}: GetWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const isMcp = platform === Platform.MCP;
  if (!responseOnly || !field.value) {
    return <Box />;
  }
  return (
    <PolicyRow
      isMcp={isMcp}
      value={field.value}
      prefix={t("get.widget.prefix")}
    />
  );
}

SecurityPolicyDetailContainer.cliWidget = true as const;

interface PutWidgetProps {
  field: { value: SecurityPolicyDetailPutResponseOutput | null | undefined };
}

export function SecurityPolicyUpdateContainer({
  field,
}: PutWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.PUT>();
  const isMcp = platform === Platform.MCP;
  if (!responseOnly || !field.value) {
    return <Box />;
  }
  const v = { ...field.value, name: field.value.nameResult };
  return <PolicyRow isMcp={isMcp} value={v} prefix={t("put.widget.prefix")} />;
}

SecurityPolicyUpdateContainer.cliWidget = true as const;

interface DeleteWidgetProps {
  field: { value: SecurityPolicyDetailDeleteResponseOutput | null | undefined };
}

export function SecurityPolicyDeleteContainer({
  field,
}: DeleteWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.DELETE>();
  const isMcp = platform === Platform.MCP;
  if (!responseOnly || !field.value) {
    return <Box />;
  }
  return (
    <PolicyRow
      isMcp={isMcp}
      value={field.value}
      prefix={t("delete.widget.prefix")}
    />
  );
}

SecurityPolicyDeleteContainer.cliWidget = true as const;
