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
  UserGroupDetailDeleteResponseOutput,
  UserGroupDetailGetResponseOutput,
  UserGroupDetailPutResponseOutput,
} from "./definition";

function GroupRow({
  isMcp,
  value,
  prefix,
}: {
  isMcp: boolean;
  value: { id: number; name: string; type: string; membershipRole: string };
  prefix: string;
}): JSX.Element {
  if (isMcp) {
    return (
      <Box flexDirection="column">
        <Text>{`${prefix} #${value.id}: ${value.name} [${value.type}] [${value.membershipRole}]`}</Text>
      </Box>
    );
  }
  return (
    <Box flexDirection="column" marginTop={1}>
      <Box gap={2}>
        <Text dimColor>#{value.id}</Text>
        <Text bold>{value.name}</Text>
        <Text dimColor>[{value.type}]</Text>
        <Text dimColor>[{value.membershipRole}]</Text>
      </Box>
    </Box>
  );
}

interface GetWidgetProps {
  field: { value: UserGroupDetailGetResponseOutput | null | undefined };
}

export function UserGroupDetailContainer({
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
    <GroupRow
      isMcp={isMcp}
      value={field.value}
      prefix={t("get.widget.prefix")}
    />
  );
}

UserGroupDetailContainer.cliWidget = true as const;

interface PutWidgetProps {
  field: { value: UserGroupDetailPutResponseOutput | null | undefined };
}

export function UserGroupUpdateContainer({
  field,
}: PutWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.PUT>();
  const isMcp = platform === Platform.MCP;

  if (!responseOnly || !field.value) {
    return <Box />;
  }

  return (
    <GroupRow
      isMcp={isMcp}
      value={field.value}
      prefix={t("put.widget.prefix")}
    />
  );
}

UserGroupUpdateContainer.cliWidget = true as const;

interface DeleteWidgetProps {
  field: { value: UserGroupDetailDeleteResponseOutput | null | undefined };
}

export function UserGroupDeleteContainer({
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
    <GroupRow
      isMcp={isMcp}
      value={field.value}
      prefix={t("delete.widget.prefix")}
    />
  );
}

UserGroupDeleteContainer.cliWidget = true as const;
