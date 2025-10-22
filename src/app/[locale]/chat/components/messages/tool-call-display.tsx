"use client";

import { Search } from "lucide-react";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { ToolCall } from "../../types";

interface ToolCallDisplayProps {
  toolCalls: ToolCall[];
  locale?: CountryLanguage;
}

export function ToolCallDisplay({
  toolCalls,
  locale = "en-GLOBAL",
}: ToolCallDisplayProps): JSX.Element | null {
  const { t } = simpleT(locale);

  if (!toolCalls || toolCalls.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 mb-3">
      {toolCalls.map((toolCall, index) => (
        <div
          key={index}
          className="flex items-start gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm"
        >
          {/* Tool icon */}
          <div className="flex-shrink-0 mt-0.5">
            {toolCall.toolName === "search" ? (
              <Search className="h-4 w-4 text-blue-400" />
            ) : (
              <span className="text-blue-400">🔧</span>
            )}
          </div>

          {/* Tool info */}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-blue-400">
              {toolCall.toolName === "search"
                ? t("app.chat.toolCall.search.title")
                : toolCall.toolName}
            </div>
            <div className="text-muted-foreground text-xs mt-1">
              {toolCall.toolName === "search" && toolCall.args.query ? (
                <span>
                  {t("app.chat.toolCall.search.query")}:{" "}
                  <span className="text-foreground/80">
                    {String(toolCall.args.query)}
                  </span>
                </span>
              ) : (
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(toolCall.args, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

