"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Brain } from "next-vibe-ui/ui/icons/Brain";
import { Span } from "next-vibe-ui/ui/span";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";

import { scopedTranslation } from "@/app/api/[locale]/agent/cortex/i18n";
import type { CountryLanguage } from "@/i18n/core/config";

import { useCortexModalStore } from "./store";

interface CortexButtonProps {
  disabled?: boolean;
  locale: CountryLanguage;
  className?: string;
}

/**
 * Cortex Button
 * Opens the cortex browser modal from the chat input bar.
 */
export function CortexButton({
  disabled = false,
  locale,
  className,
}: CortexButtonProps): JSX.Element {
  const openCortexModal = useCortexModalStore((state) => state.open);
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Button
      type="button"
      onClick={openCortexModal}
      disabled={disabled}
      variant="outline"
      size="sm"
      className={cn(
        "relative inline-flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 h-8 sm:h-9 px-1.5 sm:px-2 md:px-3",
        className,
      )}
      title={t("button.title")}
    >
      <Brain className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
      <Span className="hidden @2xl:inline text-xs">{t("button.label")}</Span>
    </Button>
  );
}
