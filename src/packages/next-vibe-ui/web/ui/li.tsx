import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

export interface LiMouseEvent {
  preventDefault?: () => void;
  stopPropagation?: () => void;
}

export interface LiProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  id?: string;
  role?: string;
  value?: number;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  onClick?: (event: LiMouseEvent) => void;
  onMouseEnter?: (event: LiMouseEvent) => void;
  onMouseLeave?: (event: LiMouseEvent) => void;
}

function Li({ className, children, ...props }: LiProps): React.JSX.Element {
  return (
    <li className={cn(className)} {...props}>
      {children}
    </li>
  );
}

export { Li };
