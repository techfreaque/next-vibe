import type { JSX, ReactNode } from "react";

import type { StyleType } from "../utils/style-type";

export type FooterProps = {
  children?: ReactNode;
} & StyleType;

export function Footer({
  children,
  className,
  style,
}: FooterProps): JSX.Element {
  return (
    <footer className={className} style={style}>
      {children}
    </footer>
  );
}
