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
import type { CorvinaUserCreateResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: CorvinaUserCreateResponseOutput | null | undefined;
  };
}

export function UserCreateContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.POST>();
  const user = field.value;

  if (!responseOnly || !user) {
    return <Box />;
  }

  if (platform === Platform.MCP) {
    return (
      <Box>
        <Text>{`created: user #${user.id} ${user.usernameResult} <${user.emailResult}>`}</Text>
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
        <Text dimColor>#{user.id}</Text>
        <Text bold>{user.usernameResult}</Text>
        <Text dimColor>&lt;{user.emailResult}&gt;</Text>
        {user.serviceAccountResult && <Text color="cyan">SVC</Text>}
      </Box>
    </Box>
  );
}

UserCreateContainer.cliWidget = true as const;
