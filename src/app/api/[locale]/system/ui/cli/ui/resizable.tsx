import * as React from "react";

export type {
  ResizableContainerProps,
  ResizableHandleProps,
} from "next-vibe/ui/web/ui/resizable";

import type { ResizableContainerProps } from "next-vibe/ui/web/ui/resizable";

import { Div } from "./div";

export function ResizableContainer({
  children,
  className,
  collapsed,
}: ResizableContainerProps): React.JSX.Element | null {
  if (collapsed) {
    return null;
  }
  if (className) {
    return <Div className={className}>{children}</Div>;
  }
  return <>{children}</>;
}

export function ResizableHandle(): null {
  return null;
}
