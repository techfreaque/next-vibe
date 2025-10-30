/**
 * Human-style Text Component
 * Text component with natural spacing for human-like emails
 */

import { Text } from "@react-email/components";
import type React from "react";
import type { ReactNode } from "react";

/**
 * Human Text Component Props
 */
interface HumanTextProps {
  children: ReactNode;
  variant?: TextStyle;
}

const TEXT_STYLES = {
  greeting: {
    fontSize: "16px",
    color: "#111827",
    margin: "0 0 20px 0",
    fontWeight: "normal",
  },
  body: {
    fontSize: "16px",
    color: "#374151",
    margin: "0 0 16px 0",
    lineHeight: "1.6",
  },
  signature: {
    fontSize: "16px",
    color: "#111827",
    margin: "20px 0 0 0",
    fontWeight: "normal",
  },
  ps: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "20px 0 0 0",
    fontStyle: "italic",
  },
};

export type TextStyle = keyof typeof TEXT_STYLES;

/**
 * Human-style text component with natural spacing
 */
export function HumanText({
  children,
  variant = "body",
}: HumanTextProps): React.JSX.Element {
  return <Text style={TEXT_STYLES[variant]}>{children}</Text>;
}
