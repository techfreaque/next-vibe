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
import type { CorvinaSubOrgCreateResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: CorvinaSubOrgCreateResponseOutput | null | undefined;
  };
}

export function SubOrgCreateContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.POST>();
  const org = field.value;

  if (!responseOnly || !org) {
    return <Box />;
  }

  if (platform === Platform.MCP) {
    return (
      <Box>
        <Text>{`created: name=${org.nameResult} #id=${org.id} status=${org.status} resource=${org.resourceId}`}</Text>
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
        <Text dimColor>#{org.id}</Text>
        <Text bold>{org.labelResult}</Text>
        <Text dimColor>({org.nameResult})</Text>
        <Text dimColor>{org.status}</Text>
      </Box>
      <Box marginTop={1}>
        <Text dimColor>{org.resourceId}</Text>
      </Box>
    </Box>
  );
}

SubOrgCreateContainer.cliWidget = true as const;
