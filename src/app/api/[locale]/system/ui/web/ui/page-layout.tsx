import type { StyleType } from "next-vibe/ui/web/utils/style-type";
import type { ReactNode } from "react";

export type PageLayoutProps = {
  children: ReactNode;
  scrollable?: boolean;
} & StyleType;

/**
 * Web: Simple div wrapper (no safe area needed)
 * Native: SafeAreaView with optional scrolling
 */
export function PageLayout({
  children,
  className,
  style,
}: PageLayoutProps): React.JSX.Element {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

PageLayout.displayName = "PageLayout";
