import * as React from "react";

export type {
  ScrollAreaBarProps,
  ScrollAreaCornerProps,
  ScrollAreaProps,
  ScrollAreaRootProps,
  ScrollAreaThumbProps,
  ScrollAreaViewportProps,
  ScrollBarProps,
} from "../../web/components/scroll-area";

import type { ScrollAreaRootProps } from "../../web/components/scroll-area";

export function ScrollArea({
  children,
}: ScrollAreaRootProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function ScrollBar(): null {
  return null;
}
