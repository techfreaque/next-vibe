import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import { CorvinaOrgStatus } from "../enums";
import type endpoints from "./definition";
import type { CorvinaOrganizationGetResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: CorvinaOrganizationGetResponseOutput | null | undefined;
  };
}

export function OrgDetailContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const isMcp = platform === Platform.MCP;
  const org = field.value;

  if (!responseOnly || !org) {
    return <Box />;
  }

  if (isMcp) {
    const lines = [
      `Organization #${org.orgId}: ${org.label} (${org.name})`,
      `  status: ${t(org.status)}  resource: ${org.resourceId}`,
      `  data:${org.dataEnabled ? "on" : "off"}  vpn:${org.vpnEnabled ? "on" : "off"}  store:${org.storeEnabled ? "on" : "off"}  mfa:${org.mfaRequired ? "on" : "off"}`,
      `  private:${org.privateAccess ? "yes" : "no"}  userAccess:${org.userCanAccess ? "yes" : "no"}`,
    ];
    if (org.hostname) {
      lines.push(`  hostname: ${org.hostname}`);
    }
    if (org.vpnPairingMode) {
      lines.push(`  vpnMode: ${org.vpnPairingMode}`);
    }
    return (
      <Box flexDirection="column">
        <Text>{lines.join("\n")}</Text>
      </Box>
    );
  }

  const statusColor =
    org.status === CorvinaOrgStatus.DONE
      ? "green"
      : org.status === CorvinaOrgStatus.PROVISIONING ||
          org.status === CorvinaOrgStatus.DELETING
        ? "yellow"
        : undefined;

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box gap={2} marginBottom={1}>
        <Text dimColor>#{org.orgId}</Text>
        <Text bold>{org.label}</Text>
        <Text dimColor>({org.name})</Text>
        <Text color={statusColor}>{t(org.status)}</Text>
      </Box>
      <Box gap={1}>
        <Text dimColor>{org.resourceId}</Text>
      </Box>
      <Box gap={2} marginTop={1}>
        <Text>{org.dataEnabled ? chalk.green("DATA") : chalk.dim("data")}</Text>
        <Text>{org.vpnEnabled ? chalk.green("VPN") : chalk.dim("vpn")}</Text>
        <Text>
          {org.storeEnabled ? chalk.green("STORE") : chalk.dim("store")}
        </Text>
        <Text>{org.mfaRequired ? chalk.yellow("MFA") : chalk.dim("mfa")}</Text>
        <Text>
          {org.privateAccess ? chalk.yellow("PRIVATE") : chalk.dim("public")}
        </Text>
      </Box>
      {org.hostname && (
        <Box marginTop={1}>
          <Text dimColor>{t("get.widget.cli.hostnameLabel")}</Text>
          <Text>{org.hostname}</Text>
        </Box>
      )}
    </Box>
  );
}

OrgDetailContainer.cliWidget = true as const;
