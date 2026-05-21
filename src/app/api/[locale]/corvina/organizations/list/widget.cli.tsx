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
import type { CorvinaOrganizationsListResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: CorvinaOrganizationsListResponseOutput | null | undefined;
  };
}

export function OrgListContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const isMcp = platform === Platform.MCP;
  const value = field.value;

  if (!responseOnly || !value) {
    return <Box />;
  }

  const orgs = value.organizations ?? [];
  const total = value.total ?? orgs.length;

  if (isMcp) {
    const lines = [`Organizations (${total}):`];
    for (const org of orgs) {
      const data = org.dataEnabled ? "data:on" : "data:off";
      const vpn = org.vpnEnabled ? "vpn:on" : "vpn:off";
      lines.push(
        `  #${org.id} ${org.label} (${org.name}) [${org.status}] ${data} ${vpn}`,
      );
    }
    if (orgs.length === 0) {
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
        <Text bold>{t("get.widget.title")}</Text>
        <Text dimColor>({total})</Text>
      </Box>

      {orgs.length === 0 ? (
        <Text dimColor>{t("get.widget.noOrgsFound")}</Text>
      ) : (
        orgs.map((org) => {
          const statusColor =
            org.status === "DONE"
              ? "green"
              : org.status === "PENDING"
                ? "yellow"
                : org.status === "FAILED"
                  ? "red"
                  : undefined;
          return (
            <Box key={org.id} gap={2} marginBottom={0}>
              <Text dimColor>#{org.id}</Text>
              <Text bold>{org.label}</Text>
              <Text dimColor>({org.name})</Text>
              <Text color={statusColor}>{org.status}</Text>
              <Text>
                {org.dataEnabled ? chalk.green("DATA") : chalk.dim("data")}
              </Text>
              <Text>
                {org.vpnEnabled ? chalk.green("VPN") : chalk.dim("vpn")}
              </Text>
            </Box>
          );
        })
      )}
    </Box>
  );
}

OrgListContainer.cliWidget = true as const;
