"use client";

import { Markdown } from "next-vibe/ui/web/ui/markdown";
import type { JSX } from "react";

interface FrameworkContentProps {
  content: string;
}

export function FrameworkContent({
  content,
}: FrameworkContentProps): JSX.Element {
  return <Markdown content={content} />;
}
