import { styled } from "nativewind";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { Pressable, View } from "react-native";

import { styledNative } from "../../native/utils/style-converter";
import type { EmptyBlockProps } from "../../web/ui/empty-block";
import { Text } from "./text";

export type {
  EmptyBlockAction,
  EmptyBlockProps,
} from "../../web/ui/empty-block";

const StyledView = styled(View, { className: "style" });
const StyledPressable = styledNative(Pressable);

export function EmptyBlock({
  icon,
  title,
  message,
  action,
  className,
}: EmptyBlockProps): React.JSX.Element {
  return (
    <StyledView
      className={cn("items-center justify-center gap-3 py-12", className)}
    >
      {icon ? <StyledView className="opacity-30">{icon}</StyledView> : null}
      <StyledView className="items-center gap-1">
        <Text className="text-sm font-medium text-muted-foreground">
          {title}
        </Text>
        {message ? (
          <Text className="text-xs text-muted-foreground text-center">
            {message}
          </Text>
        ) : null}
      </StyledView>
      {action ? (
        <StyledPressable
          onPress={action.onClick}
          className="mt-1 rounded-md bg-primary px-3 py-1.5"
        >
          <Text className="text-xs font-medium text-primary-foreground">
            {action.label}
          </Text>
        </StyledPressable>
      ) : null}
    </StyledView>
  );
}
EmptyBlock.displayName = "EmptyBlock";
