"use client";

import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Hash } from "next-vibe-ui/ui/icons/Hash";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";

export function SubscriptionsResourceJournalSumContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const isLoading = data === undefined;
  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  if (isCompact) {
    if (!data) {
      return <Div />;
    }
    return (
      <Div className="font-mono text-sm p-2">
        <Div className="font-semibold mb-1">{t("get.widget.title")}</Div>
        <Div>{`totalUsage=${data.totalUsage}`}</Div>
      </Div>
    );
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
          title={t("get.widget.back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Hash className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("get.widget.title")}
        </Span>
      </Div>

      <Div className="p-6 flex flex-col items-center justify-center">
        {isLoading ? (
          <Div className="h-48 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </Div>
        ) : (
          <Div className="flex flex-col items-center gap-2">
            <Hash className="h-10 w-10 text-primary opacity-60" />
            <Span className="text-4xl font-bold font-mono">
              {data.totalUsage}
            </Span>
            <Span className="text-sm text-muted-foreground">
              {t("get.response.totalUsage")}
            </Span>
          </Div>
        )}
      </Div>
    </Div>
  );
}
