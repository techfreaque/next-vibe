import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

import type { StyleType } from "../utils/style-type";

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
