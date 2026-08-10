import { styled } from "nativewind";
import { View } from "react-native";

import { cn } from "../../../unified-ui/_shared/cn";
import type {
  DetailFieldProps,
  DetailGridProps,
} from "../../web/ui/detail-grid";
import { Text } from "./text";

export type {
  DetailFieldProps,
  DetailGridColumns,
  DetailGridProps,
} from "../../web/ui/detail-grid";

const StyledView = styled(View, { className: "style" });

export function DetailGrid({
  children,
  className,
}: DetailGridProps): React.JSX.Element {
  return (
    <StyledView className={cn("flex-row flex-wrap gap-x-6 gap-y-3", className)}>
      {children}
    </StyledView>
  );
}
DetailGrid.displayName = "DetailGrid";

export function DetailField({
  label,
  value,
  mono = false,
  className,
}: DetailFieldProps): React.JSX.Element {
  return (
    <StyledView className={cn("gap-0.5 min-w-[120px]", className)}>
      <Text className="text-xs text-muted-foreground">{label}</Text>
      <Text className={cn("text-sm font-medium", mono && "font-mono text-xs")}>
        {value !== undefined && value !== null ? String(value) : "\u2014"}
      </Text>
    </StyledView>
  );
}
DetailField.displayName = "DetailField";
