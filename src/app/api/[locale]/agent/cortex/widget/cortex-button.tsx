"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Brain } from "next-vibe-ui/ui/icons/Brain";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "next-vibe-ui/ui/popover";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { scopedTranslation } from "@/app/api/[locale]/agent/cortex/i18n";
import type { CountryLanguage } from "@/i18n/core/config";

import { useCortexModalStore } from "./store";

interface CortexButtonProps {
  disabled?: boolean;
  locale: CountryLanguage;
  className?: string;
  folderId?: string | null;
}

const CORTEX_ALLOWED_FOLDERS = new Set<string>([
  DefaultFolderId.PRIVATE,
  DefaultFolderId.SHARED,
  DefaultFolderId.BACKGROUND,
]);

/**
 * Cortex Button
 * Opens the cortex browser modal from the chat input bar.
 * Shows an explanatory popover for incognito, public, and unauthenticated contexts.
 */
export function CortexButton({
  disabled = false,
  locale,
  className,
  folderId,
}: CortexButtonProps): JSX.Element {
  const openCortexModal = useCortexModalStore((state) => state.open);
  const { t } = scopedTranslation.scopedT(locale);

  const cortexUnavailable =
    folderId !== null &&
    folderId !== undefined &&
    !CORTEX_ALLOWED_FOLDERS.has(folderId);

  const button = (
    <Button
      type="button"
      onClick={cortexUnavailable ? undefined : openCortexModal}
      disabled={disabled && !cortexUnavailable}
      variant="outline"
      size="sm"
      className={cn(
        "relative inline-flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 h-8 sm:h-9 px-1.5 sm:px-2 md:px-3",
        cortexUnavailable && "opacity-50 cursor-not-allowed",
        className,
      )}
      title={cortexUnavailable ? undefined : t("button.title")}
    >
      <Brain className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
      <Span className="hidden @2xl:inline text-xs">{t("button.label")}</Span>
    </Button>
  );

  if (!cortexUnavailable) {
    return button;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{button}</PopoverTrigger>
      <PopoverContent className="w-72 text-sm">
        <P className="font-semibold mb-1">{t("button.unavailableTitle")}</P>
        <P className="text-muted-foreground">
          {t("button.unavailableDescription")}
        </P>
      </PopoverContent>
    </Popover>
  );
}
