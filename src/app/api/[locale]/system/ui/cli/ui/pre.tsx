import { Text } from "ink";
import type { PreProps } from "next-vibe/ui/web/ui/pre";
import type { JSX } from "react";

export type { PreProps } from "next-vibe/ui/web/ui/pre";

// CLI: preformatted text renders as-is - terminal preserves whitespace naturally
export function Pre({ children }: PreProps): JSX.Element {
  return <Text>{children}</Text>;
}
