import * as React from "react";

export type { SidebarLayoutProps } from "../../web/ui/sidebar";

import type { SidebarLayoutProps } from "../../web/ui/sidebar";

export function SidebarLayout({
  children,
}: SidebarLayoutProps): React.JSX.Element | null {
  return <>{children}</>;
}
