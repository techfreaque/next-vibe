import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

import type { StyleType } from "../utils/style-type";

export interface StrongMouseEvent {
  preventDefault?: () => void;
  stopPropagation?: () => void;
}

export type StrongProps = {
  children?: React.ReactNode;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  onClick?: (event: StrongMouseEvent) => void;
  onMouseEnter?: (event: StrongMouseEvent) => void;
  onMouseLeave?: (event: StrongMouseEvent) => void;
} & StyleType;

function Strong({ className, children, ...props }: StrongProps): React.JSX.Element {
  return (
    <strong className={cn(className)} {...props}>
      {children}
    </strong>
  );
}

export { Strong };
