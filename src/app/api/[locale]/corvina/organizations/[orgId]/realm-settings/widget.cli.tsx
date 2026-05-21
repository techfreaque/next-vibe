import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type {
  RealmSettingsGetResponseOutput,
  RealmSettingsPutResponseOutput,
} from "./definition";

const DEPTH_KEYS = [
  ["configDealerMaxDepth", "dealer"],
  ["configHostnameMaxDepth", "hostname"],
  ["configOwnResourcesMaxDepth", "ownResources"],
  ["configIotMaxDepth", "iot"],
  ["configVpnMaxDepth", "vpn"],
  ["configStoreMaxDepth", "store"],
  ["configIpFilteringMaxDepth", "ipFiltering"],
  ["configPrivateAccessMaxDepth", "privateAccess"],
] as const;

function RealmSettingsView({
  isMcp,
  value,
}: {
  isMcp: boolean;
  value: RealmSettingsGetResponseOutput;
}): JSX.Element {
  if (isMcp) {
    const lines = DEPTH_KEYS.map(([key, label]) => `  ${label}: ${value[key]}`);
    return (
      <Box flexDirection="column">
        <Text>{`Realm Settings:\n${lines.join("\n")}`}</Text>
      </Box>
    );
  }
  return (
    <Box flexDirection="column" marginTop={1}>
      {DEPTH_KEYS.map(([key, label]) => (
        <Box key={key} gap={2}>
          <Text dimColor>{label}:</Text>
          <Text bold>{value[key]}</Text>
        </Box>
      ))}
    </Box>
  );
}

interface GetWidgetProps {
  field: { value: RealmSettingsGetResponseOutput | null | undefined };
}

export function RealmSettingsGetContainer({
  field,
}: GetWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const isMcp = platform === Platform.MCP;
  if (!responseOnly || !field.value) {
    return <Box />;
  }
  return <RealmSettingsView isMcp={isMcp} value={field.value} />;
}

RealmSettingsGetContainer.cliWidget = true as const;

interface PutWidgetProps {
  field: { value: RealmSettingsPutResponseOutput | null | undefined };
}

export function RealmSettingsPutContainer({
  field,
}: PutWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const isMcp = platform === Platform.MCP;
  if (!responseOnly || !field.value) {
    return <Box />;
  }
  return <RealmSettingsView isMcp={isMcp} value={field.value} />;
}

RealmSettingsPutContainer.cliWidget = true as const;
