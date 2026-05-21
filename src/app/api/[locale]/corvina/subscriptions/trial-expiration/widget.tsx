"use client";

import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Clock } from "next-vibe-ui/ui/icons/Clock";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";

const MS_PER_DAY = 86_400_000;
const WARNING_DAYS = 30;

function formatDate(epoch: number): string {
  return new Date(epoch).toLocaleDateString();
}

function isExpired(epoch: number): boolean {
  return epoch < Date.now();
}

function isExpiringSoon(epoch: number): boolean {
  const msLeft = epoch - Date.now();
  return msLeft >= 0 && msLeft < WARNING_DAYS * MS_PER_DAY;
}

export function SubscriptionsTrialExpirationContainer(): React.JSX.Element {
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
    const expired = isExpired(data.expirationDate);
    const soon = isExpiringSoon(data.expirationDate);
    return (
      <Div className="font-mono text-sm p-2">
        <Div className="font-semibold mb-1">{t("get.widget.title")}</Div>
        <Div>
          <Span
            className={cn(
              expired
                ? "text-destructive"
                : soon
                  ? "text-warning"
                  : "text-foreground",
            )}
          >
            {expired
              ? t("get.widget.expired")
              : soon
                ? t("get.widget.expiringSoon")
                : t("get.widget.expiresOn")}
          </Span>
          <Span className="ml-2 font-mono">
            {formatDate(data.expirationDate)}
          </Span>
          <Span className="ml-1 text-muted-foreground">
            {`(${data.expirationDate})`}
          </Span>
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
        <Clock className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("get.widget.title")}
        </Span>
      </Div>

      <Div className="flex flex-col items-center justify-center p-8 gap-4">
        {data === undefined ? (
          <Div className="text-muted-foreground text-sm">—</Div>
        ) : (
          <>
            <Clock
              className={cn(
                "h-16 w-16",
                isExpired(data.expirationDate)
                  ? "text-destructive"
                  : isExpiringSoon(data.expirationDate)
                    ? "text-warning"
                    : "text-muted-foreground",
              )}
            />
            <Div className="text-center">
              <Div
                className={cn(
                  "text-lg font-semibold",
                  isExpired(data.expirationDate)
                    ? "text-destructive"
                    : isExpiringSoon(data.expirationDate)
                      ? "text-warning"
                      : "text-foreground",
                )}
              >
                {isExpired(data.expirationDate)
                  ? t("get.widget.expired")
                  : isExpiringSoon(data.expirationDate)
                    ? t("get.widget.expiringSoon")
                    : t("get.widget.expiresOn")}
              </Div>
              <Div className="text-3xl font-bold mt-2">
                {formatDate(data.expirationDate)}
              </Div>
              <Div className="text-xs text-muted-foreground mt-1 font-mono">
                {data.expirationDate}
              </Div>
            </Div>
          </>
        )}
      </Div>
    </Div>
  );
}
