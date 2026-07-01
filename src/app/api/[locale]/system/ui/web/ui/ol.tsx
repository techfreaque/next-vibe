import { cn } from "next-vibe/core/utils/utils";
import type { StyleType } from "next-vibe/ui/web/utils/style-type";
import * as React from "react";

export interface OlMouseEvent {
  preventDefault?: () => void;
  stopPropagation?: () => void;
}

export type OlProps = {
  children?: React.ReactNode;
  id?: string;
  role?: string;
  start?: number;
  reversed?: boolean;
  type?: "1" | "a" | "A" | "i" | "I";
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  onClick?: (event: OlMouseEvent) => void;
  onMouseEnter?: (event: OlMouseEvent) => void;
  onMouseLeave?: (event: OlMouseEvent) => void;
} & StyleType;

function Ol({ className, children, ...props }: OlProps): React.JSX.Element {
  return (
    <ol className={cn(className)} {...props}>
      {children}
    </ol>
  );
}

export { Ol };
