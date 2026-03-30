/**
 * Markdown Component for React Native
 * TODO: Implement markdown rendering using react-native-markdown-display or similar
 * Currently renders plain text
 */
import { cn } from "next-vibe/shared/utils/utils";
import { memo } from "react";
import { Text as RNText, View } from "react-native";

// Import all public types from web version (web is source of truth)
import type { MarkdownProps } from "../../web/ui/markdown";
import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";

export const CodeBlock = memo(function CodeBlock({
  code,
}: {
  code: string;
  language: string;
}): React.JSX.Element {
  return (
    <View className="rounded-lg bg-slate-900 p-4">
      <RNText className="text-xs font-mono text-slate-300">{code}</RNText>
    </View>
  );
});

export const Markdown = memo(function Markdown({
  className,
  style,
  content,
}: MarkdownProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <View
      {...applyStyleType({
        nativeStyle,
        className: cn("flex flex-col gap-2", className),
      })}
    >
      <RNText className="text-sm text-foreground">{content}</RNText>
    </View>
  );
});
