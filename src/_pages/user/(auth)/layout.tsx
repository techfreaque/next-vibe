import { PageLayout } from "next-vibe/ui/components/page-layout";
import type { JSX, ReactNode } from "react";

import { AuthShell } from "../_components/auth-shell";

export interface AuthLayoutData {
  children?: ReactNode;
}

export async function tanstackLoader(): Promise<
  Omit<AuthLayoutData, "children">
> {
  return {};
}

export function TanstackPage({ children }: AuthLayoutData): JSX.Element {
  return (
    <PageLayout scrollable={true}>
      <AuthShell>{children}</AuthShell>
    </PageLayout>
  );
}

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return <TanstackPage>{children}</TanstackPage>;
}
