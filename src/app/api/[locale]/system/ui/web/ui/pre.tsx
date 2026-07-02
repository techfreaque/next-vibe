import type { JSX, ReactNode } from "react";

import type { StyleType } from "../../web/utils/style-type";

export type PreProps = {
  children?: ReactNode;
  id?: string;
} & StyleType;

export function Pre({ className, style, children, id }: PreProps): JSX.Element {
  return (
    <pre className={className} style={style} id={id}>
      {children}
    </pre>
  );
}
