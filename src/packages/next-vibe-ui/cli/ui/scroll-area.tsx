import * as React from "react";

export type {
  ScrollAreaRootProps,
  ScrollAreaViewportProps,
  ScrollAreaBarProps,
  ScrollAreaThumbProps,
  ScrollAreaCornerProps,
  ScrollAreaProps,
  ScrollBarProps,
} from "../../web/ui/scroll-area";

import type { ScrollAreaRootProps } from "../../web/ui/scroll-area";

export function ScrollArea({
  children,
}: ScrollAreaRootProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function ScrollBar(): null {
  return null;
}
