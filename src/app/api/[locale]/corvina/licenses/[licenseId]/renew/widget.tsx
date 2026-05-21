"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";

function formatDate(epoch: number | null | undefined): string {
  if (epoch === null || epoch === undefined) {
    return "—";
  }
  return new Date(epoch).toLocaleDateString();
}

function formatDateShort(epoch: number | null | undefined): string {
  if (epoch === null || epoch === undefined) {
    return "none";
  }
  return new Date(epoch).toISOString().slice(0, 10);
}

export function LicenseRenewContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const result = useWidgetValue<typeof definition.POST>();

  const isMcp = platform === Platform.MCP;
  const isCli = platform === Platform.CLI;
  const isCompact = isCli || isMcp;

  if (isCompact) {
    if (result !== null && result !== undefined) {
      return (
        <Div className="font-mono text-sm p-2">
          {`renewed license #${result.licenseId}: expires:${formatDateShort(result.expirationDate)}`}
        </Div>
      );
    }
    return <Div />;
  }

  return (
    <Div className="flex flex-col min-h-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            pop();
          }}
          title={t("post.widget.back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <RefreshCw className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("post.widget.title")}
        </Span>
      </Div>

      <Div className="overflow-y-auto max-h-[min(600px,calc(100dvh-200px))] p-4 space-y-4">
        <Button
          type="button"
          variant="default"
          className="w-full gap-2"
          onClick={onSubmit ?? undefined}
        >
          <RefreshCw className="h-4 w-4" />
          {t("post.submitButton.label")}
        </Button>

        {result !== null && result !== undefined && (
          <Div className="rounded-xl border bg-card p-4 space-y-3">
            <Span className="font-semibold text-sm text-success block">
              {t("post.success.description")}
            </Span>
            <Div className="grid grid-cols-2 gap-2 text-sm">
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.code")}
                </Span>
                <Span className="font-mono">{result.code}</Span>
              </Div>
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.productLabel")}
                </Span>
                <Span>{result.productLabel}</Span>
              </Div>
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.expirationDate")}
                </Span>
                <Span className="font-semibold text-success">
                  {formatDate(result.expirationDate)}
                </Span>
              </Div>
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.autorenew")}
                </Span>
                <Span>{result.autorenew ? "Yes" : "No"}</Span>
              </Div>
            </Div>
          </Div>
        )}
      </Div>
    </Div>
  );
}
