"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Form } from "next-vibe-ui/ui/form/form";
import { Textarea } from "next-vibe-ui/ui/textarea";
import { Send, Square } from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import React, { forwardRef } from "react";

import { getModelById } from "@/app/api/[locale]/v1/core/agent/chat/model-access/models";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLocaleString } from "@/i18n/core/localization-utils";
import { simpleT } from "@/i18n/core/shared";

import type { ModelId } from "../../types";
import { ModelSelector } from "./model-selector";
import { PersonaSelector } from "./persona-selector";
import { SearchToggle } from "./search-toggle";
import { SpeechInputButton } from "./speech-input-button";
import { ToolsButton } from "./tools-button";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  onStop: () => void;
  selectedPersona: string;
  selectedModel: ModelId;
  enabledToolIds: string[]; // All enabled tool IDs (search is treated as one of the tools)
  onPersonaChange: (persona: string) => void;
  onModelChange: (model: ModelId) => void;
  onToolsChange: (toolIds: string[]) => void;
  onOpenToolsModal: () => void;
  locale: CountryLanguage;
  logger: EndpointLogger;
  className?: string;
  canPost?: boolean; // Whether user has permission to post messages (computed server-side)
  noPermissionReason?: string; // Reason why user cannot post (for tooltip)
  deductCredits: (creditCost: number, feature: string) => void;
}

export const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
  (
    {
      value,
      onChange,
      onSubmit,
      onKeyDown,
      isLoading,
      onStop,
      selectedPersona,
      selectedModel,
      enabledToolIds,
      onPersonaChange,
      onModelChange,
      onToolsChange,
      onOpenToolsModal,
      locale,
      logger,
      className,
      canPost = true, // Default to true for backward compatibility
      noPermissionReason,
      deductCredits,
    },
    ref,
  ): JSX.Element => {
    const { t } = simpleT(locale);
    const speechLang = getLocaleString(locale);

    // Check if current model supports tools (for search toggle visibility)
    const currentModel = getModelById(selectedModel);
    const modelSupportsTools = currentModel?.supportsTools ?? false;

    // Calculate active tool count (search is treated as one of the tools)
    const activeToolCount = enabledToolIds.length;

    // Determine if input should be disabled
    const isInputDisabled = isLoading || !canPost;

    return (
      <Form
        onSubmit={onSubmit}
        className={cn(
          "p-3 sm:p-4 bg-card/80 backdrop-blur",
          "border border-border rounded-t-lg",
          className,
        )}
      >
        {/* Input Area */}
        <Div className="relative mb-3">
          <Textarea
            ref={ref}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            onKeyDown={onKeyDown}
            disabled={isInputDisabled}
            // Placeholder is handled below
            placeholder={""}
            className="px-0 text-base"
            variant={"ghost"}
            rows={2}
            title={!canPost ? noPermissionReason : undefined}
          />

          {/* Hint Text - Shows when textarea is empty - Hidden on mobile */}
          {!value && canPost && (
            <Div className="absolute top-2 left-0 pointer-events-none text-sm text-muted-foreground hidden sm:block">
              {t("app.chat.input.keyboardShortcuts.press")}{" "}
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                {t("app.chat.input.keyboardShortcuts.enter")}
              </kbd>{" "}
              {t("app.chat.input.keyboardShortcuts.toSend")},{" "}
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                {t("app.chat.input.keyboardShortcuts.shiftEnter")}
              </kbd>{" "}
              {t("app.chat.input.keyboardShortcuts.forNewLine")}
            </Div>
          )}

          {/* No Permission Message - Shows when user cannot post */}
          {!canPost && (
            <Div className="absolute top-2 left-0 pointer-events-none text-sm text-destructive">
              {noPermissionReason || t("app.chat.input.noPermission")}
            </Div>
          )}
        </Div>

        {/* Controls */}
        <Div className="flex items-center gap-2 justify-between flex-wrap sm:flex-nowrap">
          <Div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Model Selector */}
            <ModelSelector
              value={selectedModel}
              onChange={onModelChange}
              locale={locale}
              logger={logger}
            />

            {/* Persona Selector */}
            <PersonaSelector
              value={selectedPersona}
              onChange={onPersonaChange}
              onModelChange={onModelChange}
              locale={locale}
              logger={logger}
            />

            {/* Search Toggle and Tools - Only show if model supports tools */}
            {modelSupportsTools && (
              <>
                <SearchToggle
                  enabledToolIds={enabledToolIds}
                  onToolsChange={onToolsChange}
                  disabled={isLoading}
                  locale={locale}
                />
                <ToolsButton
                  activeToolCount={activeToolCount}
                  onOpenToolsModal={onOpenToolsModal}
                  disabled={isLoading}
                  locale={locale}
                />
              </>
            )}
          </Div>

          <Div className="flex items-center gap-2">
            {/* Speech Input Button */}
            <SpeechInputButton
              onTranscript={(text) => {
                // Append transcript to existing value
                const newValue = value ? `${value} ${text}`.trim() : text;
                onChange(newValue);
              }}
              disabled={isInputDisabled}
              lang={speechLang}
              locale={locale}
              logger={logger}
              deductCredits={deductCredits}
            />

            {/* Send/Stop Button */}
            {isLoading ? (
              <Button
                type="button"
                size="icon"
                onClick={onStop}
                className="h-9 w-9 shrink-0"
                variant="destructive"
                title={t("app.chat.actions.stopGeneration")}
              >
                <Square className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                disabled={!value.trim() || isInputDisabled}
                className="h-9 w-9 shrink-0"
                title={
                  !canPost
                    ? noPermissionReason || t("app.chat.input.noPermission")
                    : t("app.chat.actions.sendMessage")
                }
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </Div>
        </Div>
      </Form>
    );
  },
);

ChatInput.displayName = "ChatInput";
