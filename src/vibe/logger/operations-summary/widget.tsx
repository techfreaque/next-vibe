"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { CheckCircle2 } from "next-vibe/ui/components/icons/CheckCircle2";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { CategorySummaryPanel } from "next-vibe/unified-ui/_shared/category-summary-panel";
import { formatDocDate } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetEndpointMutations,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { resolveEndpoint } from "next-vibe/unified-ui/hooks/resolve-endpoint";
import type { JSX } from "react";

import type definition from "./definition";

export function OperationsSummaryWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const response = useWidgetResponse();
  const mutations = useWidgetEndpointMutations();
  const { push } = useWidgetNavigation();
  const embedded = interactive && responseOnly;
  const open = ({
    alias,
    args,
    urlPathParams,
  }: {
    alias: string;
    args?: Record<string, string>;
    urlPathParams?: Record<string, string>;
  }): void => {
    void resolveEndpoint(alias)
      .catch(() => null)
      .then((endpoint) => {
        if (endpoint) {
          push(endpoint, { data: args, urlPathParams });
        }
        return undefined;
      });
  };

  return (
    <WidgetShell
      layout={embedded ? "compact" : "page"}
      padding={embedded ? "none" : undefined}
    >
      {!embedded && (
        <WidgetHeader
          size="page"
          title={t("title")}
          subtitle={t("description")}
        />
      )}
      {data?.summary ? (
        <>
          <P className="text-xs text-muted-foreground">
            {t("snapshot", { date: formatDocDate(data.summary.to, locale) })}
          </P>
          <Div className="grid grid-cols-2 gap-2 [&>:last-child]:col-span-2 @2xl:grid-cols-3 @2xl:[&>:last-child]:col-span-1">
            <CategorySummaryPanel
              summary={data.summary}
              section="metrics"
              locale={locale}
              translate={(key, args) => t(key, args)}
              sectionName={t("title")}
              attentionTitle={t("attention")}
              clearLabel={t("clear")}
              unavailable={t("unavailable")}
              recentTitle={t("recent")}
              onOpen={interactive ? open : undefined}
            />
          </Div>
          <Div className="space-y-2 rounded-lg border bg-card p-3">
            <P className="text-sm font-semibold">{t("attention")}</P>
            {data.summary.attention.map((alert) => {
              const action =
                alert.label === "errorAlert"
                  ? t("reviewErrors")
                  : alert.label === "taskAlert"
                    ? t("reviewTasks")
                    : t("reviewConnections");
              const count = new Intl.NumberFormat(locale).format(alert.count);
              return (
                <Div
                  key={alert.label}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2"
                >
                  <Div className="flex min-w-0 items-center gap-2">
                    <AlertTriangle
                      className={
                        alert.severity === "danger"
                          ? "size-4 shrink-0 text-destructive"
                          : "size-4 shrink-0 text-warning"
                      }
                      aria-hidden="true"
                    />
                    <P className="text-sm">{t(alert.label, { count })}</P>
                  </Div>
                  {interactive && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => open(alert.drill)}
                    >
                      {action}
                    </Button>
                  )}
                </Div>
              );
            })}
            {!data.summary.attentionAvailable ? (
              <P className="text-sm text-muted-foreground">
                {t("unavailable")}
              </P>
            ) : (
              data.summary.attention.length === 0 && (
                <Div className="flex items-center gap-2">
                  <CheckCircle2
                    className="size-4 text-success"
                    aria-hidden="true"
                  />
                  <P className="text-sm text-muted-foreground">{t("clear")}</P>
                </Div>
              )
            )}
          </Div>
        </>
      ) : response?.success === false ? (
        <EmptyBlock
          title={t("unavailable")}
          message={response.message}
          action={
            interactive
              ? {
                  label: t("retry"),
                  onClick: () => void mutations?.read?.refetch(),
                }
              : undefined
          }
        />
      ) : (
        <Div className="space-y-2">
          <P className="text-sm text-muted-foreground">{t("loading")}</P>
          <Div className="grid grid-cols-2 gap-2 @lg:grid-cols-3">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </Div>
        </Div>
      )}
    </WidgetShell>
  );
}
