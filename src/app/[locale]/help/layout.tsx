"use client";

import { PageLayout } from "next-vibe-ui/ui/page-layout";
import type { JSX, ReactNode } from "react";

export interface HelpLayoutData {
  children?: ReactNode;
}

export async function tanstackLoader(): Promise<
  Omit<HelpLayoutData, "children">
> {
  return {};
}

export function TanstackPage({ children }: HelpLayoutData): JSX.Element {
  return <PageLayout scrollable={true}>{children}</PageLayout>;
}

export default function HelpLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return <TanstackPage>{children}</TanstackPage>;
}
