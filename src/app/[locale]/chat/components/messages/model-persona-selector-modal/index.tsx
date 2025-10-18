"use client";

import { Send, X } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import React from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";
import { Button, Textarea } from "@/packages/next-vibe-ui/web/ui";

import type { ModelId } from "../../../lib/config/models";
import { ModelSelector } from "../../input/model-selector";
import { PersonaSelector } from "../../input/persona-selector";

interface ModelPersonaSelectorModalProps {
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  selectedModel: ModelId;
  selectedTone: string;
  onModelChange: (model: ModelId) => void;
  onToneChange: (tone: string) => void;
  onConfirm: () => void;
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
  selectedModel,
  selectedTone,
  onModelChange,
  onToneChange,
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
  const { t } = simpleT(locale);
  const title = t(titleKey);
  const description = t(descriptionKey);
  const finalConfirmLabel = confirmLabelKey
    ? t(confirmLabelKey)
    : t("app.chat.common.send");
  const inputPlaceholder = inputPlaceholderKey
    ? t(inputPlaceholderKey)
    : t("app.chat.common.send");

  return (
    <div className="w-full max-h-[80dvh] overflow-y-auto">
      <div
        className={cn(
          "p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "border border-border rounded-lg shadow-lg",
          "w-full",
        )}
      >
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-1">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>

        {/* Input field (for Answer as AI) */}
        {showInput && (
          <div className="mb-4">
            <Textarea
              value={inputValue}
              onChange={(e) => onInputChange?.(e.target.value)}
              placeholder={inputPlaceholder}
              rows={3}
              className="w-full min-h-[80px]"
              autoFocus
            />
          </div>
        )}

        {/* Selectors */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <ModelSelector
              value={selectedModel}
              onChange={onModelChange}
              locale={locale}
              logger={logger}
            />
            <PersonaSelector
              value={selectedTone}
              onChange={onToneChange}
              locale={locale}
              logger={logger}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 justify-end">
          <Button
            onClick={onCancel}
            disabled={isLoading}
            size="sm"
            variant="ghost"
            className="h-10 min-h-[44px]"
          >
            <X className="h-4 w-4 mr-2" />
            {t("app.chat.common.cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading || (showInput && !inputValue.trim())}
            size="sm"
            variant="default"
            className="h-10 min-h-[44px]"
          >
            <Send className="h-4 w-4 mr-2" />
            {isLoading ? t("app.chat.common.sending") : finalConfirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
