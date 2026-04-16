import * as React from "react";

export type {
  ResizableContainerProps,
  ResizableHandleProps,
} from "../../web/ui/resizable";

import type { ResizableContainerProps } from "../../web/ui/resizable";

export function ResizableContainer({
  children,
}: ResizableContainerProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function ResizableHandle(): null {
  return null;
}
