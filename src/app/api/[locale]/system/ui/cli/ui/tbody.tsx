import { Box } from "ink";
import { parseClassesToBoxProps } from "next-vibe/ui/cli/utils/tailwind-to-ink";
import type { TbodyProps } from "next-vibe/ui/web/ui/tbody";
import type { JSX } from "react";

export type { TbodyProps } from "next-vibe/ui/web/ui/tbody";

export function Tbody({ className, children }: TbodyProps): JSX.Element {
  const boxProps = parseClassesToBoxProps(className);
  return (
    <Box flexDirection="column" {...boxProps}>
      {children}
    </Box>
  );
}
