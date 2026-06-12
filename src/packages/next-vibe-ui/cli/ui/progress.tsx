import { Text } from "ink";
import type { JSX } from "react";

import { useIsMcp } from "next-vibe-ui/unified/_shared/use-widget-context";
import type {
  ProgressRootProps,
  ProgressIndicatorProps,
} from "../../web/ui/progress";

export type {
  ProgressRootProps,
  ProgressIndicatorProps,
} from "../../web/ui/progress";

const BAR_WIDTH = 20;

function buildBar(value: number): { filled: number; empty: number } {
  const pct = Math.max(0, Math.min(100, value ?? 0));
  const filled = Math.round((pct / 100) * BAR_WIDTH);
  const empty = BAR_WIDTH - filled;
  return { filled, empty };
}

export function Progress({ value, max = 100 }: ProgressRootProps): JSX.Element {
  const isMcp = useIsMcp();
  const normalized = max > 0 ? Math.round(((value ?? 0) / max) * 100) : 0;
  const pct = Math.max(0, Math.min(100, normalized));

  if (isMcp) {
    return (
      <Text>
        {pct}/{100}
      </Text>
    );
  }

  const { filled, empty } = buildBar(pct);
  const filledBar = "█".repeat(filled);
  const emptyBar = "░".repeat(empty);

  // Use Text-only rendering to avoid Box-inside-Text crashes when
  // Progress is nested inside Span/Text contexts (e.g. sidebar footer).
  return (
    <Text>
      <Text color="cyan">[{filledBar}</Text>
      <Text dimColor>{emptyBar}</Text>
      <Text color="cyan">] {pct}%</Text>
    </Text>
  );
}
Progress.displayName = "Progress";

export function ProgressIndicator({
  value,
}: ProgressIndicatorProps): JSX.Element {
  const isMcp = useIsMcp();
  const pct = Math.max(0, Math.min(100, value ?? 0));

  if (isMcp) {
    return <Text>{pct}%</Text>;
  }

  const { filled, empty } = buildBar(pct);
  return (
    <Text>
      <Text color="cyan">{"█".repeat(filled)}</Text>
      <Text dimColor>{"░".repeat(empty)}</Text>
    </Text>
  );
}
ProgressIndicator.displayName = "ProgressIndicator";
