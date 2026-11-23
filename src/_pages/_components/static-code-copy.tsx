"use client";

/**
 * Copy button island for `StaticCodeFile`: the only interactive part of a
 * server-highlighted code card. Same look as the `CodeSnippet` copy button.
 */

import { useTranslation } from "next-vibe/core/i18n/core/client";
import { Button } from "next-vibe/ui/components/button";
import { Check } from "next-vibe/ui/components/icons/Check";
import { Copy } from "next-vibe/ui/components/icons/Copy";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { scopedTranslation } from "next-vibe/ui/i18n";
import { copyToClipboard } from "next-vibe/ui/lib/clipboard";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX } from "react";
import { useState } from "react";

const COPIED_RESET_MS = 2000;

export function StaticCodeCopy({ code }: { code: string }): JSX.Element {
  const { locale } = useTranslation();
  const { t } = scopedTranslation.scopedT(locale);
  const logger = useLogger();
  const [copied, setCopied] = useState(false);
  const label = copied ? t("ui.markdown.copied") : t("ui.markdown.copyCode");
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      title={label}
      aria-label={label}
      className={cn(
        "h-auto shrink-0 gap-1 rounded px-2 py-1 text-[10px] font-medium transition-all duration-150 hover:bg-transparent",
        copied
          ? "text-emerald-400 hover:text-emerald-400"
          : "text-slate-500 hover:text-slate-300",
      )}
      onClick={(): void => {
        void (async (): Promise<void> => {
          const ok = await copyToClipboard(code, logger);
          setCopied(ok);
          if (ok) {
            setTimeout(() => setCopied(false), COPIED_RESET_MS);
          }
        })();
      }}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </Button>
  );
}
