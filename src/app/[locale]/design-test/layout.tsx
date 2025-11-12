"use client";

import { PageLayout } from "next-vibe-ui/ui/page-layout";
import type { JSX, ReactNode } from "react";

export default function ThreadsLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return <PageLayout scrollable={true}>{children}</PageLayout>;
}
