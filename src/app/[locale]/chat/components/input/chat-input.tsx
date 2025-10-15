"use client";

import { Send, Square } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import React, { forwardRef } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { Button, Textarea } from "@/packages/next-vibe-ui/web/ui";

import type { ModelId } from "../../lib/config/models";
import { localeToSpeechLang } from "../../lib/utils/speech-utils";
import { ModelSelector } from "./model-selector";
import { PersonaSelector } from "./persona-selector";
import { SearchToggle } from "./search-toggle";
import { SpeechInputButton } from "./speech-input-button";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  onStop: () => void;
  selectedTone: string;
  selectedModel: ModelId;
  enableSearch: boolean;
  onToneChange: (tone: string) => void;
  onModelChange: (model: ModelId) => void;
  onEnableSearchChange: (enabled: boolean) => void;
  locale?: CountryLanguage;
  className?: string;
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
      selectedTone,
      selectedModel,
      enableSearch,
      onToneChange,
      onModelChange,
      onEnableSearchChange,
      locale = "en",
      className,
    },
    ref,
  ): JSX.Element => {
    const speechLang = localeToSpeechLang(locale);
    return (
      <form
        onSubmit={onSubmit}
        className={cn(
          "p-3 sm:p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "border border-border rounded-t-lg",
          className,
        )}
      >
        {/* Input Area */}
        <div className="relative mb-3">
          <Textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={isLoading}
            className="px-0 text-base"
            variant={"ghost"}
            rows={2}
          />

          {/* Hint Text - Shows when textarea is empty - Hidden on mobile */}
          {!value && (
            <div className="absolute top-2 left-0 pointer-events-none text-sm text-muted-foreground hidden sm:block">
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                Enter
              </kbd>{" "}
              to send,{" "}
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                Shift+Enter
              </kbd>{" "}
              for new line
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 justify-between flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Model Selector */}
            <ModelSelector value={selectedModel} onChange={onModelChange} />

            {/* Persona Selector */}
            <PersonaSelector value={selectedTone} onChange={onToneChange} />

            {/* Search Toggle */}
            <SearchToggle
              enabled={enableSearch}
              onChange={onEnableSearchChange}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Speech Input Button */}
            <SpeechInputButton
              onTranscript={(text) => {
                // Append transcript to existing value
                const newValue = value ? `${value} ${text}`.trim() : text;
                onChange(newValue);
              }}
              disabled={isLoading}
              lang={speechLang}
              locale={locale}
            />

            {/* Send/Stop Button */}
            {isLoading ? (
              <Button
                type="button"
                size="icon"
                onClick={onStop}
                className="h-11 w-11 sm:h-9 sm:w-9 rounded-full flex-shrink-0"
                variant="destructive"
                title="Stop generation"
              >
                <Square className="h-5 w-5 sm:h-4 sm:w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                disabled={!value.trim() || isLoading}
                className="h-11 w-11 sm:h-9 sm:w-9 flex-shrink-0"
                title="Send message"
              >
                <Send className="h-5 w-5 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
        </div>
      </form>
    );
  },
);

ChatInput.displayName = "ChatInput";
