import { cn } from "next-vibe/core/utils/utils";
import type { StyleType } from "next-vibe/ui/web/utils/style-type";
import * as React from "react";

export interface LiMouseEvent {
  preventDefault?: () => void;
  stopPropagation?: () => void;
}

export type LiProps = {
  children?: React.ReactNode;
  id?: string;
  role?: string;
  value?: number;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  onClick?: (event: LiMouseEvent) => void;
  onMouseEnter?: (event: LiMouseEvent) => void;
  onMouseLeave?: (event: LiMouseEvent) => void;
} & StyleType;

function Li({ className, children, ...props }: LiProps): React.JSX.Element {
  return (
    <li className={cn(className)} {...props}>
      {children}
    </li>
  );
}

export { Li };
