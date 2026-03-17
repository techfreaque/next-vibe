/**
 * Widget Chat Input
 *
 * Renders the same visual structure as the real ChatInput (input.tsx)
 * but wired to widget form state instead of ChatContext.
 * Used by both ai-stream and ai-run widgets in form mode.
 */

/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { ExternalLink } from "next-vibe-ui/ui/icons/ExternalLink";
import { Send } from "next-vibe-ui/ui/icons/Send";
import { Square } from "next-vibe-ui/ui/icons/Square";
import { Kbd } from "next-vibe-ui/ui/kbd";
import { Span } from "next-vibe-ui/ui/span";
import type { TextareaKeyboardEvent } from "next-vibe-ui/ui/textarea";
import { Textarea } from "next-vibe-ui/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import type { JSX, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { AGENT_MESSAGE_LENGTH } from "@/app/api/[locale]/agent/chat/constants";
import type { EnabledTool } from "@/app/api/[locale]/agent/chat/hooks/store";
import {
  getModelById,
  type ModelId,
} from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { useChatSettings } from "../../../chat/settings/hooks";
import { Selector } from "./selector";
import { ToolsButton } from "./tools-button";

// ─── Props ──────────────────────────────────────────────────────────────────

export interface WidgetChatInputProps {
  content: string;
  onContentChange: (value: string) => void;
  modelId: ModelId;
  skillId: string;
  onModelChange: (id: ModelId) => void;
  onSkillChange: (id: string) => void;
  locale: CountryLanguage;
  user: JwtPayloadType;
  logger: EndpointLogger;
  onSubmit: () => void;
  isSubmitting: boolean;
  enabledTools?: EnabledTool[] | null;
  advancedContent?: ReactNode;
  className?: string;
  /** Read-only mode (e.g. inside completed tool call results) */
  disabled?: boolean;
  /** Full URL for "go to thread" button in disabled mode */
  threadHref?: string | null;
  /** Called when the cancel/stop button is clicked */
  onCancel?: () => void;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function WidgetChatInput({
  content,
  onContentChange,
  modelId,
  skillId,
  onModelChange,
  onSkillChange,
  locale,
  user,
  logger,
  onSubmit,
  isSubmitting,
  enabledTools,
  advancedContent,
  className,
  disabled = false,
  threadHref,
  onCancel,
}: WidgetChatInputProps): JSX.Element {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { t } = simpleT(locale);
  const isInactive = disabled || isSubmitting;

  // Bridge: react to favorite selection → sync model/skill to form
  const { settings } = useChatSettings(user, logger);
  const settingsModelRef = useRef(settings?.selectedModel);
  const settingsCharRef = useRef(settings?.selectedSkill);

  useEffect(() => {
    if (
      settings?.selectedModel &&
      settings.selectedModel !== settingsModelRef.current
    ) {
      settingsModelRef.current = settings.selectedModel;
      onModelChange(settings.selectedModel);
    }
    if (
      settings?.selectedSkill &&
      settings.selectedSkill !== settingsCharRef.current
    ) {
      settingsCharRef.current = settings.selectedSkill;
      onSkillChange(settings.selectedSkill);
    }
  }, [
    settings?.selectedModel,
    settings?.selectedSkill,
    onModelChange,
    onSkillChange,
  ]);

  // Keyboard: Enter to submit, Shift+Enter for newline
  const handleKeyDown = useCallback(
    (e: TextareaKeyboardEvent): void => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (content.trim() && !isInactive) {
          onSubmit();
        }
      }
    },
    [content, isInactive, onSubmit],
  );

  const currentModel = getModelById(modelId);
  const modelSupportsTools = currentModel?.supportsTools ?? false;
  const canSubmit = content.trim().length > 0 && !isInactive;

  return (
    <Div
      className={cn(
        "@container",
        "p-2 @sm:p-3 @md:p-4 backdrop-blur",
        "border border-border rounded-t-lg",
        "bg-blue-200/70 dark:bg-blue-950/70",
        className,
      )}
    >
      {/* Input area — hidden in disabled mode */}
      {!disabled && (
        <Div className="relative mb-2 @sm:mb-3">
          <Textarea
            ref={inputRef}
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isInactive}
            placeholder=""
            className="px-0 text-base pl-3"
            variant="ghost"
            rows={2}
            maxLength={AGENT_MESSAGE_LENGTH}
          />

          {/* Hint overlay */}
          {!content && !isInactive && (
            <Div className="absolute inset-0 pl-3 pr-3 pointer-events-none hidden @sm:flex flex-col justify-between pb-1">
              <Div className="text-sm text-muted-foreground/70 pt-2">
                {t("app.chat.input.placeholder")}
              </Div>
              <Div className="flex items-center gap-2 text-[11px] text-muted-foreground/40">
                <Span>
                  <Kbd className="px-1 py-px bg-muted/50 rounded text-[10px] font-sans">
                    {t("app.chat.input.keyboardShortcuts.enter")}
                  </Kbd>{" "}
                  {t("app.chat.input.keyboardShortcuts.toSend")}
                </Span>
                <Span className="opacity-30">{"/"}</Span>
                <Span>
                  <Kbd className="px-1 py-px bg-muted/50 rounded text-[10px] font-sans">
                    {t("app.chat.input.keyboardShortcuts.shiftEnter")}
                  </Kbd>{" "}
                  {t("app.chat.input.keyboardShortcuts.forNewLine")}
                </Span>
              </Div>
            </Div>
          )}
        </Div>
      )}

      {/* Controls */}
      <Div className="flex flex-row items-center gap-1 @sm:gap-1.5 @md:gap-2 flex-nowrap">
        {/* Left: Selector + Tools + Advanced */}
        <Div
          className={cn(
            "flex flex-row items-center gap-0.5 @sm:gap-1 @md:gap-1.5 flex-1 min-w-0",
            disabled && "pointer-events-none",
          )}
        >
          <Selector
            skillId={skillId}
            modelId={modelId}
            locale={locale}
            buttonClassName={cn(
              "px-1.5 @sm:px-2 @md:px-3 min-h-8 h-8 @sm:min-h-9 @sm:h-9",
              disabled && "opacity-70",
            )}
          />

          {modelSupportsTools && (
            <ToolsButton
              disabled={isInactive}
              locale={locale}
              enabledTools={enabledTools}
            />
          )}

          {/* Advanced toggle */}
          {advancedContent && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-muted-foreground"
              onClick={() => setShowAdvanced((v) => !v)}
            >
              {showAdvanced ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
              <Span className="hidden @md:inline ml-1">Advanced</Span>
            </Button>
          )}
        </Div>

        {/* Right: Go-to-thread (disabled) / Send / Stop */}
        {disabled ? (
          threadHref && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 @sm:h-9 @sm:w-9"
                    onClick={() => {
                      window.open(threadHref, "_blank");
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{"Open thread"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        ) : isSubmitting ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8 @sm:h-9 @sm:w-9"
                  onClick={onCancel}
                >
                  <Square className="h-3.5 w-3.5 fill-current" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {t("app.chat.actions.stopGeneration")}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="default"
                  disabled={!canSubmit}
                  onClick={onSubmit}
                  className="h-8 w-8 @sm:h-9 @sm:w-9"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {t("app.chat.actions.sendMessage")}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </Div>

      {/* Advanced section */}
      {showAdvanced && advancedContent && (
        <Div className="border-t mt-3 pt-3 flex flex-col gap-3">
          {advancedContent}
        </Div>
      )}
    </Div>
  );
}
