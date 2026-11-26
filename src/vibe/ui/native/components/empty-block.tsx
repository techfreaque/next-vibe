import { Pressable, View } from "react-native";

import { cn } from "../../../unified-ui/_shared/cn";
import type { EmptyBlockProps } from "../../web/components/empty-block";
import { styledNative } from "../utils/style-converter";
import { Text } from "./text";

export type {
  EmptyBlockAction,
  EmptyBlockProps,
} from "../../web/components/empty-block";

const StyledView = styledNative(View);
const StyledPressable = styledNative(Pressable);

export function EmptyBlock({
  size = "compact",
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
      {icon ? (
        <StyledView
          className={
            size === "page" ? "rounded-full bg-muted p-2" : "opacity-30"
          }
        >
          {icon}
        </StyledView>
      ) : null}
      <StyledView className="items-center gap-1">
        <Text
          className={
            size === "page"
              ? "text-base font-semibold text-foreground"
              : "text-sm font-medium text-muted-foreground"
          }
        >
          {title}
        </Text>
        {message ? (
          <Text
            className={
              size === "page"
                ? "text-center text-sm text-muted-foreground"
                : "text-xs text-muted-foreground text-center"
            }
          >
            {message}
          </Text>
        ) : null}
      </StyledView>
      {action ? (
        <StyledPressable
          onPress={action.onClick}
          className={cn(
            "mt-1 justify-center rounded-md bg-primary px-3 py-1.5",
            size === "page" && "min-h-11 px-4",
          )}
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
