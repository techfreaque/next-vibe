import { Box, Text } from "ink";
import type { JSX } from "react";

import { useIsMcp } from "../../../unified-ui/_shared/use-widget-context";
import type { LiProps } from "../../web/ui/li";

export type { LiMouseEvent, LiProps } from "../../web/ui/li";

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
