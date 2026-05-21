import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { CorvinaRoleGetResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: CorvinaRoleGetResponseOutput | null | undefined;
  };
}

export function RoleDetailContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const role = field.value;

  if (!responseOnly || !role) {
    return <Box />;
  }

  if (platform === Platform.MCP) {
    return (
      <Box flexDirection="column">
        <Text>{`Role #${role.id}: ${role.label ?? role.name} [${role.type}] [${role.enabled ? "ENABLED" : "DISABLED"}]`}</Text>
        <Text>{`  owner: ${role.owner}  device:${role.deviceGeneralPermission}  vpn:${role.vpnGeneralPermission}`}</Text>
        {role.description && <Text>{`  desc: ${role.description}`}</Text>}
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box gap={2} marginBottom={1}>
        <Text dimColor>#{role.id}</Text>
        <Text bold>{role.label ?? role.name}</Text>
        <Text dimColor>[{role.type}]</Text>
        <Text>
          {role.enabled ? chalk.green("ENABLED") : chalk.dim("disabled")}
        </Text>
        {role.defaultStar && <Text>{chalk.yellow("DEFAULT")}</Text>}
      </Box>
      {role.description && (
        <Box marginBottom={1}>
          <Text dimColor>{role.description}</Text>
        </Box>
      )}
      <Box gap={2}>
        <Text dimColor>{`device:${role.deviceGeneralPermission}`}</Text>
        <Text dimColor>{`vpn:${role.vpnGeneralPermission}`}</Text>
        <Text dimColor>{role.owner}</Text>
      </Box>
    </Box>
  );
}

RoleDetailContainer.cliWidget = true as const;
