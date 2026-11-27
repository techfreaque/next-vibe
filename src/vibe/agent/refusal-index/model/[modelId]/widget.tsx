"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import { BarChart } from "next-vibe/ui/components/icons/BarChart";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { RecordTable } from "next-vibe/ui/components/record-table";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import {
  StatusPill,
  type StatusPillVariant,
} from "next-vibe/ui/components/status-pill";
import { H2, P } from "next-vibe/ui/components/typography";
import { AdminRecordDetail } from "next-vibe/unified-ui/_shared/admin-record-detail";
import {
  formatDocDate,
  formatPercent,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetEndpointMutations,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { RefusalVerdict } from "../../enum";
import type definition from "./definition";
import type { ModelStatsResponseOutput } from "./definition";

type Sample = ModelStatsResponseOutput["samples"][number];
type T = ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;

const CONTENT_LABELS = {
  "enums.content.mainstream": { variant: "muted" },
  "enums.content.open": { variant: "info" },
  "enums.content.uncensored": { variant: "warning" },
} as const satisfies Record<string, { variant: StatusPillVariant }>;

const CATEGORY_LABELS = {
  politics: "model.widget.categories.politics",
  history: "model.widget.categories.history",
  health: "model.widget.categories.health",
  drugs: "model.widget.categories.drugs",
  sexuality: "model.widget.categories.sexuality",
  security: "model.widget.categories.security",
  religion: "model.widget.categories.religion",
  law: "model.widget.categories.law",
  science: "model.widget.categories.science",
  fiction: "model.widget.categories.fiction",
  satire: "model.widget.categories.satire",
} as const;

const VERDICT_VARIANT: Record<string, StatusPillVariant> = {
  [RefusalVerdict.ANSWERED]: "success",
  [RefusalVerdict.HEDGED]: "warning",
  [RefusalVerdict.REFUSED]: "danger",
  [RefusalVerdict.ERROR]: "muted",
};

function isContentKey(value: string): value is keyof typeof CONTENT_LABELS {
  return value in CONTENT_LABELS;
}

function isCategoryKey(value: string): value is keyof typeof CATEGORY_LABELS {
  return value in CATEGORY_LABELS;
}

function categoryLabel(category: string, t: T): string {
  return isCategoryKey(category) ? t(CATEGORY_LABELS[category]) : category;
}

/** Rates are stored as 0-100 with one decimal. */
function rate(value: number, locale: CountryLanguage): string {
  return formatPercent(value / 100, locale);
}

function localizedQuestion(sample: Sample, locale: CountryLanguage): string {
  const language = locale.slice(0, 2);
  const byLanguage: Record<string, string | null> = {
    de: sample.questionDe,
    pl: sample.questionPl,
    fr: sample.questionFr,
    it: sample.questionIt,
    es: sample.questionEs,
    sk: sample.questionSk,
    hi: sample.questionHi,
  };
  return byLanguage[language] ?? sample.questionEn;
}

function renderCategoryCell(label: string): JSX.Element {
  return <Span className="font-medium">{label}</Span>;
}

function renderRefusedCell(
  value: number,
  locale: CountryLanguage,
): JSX.Element {
  return (
    <Span className={value > 0 ? "text-destructive" : "text-muted-foreground"}>
      {rate(value, locale)}
    </Span>
  );
}

export function ModelStatsWidget({
  field,
}: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const response = useWidgetResponse();
  const read = useWidgetEndpointMutations()?.read;
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const interactive = useWidgetIsInteractive();

  if (!data) {
    if (response?.success === false) {
      return (
        <AdminRecordDetail
          title={t("model.title")}
          state={{
            kind: "error",
            title: t("model.widget.loadError"),
            message: response.message,
          }}
        />
      );
    }
    if (interactive && !read?.isLoading) {
      return (
        <AdminRecordDetail
          title={t("model.title")}
          subtitle={t("model.description")}
        >
          <Div className="flex flex-col gap-3 rounded-lg border bg-card p-4 @lg:flex-row @lg:items-end">
            <Div className="min-w-0 flex-1">
              <TextFieldWidget
                fieldName="modelId"
                field={field.children.modelId}
              />
            </Div>
            <SubmitButtonWidget<typeof definition.GET>
              field={{ text: "model.widget.lookup" }}
            />
          </Div>
        </AdminRecordDetail>
      );
    }
    return (
      <AdminRecordDetail
        title={t("model.title")}
        state={{ kind: "loading", label: t("model.title") }}
      />
    );
  }

  const tier = data.tier && isContentKey(data.tier) ? data.tier : null;
  const status = tier
    ? {
        status: tier,
        label: t(tier),
        variant: CONTENT_LABELS[tier].variant,
      }
    : undefined;

  const technicalDetails = data.judgeModelId
    ? [
        {
          key: "judgeModelId",
          label: t("public.fields.judgeModelId.label"),
          value: data.judgeModelId,
        },
      ]
    : [];

  if (!data.hasData || data.judged === 0) {
    return (
      <AdminRecordDetail
        title={data.name}
        subtitle={t("model.widget.subtitle")}
        status={status}
        technicalDetails={technicalDetails}
        state={{
          kind: "empty",
          icon: <BarChart className="size-5 text-muted-foreground" />,
          title: t("model.widget.noDataTitle"),
          message: t("model.widget.noDataMessage"),
        }}
      />
    );
  }

  const trendText =
    data.trend === null
      ? t("model.widget.noTrend")
      : t("model.widget.trendValue", {
          delta: `${data.trend > 0 ? "+" : ""}${data.trend.toLocaleString(locale)}`,
        });

  const columns = [
    { id: "category", label: t("public.fields.category.label") },
    { id: "judged", label: t("public.fields.judged.label"), numeric: true },
    { id: "answered", label: t("enums.verdict.answered"), numeric: true },
    { id: "hedged", label: t("enums.verdict.hedged"), numeric: true },
    { id: "refused", label: t("enums.verdict.refused"), numeric: true },
  ];
  const rows = data.categoryBreakdown.map((row) => ({
    id: row.category,
    cells: {
      category: renderCategoryCell(categoryLabel(row.category, t)),
      judged: row.judged.toLocaleString(locale),
      answered: rate(row.answeredPct, locale),
      hedged: rate(row.hedgedPct, locale),
      refused: renderRefusedCell(row.refusedPct, locale),
    },
  }));

  return (
    <AdminRecordDetail
      title={data.name}
      subtitle={t("model.widget.subtitle")}
      status={status}
      technicalDetails={technicalDetails}
      facts={[
        {
          key: "rank",
          label: t("model.widget.rank"),
          value:
            data.rank === null
              ? t("model.widget.notRanked")
              : t("model.widget.rankValue", {
                  rank: data.rank,
                  total: data.rankedModels,
                }),
        },
        { key: "trend", label: t("model.widget.trend"), value: trendText },
        {
          key: "judged",
          label: t("public.fields.judged.label"),
          value: data.judged.toLocaleString(locale),
        },
        {
          key: "updated",
          label: t("public.fields.runFinishedAt.label"),
          value: data.runFinishedAt
            ? formatDocDate(data.runFinishedAt, locale)
            : undefined,
        },
        {
          key: "questions",
          label: t("public.fields.questionCount.label"),
          value: data.questionCount.toLocaleString(locale),
        },
        {
          key: "judge",
          label: t("public.fields.judgeModelName.label"),
          value: data.judgeModelName
            ? `${data.judgeModelName}${data.judgePromptVersion ? ` · ${data.judgePromptVersion}` : ""}`
            : undefined,
        },
      ]}
    >
      <MetricGrid columns={3}>
        <MetricCard
          label={t("enums.verdict.answered")}
          value={rate(data.answeredPct, locale)}
          variant={data.answeredPct > 0 ? "success" : "muted"}
        />
        <MetricCard
          label={t("enums.verdict.hedged")}
          value={rate(data.hedgedPct, locale)}
          variant={data.hedgedPct > 0 ? "warning" : "muted"}
        />
        <MetricCard
          label={t("enums.verdict.refused")}
          value={rate(data.refusedPct, locale)}
          variant={data.refusedPct > 0 ? "danger" : "muted"}
        />
      </MetricGrid>

      {rows.length > 0 && (
        <Div className="flex min-w-0 flex-col gap-2">
          <H2 className="border-0 pb-0 text-[15px] font-semibold tracking-normal">
            {t("model.widget.breakdown")}
          </H2>
          <RecordTable
            label={t("model.widget.breakdown")}
            columns={columns}
            rows={rows}
            compact={
              <Div className="divide-y rounded-lg border bg-card">
                {data.categoryBreakdown.map((row) => (
                  <Div
                    key={row.category}
                    className="flex min-w-0 items-center justify-between gap-3 px-3 py-2.5"
                  >
                    <Span className="font-medium">
                      {categoryLabel(row.category, t)}
                    </Span>{" "}
                    <Span className="text-sm tabular-nums text-muted-foreground">
                      {`${rate(row.answeredPct, locale)} / ${rate(row.hedgedPct, locale)} / ${rate(row.refusedPct, locale)}`}
                    </Span>
                  </Div>
                ))}
              </Div>
            }
          />
        </Div>
      )}

      <SectionGroup title={t("model.widget.samples")}>
        {data.samples.length === 0 ? (
          <P className="px-1 text-sm text-muted-foreground">
            {t("model.widget.samplesEmpty")}
          </P>
        ) : (
          <Div className="flex flex-col divide-y">
            {data.samples.map((sample) => (
              <Div
                key={sample.id}
                className="flex min-w-0 flex-col gap-1.5 py-3 first:pt-0 last:pb-0"
              >
                <Div className="flex flex-wrap items-center gap-2">
                  <StatusPill
                    status={sample.verdict}
                    label={t(sample.verdict)}
                    variant={VERDICT_VARIANT[sample.verdict] ?? "muted"}
                  />
                  <Span className="text-xs text-muted-foreground">
                    {categoryLabel(sample.category, t)}
                  </Span>
                </Div>
                <Span className="text-sm font-medium">
                  {localizedQuestion(sample, locale)}
                </Span>
                <P className="line-clamp-4 whitespace-pre-wrap text-sm">
                  {sample.answerExcerpt}
                </P>
                {sample.judgeReason && (
                  <P className="text-[13px] text-muted-foreground">
                    {`${t("model.widget.judge")}: ${sample.judgeReason}`}
                  </P>
                )}
              </Div>
            ))}
          </Div>
        )}
      </SectionGroup>
    </AdminRecordDetail>
  );
}
