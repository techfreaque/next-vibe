/**
 * Custom Widget for Skill Export
 * Shows what the card contains, a download button and a copy button.
 * CLI: `downloadFile` writes the card to ~/Downloads.
 */

"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Check } from "next-vibe/ui/components/icons/Check";
import { Copy } from "next-vibe/ui/components/icons/Copy";
import { Download } from "next-vibe/ui/components/icons/Download";
import { FileText } from "next-vibe/ui/components/icons/FileText";
import { Pre } from "next-vibe/ui/components/pre";
import { Span } from "next-vibe/ui/components/span";
import { copyToClipboard } from "next-vibe/ui/lib/clipboard";
import { downloadFile } from "next-vibe/ui/lib/download";
import {
  useWidgetLogger,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { type JSX, useCallback, useState } from "react";

import type definition from "./definition";

export function SkillExportContainer(): JSX.Element {
  const value = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const logger = useWidgetLogger();
  const [copied, setCopied] = useState(false);

  const card = value?.card;
  const fileName = value?.fileName;

  const handleDownload = useCallback((): void => {
    if (card && fileName) {
      downloadFile(fileName, card, "application/json");
    }
  }, [card, fileName]);

  const handleCopy = useCallback((): void => {
    if (!card) {
      return;
    }
    void copyToClipboard(card, logger).then((copiedOk) => {
      if (!copiedOk) {
        logger.warn("Clipboard write failed", {
          component: "SkillExportContainer",
          textLength: card.length,
        });
        return undefined;
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return undefined;
    });
  }, [card, logger]);

  if (!card || !fileName) {
    return <Div />;
  }

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex flex-col gap-1 text-sm text-muted-foreground">
        <Span>{t("get.widget.intro")}</Span>
        <Span className="text-xs">{t("get.widget.included")}</Span>
      </Div>

      <Div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
        <Span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-background">
          <FileText className="h-5 w-5 text-muted-foreground" />
        </Span>
        <Div className="flex min-w-0 flex-col gap-0.5">
          <Span className="truncate font-semibold">{value.name}</Span>
          <Span className="truncate font-mono text-xs text-muted-foreground">
            {fileName}
          </Span>
        </Div>
      </Div>

      <Pre className="max-h-56 overflow-auto rounded-lg border bg-muted/20 p-3 font-mono text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap break-words">
        {card}
      </Pre>

      <Div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="outline" onClick={handleCopy}>
          {copied ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          {copied ? t("get.widget.copied") : t("get.widget.copy")}
        </Button>
        <Button type="button" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          {t("get.widget.download")}
        </Button>
      </Div>
    </Div>
  );
}
