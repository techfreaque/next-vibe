/**
 * Markdown Component for React Native
 * TODO: Implement markdown rendering using react-native-markdown-display or similar
 * Currently renders plain text
 */
import { Text as RNText, View } from "react-native";

import { cn } from "next-vibe/shared/utils/utils";

// Import all public types from web version (web is source of truth)
import type { MarkdownProps } from "../../web/ui/markdown";

export function Markdown({
  className,
  content,
}: MarkdownProps): React.JSX.Element {
  return (
    <View className={cn("flex flex-col gap-2", className)}>
      <RNText className="text-sm text-foreground">{content}</RNText>
    </View>
  );
}
