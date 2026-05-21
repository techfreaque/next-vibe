"use client";

import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Layers } from "next-vibe-ui/ui/icons/Layers";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetContext,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";
import type { SubscriptionsListResponseOutput } from "./definition";
import type { SubscriptionsListT } from "./i18n";

type Subscription = SubscriptionsListResponseOutput["subscriptions"][number];

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

function SubscriptionRow({
  sub,
  compact,
  t,
}: {
  sub: Subscription;
  compact: boolean;
  t: SubscriptionsListT;
}): React.JSX.Element {
  const expiringSoon = isExpiringSoon(sub.expirationDate);
  const usagePercent =
    sub.quantity > 0 ? Math.round((sub.used / sub.quantity) * 100) : 0;

  if (compact) {
    return (
      <Div className="py-1 text-sm font-mono">
        <Span className="font-semibold">{sub.resourceType}</Span>
        <Span className="text-muted-foreground">
          {` [${sub.productLabel}]`}
        </Span>
        <Span className="ml-2">{` used:${sub.used}/${sub.quantity}`}</Span>
        <Span
          className={cn("ml-2", expiringSoon && "text-warning font-semibold")}
        >
          {` exp:${formatDateShort(sub.expirationDate)}`}
        </Span>
        {sub.expired && (
          <Span className="ml-2 text-destructive">{` [${t("get.widget.expired")}]`}</Span>
        )}
      </Div>
    );
  }

  return (
    <Div className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-accent transition-colors">
      <Div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <Layers className="h-4 w-4 text-primary" />
      </Div>

      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-semibold text-sm">{sub.resourceType}</Span>
          <Span className="text-xs text-muted-foreground">
            {sub.productLabel}
          </Span>
          {sub.expired && (
            <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
              {t("get.widget.expired")}
            </Span>
          )}
          {!sub.expired && expiringSoon && (
            <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
              {t("get.widget.expiringSoon")}
            </Span>
          )}
        </Div>
        <Div className="mt-1 flex items-center gap-2">
          <Span
            className={cn(
              "text-xs font-mono",
              usagePercent >= 90
                ? "text-destructive font-semibold"
                : usagePercent >= 70
                  ? "text-warning font-semibold"
                  : "text-muted-foreground",
            )}
          >
            {sub.used}/{sub.quantity} ({usagePercent}%)
          </Span>
        </Div>
      </Div>

      <Div className="flex flex-col items-end gap-0.5 shrink-0">
        <Span
          className={cn(
            "text-xs font-mono",
            expiringSoon
              ? "text-warning font-semibold"
              : "text-muted-foreground",
          )}
        >
          {formatDate(sub.expirationDate)}
        </Span>
        <Span className="text-xs text-muted-foreground/60">
          {`#${sub.licenseId}`}
        </Span>
      </Div>
    </Div>
  );
}

export function SubscriptionsListContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { endpointMutations } = useWidgetContext();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const subscriptions = data?.subscriptions ?? [];
  const total = data?.total ?? 0;
  const isLoading = data === undefined;
  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  if (isCompact) {
    if (!data) {
      return <Div />;
    }
    return (
      <Div className="font-mono text-sm p-2">
        <Div className="font-semibold mb-1">
          {t("get.widget.title")} ({subscriptions.length}/{total})
          {isMcp && ` — use page/pageSize to paginate`}
        </Div>
        {subscriptions.length === 0 ? (
          <Div className="text-muted-foreground">
            {t("get.widget.noItemsFound")}
          </Div>
        ) : (
          subscriptions.map((sub, idx) => (
            <SubscriptionRow key={idx} sub={sub} compact={true} t={t} />
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
        <Layers className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("get.widget.title")}
          {total > 0 && (
            <Span className="ml-2 text-xs text-muted-foreground font-normal">
              ({total})
            </Span>
          )}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))]">
        {isLoading ? (
          <Div className="h-48 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </Div>
        ) : subscriptions.length === 0 ? (
          <Div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <Layers className="h-8 w-8 opacity-30" />
            <Span className="text-sm">{t("get.widget.noItemsFound")}</Span>
          </Div>
        ) : (
          subscriptions.map((sub, idx) => (
            <SubscriptionRow key={idx} sub={sub} compact={false} t={t} />
          ))
        )}
      </Div>
    </Div>
  );
}
