"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Form } from "next-vibe-ui/ui/form/form";
import { Kbd } from "next-vibe-ui/ui/kbd";
import { Textarea } from "next-vibe-ui/ui/textarea";
import { Send, Square } from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import React from "react";

import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { useChatPermissions } from "@/app/api/[locale]/agent/chat/hooks/use-chat-permissions";
import { getModelById } from "@/app/api/[locale]/agent/chat/model-access/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLocaleString } from "@/i18n/core/localization-utils";
import { simpleT } from "@/i18n/core/shared";

import { ModelSelector } from "./model-selector";
import { PersonaSelector } from "@/app/api/[locale]/agent/chat/personas/_components/persona-selector";
import { SearchToggle } from "./search-toggle";
import { SpeechInputButton } from "./speech-input-button";
import { ToolsButton } from "./tools-button";

interface ChatInputV2Props {
  locale: CountryLanguage;
  logger: EndpointLogger;
  className?: string;
}

export function ChatInput({
  locale,
  logger,
  className,
}: ChatInputV2Props): JSX.Element {
  const chat = useChatContext();
  const {
    input: value,
    setInput: onChange,
    handleSubmit: onSubmit,
    handleKeyDown: onKeyDown,
    isLoading,
    stopGeneration: onStop,
    inputRef,
    selectedPersona,
    selectedModel,
    handleModelChange: onModelChange,
    setSelectedPersona: onPersonaChange,
  } = chat;

  // Check permissions
  const { canPost, noPermissionReason } = useChatPermissions(chat, locale);

  const { t } = simpleT(locale);
  const speechLang = getLocaleString(locale);

  // Check if current model supports tools (for search toggle visibility)
  const currentModel = getModelById(selectedModel);
  const modelSupportsTools = currentModel?.supportsTools ?? false;

  // Determine if input should be disabled
  const isInputDisabled = isLoading || !canPost;

  return (
    <Form
      onSubmit={onSubmit}
      className={cn(
        "p-2 sm:p-3 md:p-4 bg-blue-200/70 dark:bg-blue-950/70 backdrop-blur",
        "border border-border rounded-t-lg",
        className,
      )}
    >
      {/* Input Area */}
      <Div className="relative mb-2 sm:mb-3">
        <Textarea
          ref={inputRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          onKeyDown={onKeyDown}
          disabled={isInputDisabled}
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
            <Kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
              {t("app.chat.input.keyboardShortcuts.enter")}
            </Kbd>{" "}
            {t("app.chat.input.keyboardShortcuts.toSend")},{" "}
            <Kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
              {t("app.chat.input.keyboardShortcuts.shiftEnter")}
            </Kbd>{" "}
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

      {/* Controls - ALL IN ONE LINE */}
      <Div className="flex flex-row items-center gap-1 sm:gap-1.5 md:gap-2 flex-nowrap">
        {/* Left side: Model & Persona Selectors */}
        <Div className="flex flex-row items-center gap-0.5 sm:gap-1 md:gap-1.5 flex-1 min-w-0">
          {/* Model Selector - text hidden last (on smallest screens) */}
          <ModelSelector
            value={selectedModel}
            onChange={onModelChange}
            locale={locale}
            logger={logger}
            buttonClassName="px-1.5 sm:px-2 md:px-3 min-h-8 h-8 sm:min-h-9 sm:h-9"
            showTextAt="sm"
          />

          {/* Persona Selector - text hidden first (on smaller screens) */}
          <PersonaSelector
            value={selectedPersona}
            onChange={onPersonaChange}
            locale={locale}
            logger={logger}
            buttonClassName="px-1.5 sm:px-2 md:px-3 min-h-8 h-8 sm:min-h-9 sm:h-9"
            showTextAt="md"
          />

          {/* Search Toggle and Tools - Only show if model supports tools */}
          {modelSupportsTools && (
            <>
              <SearchToggle disabled={isLoading} locale={locale} />
              <ToolsButton disabled={isLoading} locale={locale} />
            </>
          )}
        </Div>

        {/* Right side: Speech Input & Send/Stop Button */}
        <Div className="flex flex-row items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
          {/* Speech Input Button */}
          <SpeechInputButton
            disabled={isInputDisabled}
            lang={speechLang}
            locale={locale}
            logger={logger}
          />

          {/* Send/Stop Button */}
          {isLoading ? (
            <Button
              type="button"
              size="icon"
              onClick={onStop}
              className="h-8 w-8 sm:h-9 sm:w-9 shrink-0"
              variant="destructive"
              title={t("app.chat.actions.stopGeneration")}
            >
              <Square className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon"
              disabled={!value.trim() || isInputDisabled}
              className="h-8 w-8 sm:h-9 sm:w-9 shrink-0"
              title={
                !canPost
                  ? noPermissionReason || t("app.chat.input.noPermission")
                  : t("app.chat.actions.sendMessage")
              }
            >
              <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          )}
        </Div>
      </Div>
    </Form>
  );
}
