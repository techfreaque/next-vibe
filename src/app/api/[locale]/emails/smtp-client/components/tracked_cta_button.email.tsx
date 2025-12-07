/**
 * Tracked CTA Button Components
 * CTA buttons with built-in tracking functionality
 */

import type { JSX } from "react";

import { TrackedLink } from "./tracked_link.email";
import type { TrackingContext } from "./tracking_context.email";

/**
 * Button style constants
 */
const BUTTON_STYLES = {
  primary: {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    border: "1px solid #3b82f6",
  },
  secondary: {
    backgroundColor: "transparent",
    color: "#3b82f6",
    border: "1px solid #3b82f6",
  },
};

/**
 * CTA Button with built-in tracking
 */
interface TrackedCTAButtonProps {
  href: string;
  text: string;
  tracking: TrackingContext;
  backgroundColor?: string;
  textColor?: string;
  size?: "small" | "medium" | "large";
}

export function TrackedCTAButton({
  href,
  text,
  tracking,
  backgroundColor = "#3b82f6",
  textColor = "#ffffff",
  size = "medium",
}: TrackedCTAButtonProps): JSX.Element {
  const sizeStyles = {
    small: { padding: "12px 24px", fontSize: "14px" },
    medium: { padding: "16px 32px", fontSize: "16px" },
    large: { padding: "20px 40px", fontSize: "18px" },
  };

  return (
    <div style={{ textAlign: "center", margin: "32px 0" }}>
      <TrackedLink
        href={href}
        tracking={tracking}
        style={{
          backgroundColor,
          color: textColor,
          ...sizeStyles[size],
          textDecoration: "none",
          borderRadius: "8px",
          fontWeight: "600",
          display: "inline-block",
          boxShadow: "0 4px 14px rgba(59, 130, 246, 0.3)",
        }}
      >
        {text}
      </TrackedLink>
    </div>
  );
}

/**
 * Human-style CTA Button with built-in tracking
 */
interface TrackedHumanCTAButtonProps {
  href: string;
  text: string;
  tracking: TrackingContext;
  style?: "primary" | "secondary";
}

export function TrackedHumanCTAButton({
  href,
  text,
  tracking,
  style = "primary",
}: TrackedHumanCTAButtonProps): JSX.Element {
  return (
    <div style={{ textAlign: "center", margin: "24px 0" }}>
      <TrackedLink
        href={href}
        tracking={tracking}
        style={{
          ...BUTTON_STYLES[style],
          padding: "12px 24px",
          textDecoration: "none",
          borderRadius: "6px",
          fontWeight: "500",
          display: "inline-block",
          fontSize: "16px",
        }}
      >
        {text}
      </TrackedLink>
    </div>
  );
}
