import { useWindowSize } from "./use-window-size";

/** Narrower than this and a separator says less than the space it costs. */
const MIN_SEPARATOR_WIDTH = 20;

/** Historic fixed width — now an upper bound, so wide terminals stay readable. */
const MAX_SEPARATOR_WIDTH = 60;

/** Leave a column either side so the rule never touches the terminal edge. */
const HORIZONTAL_PADDING = 2;

/**
 * Separator width in terminal columns, clamped to a readable range.
 *
 * Reacts to SIGWINCH via `useWindowSize`. Previously every rule was a
 * module-scope `"─".repeat(60)`, which wrapped onto a second row on any
 * terminal narrower than 60 columns.
 */
export function useSeparatorWidth(): number {
  const { width } = useWindowSize();
  return Math.max(
    MIN_SEPARATOR_WIDTH,
    Math.min(width - HORIZONTAL_PADDING, MAX_SEPARATOR_WIDTH),
  );
}

/**
 * Ready-to-render horizontal rule sized to the current terminal.
 */
export function useSeparatorLine(): string {
  const width = useSeparatorWidth();
  return "─".repeat(width);
}
