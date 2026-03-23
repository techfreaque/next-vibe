/**
 * Vibe Sense - Crossover Evaluator Widget
 * No params - just a description label in the node inspector.
 */

"use client";

import type { JSX } from "react";

import { P } from "next-vibe-ui/ui/typography";

interface Props {
  description?: string;
}

export function CrossoverWidget({ description }: Props): JSX.Element {
  return <P className="text-sm text-muted-foreground">{description}</P>;
}
