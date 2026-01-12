"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Code, Copy, FileText } from "next-vibe-ui/ui/icons";
import { Markdown } from "next-vibe-ui/ui/markdown";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useCallback, useState } from "react";

import { Logo } from "@/app/[locale]/_components/logo";
import {
  chatAnimations,
  chatProse,
  chatShadows,
  chatTransitions,
} from "@/app/[locale]/chat/lib/design-tokens";
import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { useDebugSystemPrompt } from "./hook";

/**
 * Debug-only component that generates and displays system prompt
 * Only rendered when debug view is active to avoid unnecessary API calls and processing
 */
export function DebugSystemPrompt({
  locale,
  rootFolderId,
  subFolderId,
  characterId,
  selectedModel,
  user,
  logger,
}: {
  locale: CountryLanguage;
  rootFolderId?: DefaultFolderId;
  subFolderId?: string | null;
  characterId?: string | null;
  selectedModel?: string;
  user: JwtPayloadType;
  logger: EndpointLogger;
}): JSX.Element {
  const { t } = simpleT(locale);
  const [copiedSystemPrompt, setCopiedSystemPrompt] = useState(false);
  const [showMarkdown, setShowMarkdown] = useState(true);

  // Use the hook to fetch all data and generate system prompt
  const systemPrompt = useDebugSystemPrompt({
    locale,
    rootFolderId,
    subFolderId,
    characterId,
    selectedModel,
    user,
    logger,
  });

  const handleCopySystemPrompt = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(systemPrompt);
      setCopiedSystemPrompt(true);
      setTimeout(() => setCopiedSystemPrompt(false), 2000);
    } catch (error) {
      logger.error("Failed to copy system prompt", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }, [systemPrompt, logger]);

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
        {/* Card Header with Logo */}
        <Div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-500/20">
          <Div className="flex items-center gap-2">
            <Div className="text-sm font-semibold text-purple-400">
              {t("app.chat.debugView.systemPromptTitle")}
            </Div>
            <Button
              onClick={handleCopySystemPrompt}
              size="sm"
              variant="ghost"
              className="h-7 px-2 hover:bg-purple-500/20"
            >
              <Copy className="h-4 w-4" />
              {copiedSystemPrompt && (
                <Span className="ml-1 text-xs text-purple-400">
                  {t("app.chat.debugView.copied")}
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

          {/* Logo on the right */}
          <Div className="flex items-center">
            <Logo locale={locale} disabled size="h-8" />
          </Div>
        </Div>

        {/* System Prompt Content */}
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
