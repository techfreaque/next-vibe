import { styled } from "nativewind";
import { cn } from "../../../unified-ui/_shared/cn";
import { View } from "react-native";

import type {
  StatusPillProps,
  StatusPillVariant,
} from "../../web/ui/status-pill";
import { Text } from "./text";

export type {
  StatusPillProps,
  StatusPillVariant,
} from "../../web/ui/status-pill";

const StyledView = styled(View, { className: "style" });

const variantClasses: Record<StatusPillVariant, string> = {
  default: "bg-primary/10",
  success: "bg-success/10",
  warning: "bg-warning/10",
  danger: "bg-destructive/10",
  info: "bg-info/10",
  muted: "bg-muted",
};

const textClasses: Record<StatusPillVariant, string> = {
  default: "text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
  info: "text-info",
  muted: "text-muted-foreground",
};

export function StatusPill({
  status,
  variant = "default",
  label,
  className,
}: StatusPillProps): React.JSX.Element {
  return (
    <StyledView
      className={cn(
        "rounded-full px-2 py-0.5",
        variantClasses[variant],
        className,
      )}
    >
      <Text className={cn("text-xs font-medium", textClasses[variant])}>
        {label ?? status}
      </Text>
    </StyledView>
  );
}
StatusPill.displayName = "StatusPill";
