import * as React from "react";

export type { PageLayoutProps } from "../../web/ui/page-layout";

import type { PageLayoutProps } from "../../web/ui/page-layout";

export function PageLayout({
  children,
}: PageLayoutProps): React.JSX.Element | null {
  return <>{children}</>;
}
