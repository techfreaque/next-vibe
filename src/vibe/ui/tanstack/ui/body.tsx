/* eslint-disable oxlint-plugin-jsx-capitalization/jsx-capitalization -- platform-agnostic HTML wrapper */
import type { JSX, ReactNode } from "react";

import type { StyleType } from "../../web/utils/style-type";

export type BodyProps = {
  children: ReactNode;
} & StyleType;

/**
 * Platform-agnostic Body wrapper component (TanStack Start implementation)
 */
export function Body({ children, className, style }: BodyProps): JSX.Element {
  return (
    <body className={className} style={style}>
      {children}
    </body>
  );
}
