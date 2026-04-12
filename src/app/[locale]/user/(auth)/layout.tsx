import { PageLayout } from "next-vibe-ui/ui/page-layout";
import type { JSX, ReactNode } from "react";

export interface AuthLayoutData {
  children?: ReactNode;
}

export async function tanstackLoader(): Promise<
  Omit<AuthLayoutData, "children">
> {
  return {};
}

export function TanstackPage({ children }: AuthLayoutData): JSX.Element {
  return <PageLayout scrollable={true}>{children}</PageLayout>;
}

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return <TanstackPage>{children}</TanstackPage>;
}
