import { cn } from "next-vibe/shared/utils/utils";
import { styled } from "nativewind";
import { Pressable, View } from "react-native";

import type { ActionCardProps } from "@/packages/next-vibe-ui/web/ui/action-card";
import { styledNative } from "../utils/style-converter";
import { Text } from "./text";

export type { ActionCardProps } from "@/packages/next-vibe-ui/web/ui/action-card";

const StyledView = styled(View, { className: "style" });
const StyledPressable = styledNative(Pressable);

export function ActionCard({
  icon,
  title,
  description,
  onClick,
  className,
}: ActionCardProps): React.JSX.Element {
  const Wrapper = onClick ? StyledPressable : StyledView;

  return (
    <Wrapper
      className={cn(
        "flex-row items-start gap-3 rounded-lg border border-border px-4 py-3",
        className,
      )}
      {...(onClick ? { onPress: onClick } : {})}
    >
      {icon ? (
        <StyledView className="mt-0.5 opacity-60">{icon}</StyledView>
      ) : null}
      <StyledView className="flex-1 gap-0.5">
        <Text className="text-sm font-medium">{title}</Text>
        {description ? (
          <Text className="text-xs text-muted-foreground">{description}</Text>
        ) : null}
      </StyledView>
    </Wrapper>
  );
}
ActionCard.displayName = "ActionCard";
