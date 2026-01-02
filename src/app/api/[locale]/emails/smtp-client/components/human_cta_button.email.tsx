/**
 * Human-style CTA Button Component
 * More subtle, text-based CTA that looks like a natural part of the email
 */

import type React from "react";

import { TrackedLink } from "./tracked_link.email";
import type { TrackingContext } from "./tracking_context.email";

/**
 * Human CTA Button Props
 */
interface HumanCTAButtonProps {
  href: string;
  text: string;
  variant?: ButtonStyle;
  tracking: TrackingContext;
}

const BUTTON_STYLE = {
  primary: {
    color: "#3b82f6",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "16px",
    padding: "12px 20px",
    border: `1px solid #3b82f6`,
    borderRadius: "6px",
    backgroundColor: "#f8fafc",
    display: "inline-block",
    margin: "8px 0",
  },
  secondary: {
    color: "#6b7280",
    textDecoration: "underline",
    fontWeight: "500",
    fontSize: "16px",
    padding: "8px 0",
    display: "inline-block",
    margin: "8px 0",
  },
};
export type ButtonStyle = keyof typeof BUTTON_STYLE;
/**
 * Human-style CTA Button Component
 * More subtle, text-based CTA that looks like a natural part of the email
 * Now with built-in tracking support
 */
export function HumanCTAButton({
  href,
  text,
  variant = "primary",
  tracking,
}: HumanCTAButtonProps): React.JSX.Element {
  return (
    <div style={{ textAlign: "left", margin: "20px 0" }}>
      <TrackedLink href={href} style={BUTTON_STYLE[variant]} tracking={tracking}>
        {text}
      </TrackedLink>
    </div>
  );
}
