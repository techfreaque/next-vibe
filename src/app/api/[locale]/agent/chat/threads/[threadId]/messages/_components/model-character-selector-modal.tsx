"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Send, X } from "next-vibe-ui/ui/icons";
import { Textarea } from "next-vibe-ui/ui/textarea";
import { H3 } from "next-vibe-ui/ui/typography";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import React, { useState } from "react";

import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import type { ModelId } from "@/app/api/[locale]/agent/chat/model-access/models";
import { Selector } from "@/app/api/[locale]/agent/chat/threads/_components/chat-input/selector";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

interface ModelCharacterSelectorModalProps {
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  onModelChange: (model: ModelId) => void;
  onCharacterChange: (character: string) => void;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  confirmLabelKey?: TranslationKey;
  isLoading?: boolean;
  showInput?: boolean;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  inputPlaceholderKey?: TranslationKey;
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
}

export function ModelCharacterSelectorModal({
  titleKey,
  descriptionKey,
  onModelChange,
  onCharacterChange,
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
  // Get selectedModel and selectedCharacter from context
  const { selectedModel, selectedCharacter } = useChatContext();

  const { t } = simpleT(locale);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const title = t(titleKey);
  const description = t(descriptionKey);
  const finalConfirmLabel = confirmLabelKey
    ? t(confirmLabelKey)
    : t("app.chat.common.send");
  const inputPlaceholder = inputPlaceholderKey
    ? t(inputPlaceholderKey)
    : t("app.chat.common.send");

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
    <Div className="w-full max-h-[80dvh] overflow-y-auto relative z-10">
      <Div
        className={cn(
          "p-4 bg-card backdrop-blur",
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
              onCharacterChange={onCharacterChange}
              onModelChange={onModelChange}
              locale={locale}
              logger={logger}
              buttonClassName="px-1.5 sm:px-2 md:px-3 min-h-8 h-8 sm:min-h-9 sm:h-9"
              user={user}
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
              title={t("app.chat.common.cancel")}
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
                isDisabled ? t("app.chat.common.sending") : finalConfirmLabel
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
