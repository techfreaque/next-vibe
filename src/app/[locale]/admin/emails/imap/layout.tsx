/**
 * IMAP Admin Layout
 * Passthrough — unified email sidebar is provided by the parent emails layout
 */

import type { JSX, ReactNode } from "react";

interface ImapAdminLayoutProps {
  children: ReactNode;
}

export default function ImapAdminLayout({
  children,
}: ImapAdminLayoutProps): JSX.Element {
  return <>{children}</>;
}
