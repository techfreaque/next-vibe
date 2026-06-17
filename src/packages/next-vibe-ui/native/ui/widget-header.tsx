import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import { View } from "react-native";

import type { WidgetHeaderProps } from "@/packages/next-vibe-ui/web/ui/widget-header";

import { Text } from "./text";

export type { WidgetHeaderProps } from "@/packages/next-vibe-ui/web/ui/widget-header";

const StyledView = styled(View, { className: "style" });

export function WidgetHeader({
  title,
  backButton,
  actions,
  border = true,
  className,
}: WidgetHeaderProps): React.JSX.Element {
  return (
    <StyledView
      className={cn(
        "flex-row items-center gap-2 pb-3",
        border && "border-b border-border",
        className,
      )}
    >
      {backButton}
      <Text className="font-semibold text-base flex-1">{title}</Text>
      {actions ? (
        <StyledView className="flex-row items-center gap-2">
          {actions}
        </StyledView>
      ) : null}
    </StyledView>
  );
}
WidgetHeader.displayName = "WidgetHeader";
