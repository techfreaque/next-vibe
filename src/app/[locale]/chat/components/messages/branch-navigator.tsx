"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import { ChevronLeft, ChevronRight, GitBranch } from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import React from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface BranchNavigatorProps {
  currentBranchIndex: number;
  totalBranches: number;
  branches: Array<{ id: string; preview: string }>;
  onSwitchBranch: (index: number) => void;
  locale: CountryLanguage;
  className?: string;
}

export function BranchNavigator({
  currentBranchIndex,
  totalBranches,
  branches,
  onSwitchBranch,
  locale,
  className,
}: BranchNavigatorProps): JSX.Element {
  const { t } = simpleT(locale);

  if (totalBranches <= 1) {
    return <></>;
  }

  const handlePrevious = (): void => {
    const newIndex =
      currentBranchIndex > 0 ? currentBranchIndex - 1 : totalBranches - 1;
    onSwitchBranch(newIndex);
  };

  const handleNext = (): void => {
    const newIndex =
      currentBranchIndex < totalBranches - 1 ? currentBranchIndex + 1 : 0;
    onSwitchBranch(newIndex);
  };
  return (
    <Div
      className={cn(
        "flex items-center gap-2 px-3 py-2 bg-accent/30 border border-border/40 rounded-lg relative",
        className,
      )}
    >
      <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />

      <Div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          className="h-6 w-6"
          title={t("app.chat.messages.branch.previous")}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>

        <Div className="flex items-center gap-1 px-2">
          <Span className="text-xs font-medium">
            {currentBranchIndex + 1} / {totalBranches}
          </Span>
        </Div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          className="h-6 w-6"
          title={t("app.chat.messages.branch.next")}
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </Div>

      {branches[currentBranchIndex] && (
        <Div className="flex-1 min-w-0 text-xs text-muted-foreground truncate">
          {branches[currentBranchIndex].preview}
        </Div>
      )}
    </Div>
  );
}
