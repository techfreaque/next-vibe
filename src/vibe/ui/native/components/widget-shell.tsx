import { styled } from "nativewind";
import { View } from "react-native";

import { cn } from "../../../unified-ui/_shared/cn";
import type { WidgetShellProps } from "../../web/components/widget-shell";

export type {
  WidgetShellPadding,
  WidgetShellProps,
} from "../../web/components/widget-shell";

const StyledView = styled(View, { className: "style" });

const paddingClasses: Record<string, string> = {
  none: "",
  sm: "p-2",
  md: "p-4",
};

export function WidgetShell({
  children,
  className,
  padding = "md",
}: WidgetShellProps): React.JSX.Element {
  return (
    <StyledView
      className={cn("flex-1 gap-4", paddingClasses[padding], className)}
    >
      {children}
    </StyledView>
  );
}
WidgetShell.displayName = "WidgetShell";
