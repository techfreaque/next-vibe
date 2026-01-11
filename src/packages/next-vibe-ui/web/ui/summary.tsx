import type { JSX, ReactNode } from "react";

import type { StyleType } from "../utils/style-type";

export type SummaryProps = {
  children?: ReactNode;
  id?: string;
} & StyleType;

export function Summary({ className, style, children, id }: SummaryProps): JSX.Element {
  return (
    <summary className={className} style={style} id={id}>
      {children}
    </summary>
  );
}
