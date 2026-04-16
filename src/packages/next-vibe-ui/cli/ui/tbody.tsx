import { Box } from "ink";
import type { JSX } from "react";

import type { TbodyProps } from "../../web/ui/tbody";
import { parseClassesToBoxProps } from "@/packages/next-vibe-ui/cli/utils/tailwind-to-ink";

export type { TbodyProps } from "../../web/ui/tbody";

export function Tbody({ className, children }: TbodyProps): JSX.Element {
  const boxProps = parseClassesToBoxProps(className);
  return (
    <Box flexDirection="column" {...boxProps}>
      {children}
    </Box>
  );
}
