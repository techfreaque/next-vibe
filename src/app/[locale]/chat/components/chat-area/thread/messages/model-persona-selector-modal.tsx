"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { H3 } from "next-vibe-ui/ui/typography";
import { P } from "next-vibe-ui/ui/typography";
import { Textarea } from "next-vibe-ui/ui/textarea";
import { Send, X } from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import React, { useState } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

import { useChatContext } from "@/app/api/[locale]/v1/core/agent/chat/hooks/context";
import type { ModelId } from "@/app/api/[locale]/v1/core/agent/chat/model-access/models";
import { ModelSelector } from "../../chat-input/model-selector";
import { PersonaSelector } from "../../chat-input/persona-selector";

interface ModelPersonaSelectorModalProps {
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  onModelChange: (model: ModelId) => void;
  onPersonaChange: (persona: string) => void;
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
}

export function ModelPersonaSelectorModal({
  titleKey,
  descriptionKey,
  onModelChange,
  onPersonaChange,
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
}: ModelPersonaSelectorModalProps): JSX.Element {
  // Get selectedModel and selectedPersona from context
  const { selectedModel, selectedPersona } = useChatContext();

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
    <Div className="w-full max-h-[80dvh] overflow-y-auto">
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

        {/* Selectors */}
        <Div className="flex flex-col gap-3 mb-4">
          <Div className="flex items-center gap-2 flex-wrap">
            <ModelSelector
              value={selectedModel}
              onChange={onModelChange}
              locale={locale}
              logger={logger}
            />
            <PersonaSelector
              value={selectedPersona}
              onChange={onPersonaChange}
              locale={locale}
              logger={logger}
            />
          </Div>
        </Div>

        {/* Actions */}
        <Div className="flex items-center gap-2 justify-end">
          <Button
            onClick={onCancel}
            disabled={isDisabled}
            size="sm"
            variant="ghost"
            className="h-10 min-h-[44px]"
          >
            <X className="h-4 w-4 mr-2" />
            {t("app.chat.common.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isDisabled}
            size="sm"
            variant="default"
            className="h-10 min-h-[44px]"
          >
            <Send className="h-4 w-4 mr-2" />
            {isDisabled ? t("app.chat.common.sending") : finalConfirmLabel}
          </Button>
        </Div>
      </Div>
    </Div>
  );
}
