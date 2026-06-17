import { Box } from "ink";
import type { JSX } from "react";

import { parseClassesToBoxProps } from "@/packages/next-vibe-ui/cli/utils/tailwind-to-ink";

import type { TbodyProps } from "../../web/ui/tbody";

export type { TbodyProps } from "../../web/ui/tbody";

export function Tbody({ className, children }: TbodyProps): JSX.Element {
  const boxProps = parseClassesToBoxProps(className);
  return (
    <Box flexDirection="column" {...boxProps}>
      {children}
    </Box>
  );
}
