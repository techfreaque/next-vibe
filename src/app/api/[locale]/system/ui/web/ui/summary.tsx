import type { StyleType } from "next-vibe/ui/web/utils/style-type";
import type { JSX, ReactNode } from "react";

export type SummaryProps = {
  children?: ReactNode;
  id?: string;
} & StyleType;

export function Summary({
  className,
  style,
  children,
  id,
}: SummaryProps): JSX.Element {
  return (
    <summary className={className} style={style} id={id}>
      {children}
    </summary>
  );
}
