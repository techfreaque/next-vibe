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
import type { CorvinaOrgDeleteResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: CorvinaOrgDeleteResponseOutput | null | undefined;
  };
}

export function OrgDeleteContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.DELETE>();
  const org = field.value;

  if (!responseOnly || !org) {
    return <Box />;
  }

  if (platform === Platform.MCP) {
    return (
      <Box>
        <Text>{`deleted: name=${org.name} #id=${org.id} status=${org.status}`}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box gap={2}>
        <Text color="green">{chalk.green("✓")}</Text>
        <Text bold>{t("delete.success.title")}</Text>
      </Box>
      <Box gap={2} marginTop={1}>
        <Text dimColor>#{org.id}</Text>
        <Text>{org.name}</Text>
        <Text dimColor>({org.label})</Text>
        <Text dimColor>{org.status}</Text>
      </Box>
    </Box>
  );
}

OrgDeleteContainer.cliWidget = true as const;
