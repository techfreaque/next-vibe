import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { SecurityPoliciesCreateResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: SecurityPoliciesCreateResponseOutput | null | undefined;
  };
}

export function SecurityPolicyCreateContainer({
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
        <Text>{`Created policy #${value.id}: ${value.nameResult} [${value.type}]`}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box gap={2}>
        <Text dimColor>#{value.id}</Text>
        <Text bold>{value.nameResult}</Text>
        <Text dimColor>[{value.type}]</Text>
        <Text dimColor>{value.orgResourceId}</Text>
      </Box>
    </Box>
  );
}

SecurityPolicyCreateContainer.cliWidget = true as const;
