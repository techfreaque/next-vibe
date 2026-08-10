import * as React from "react";

import { cn } from "../../../unified-ui/_shared/cn";
import type { StyleType } from "../utils/style-type";

export interface KbdMouseEvent {
  preventDefault?: () => void;
  stopPropagation?: () => void;
}

export type KbdProps = {
  children?: React.ReactNode;
  id?: string;
  "aria-label"?: string;
  onClick?: (event: KbdMouseEvent) => void;
} & StyleType;

function Kbd({ className, children, ...props }: KbdProps): React.JSX.Element {
  return (
    <kbd className={cn(className)} {...props}>
      {children}
    </kbd>
  );
}

export { Kbd };
