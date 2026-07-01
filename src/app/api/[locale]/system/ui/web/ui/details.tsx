import type { StyleType } from "next-vibe/ui/web/utils/style-type";
import type { JSX, ReactNode } from "react";

export type DetailsProps = {
  children?: ReactNode;
  id?: string;
  open?: boolean;
} & StyleType;

export function Details({
  className,
  style,
  children,
  id,
  open,
}: DetailsProps): JSX.Element {
  return (
    <details className={className} style={style} id={id} open={open}>
      {children}
    </details>
  );
}
