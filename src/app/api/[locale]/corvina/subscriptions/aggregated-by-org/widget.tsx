"use client";

import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { BarChart2 } from "next-vibe-ui/ui/icons/BarChart2";
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
import type { SubscriptionsAggregatedByOrgResponseOutput } from "./definition";

type AggregatedByOrgItem =
  SubscriptionsAggregatedByOrgResponseOutput["items"][number];

function AggregatedByOrgRow({
  item,
  compact,
}: {
  item: AggregatedByOrgItem;
  compact: boolean;
}): React.JSX.Element {
  if (compact) {
    return (
      <Div className="py-1 text-sm font-mono">
        {`${item.org}/${item.resourceType}: qty=${item.quantity} used=${item.used}`}
      </Div>
    );
  }

  return (
    <Div className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-accent transition-colors">
      <Div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <BarChart2 className="h-4 w-4 text-primary" />
      </Div>

      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-semibold text-sm">{item.resourceType}</Span>
          <Span className="text-xs text-muted-foreground">{item.org}</Span>
        </Div>
        <Div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground font-mono flex-wrap">
          <Span>{`qty:${item.quantity}`}</Span>
          <Span>{`used:${item.used}`}</Span>
          <Span>{`licensed:${item.licensed}`}</Span>
          <Span>{`granted:${item.granted}`}</Span>
          <Span>{`grantedUsed:${item.grantedUsed}`}</Span>
          <Span>{`freeUpdate:${item.lastUpdateFreeQuantity}`}</Span>
        </Div>
      </Div>
    </Div>
  );
}

export function SubscriptionsAggregatedByOrgContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();

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
          {t("post.widget.title")} ({items.length})
        </Div>
        {items.length === 0 ? (
          <Div className="text-muted-foreground">
            {t("post.widget.noItemsFound")}
          </Div>
        ) : (
          items.map((item, idx) => (
            <AggregatedByOrgRow key={idx} item={item} compact={true} />
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
          title={t("post.widget.back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <BarChart2 className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("post.widget.title")}
          {items.length > 0 && (
            <Span className="ml-2 text-xs text-muted-foreground font-normal">
              ({items.length})
            </Span>
          )}
        </Span>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))]">
        {isLoading ? (
          <Div className="h-48 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </Div>
        ) : items.length === 0 ? (
          <Div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <BarChart2 className="h-8 w-8 opacity-30" />
            <Span className="text-sm">{t("post.widget.noItemsFound")}</Span>
          </Div>
        ) : (
          items.map((item, idx) => (
            <AggregatedByOrgRow key={idx} item={item} compact={false} />
          ))
        )}
      </Div>
    </Div>
  );
}
