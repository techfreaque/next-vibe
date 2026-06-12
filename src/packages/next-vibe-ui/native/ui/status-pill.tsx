import { cn } from "next-vibe/shared/utils/utils";
import { styled } from "nativewind";
import { View } from "react-native";

import type {
  StatusPillProps,
  StatusPillVariant,
} from "@/packages/next-vibe-ui/web/ui/status-pill";
import { Text } from "./text";

export type {
  StatusPillVariant,
  StatusPillProps,
} from "@/packages/next-vibe-ui/web/ui/status-pill";

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
