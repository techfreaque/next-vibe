import * as React from "react";
import type { ReactNode } from "react";
import type { StyleType } from "../utils/style-type";

export type KeyboardAvoidingViewProps = {
  children?: ReactNode;
  behavior?: "height" | "position" | "padding";
  keyboardVerticalOffset?: number;
} & StyleType;

/**
 * On web, keyboard handling is automatic, so this is just a passthrough div
 */
export function KeyboardAvoidingView({
  children,
  className,
  style,
}: KeyboardAvoidingViewProps): React.JSX.Element {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
