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
import type { CorvinaUsersListResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: CorvinaUsersListResponseOutput | null | undefined;
  };
}

export function UsersListContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const data = field.value;

  if (!responseOnly || !data) {
    return <Box />;
  }

  const { users, totalElements } = data;
  const isMcp = platform === Platform.MCP;

  if (isMcp) {
    const lines = [`users (${users.length}/${totalElements}):`];
    for (const u of users) {
      const badges: string[] = [];
      if (u.serviceAccount) {
        badges.push("svc");
      }
      if (u.mfaEnabled) {
        badges.push("mfa");
      }
      lines.push(
        `  user #${u.id}: ${u.username} <${u.email}>${badges.length > 0 ? ` [${badges.join(",")}]` : ""}`,
      );
    }
    return (
      <Box flexDirection="column">
        <Text>{lines.join("\n")}</Text>
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box marginTop={1}>
        <Text dimColor>{t("get.widget.emptyState")}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box gap={2} marginBottom={1}>
        <Text bold>{t("get.widget.title")}</Text>
        <Text dimColor>
          ({users.length}/{totalElements})
        </Text>
      </Box>
      {users.map((u) => {
        const badges: string[] = [];
        if (u.serviceAccount) {
          badges.push(chalk.cyan("SVC"));
        }
        if (u.mfaEnabled) {
          badges.push(chalk.green("MFA"));
        }
        return (
          <Box key={u.id} gap={2} marginBottom={0}>
            <Text dimColor>#{u.id}</Text>
            <Text bold>{u.username}</Text>
            <Text dimColor>&lt;{u.email}&gt;</Text>
            {badges.length > 0 && <Text>{badges.join(" ")}</Text>}
          </Box>
        );
      })}
    </Box>
  );
}

UsersListContainer.cliWidget = true as const;
