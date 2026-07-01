import { cn } from "next-vibe/core/utils/utils";
import type { StyleType } from "next-vibe/ui/web/utils/style-type";
import * as React from "react";

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

function Strong({
  className,
  children,
  ...props
}: StrongProps): React.JSX.Element {
  return (
    <strong className={cn(className)} {...props}>
      {children}
    </strong>
  );
}

export { Strong };
