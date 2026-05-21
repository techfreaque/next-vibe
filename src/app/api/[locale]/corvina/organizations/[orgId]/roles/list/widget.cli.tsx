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
import type { CorvinaRolesListResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: CorvinaRolesListResponseOutput | null | undefined;
  };
}

export function RolesListContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const data = field.value;

  if (!responseOnly || !data) {
    return <Box />;
  }

  const { roles, totalElements } = data;
  const isMcp = platform === Platform.MCP;

  if (isMcp) {
    const lines = [`roles (${roles.length}/${totalElements}):`];
    for (const r of roles) {
      lines.push(
        `  role #${r.id}: ${r.name} [${r.type}] [${r.enabled ? "ENABLED" : "DISABLED"}]${r.description ? ` - ${r.description}` : ""}`,
      );
    }
    return (
      <Box flexDirection="column">
        <Text>{lines.join("\n")}</Text>
      </Box>
    );
  }

  if (roles.length === 0) {
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
          ({roles.length}/{totalElements})
        </Text>
      </Box>
      {roles.map((r) => (
        <Box key={r.id} gap={2} marginBottom={0}>
          <Text dimColor>#{r.id}</Text>
          <Text bold>{r.label ?? r.name}</Text>
          <Text dimColor>[{r.type}]</Text>
          <Text>
            {r.enabled ? chalk.green("ENABLED") : chalk.dim("disabled")}
          </Text>
          {r.defaultStar && <Text>{chalk.yellow("DEFAULT")}</Text>}
        </Box>
      ))}
    </Box>
  );
}

RolesListContainer.cliWidget = true as const;
