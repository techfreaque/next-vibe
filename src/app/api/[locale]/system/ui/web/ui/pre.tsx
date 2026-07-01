import type { StyleType } from "next-vibe/ui/web/utils/style-type";
import type { JSX, ReactNode } from "react";

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
