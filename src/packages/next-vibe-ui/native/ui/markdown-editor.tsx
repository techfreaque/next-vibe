/**
 * Markdown Editor - Native implementation
 * Toolbar buttons insert markdown syntax around selected text / at cursor.
 * No WYSIWYG (React Native has no good native rich-text without WebView).
 *
 * Types imported from web version (source of truth).
 */

import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import React, { useCallback, useRef, useState } from "react";
import {
  ScrollView,
  Text as RNText,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import type {
  MarkdownEditorProps,
  ToolbarAction,
} from "../../web/ui/markdown-editor";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";

// Re-export types so consumers can import from the native path too
export type {
  MarkdownEditorProps,
  ToolbarAction,
} from "../../web/ui/markdown-editor";

const StyledView = styled(View, { className: "style" });
const StyledTextInput = styled(TextInput, { className: "style" });
const StyledText = styled(RNText, { className: "style" });

// ─── Toolbar item config (native) ───────────────────────────────────
interface NativeToolbarItem {
  /** Display label for the button */
  label: string;
  /** Markdown prefix to wrap around selection */
  prefix: string;
  /** Markdown suffix to wrap around selection (empty for line-prefix formatting) */
  suffix: string;
  /** Whether this is a line-level prefix (e.g. heading, list) */
  linePrefix?: boolean;
}

const NATIVE_TOOLBAR: Record<ToolbarAction, NativeToolbarItem> = {
  bold: { label: "B", prefix: "**", suffix: "**" },
  italic: { label: "I", prefix: "_", suffix: "_" },
  strike: { label: "S", prefix: "~~", suffix: "~~" },
  link: { label: "🔗", prefix: "[", suffix: "](url)" },
  heading1: { label: "H1", prefix: "# ", suffix: "", linePrefix: true },
  heading2: { label: "H2", prefix: "## ", suffix: "", linePrefix: true },
  heading3: { label: "H3", prefix: "### ", suffix: "", linePrefix: true },
  bulletList: { label: "•", prefix: "- ", suffix: "", linePrefix: true },
  orderedList: { label: "1.", prefix: "1. ", suffix: "", linePrefix: true },
  blockquote: { label: ">", prefix: "> ", suffix: "", linePrefix: true },
  code: { label: "</>", prefix: "`", suffix: "`" },
  horizontalRule: { label: "—", prefix: "\n---\n", suffix: "" },
};

const DEFAULT_TOOLBAR: ToolbarAction[] = [
  "bold",
  "italic",
  "strike",
  "link",
  "heading1",
  "heading2",
  "heading3",
  "bulletList",
  "orderedList",
  "blockquote",
  "code",
  "horizontalRule",
];

// ─── Component ──────────────────────────────────────────────────────
export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  maxLength,
  disabled = false,
  minRows = 4,
  toolbar = DEFAULT_TOOLBAR,
  className,
  style,
}: MarkdownEditorProps): React.JSX.Element {
  const inputRef = useRef<TextInput>(null);
  const [selection, setSelection] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });

  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  const handleFormat = useCallback(
    (action: ToolbarAction) => {
      if (disabled) {
        return;
      }

      const item = NATIVE_TOOLBAR[action];
      const text = value;
      const { start, end } = selection;
      const selected = text.slice(start, end);

      let newText: string;
      let newCursorPos: number;

      if (item.linePrefix) {
        // Line-level: insert prefix at start of current line
        const lineStart = text.lastIndexOf("\n", start - 1) + 1;
        newText =
          text.slice(0, lineStart) + item.prefix + text.slice(lineStart);
        newCursorPos = start + item.prefix.length;
      } else if (action === "horizontalRule") {
        newText = text.slice(0, start) + item.prefix + text.slice(end);
        newCursorPos = start + item.prefix.length;
      } else {
        // Inline: wrap selection
        newText =
          text.slice(0, start) +
          item.prefix +
          (selected || "text") +
          item.suffix +
          text.slice(end);
        newCursorPos =
          start + item.prefix.length + (selected ? selected.length : 4);
      }

      if (maxLength !== undefined && newText.length > maxLength) {
        return;
      }

      onChange(newText);

      // Restore cursor position after React re-renders
      setTimeout(() => {
        inputRef.current?.setNativeProps({
          selection: { start: newCursorPos, end: newCursorPos },
        });
      }, 0);
    },
    [value, selection, onChange, disabled, maxLength],
  );

  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "rounded-md border border-input bg-background",
          disabled && "opacity-50",
          className,
        ),
      })}
    >
      {/* ── Toolbar ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          borderBottomWidth: 1,
          borderColor: "hsl(var(--input))",
          paddingHorizontal: 4,
          paddingVertical: 4,
        }}
      >
        <StyledView className="flex-row items-center gap-1">
          {toolbar.map((action) => {
            const item = NATIVE_TOOLBAR[action];
            return (
              <TouchableOpacity
                key={action}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 4,
                  backgroundColor: "hsl(var(--muted) / 0.5)",
                }}
                onPress={(): void => handleFormat(action)}
                disabled={disabled}
              >
                <StyledText className="text-xs font-semibold text-foreground">
                  {item.label}
                </StyledText>
              </TouchableOpacity>
            );
          })}
        </StyledView>
      </ScrollView>

      {/* ── Text input ── */}
      <StyledTextInput
        ref={inputRef}
        className="flex-1 px-3 py-2 text-sm text-foreground min-h-[96px]"
        placeholderTextColor="hsl(var(--muted-foreground))"
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        multiline
        numberOfLines={minRows}
        textAlignVertical="top"
        editable={!disabled}
        onChangeText={onChange}
        onSelectionChange={(e): void => {
          setSelection(e.nativeEvent.selection);
        }}
      />

      {/* ── Character count ── */}
      {maxLength !== undefined && (
        <StyledView className="flex-row justify-end px-3 pb-1.5">
          <StyledText
            className={cn(
              "text-xs",
              value.length > maxLength * 0.9
                ? "text-destructive"
                : "text-muted-foreground",
            )}
          >
            {value.length}/{maxLength}
          </StyledText>
        </StyledView>
      )}
    </StyledView>
  );
}

export default MarkdownEditor;
