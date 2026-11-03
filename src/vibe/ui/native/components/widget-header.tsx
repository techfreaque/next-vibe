import { View } from "react-native";

import { cn } from "../../../unified-ui/_shared/cn";
import type { WidgetHeaderProps } from "../../web/components/widget-header";
import { Text } from "./text";
import { styledNative } from "../utils/style-converter";

export type { WidgetHeaderProps } from "../../web/components/widget-header";

const StyledView = styledNative(View);

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
