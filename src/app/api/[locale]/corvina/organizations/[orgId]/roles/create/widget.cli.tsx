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
import type { CorvinaRoleCreateResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: CorvinaRoleCreateResponseOutput | null | undefined;
  };
}

export function RoleCreateContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.POST>();
  const role = field.value;

  if (!responseOnly || !role) {
    return <Box />;
  }

  if (platform === Platform.MCP) {
    return (
      <Box>
        <Text>{`created: role #${role.id} ${role.nameResult} [${role.typeResult}] enabled=${role.enabledResult}`}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box gap={2} marginBottom={1}>
        <Text color="green">{chalk.green("✓")}</Text>
        <Text bold>{t("post.success.title")}</Text>
      </Box>
      <Box gap={2}>
        <Text dimColor>#{role.id}</Text>
        <Text bold>{role.labelResult ?? role.nameResult}</Text>
        <Text dimColor>[{role.typeResult}]</Text>
        <Text>
          {role.enabledResult ? chalk.green("ENABLED") : chalk.dim("disabled")}
        </Text>
      </Box>
    </Box>
  );
}

RoleCreateContainer.cliWidget = true as const;
