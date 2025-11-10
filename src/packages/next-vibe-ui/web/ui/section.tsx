import type { ReactNode } from "react";

// Cross-platform props interface
// Includes all standard HTML section props for web (style, etc.)
export interface SectionProps {
  children?: ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

/**
 * Platform-agnostic Section component for web
 * On web, this is a section element
 * Provides semantic HTML5 section element with platform consistency
 */
export function Section(props: SectionProps): React.JSX.Element {
  return <section {...props} />;
}
