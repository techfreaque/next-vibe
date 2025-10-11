"use client";

import { MessageSquare } from "lucide-react";
import { Button } from "next-vibe-ui/ui/button";
import { Label } from "next-vibe-ui/ui/label";
import { Textarea } from "next-vibe-ui/ui/textarea";
import type { JSX } from "react";
import { useState } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ConsultationMessageInputProps {
  message: string;
  onMessageChange: (message: string) => void;
  disabled?: boolean;
  locale: CountryLanguage;
}

export function ConsultationMessageInput({
  message,
  onMessageChange,
  disabled = false,
  locale,
}: ConsultationMessageInputProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = simpleT(locale);

  // Get default message based on current translations
  const getDefaultMessage = (): string => {
    const businessType = t(
      "consultations.admin.messageInput.defaultBusinessType",
    );
    const challenges = t("consultations.admin.messageInput.defaultChallenges");
    const goals = t("consultations.admin.messageInput.defaultGoals");

    return [businessType, challenges, goals].join("\n\n");
  };

  const handleResetToDefault = (): void => {
    onMessageChange(getDefaultMessage());
  };

  const isDefaultMessage = message === getDefaultMessage();

  return (
    <div className="space-y-4">
      {/* Header with toggle button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <Label className="text-base font-medium">
            {t("consultations.admin.messageInput.title")}
          </Label>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={disabled}
          className="text-sm"
        >
          {isExpanded
            ? t("consultations.admin.messageInput.collapse")
            : t("consultations.admin.messageInput.customize")}
        </Button>
      </div>

      {/* Collapsed view - show preview */}
      {!isExpanded && (
        <div className="bg-muted/50 rounded-lg p-4 border border-dashed">
          <p className="text-sm text-muted-foreground mb-2">
            {t("consultations.admin.messageInput.messagePreview")}
          </p>
          <p className="text-sm line-clamp-3 whitespace-pre-wrap">
            {message || getDefaultMessage()}
          </p>
        </div>
      )}

      {/* Expanded view - show full editor */}
      {isExpanded && (
        <div className="space-y-3">
          <div className="space-y-2">
            <Textarea
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder={t("consultations.admin.messageInput.placeholder")}
              disabled={disabled}
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {t("consultations.admin.messageInput.helpText")}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {!isDefaultMessage && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetToDefault}
                disabled={disabled}
                className="text-xs"
              >
                {t("consultations.admin.messageInput.resetToDefault")}
              </Button>
            )}
            <div className="text-xs text-muted-foreground flex items-center">
              {message.length} characters
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
