import { Box, Text } from "ink";
import type { JSX } from "react";

import type {
  MarkdownEditorProps,
  ToolbarAction,
} from "../../web/ui/markdown-editor";
import { useIsMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

export type {
  MarkdownEditorProps,
  ToolbarAction,
} from "../../web/ui/markdown-editor";

// MarkdownEditor in CLI: show the current markdown value as plain text.
// No WYSIWYG editing — the terminal can't render a rich text editor.
// In MCP: return null (editors are interactive UI, not useful for AI).
export function MarkdownEditor({
  value,
  placeholder,
}: MarkdownEditorProps): JSX.Element | null {
  const isMcp = useIsMcp();

  if (isMcp) {
    return null;
  }

  const content = value !== undefined && value !== "" ? value : placeholder;

  return (
    <Box flexDirection="column" borderStyle="single">
      <Text dimColor>{content}</Text>
    </Box>
  );
}
