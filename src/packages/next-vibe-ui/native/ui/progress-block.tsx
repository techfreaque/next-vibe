import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import { View } from "react-native";

import type {
  ProgressBlockProps,
  ProgressBlockVariant,
} from "@/packages/next-vibe-ui/web/ui/progress-block";

import { Text } from "./text";

export type {
  ProgressBlockProps,
  ProgressBlockVariant,
} from "@/packages/next-vibe-ui/web/ui/progress-block";

const StyledView = styled(View, { className: "style" });

const variantClasses: Record<ProgressBlockVariant, string> = {
  default: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
};

export function ProgressBlock({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = "default",
  className,
}: ProgressBlockProps): React.JSX.Element {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <StyledView className={cn("gap-1.5", className)}>
      {label || showPercentage ? (
        <StyledView className="flex-row items-center justify-between">
          {label ? (
            <Text className="text-xs text-muted-foreground">{label}</Text>
          ) : (
            <StyledView />
          )}
          {showPercentage ? (
            <Text className="text-xs font-medium text-muted-foreground">
              {Math.round(pct)}%
            </Text>
          ) : null}
        </StyledView>
      ) : null}
      <StyledView className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <StyledView
          className={cn("h-full rounded-full", variantClasses[variant])}
          style={{ width: `${pct}%` }}
        />
      </StyledView>
    </StyledView>
  );
}
ProgressBlock.displayName = "ProgressBlock";
