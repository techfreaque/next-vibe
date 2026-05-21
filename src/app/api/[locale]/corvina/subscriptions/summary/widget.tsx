"use client";

import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { BarChart } from "next-vibe-ui/ui/icons/BarChart";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
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
import type { SubscriptionsSummaryResponseOutput } from "./definition";
import type { SubscriptionsSummaryT } from "./i18n";

type SummaryItem = SubscriptionsSummaryResponseOutput["items"][number];
type ResourceItem = SummaryItem["resources"][number];

const MS_PER_DAY = 86_400_000;
const WARNING_DAYS = 30;

function formatDate(epoch: number | null): string {
  if (epoch === null) {
    return "—";
  }
  return new Date(epoch).toLocaleDateString();
}

function formatDateShort(epoch: number | null): string {
  if (epoch === null) {
    return "none";
  }
  return new Date(epoch).toISOString().slice(0, 10);
}

function isExpiringSoon(epoch: number | null): boolean {
  if (epoch === null) {
    return false;
  }
  return epoch - Date.now() < WARNING_DAYS * MS_PER_DAY;
}

function ResourceRow({
  resource,
}: {
  resource: ResourceItem;
}): React.JSX.Element {
  const usagePercent =
    resource.quantity > 0
      ? Math.round((resource.used / resource.quantity) * 100)
      : 0;
  return (
    <Div className="flex items-center gap-3 py-1 text-xs">
      <Span className="font-mono w-32 shrink-0">{resource.resourceType}</Span>
      <Span
        className={cn(
          "font-mono",
          resource.expired
            ? "text-destructive font-semibold"
            : usagePercent >= 90
              ? "text-destructive font-semibold"
              : usagePercent >= 70
                ? "text-warning font-semibold"
                : "text-muted-foreground",
        )}
      >
        {resource.used}/{resource.quantity} ({usagePercent}%)
      </Span>
      {resource.expired && (
        <Span className="text-destructive font-medium">expired</Span>
      )}
    </Div>
  );
}

function SummaryCard({
  item,
  t,
}: {
  item: SummaryItem;
  t: SubscriptionsSummaryT;
}): React.JSX.Element {
  const expiringSoon = isExpiringSoon(item.expirationDate);
  return (
    <Div className="border rounded-lg p-4 mb-3">
      <Div className="flex items-start justify-between gap-2 mb-2">
        <Div>
          <Div className="flex items-center gap-2 flex-wrap">
            <Span className="font-semibold text-sm">{item.productLabel}</Span>
            {item.trial && (
              <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                {t("get.widget.trial")}
              </Span>
            )}
            {item.autorenew && (
              <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {t("get.widget.autorenewSymbol")}
              </Span>
            )}
          </Div>
          <Span className="text-xs text-muted-foreground font-mono">
            {item.licenseCode}
          </Span>
        </Div>
        <Div className="shrink-0 text-right">
          <Span
            className={cn(
              "text-xs font-mono",
              expiringSoon
                ? "text-warning font-semibold"
                : "text-muted-foreground",
            )}
          >
            {formatDate(item.expirationDate)}
          </Span>
        </Div>
      </Div>
      {item.resources.length > 0 && (
        <Div className="mt-2 border-t pt-2">
          {item.resources.map((r, idx) => (
            <ResourceRow key={idx} resource={r} />
          ))}
        </Div>
      )}
    </Div>
  );
}

export function SubscriptionsSummaryContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const items = data?.items ?? [];
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
        <Div className="font-semibold mb-1">
          {t("get.widget.title")} ({items.length})
        </Div>
        {items.length === 0 ? (
          <Div className="text-muted-foreground">
            {t("get.widget.noItemsFound")}
          </Div>
        ) : (
          items.map((item, idx) => (
            <Div key={idx} className="py-1 border-b last:border-b-0">
              <Div>
                <Span className="font-semibold">{item.productLabel}</Span>
                <Span className="text-muted-foreground">
                  {` [${item.licenseCode}]`}
                </Span>
                <Span
                  className={cn(
                    "ml-2",
                    isExpiringSoon(item.expirationDate) &&
                      "text-warning font-semibold",
                  )}
                >
                  {` exp:${formatDateShort(item.expirationDate)}`}
                </Span>
              </Div>
              {item.resources.map((r, rIdx) => (
                <Div key={rIdx} className="ml-2 text-xs text-muted-foreground">
                  {`  ${r.resourceType}: ${r.used}/${r.quantity}${r.expired ? " [expired]" : ""}`}
                </Div>
              ))}
            </Div>
          ))
        )}
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
        <BarChart className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("get.widget.title")}
          {items.length > 0 && (
            <Span className="ml-2 text-xs text-muted-foreground font-normal">
              ({items.length})
            </Span>
          )}
        </Span>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))] p-4">
        {isLoading ? (
          <Div className="h-48 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </Div>
        ) : items.length === 0 ? (
          <Div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <BarChart className="h-8 w-8 opacity-30" />
            <Span className="text-sm">{t("get.widget.noItemsFound")}</Span>
          </Div>
        ) : (
          items.map((item, idx) => <SummaryCard key={idx} item={item} t={t} />)
        )}
      </Div>
    </Div>
  );
}
