import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import { MembershipRole, UserGroupType } from "../enums";
import type endpoints from "./definition";
import type { UserGroupsListResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: UserGroupsListResponseOutput | null | undefined;
  };
}

export function UserGroupListContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const isMcp = platform === Platform.MCP;
  const value = field.value;

  if (!responseOnly || !value) {
    return <Box />;
  }

  const groups = value.groups ?? [];
  const total = value.totalElements ?? groups.length;

  if (isMcp) {
    const lines = [`User Groups (${total}):`];
    for (const g of groups) {
      lines.push(`  #${g.id} ${g.name} [${g.type}] [${g.membershipRole}]`);
    }
    if (groups.length === 0) {
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
      {groups.length === 0 ? (
        <Text dimColor>{t("get.widget.noGroupsFound")}</Text>
      ) : (
        groups.map((g) => {
          const roleColor =
            g.membershipRole === MembershipRole.ADMIN ? "yellow" : "cyan";
          const typeColor =
            g.type === UserGroupType.ALL || g.type === UserGroupType.ALL_USER
              ? "magenta"
              : undefined;
          return (
            <Box key={g.id} gap={2} marginBottom={0}>
              <Text dimColor>#{g.id}</Text>
              <Text bold>{g.name}</Text>
              <Text color={typeColor}>
                {chalk.dim("[") + g.type + chalk.dim("]")}
              </Text>
              <Text color={roleColor}>[{g.membershipRole}]</Text>
            </Box>
          );
        })
      )}
    </Box>
  );
}

UserGroupListContainer.cliWidget = true as const;
