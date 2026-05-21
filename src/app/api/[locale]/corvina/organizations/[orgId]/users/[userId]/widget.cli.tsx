import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { CorvinaUserGetResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: CorvinaUserGetResponseOutput | null | undefined;
  };
}

export function UserDetailContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const user = field.value;

  if (!responseOnly || !user) {
    return <Box />;
  }

  if (platform === Platform.MCP) {
    const badges: string[] = [];
    if (user.serviceAccount) {
      badges.push("svc");
    }
    if (user.mfaEnabled) {
      badges.push("mfa");
    }
    if (user.groupPoliciesEnabled) {
      badges.push("policies");
    }
    return (
      <Box flexDirection="column">
        <Text>
          {`User #${user.id}: ${user.username} <${user.email}>${badges.length > 0 ? ` [${badges.join(",")}]` : ""}`}
        </Text>
        {(user.firstName ?? user.lastName) && (
          <Text>{`  name: ${[user.firstName, user.lastName].filter(Boolean).join(" ")}`}</Text>
        )}
        <Text>{`  owner: ${user.owner}  mfa: ${user.mfaEnabled ? "yes" : "no"}`}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box gap={2} marginBottom={1}>
        <Text dimColor>#{user.id}</Text>
        <Text bold>{user.username}</Text>
        <Text dimColor>&lt;{user.email}&gt;</Text>
      </Box>
      {(user.firstName ?? user.lastName) && (
        <Box gap={1}>
          <Text>
            {[user.firstName, user.lastName].filter(Boolean).join(" ")}
          </Text>
        </Box>
      )}
      <Box gap={2} marginTop={1}>
        {user.serviceAccount && <Text>{chalk.cyan("SVC")}</Text>}
        <Text>
          {user.mfaEnabled ? chalk.green("MFA") : chalk.dim("no-mfa")}
        </Text>
        {user.groupPoliciesEnabled && <Text>{chalk.yellow("POLICIES")}</Text>}
        {user.userImpersonation && <Text>{chalk.yellow("IMPERSONATION")}</Text>}
        <Text dimColor>{user.owner}</Text>
      </Box>
    </Box>
  );
}

UserDetailContainer.cliWidget = true as const;
