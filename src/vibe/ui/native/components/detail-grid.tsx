import { Children, type ReactNode } from "react";
import { View } from "react-native";

import { cn } from "../../../unified-ui/_shared/cn";
import type {
  DetailFieldProps,
  DetailGridProps,
} from "../../web/components/detail-grid";
import { styledNative } from "../utils/style-converter";
import { Text } from "./text";

export type {
  DetailFieldProps,
  DetailGridColumns,
  DetailGridProps,
} from "../../web/components/detail-grid";

const StyledView = styledNative(View);

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
  const renderValue = (node: ReactNode): ReactNode => {
    if (
      typeof node === "string" ||
      typeof node === "number" ||
      typeof node === "bigint"
    ) {
      return (
        <Text
          className={cn("text-sm font-medium", mono && "font-mono text-xs")}
        >
          {String(node)}
        </Text>
      );
    }
    return node;
  };
  return (
    <StyledView className={cn("gap-0.5 min-w-[120px] max-w-full", className)}>
      <Text className="text-xs text-muted-foreground">{label}</Text>
      {Children.map(value ?? "\u2013", renderValue)}
    </StyledView>
  );
}
DetailField.displayName = "DetailField";
