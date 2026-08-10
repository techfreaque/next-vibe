import type { JSX } from "react";

import type { AspectRatioRootProps } from "../../web/components/aspect-ratio";

export type { AspectRatioRootProps } from "../../web/components/aspect-ratio";

// CLI: aspect ratio is meaningless in a terminal - passthrough children, ignore ratio
export function AspectRatio({
  children,
  ratio,
}: AspectRatioRootProps): JSX.Element {
  void ratio;
  return <>{children}</>;
}
