import type { AspectRatioRootProps } from "next-vibe/ui/web/ui/aspect-ratio";
import type { JSX } from "react";

export type { AspectRatioRootProps } from "next-vibe/ui/web/ui/aspect-ratio";

// CLI: aspect ratio is meaningless in a terminal - passthrough children, ignore ratio
export function AspectRatio({
  children,
  ratio,
}: AspectRatioRootProps): JSX.Element {
  void ratio;
  return <>{children}</>;
}
