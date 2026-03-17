/**
 * Export Env Widget
 * Displays the generated .env.prod content with copy and download buttons.
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Copy } from "next-vibe-ui/ui/icons/Copy";
import { Download } from "next-vibe-ui/ui/icons/Download";
import { Pre } from "next-vibe-ui/ui/pre";
import type { JSX } from "react";
import { useState } from "react";

import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";
import type { ExportEnvResponseOutput } from "./definition";

interface WidgetProps {
  field: {
    value: ExportEnvResponseOutput | null | undefined;
  } & (typeof endpoints.GET)["fields"];
}

export function ExportEnvWidget({ field }: WidgetProps): JSX.Element {
  const value = field.value;
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const [copied, setCopied] = useState(false);

  if (!value?.content) {
    return <Div />;
  }

  const handleCopy = (): void => {
    void navigator.clipboard.writeText(value.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return undefined;
    });
  };

  const handleDownload = (): void => {
    const blob = new Blob([value.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = value.filename ?? ".env.prod";
    a.click();
    URL.revokeObjectURL(url);
  };

  const tStr = t as (key: string) => string;

  return (
    <Div className="flex flex-col gap-3 p-4">
      <Div className="text-xs text-muted-foreground">
        {tStr("get.widget.instructions")}
      </Div>

      <Div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={handleCopy}>
          {copied ? (
            <Check className="h-3.5 w-3.5 mr-1.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5 mr-1.5" />
          )}
          {copied ? tStr("get.widget.copied") : tStr("get.widget.copy")}
        </Button>
        <Button size="sm" variant="outline" onClick={handleDownload}>
          <Download className="h-3.5 w-3.5 mr-1.5" />
          {tStr("get.widget.download")}
        </Button>
      </Div>

      <Div className="relative rounded-md border bg-muted/40 overflow-hidden">
        <Pre className="text-xs font-mono p-4 overflow-auto max-h-[60vh] whitespace-pre leading-relaxed">
          {value.content}
        </Pre>
      </Div>
    </Div>
  );
}
