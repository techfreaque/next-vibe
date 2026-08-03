import { styled } from "nativewind";
import { cn } from "../../../unified-ui/_shared/cn";
import { Pressable, View } from "react-native";

import { styledNative } from "../utils/style-converter";
import type { ListItemProps } from "../../web/ui/list-item";
import { Text } from "./text";

export type { ListItemProps } from "../../web/ui/list-item";

const StyledView = styled(View, { className: "style" });
const StyledPressable = styledNative(Pressable);

export function ListItem({
  avatar,
  title,
  subtitle,
  badges,
  meta,
  actions,
  onClick,
  selected = false,
  className,
}: ListItemProps): React.JSX.Element {
  const Wrapper = onClick ? StyledPressable : StyledView;

  return (
    <Wrapper
      className={cn(
        "flex-row items-center gap-3 rounded-lg border border-border p-3",
        selected && "bg-accent",
        className,
      )}
      {...(onClick ? { onPress: onClick } : {})}
    >
      {avatar ? (
        <StyledView className="flex-shrink-0">{avatar}</StyledView>
      ) : null}
      <StyledView className="flex-1 min-w-0">
        <StyledView className="flex-row items-center gap-2 flex-wrap">
          <Text className="font-semibold text-sm">{title}</Text>
          {badges}
        </StyledView>
        {subtitle ? (
          <Text className="text-xs text-muted-foreground mt-0.5">
            {subtitle}
          </Text>
        ) : null}
        {meta ? (
          <StyledView className="flex-row items-center gap-3 mt-1 flex-wrap">
            {meta}
          </StyledView>
        ) : null}
      </StyledView>
      {actions ? (
        <StyledView className="flex-row items-center gap-1">
          {actions}
        </StyledView>
      ) : null}
    </Wrapper>
  );
}
ListItem.displayName = "ListItem";
