import type { JSX, ReactNode } from "react";

import type { StyleType } from "../utils/style-type";

export type DetailsProps = {
  children?: ReactNode;
  id?: string;
  open?: boolean;
} & StyleType;

export function Details({ className, style, children, id, open }: DetailsProps): JSX.Element {
  return (
    <details className={className} style={style} id={id} open={open}>
      {children}
    </details>
  );
}
