// Web implementation - simple passthrough
import type { ReactNode } from "react";

export interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  scrollable?: boolean;
}

/**
 * PageLayout - Cross-platform page wrapper
 * Web: Simple div wrapper (no safe area needed)
 * Native: SafeAreaView with optional scrolling
 */
export function PageLayout({
  children,
  className,
}: PageLayoutProps): React.JSX.Element {
  return <div className={className}>{children}</div>;
}

PageLayout.displayName = "PageLayout";
