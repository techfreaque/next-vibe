import * as React from "react";

export type {
  ResizableContainerProps,
  ResizableHandleProps,
} from "../../web/components/resizable";

import type { ResizableContainerProps } from "../../web/components/resizable";
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
