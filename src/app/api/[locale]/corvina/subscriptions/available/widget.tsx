"use client";

import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { XCircle } from "next-vibe-ui/ui/icons/XCircle";
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

export function SubscriptionsAvailableContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

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
        <Div>
          <Span className="font-semibold">{data.resourceType}</Span>
          <Span className="ml-2">
            {data.available
              ? t("get.widget.available")
              : t("get.widget.unavailable")}
          </Span>
          <Span className="ml-2 text-muted-foreground">
            {`available:${data.availableAmount}`}
          </Span>
          {data.inDebtSince !== null && (
            <Span className="ml-2 text-destructive">
              {`${t("get.widget.inDebt")} ${data.inDebtSince}`}
            </Span>
          )}
        </Div>
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
        <Span className="font-semibold text-sm mr-auto">
          {t("get.widget.title")}
        </Span>
      </Div>

      <Div className="flex flex-col items-center justify-center p-8 gap-4">
        {data === undefined ? (
          <Div className="text-muted-foreground text-sm">—</Div>
        ) : (
          <>
            {data.available ? (
              <CheckCircle className="h-16 w-16 text-success" />
            ) : (
              <XCircle className="h-16 w-16 text-destructive" />
            )}
            <Div className="text-center">
              <Div className="text-xl font-bold">
                {data.available
                  ? t("get.widget.available")
                  : t("get.widget.unavailable")}
              </Div>
              <Div className="text-sm text-muted-foreground mt-1">
                {data.resourceType}
              </Div>
            </Div>
            <Div className="flex flex-col items-center gap-1">
              <Span className="text-3xl font-bold text-primary">
                {data.availableAmount}
              </Span>
              <Span className="text-sm text-muted-foreground">
                {t("get.widget.units")}
              </Span>
            </Div>
            {data.inDebtSince !== null && (
              <Div className="text-sm text-destructive font-medium">
                {t("get.widget.inDebt")} {data.inDebtSince}
              </Div>
            )}
          </>
        )}
      </Div>
    </Div>
  );
}
