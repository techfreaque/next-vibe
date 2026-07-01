import { styled } from "nativewind";
import { cn } from "next-vibe/core/utils/utils";
import type {
  LoadingBlockProps,
  LoadingBlockSize,
} from "next-vibe/ui/web/ui/loading-block";
import { ActivityIndicator, View } from "react-native";

import { Text } from "./text";

export type {
  LoadingBlockProps,
  LoadingBlockSize,
} from "next-vibe/ui/web/ui/loading-block";

const StyledView = styled(View, { className: "style" });

const sizeMap: Record<LoadingBlockSize, "small" | "large"> = {
  sm: "small",
  md: "small",
  lg: "large",
};

export function LoadingBlock({
  message,
  size = "md",
  className,
}: LoadingBlockProps): React.JSX.Element {
  return (
    <StyledView
      className={cn("items-center justify-center gap-2 py-8", className)}
    >
      <ActivityIndicator size={sizeMap[size]} />
      {message ? (
        <Text className="text-sm text-muted-foreground">{message}</Text>
      ) : null}
    </StyledView>
  );
}
LoadingBlock.displayName = "LoadingBlock";
