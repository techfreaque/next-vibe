"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Code } from "next-vibe-ui/ui/icons/Code";
import { Copy } from "next-vibe-ui/ui/icons/Copy";
import { FileText } from "next-vibe-ui/ui/icons/FileText";
import { Markdown } from "next-vibe-ui/ui/markdown";
import { Span } from "next-vibe-ui/ui/span";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { useCallback, useState } from "react";

import { Logo } from "@/app/[locale]/_components/logo";
import {
  chatAnimations,
  chatProse,
  chatShadows,
  chatTransitions,
} from "@/app/[locale]/chat/lib/design-tokens";
import type { CountryLanguage } from "@/i18n/core/config";

export interface DebugSystemPromptParts {
  systemPrompt: string;
  trailingSystemMessage: string;
  contextLine: string;
}

import { scopedTranslation } from "../i18n";

interface DebugProps {
  locale: CountryLanguage;
  parts: DebugSystemPromptParts;
}

/**
 * Debug card shown BEFORE the message history.
 * Displays only the leading system prompt (the static cacheable `system` param sent to the AI).
 */
export function DebugSystemPrompt({ locale, parts }: DebugProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [copied, setCopied] = useState(false);
  const [showMarkdown, setShowMarkdown] = useState(true);

  const { systemPrompt, trailingSystemMessage, contextLine } = parts;

  // Copy copies the full context (all 3 parts) for convenience
  const fullText = [
    systemPrompt,
    ...(trailingSystemMessage.trim() ? [trailingSystemMessage] : []),
    contextLine,
  ].join("\n\n---\n\n");

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard write failed - ignore silently
    }
  }, [fullText]);

  return (
    <Div className={cn(chatAnimations.slideIn, "mb-4")}>
      <Div
        className={cn(
          "rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3",
          "bg-purple-500/10 border border-purple-500/20",
          chatShadows.sm,
          chatTransitions.default,
        )}
      >
        {/* Header */}
        <Div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-500/20">
          <Div className="flex items-center gap-2">
            <Div className="text-sm font-semibold text-purple-400">
              {t("debugView.systemPromptTitle")}
            </Div>
            <Button
              onClick={handleCopy}
              size="sm"
              variant="ghost"
              className="h-7 px-2 hover:bg-purple-500/20"
            >
              <Copy className="h-4 w-4" />
              {copied && (
                <Span className="ml-1 text-xs text-purple-400">
                  {t("debugView.copied")}
                </Span>
              )}
            </Button>
            <Button
              onClick={() => setShowMarkdown(!showMarkdown)}
              size="sm"
              variant="ghost"
              className="h-7 px-2 hover:bg-purple-500/20"
              title={showMarkdown ? "Show as plain text" : "Show as markdown"}
            >
              {showMarkdown ? (
                <FileText className="h-4 w-4" />
              ) : (
                <Code className="h-4 w-4" />
              )}
            </Button>
          </Div>
          <Div className="flex items-center">
            <Logo locale={locale} disabled size="h-8" />
          </Div>
        </Div>

        {/* Leading system prompt only - trailing and context appear after history */}
        <Div className="mb-1 text-xs font-mono text-purple-400/60 uppercase tracking-wide">
          {t("debugView.systemPromptLabel")}
        </Div>
        {showMarkdown ? (
          <Div className={cn(chatProse.all, "text-sm")}>
            <Markdown content={systemPrompt} />
          </Div>
        ) : (
          <Div className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word text-foreground/80 font-mono">
            {systemPrompt}
          </Div>
        )}
      </Div>
    </Div>
  );
}

/**
 * Debug card shown AFTER the message history.
 * Shows the trailing system message (tasks/memories/favorites) and the upcoming
 * assistant context line - in the exact order they are injected into the messages
 * array sent to the AI.
 */
export function DebugTrailingContext({
  locale,
  parts,
}: DebugProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [showMarkdown, setShowMarkdown] = useState(true);

  const { trailingSystemMessage, contextLine } = parts;

  return (
    <Div className={cn(chatAnimations.slideIn, "mt-4")}>
      {/* Trailing system message (tasks / memories / favorites) */}
      {trailingSystemMessage.trim() && (
        <Div
          className={cn(
            "rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 mb-3",
            "bg-purple-500/10 border border-purple-500/20",
            chatShadows.sm,
            chatTransitions.default,
          )}
        >
          <Div className="flex items-center justify-between mb-2">
            <Span className="text-xs font-mono text-purple-400/60 uppercase tracking-wide">
              {/* eslint-disable-next-line i18next/no-literal-string, oxlint-plugin-i18n/no-literal-string -- debug-only label */}
              trailing system message · injected after history
            </Span>
            <Button
              onClick={() => setShowMarkdown(!showMarkdown)}
              size="sm"
              variant="ghost"
              className="h-6 px-2 hover:bg-purple-500/20"
              title={showMarkdown ? "Show as plain text" : "Show as markdown"}
            >
              {showMarkdown ? (
                <FileText className="h-3.5 w-3.5" />
              ) : (
                <Code className="h-3.5 w-3.5" />
              )}
            </Button>
          </Div>
          {showMarkdown ? (
            <Div className={cn(chatProse.all, "text-sm")}>
              <Markdown content={trailingSystemMessage} />
            </Div>
          ) : (
            <Div className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word text-foreground/80 font-mono">
              {trailingSystemMessage}
            </Div>
          )}
        </Div>
      )}

      {/* Upcoming assistant context - always the last message in the array */}
      <Div
        className={cn(
          "rounded-xl px-3 py-2 sm:px-4",
          "bg-blue-500/10 border border-blue-500/20",
          chatShadows.sm,
        )}
      >
        <Div className="mb-1 text-xs font-mono text-blue-400/60 uppercase tracking-wide">
          {t("debugView.upcomingContextLabel")}
        </Div>
        <Div className="text-sm font-mono text-blue-300/80">{contextLine}</Div>
      </Div>
    </Div>
  );
}
