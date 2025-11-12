import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

export interface UlMouseEvent {
  preventDefault?: () => void;
  stopPropagation?: () => void;
}

export interface UlProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  onClick?: (event: UlMouseEvent) => void;
  onMouseEnter?: (event: UlMouseEvent) => void;
  onMouseLeave?: (event: UlMouseEvent) => void;
}

function Ul({ className, children, ...props }: UlProps): React.JSX.Element {
  return (
    <ul className={cn(className)} {...props}>
      {children}
    </ul>
  );
}

export { Ul };
