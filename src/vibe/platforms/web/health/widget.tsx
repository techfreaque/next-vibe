"use client";

import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import type { JSX } from "react";

import { toIntlLocale } from "../../../core/i18n/core/language-utils";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "../../../unified-ui/_shared/use-widget-context";
import { formatDuration } from "../../../unified-ui/analytics/format";
import { BooleanFieldWidget } from "../../../unified-ui/widgets/form-fields/boolean-field/widget";
import { FormAlertWidget } from "../../../unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "../../../unified-ui/widgets/interactive/submit-button/widget";
import type definition from "./definition";
import type { ServerHealthTranslationKey } from "./i18n";

const checkLabels: Record<string, ServerHealthTranslationKey> = {
  drain: "get.widget.checks.traffic",
  basic: "get.widget.checks.process",
  database: "get.response.database.title",
  tasks: "get.response.tasks.title",
  system: "get.response.system.title",
};

const healthVariants = {
  healthy: "success",
  warning: "warning",
  critical: "danger",
  unknown: "muted",
} as const;

export function HealthCheckWidget({
  field,
}: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();
  const response = useWidgetResponse();
  const form = useWidgetForm<typeof definition.GET>();
  const locale = useWidgetLocale();
  const isInteractive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const interactive = isInteractive && !responseOnly;
  const detailed = form?.watch("detailed") ?? true;
  const displayLocale = toIntlLocale(locale);
  const checkedAt = data?.timestamp && new Date(data.timestamp);
  const formatNumber = new Intl.NumberFormat(displayLocale, {
    maximumFractionDigits: 2,
  });
  const formatPercent = new Intl.NumberFormat(displayLocale, {
    style: "percent",
    maximumFractionDigits: 1,
  });
  const hasSystemCheck = data?.checks.some(({ name }) => name === "system");
  const { children } = field;

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("get.title")}
        subtitle={t("get.description")}
        titleAccessory={
          data && (
            <StatusPill
              status={t(`get.widget.health.${data.status}`)}
              variant={healthVariants[data.status]}
            />
          )
        }
        actions={
          interactive && (
            <SubmitButtonWidget<typeof definition.GET>
              field={{ className: "h-10 w-full @lg:w-auto" }}
              label={t("get.widget.refresh")}
            />
          )
        }
      />

      {interactive && (
        <SectionGroup title={t("get.form.title")}>
          <Div className="grid min-w-0 gap-3 p-4 @md:grid-cols-2">
            <BooleanFieldWidget
              fieldName="includeDatabase"
              field={children.includeDatabase}
            />
            <BooleanFieldWidget
              fieldName="includeTasks"
              field={children.includeTasks}
            />
            <BooleanFieldWidget
              fieldName="includeSystem"
              field={children.includeSystem}
            />
            <BooleanFieldWidget
              fieldName="detailed"
              field={children.detailed}
            />
          </Div>
        </SectionGroup>
      )}

      <FormAlertWidget field={{}} />
      {!data && response?.success !== false && (
        <LoadingBlock message={t("get.title")} />
      )}
      {data && (
        <>
          <SectionGroup title={t("get.response.checks.title")}>
            <Div className="grid divide-y">
              {data.checks.map((check) => {
                const title = checkLabels[check.name];
                return (
                  <Div
                    key={check.name}
                    className="flex min-w-0 items-start justify-between gap-3 px-4 py-3"
                  >
                    <Div className="min-w-0">
                      <P className="text-sm font-medium">
                        {title ? t(title) : check.name}
                      </P>
                      {check.message &&
                        (detailed || check.status !== "pass") && (
                          <P className="mt-0.5 break-words text-xs text-muted-foreground">
                            {check.message}
                          </P>
                        )}
                    </Div>
                    <Div className="flex shrink-0 flex-col items-end gap-1">
                      <StatusPill
                        status={t(`get.widget.results.${check.status}`)}
                        variant={
                          check.status === "pass"
                            ? "success"
                            : check.status === "warn"
                              ? "warning"
                              : "danger"
                        }
                      />
                      {detailed && check.duration !== undefined && (
                        <P className="text-xs tabular-nums text-muted-foreground">
                          {formatDuration(check.duration, locale)}
                        </P>
                      )}
                    </Div>
                  </Div>
                );
              })}
            </Div>
          </SectionGroup>
          <SectionGroup title={t("get.response.environment.title")}>
            <DetailGrid columns={3} className="p-4">
              <DetailField
                label={t("get.response.timestamp.title")}
                value={
                  checkedAt && Number.isFinite(checkedAt.getTime())
                    ? new Intl.DateTimeFormat(displayLocale, {
                        dateStyle: "medium",
                        timeStyle: "medium",
                      }).format(checkedAt)
                    : undefined
                }
              />
              <DetailField
                label={t("get.response.uptime.title")}
                value={formatDuration(data.uptime, locale)}
              />
              {detailed && (
                <>
                  <DetailField
                    label={t("get.response.environment.name.title")}
                    value={data.environment.name}
                  />
                  <DetailField
                    label={t("get.response.environment.nodeEnv.title")}
                    value={data.environment.nodeEnv}
                  />
                  <DetailField
                    label={t("get.response.environment.platform.title")}
                    value={data.environment.platform}
                  />
                  {data.revision && (
                    <DetailField
                      label={t("get.response.revision.title")}
                      value={data.revision}
                      mono
                    />
                  )}
                </>
              )}
            </DetailGrid>
          </SectionGroup>
          {hasSystemCheck && (
            <SectionGroup title={t("get.response.system.title")}>
              <DetailGrid columns={3} className="p-4">
                <DetailField
                  label={t("get.response.system.memory.percentage.title")}
                  value={formatPercent.format(
                    data.system.memory.percentage / 100,
                  )}
                />
                <DetailField
                  label={t("get.response.system.cpu.loadAverage.title")}
                  value={data.system.cpu.loadAverage
                    .map((value) => formatNumber.format(value))
                    .join(" · ")}
                />
              </DetailGrid>
            </SectionGroup>
          )}
        </>
      )}
    </WidgetShell>
  );
}
