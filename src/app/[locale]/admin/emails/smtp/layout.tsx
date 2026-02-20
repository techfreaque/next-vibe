/**
 * SMTP Admin Layout
 * Passthrough — unified email sidebar is provided by the parent emails layout
 */

import type { JSX, ReactNode } from "react";

interface SmtpAdminLayoutProps {
  children: ReactNode;
}

export default function SmtpAdminLayout({
  children,
}: SmtpAdminLayoutProps): JSX.Element {
  return <>{children}</>;
}
