"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Send } from "next-vibe-ui/ui/icons/Send";
import { X } from "next-vibe-ui/ui/icons/X";
import { Textarea } from "next-vibe-ui/ui/textarea";
import { H3 } from "next-vibe-ui/ui/typography";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useState } from "react";

import { Selector } from "@/app/api/[locale]/agent/ai-stream/stream/widget/selector";
import { useChatSettings } from "@/app/api/[locale]/agent/chat/settings/hooks";
import { ChatSettingsRepositoryClient } from "@/app/api/[locale]/agent/chat/settings/repository-client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { MessagesTranslationKey } from "../i18n";
import { scopedTranslation } from "../i18n";

interface ModelCharacterSelectorModalProps {
  titleKey: MessagesTranslationKey;
  descriptionKey: MessagesTranslationKey;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  confirmLabelKey?: MessagesTranslationKey;
  isLoading?: boolean;
  showInput?: boolean;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  inputPlaceholderKey?: MessagesTranslationKey;
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
}

export function ModelCharacterSelectorModal({
  titleKey,
  descriptionKey,
  onConfirm,
  onCancel,
  confirmLabelKey,
  isLoading = false,
  showInput = false,
  inputValue = "",
  onInputChange,
  inputPlaceholderKey,
  locale,
  logger,
  user,
}: ModelCharacterSelectorModalProps): JSX.Element {
  // Get settings directly (no context dependency for model/character)
  const { settings } = useChatSettings(user, logger);
  const defaults = ChatSettingsRepositoryClient.getDefaults();
  const selectedModel = settings?.selectedModel ?? defaults.selectedModel;
  const selectedCharacter =
    settings?.selectedCharacter ?? defaults.selectedCharacter;

  const { t } = scopedTranslation.scopedT(locale);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const title = t(titleKey);
  const description = t(descriptionKey);
  const finalConfirmLabel = confirmLabelKey
    ? t(confirmLabelKey)
    : t("widget.common.send");
  const inputPlaceholder = inputPlaceholderKey
    ? t(inputPlaceholderKey)
    : t("widget.common.send");

  const handleConfirm = async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isLoading || isSubmitting;

  return (
    <Div className="w-full max-h-[min(800px,calc(100dvh-180px))] overflow-y-auto relative z-10">
      <Div
        className={cn(
          "p-4 bg-background",
          "border border-border rounded-lg shadow-lg",
          "w-full",
        )}
      >
        {/* Header */}
        <Div className="mb-4">
          <H3 className="text-sm font-medium mb-1">{title}</H3>
          <P className="text-xs text-muted-foreground">{description}</P>
        </Div>

        {/* Input field (for Answer as AI) */}
        {showInput && (
          <Div className="mb-4">
            <Textarea
              value={inputValue}
              onChange={(e) => onInputChange?.(e.target.value)}
              placeholder={inputPlaceholder}
              rows={3}
              className="w-full min-h-[80px]"
            />
          </Div>
        )}

        {/* Selectors & Actions - ALL IN ONE LINE */}
        <Div className="flex flex-row items-center gap-1 sm:gap-1.5 md:gap-2 flex-nowrap">
          {/* Left side: Combined Character + Model Selector */}
          <Div className="flex flex-row items-center gap-0.5 sm:gap-1 md:gap-1.5 flex-1 min-w-0">
            <Selector
              characterId={selectedCharacter}
              modelId={selectedModel}
              locale={locale}
              buttonClassName="px-1.5 sm:px-2 md:px-3 min-h-8 h-8 sm:min-h-9 sm:h-9"
              open={selectorOpen}
              onOpenChange={setSelectorOpen}
            />
          </Div>

          {/* Right side: Cancel & Confirm Buttons */}
          <Div className="flex flex-row items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
            <Button
              onClick={onCancel}
              disabled={isDisabled}
              size="icon"
              variant="destructive"
              className="h-8 w-8 sm:h-9 sm:w-9 shrink-0"
              title={t("widget.common.cancel")}
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isDisabled}
              size="icon"
              variant="default"
              className="h-8 w-8 sm:h-9 sm:w-9 shrink-0"
              title={
                isDisabled ? t("widget.common.sending") : finalConfirmLabel
              }
            >
              <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
