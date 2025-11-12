import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

export interface KbdMouseEvent {
  preventDefault?: () => void;
  stopPropagation?: () => void;
}

export interface KbdProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  id?: string;
  "aria-label"?: string;
  onClick?: (event: KbdMouseEvent) => void;
}

function Kbd({ className, children, ...props }: KbdProps): React.JSX.Element {
  return (
    <kbd className={cn(className)} {...props}>
      {children}
    </kbd>
  );
}

export { Kbd };
