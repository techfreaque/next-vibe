"use client";

import { Div } from "next-vibe/ui/components/div";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import type { JSX } from "react";

import {
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "../../../unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "../../../unified-ui/widgets/form-fields/boolean-field/widget";
import { TagsFieldWidget } from "../../../unified-ui/widgets/form-fields/tags-field/widget";
import { FormAlertWidget } from "../../../unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "../../../unified-ui/widgets/interactive/submit-button/widget";
import type definition from "./definition";

export function PulseExecuteWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const locale = useWidgetLocale();

  return (
    <WidgetShell layout="page" className="mx-auto max-w-3xl">
      <WidgetHeader
        size="page"
        title={t("post.title")}
        subtitle={t("post.container.description")}
        actions={
          interactive &&
          !responseOnly && (
            <SubmitButtonWidget<typeof definition.POST>
              field={{ className: "h-10 w-full @lg:w-auto" }}
            />
          )
        }
      />
      <FormAlertWidget field={{}} />
      {interactive && !responseOnly && (
        <Div className="grid min-w-0 gap-4 rounded-lg border bg-card p-4 @md:grid-cols-2">
          <BooleanFieldWidget
            fieldName="dryRun"
            field={field.children.dryRun}
          />
          <BooleanFieldWidget fieldName="force" field={field.children.force} />
          <Div className="@md:col-span-2">
            <TagsFieldWidget
              fieldName="taskNames"
              field={field.children.taskNames}
            />
          </Div>
        </Div>
      )}
      {data && (
        <>
          <ResultBanner
            variant={data.success ? "success" : "danger"}
            title={data.message}
          />
          <MetricGrid columns={2}>
            <MetricCard
              label={t("post.response.tasksExecuted")}
              value={new Intl.NumberFormat(locale).format(data.tasksExecuted)}
            />
            <MetricCard
              label={t("post.response.executedAt")}
              value={new Intl.DateTimeFormat(locale, {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(data.executedAt))}
            />
          </MetricGrid>
          {data.results.length > 0 && (
            <Div className="divide-y rounded-lg border bg-card">
              {data.results.map((result) => (
                <Div
                  className="flex min-w-0 items-center justify-between gap-3 p-4"
                  key={result.taskName}
                >
                  <Div className="min-w-0 break-words text-sm font-medium">
                    {result.taskName}
                  </Div>
                  <StatusPill
                    status={t(
                      result.success
                        ? "post.response.success"
                        : "post.response.executionFailed",
                    )}
                    variant={result.success ? "success" : "danger"}
                  />
                </Div>
              ))}
            </Div>
          )}
        </>
      )}
    </WidgetShell>
  );
}
