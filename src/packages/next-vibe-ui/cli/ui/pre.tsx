import { Text } from "ink";
import type { JSX } from "react";

import type { PreProps } from "../../web/ui/pre";

export type { PreProps } from "../../web/ui/pre";

// CLI: preformatted text renders as-is - terminal preserves whitespace naturally
export function Pre({ children }: PreProps): JSX.Element {
  return <Text>{children}</Text>;
}
