"use client";

import { PUBLIC_FEED_ALIAS } from "next-vibe/agent/chat/public-feed/constants";
import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { CategorySummaryPanel } from "next-vibe/unified-ui/_shared/category-summary-panel";
import { formatDocDate } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function PublishingSummaryWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const response = useWidgetResponse();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const navigation = useWidgetNavigation();
  const interactive = useWidgetIsInteractive();

  if (!data?.summary) {
    return (
      <>
        <FormAlertWidget field={{}} />
        {response?.success !== false && (
          <P aria-live="polite" className="text-sm text-muted-foreground">
            {t("loading")}
          </P>
        )}
      </>
    );
  }

  const noIndexingHistory = data.indexingSnapshotOn === null;
  const summary = noIndexingHistory
    ? {
        ...data.summary,
        kpis: data.summary.kpis.filter(({ label }) => label !== "savedUrls"),
      }
    : data.summary;

  return (
    <Div className="min-w-0 space-y-3">
      <P className="text-xs text-muted-foreground">
        {t("snapshotOn", { date: formatDocDate(data.summary.to, locale) })}
      </P>
      <Div className="grid grid-cols-2 gap-2">
        <CategorySummaryPanel
          summary={summary}
          locale={locale}
          translate={(key) => t(key)}
          section="metrics"
          attentionTitle=""
          clearLabel=""
          unavailable=""
          recentTitle=""
          onOpen={
            interactive
              ? (drill): void => {
                  if (drill.alias === PUBLIC_FEED_ALIAS) {
                    void (async (): Promise<void> => {
                      const { default: forum } =
                        await import("next-vibe/agent/chat/public-feed/definition");
                      navigation.push(forum.GET, {});
                    })();
                  }
                }
              : undefined
          }
        />
        {noIndexingHistory && (
          <Div className="flex min-w-0 flex-col gap-2 rounded-lg border bg-card px-4 py-3">
            <Span className="text-xs font-medium text-muted-foreground">
              {t("savedUrls")}
            </Span>
            <Span className="text-sm font-semibold">
              {t("noIndexingRecordsYet")}
            </Span>
          </Div>
        )}
      </Div>
      <Div className="grid gap-2 @2xl:grid-cols-2">
        <P className="text-xs text-muted-foreground">
          {data.newestThreadOn
            ? t("newestOn", {
                date: formatDocDate(data.newestThreadOn, locale),
              })
            : t("noThreads")}
        </P>
        {data.indexingSnapshotOn && (
          <P className="text-xs text-muted-foreground">
            {t("indexingSavedOn", {
              date: formatDocDate(data.indexingSnapshotOn, locale),
            })}
          </P>
        )}
      </Div>
    </Div>
  );
}
