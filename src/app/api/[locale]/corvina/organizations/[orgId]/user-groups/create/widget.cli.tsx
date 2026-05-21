import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { UserGroupsCreateResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: UserGroupsCreateResponseOutput | null | undefined;
  };
}

export function UserGroupCreateContainer({
  field,
}: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const isMcp = platform === Platform.MCP;
  const value = field.value;

  if (!responseOnly || !value) {
    return <Box />;
  }

  if (isMcp) {
    return (
      <Box flexDirection="column">
        <Text>{`Created group #${value.id}: ${value.nameResult} [${value.type}] [${value.membershipRole}]`}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box gap={2}>
        <Text dimColor>#{value.id}</Text>
        <Text bold>{value.nameResult}</Text>
        <Text dimColor>[{value.type}]</Text>
        <Text dimColor>[{value.membershipRole}]</Text>
      </Box>
    </Box>
  );
}

UserGroupCreateContainer.cliWidget = true as const;
