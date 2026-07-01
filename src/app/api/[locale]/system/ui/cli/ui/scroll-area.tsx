import * as React from "react";

export type {
  ScrollAreaBarProps,
  ScrollAreaCornerProps,
  ScrollAreaProps,
  ScrollAreaRootProps,
  ScrollAreaThumbProps,
  ScrollAreaViewportProps,
  ScrollBarProps,
} from "next-vibe/ui/web/ui/scroll-area";

import type { ScrollAreaRootProps } from "next-vibe/ui/web/ui/scroll-area";

export function ScrollArea({
  children,
}: ScrollAreaRootProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function ScrollBar(): null {
  return null;
}
