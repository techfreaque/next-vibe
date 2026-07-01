import { Box } from "ink";
import type { WidgetShellProps } from "next-vibe/ui/web/ui/widget-shell";
import type { JSX } from "react";

export type {
  WidgetShellPadding,
  WidgetShellProps,
} from "next-vibe/ui/web/ui/widget-shell";

const paddingMap: Record<string, number> = {
  none: 0,
  sm: 1,
  md: 1,
};

export function WidgetShell({
  children,
  padding = "md",
}: WidgetShellProps): JSX.Element {
  return (
    <Box flexDirection="column" gap={1} padding={paddingMap[padding] ?? 1}>
      {children}
    </Box>
  );
}
WidgetShell.displayName = "WidgetShell";
