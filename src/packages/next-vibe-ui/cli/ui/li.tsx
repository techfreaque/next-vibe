import { Box, Text } from "ink";
import type { JSX } from "react";

import { useIsMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type { LiProps } from "../../web/ui/li";

export type { LiProps, LiMouseEvent } from "../../web/ui/li";

export function Li({ children, value }: LiProps): JSX.Element {
  const isMcp = useIsMcp();

  const prefix = value !== undefined ? `${value}. ` : "• ";

  if (isMcp) {
    return (
      <Box>
        <Text>{prefix}</Text>
        <Box>{children}</Box>
      </Box>
    );
  }

  return (
    <Box>
      <Text dimColor>{prefix}</Text>
      <Box>{children}</Box>
    </Box>
  );
}

export { Li as default };
