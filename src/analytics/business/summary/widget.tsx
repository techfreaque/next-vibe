"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { P } from "next-vibe/ui/components/typography";
import { CategorySummaryPanel } from "next-vibe/unified-ui/_shared/category-summary-panel";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useApiQuery } from "next-vibe/unified-ui/hooks/use-api-query";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { type JSX, useEffect, useState } from "react";

import definitions, {
  type PlatformSummaryInput,
  type PlatformSummaryOutput,
} from "./definition";

type Section = NonNullable<PlatformSummaryInput["section"]>;
const SUMMARY_TIMEOUT_MS = 12_000;

const sectionLabels = {
  acquisition: ["get.widget.kpi.humanLeads", "get.widget.kpi.signups"],
  money: ["get.widget.kpi.payers", "get.widget.kpi.revenue"],
  payments: [
    "get.widget.kpi.payers",
    "platformSummary.grossReceipts",
    "platformSummary.refunds",
    "platformSummary.netReceipts",
  ],
  operations: ["get.widget.alerts.title"],
  usage: ["platformSummary.valuationCost", "platformSummary.valuationMargin"],
  activity: ["platformSummary.recent"],
} as const;

function SummaryPanel({
  summary,
  section,
  source,
}: {
  summary: PlatformSummaryOutput["summary"];
  section?: "metrics" | "attention" | "recent";
  source?: Section;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definitions.GET>();
  const locale = useWidgetLocale();
  const interactive = useWidgetIsInteractive();
  const navigation = useWidgetNavigation();
  return (
    <CategorySummaryPanel
      summary={summary}
      section={section}
      locale={locale}
      translate={(key, args) => t(key, args)}
      sectionName={
        source === "payments" ? undefined : t("platformSummary.operations")
      }
      emptyRecent={
        source === "payments"
          ? t("platformSummary.emptyPayments")
          : section === "recent"
            ? t("platformSummary.emptyActivity")
            : undefined
      }
      attentionTitle={t("get.widget.alerts.title")}
      clearLabel={t("get.widget.alerts.none")}
      unavailable={t("platformSummary.unavailable")}
      recentTitle={
        source === "payments"
          ? t("platformSummary.recentPayments")
          : t("platformSummary.recent")
      }
      onOpen={
        interactive
          ? (drill) => {
              void (async (): Promise<void> => {
                const { getEndpoint } =
                  await import("@/generated/endpoints/endpoint");
                const target = await getEndpoint(drill.alias);
                if (target) {
                  navigation.push(target, {
                    data: drill.args,
                    urlPathParams: drill.urlPathParams,
                  });
                }
              })();
            }
          : undefined
      }
    />
  );
}

function SummarySection({ section }: { section: Section }): JSX.Element {
  const t = useWidgetTranslation<typeof definitions.GET>();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const locale = useWidgetLocale();
  const [attempt, setAttempt] = useState(0);
  const [expired, setExpired] = useState<number | null>(null);
  const read = useApiQuery({
    endpoint: definitions.GET,
    requestData: { section },
    logger,
    user,
    options: {
      queryKey: `platform-summary:${user.id}:${locale}:${section}:${attempt}`,
      retry: 0,
    },
  });
  const ready = read.isLoadingFresh ? undefined : read.data?.summary;
  useEffect(() => {
    if (ready || read.isError) {
      return;
    }
    const timer = setTimeout(() => setExpired(attempt), SUMMARY_TIMEOUT_MS);
    return (): void => clearTimeout(timer);
  }, [attempt, ready, read.isError]);
  if (ready && section === "payments") {
    return (
      <Div className="min-w-0 space-y-3">
        <Div className="grid grid-cols-2 gap-2 @2xl:grid-cols-4">
          <SummaryPanel summary={ready} section="metrics" source={section} />
        </Div>
        <SummaryPanel summary={ready} section="attention" source={section} />
        <SummaryPanel summary={ready} section="recent" source={section} />
      </Div>
    );
  }
  if (ready) {
    return (
      <SummaryPanel
        summary={ready}
        section={
          section === "operations"
            ? "attention"
            : section === "activity"
              ? "recent"
              : "metrics"
        }
      />
    );
  }

  const tiles = "flex min-w-0 flex-col gap-2 rounded-lg border bg-card p-3";
  const failed = read.isError || expired === attempt;
  if (section === "payments" && !failed) {
    return (
      <Div className="min-w-0 space-y-3" aria-busy={true}>
        <Div className="grid grid-cols-2 gap-2 @2xl:grid-cols-4">
          {sectionLabels.payments.map((label) => (
            <Div key={label} className={tiles}>
              <P className="text-sm font-medium">{t(label)}</P>
              <Skeleton className="h-8 w-3/4" />
            </Div>
          ))}
        </Div>
        <Div className={tiles}>
          <P className="text-sm font-semibold">
            {t("platformSummary.recentPayments")}
          </P>
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </Div>
      </Div>
    );
  }
  const fallback = (
    <>
      {sectionLabels[section].map((label) => (
        <Div
          key={label}
          className={tiles}
          aria-live="polite"
          aria-busy={!failed}
        >
          <P className="text-sm font-medium">{t(label)}</P>
          {failed ? (
            <>
              <P className="text-sm text-muted-foreground">
                {t("platformSummary.unavailable")}
              </P>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="self-start"
                onClick={() => setAttempt((n) => n + 1)}
              >
                {t("platformSummary.retry")}
              </Button>
            </>
          ) : (
            <Skeleton className="h-8 w-3/4" />
          )}
        </Div>
      ))}
    </>
  );
  return section === "payments" ? (
    <Div className="grid grid-cols-2 gap-2 @2xl:grid-cols-4">{fallback}</Div>
  ) : (
    fallback
  );
}

export function PlatformSummaryWidget(): JSX.Element {
  const response = useWidgetValue<typeof definitions.GET>();
  const t = useWidgetTranslation<typeof definitions.GET>();
  const embedded = useWidgetResponseOnly();
  const form = useWidgetForm<typeof definitions.GET>();
  const section = form?.getValues("section");
  const home = form?.getValues("profile") === "home";
  const interactive = useWidgetIsInteractive();
  if (response?.summary) {
    return <SummaryPanel summary={response.summary} />;
  }
  if (section && embedded && interactive) {
    return (
      <Div className="min-w-0 space-y-3">
        <P className="text-xs text-muted-foreground">
          {t("platformSummary.period")}
        </P>
        <Div
          className={
            section === "operations" ||
            section === "activity" ||
            section === "payments"
              ? ""
              : "grid grid-cols-2 gap-2"
          }
        >
          <SummarySection section={section} />
        </Div>
      </Div>
    );
  }
  if (embedded && interactive) {
    return (
      <Div className="min-w-0 space-y-3">
        <P className="text-xs text-muted-foreground">
          {t("platformSummary.period")}
        </P>
        <Div className="grid grid-cols-2 gap-2 @2xl:grid-cols-4">
          <SummarySection section="acquisition" />
          <SummarySection section="money" />
        </Div>
        {home && (
          <Div className="space-y-1.5">
            <Div className="grid grid-cols-2 gap-2">
              <SummarySection section="usage" />
            </Div>
            <P className="text-xs text-muted-foreground">
              {t("platformSummary.valuationBasis")}
            </P>
          </Div>
        )}
        <SummarySection section="operations" />
        {home && <SummarySection section="activity" />}
      </Div>
    );
  }
  return (
    <>
      <FormAlertWidget field={{}} />
      <P className="text-sm text-muted-foreground">{t("get.widget.loading")}</P>
    </>
  );
}
