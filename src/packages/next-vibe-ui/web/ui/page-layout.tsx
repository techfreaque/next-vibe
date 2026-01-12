import type { ReactNode } from "react";

import type { StyleType } from "../utils/style-type";

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
