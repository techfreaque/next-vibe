import { cn } from "next-vibe/core/utils/utils";
import type { StyleType } from "next-vibe/ui/web/utils/style-type";
import * as React from "react";

export interface UlMouseEvent {
  preventDefault?: () => void;
  stopPropagation?: () => void;
}

export type UlProps = {
  children?: React.ReactNode;
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  onClick?: (event: UlMouseEvent) => void;
  onMouseEnter?: (event: UlMouseEvent) => void;
  onMouseLeave?: (event: UlMouseEvent) => void;
} & StyleType;

function Ul({ className, children, ...props }: UlProps): React.JSX.Element {
  return (
    <ul className={cn(className)} {...props}>
      {children}
    </ul>
  );
}

export { Ul };
