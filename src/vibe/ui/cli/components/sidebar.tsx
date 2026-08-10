import * as React from "react";

export type { SidebarLayoutProps } from "../../web/components/sidebar";

import type { SidebarLayoutProps } from "../../web/components/sidebar";

export function SidebarLayout({
  children,
}: SidebarLayoutProps): React.JSX.Element | null {
  return <>{children}</>;
}
