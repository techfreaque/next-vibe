import { View } from "react-native";

import { cn } from "../../../unified-ui/_shared/cn";
import type { WidgetHeaderProps } from "../../web/components/widget-header";
import { styledNative } from "../utils/style-converter";
import { Text } from "./text";

export type { WidgetHeaderProps } from "../../web/components/widget-header";

const StyledView = styledNative(View);

export function WidgetHeader({
  title,
  titleAccessory,
  size = "section",
  subtitle,
  breadcrumb,
  backButton,
  actions,
  border = true,
  className,
}: WidgetHeaderProps): React.JSX.Element {
  return (
    <StyledView
      className={cn(
        size === "page"
          ? "flex-col items-stretch gap-2 pb-3"
          : "flex-row items-center gap-2 pb-3",
        border && "border-b border-border",
        className,
      )}
    >
      {backButton}
      {size === "page" ? (
        <StyledView className="min-w-0 gap-1">
          {breadcrumb}
          <StyledView className="flex-row flex-wrap items-center gap-2">
            <Text accessibilityRole="header" className="text-2xl font-semibold">
              {title}
            </Text>
            {titleAccessory}
          </StyledView>
          {subtitle && (
            <Text className="text-sm text-muted-foreground">{subtitle}</Text>
          )}
        </StyledView>
      ) : (
        <Text className="font-semibold text-base flex-1">{title}</Text>
      )}
      {size === "section" && titleAccessory}
      {actions ? (
        <StyledView className="flex-row flex-wrap items-center gap-2">
          {actions}
        </StyledView>
      ) : null}
    </StyledView>
  );
}
WidgetHeader.displayName = "WidgetHeader";
