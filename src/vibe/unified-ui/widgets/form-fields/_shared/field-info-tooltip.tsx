"use client";

import { Button } from "next-vibe/ui/components/button";
import { Info } from "next-vibe/ui/components/icons/Info";
import { Span } from "next-vibe/ui/components/span";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe/ui/components/tooltip";
import type { JSX } from "react";

import { descriptionAddsInfo } from "./description-info";

/**
 * Info icon that sits inline on a field's label row (16px, no button
 * padding), with the full description in a tooltip.
 */
export function FieldInfoTooltip({
  text,
  label,
}: {
  text: string;
  label?: string;
}): JSX.Element | null {
  if (!descriptionAddsInfo(text, label)) {
    return null;
  }
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="unset"
            aria-label={text}
            className="inline-flex h-4 w-4 shrink-0 cursor-help items-center justify-center rounded-full p-0 align-middle text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            <Info className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[260px]">
          <Span className="text-sm">{text}</Span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
