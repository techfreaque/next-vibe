import { cn } from "next-vibe/core/utils/utils";
import type { StyleType } from "next-vibe/ui/web/utils/style-type";
import * as React from "react";

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
