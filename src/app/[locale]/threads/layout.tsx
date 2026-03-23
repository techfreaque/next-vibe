"use client";

import { PageLayout } from "next-vibe-ui/ui/page-layout";
import type { JSX, ReactNode } from "react";

export interface ThreadsLayoutData {
  children?: ReactNode;
}

export async function tanstackLoader(): Promise<
  Omit<ThreadsLayoutData, "children">
> {
  return {};
}

export function TanstackPage({ children }: ThreadsLayoutData): JSX.Element {
  return <PageLayout scrollable={false}>{children}</PageLayout>;
}

export default function ThreadsLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return <TanstackPage>{children}</TanstackPage>;
}
