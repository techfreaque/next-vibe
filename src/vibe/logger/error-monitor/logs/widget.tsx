"use client";

import { Button } from "next-vibe/ui/components/button";
import { DatePicker } from "next-vibe/ui/components/date-picker";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { Input } from "next-vibe/ui/components/input";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Pre } from "next-vibe/ui/components/pre";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { type JSX, useState } from "react";

import { Platform } from "../../../platforms/platforms";
import { useRelatedEntityNavigation } from "../../../unified-ui/_shared/related-entities";
import {
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "../../../unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "../../../unified-ui/widgets/form-fields/boolean-field/widget";
import { TextFieldWidget } from "../../../unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "../../../unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "../../../unified-ui/widgets/interactive/submit-button/widget";
import { ERROR_LOGS_PAGE_SIZE } from "./constants";
import type endpoints from "./definition";
import type { ErrorLogsResponseOutput } from "./definition";
import { ErrorLogStatusFilter, ErrorLogStatusFilterOptions } from "./enum";

type ErrorLog = ErrorLogsResponseOutput["logs"][number];

function ErrorLogCard({
  log,
  onUpdate,
}: {
  log: ErrorLog;
  onUpdate: () => void;
}): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const locale = useWidgetLocale();
  const platform = useWidgetPlatform();
  const widgetIsInteractive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const isInteractive = widgetIsInteractive && !responseOnly;
  const showDetails =
    expanded || platform === Platform.CLI || platform === Platform.MCP;
  const date = (value: string): string =>
    new Date(value).toLocaleString(locale, { timeZoneName: "short" });

  return (
    <Div className="flex min-w-0 flex-col gap-3 rounded-lg border bg-card p-3">
      <Div className="flex flex-wrap items-center gap-2">
        <StatusPill
          status={
            log.resolved
              ? t("widget.status.resolved")
              : t("widget.status.active")
          }
          variant={log.resolved ? "success" : "warning"}
        />
        <StatusPill
          status={
            log.level === "warn"
              ? t("widget.severity.warning")
              : t("widget.severity.error")
          }
          variant={log.level === "warn" ? "warning" : "danger"}
        />
        {log.errorType && (
          <Span className="min-w-0 font-mono text-xs text-muted-foreground [overflow-wrap:anywhere]">
            {log.errorType}
          </Span>
        )}
      </Div>
      <Span className="text-sm font-medium [overflow-wrap:anywhere]">
        {log.message}
      </Span>
      <DetailGrid columns={3}>
        <DetailField
          label={t("widget.col.occurrences")}
          value={log.occurrences.toLocaleString(locale)}
        />
        <DetailField
          label={t("widget.col.firstSeen")}
          value={date(log.firstSeen)}
        />
        <DetailField
          label={t("widget.col.createdAt")}
          value={date(log.createdAt)}
        />
      </DetailGrid>
      {isInteractive && (
        <Div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-expanded={showDetails}
            onClick={() => setExpanded(!expanded)}
          >
            {t("widget.detail.context")}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onUpdate}>
            {log.resolved
              ? t("widget.action.reopen")
              : t("widget.action.resolve")}
          </Button>
        </Div>
      )}
      {showDetails && (
        <Div className="flex min-w-0 flex-col gap-3 border-t pt-3">
          <DetailGrid columns={2}>
            <DetailField
              label={t("patch.fields.id.label")}
              value={log.id}
              mono
              copyable
            />
            <DetailField
              label={t("patch.fields.fingerprint.label")}
              value={log.fingerprint}
              mono
              copyable
            />
          </DetailGrid>
          {log.stackTrace && (
            <Div className="flex min-w-0 flex-col gap-1">
              <Span className="text-xs font-medium">
                {t("widget.detail.stackTrace")}
              </Span>
              <Pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-xs [overflow-wrap:anywhere]">
                {log.stackTrace}
              </Pre>
            </Div>
          )}
          {log.metadata && log.metadata.length > 0 && (
            <Div className="flex min-w-0 flex-col gap-1">
              <Span className="text-xs font-medium">
                {t("widget.detail.metadata")}
              </Span>
              <Pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-xs [overflow-wrap:anywhere]">
                {JSON.stringify(log.metadata, null, 2)}
              </Pre>
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}

export function ErrorLogsContainer(): JSX.Element {
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const locale = useWidgetLocale();
  const form = useWidgetForm<typeof endpoints.GET>();
  const widgetIsInteractive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const isInteractive = widgetIsInteractive && !responseOnly;
  const { pop, canGoBack } = useWidgetNavigation();
  const navigateRelated = useRelatedEntityNavigation();
  const read = useWidgetEndpointMutations()?.read;
  const response = useWidgetResponse();
  const data = useWidgetValue<typeof endpoints.GET>();
  const [datePickerVersion, setDatePickerVersion] = useState(0);
  const status = form.watch("status") ?? ErrorLogStatusFilter.ACTIVE;
  const search = form.watch("search") ?? "";
  const errorType = form.watch("errorType") ?? "";
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const pageSize = form.watch("limit") || ERROR_LOGS_PAGE_SIZE;
  const offset = form.watch("offset") ?? 0;
  const setOffset = (value: number): void =>
    form.setValue("offset", value, { shouldDirty: true });
  const hasError = response?.success === false;
  const isLoading = !hasError && (!data || read?.isLoading);
  const hasFilters =
    status !== ErrorLogStatusFilter.ACTIVE ||
    !!(search || errorType || startDate || endDate);

  const clearFilters = (): void => {
    setOffset(0);
    form.setValue("status", ErrorLogStatusFilter.ACTIVE, { shouldDirty: true });
    form.setValue("search", "", { shouldDirty: true });
    form.setValue("errorType", "", { shouldDirty: true });
    form.setValue("startDate", undefined, { shouldDirty: true });
    form.setValue("endDate", undefined, { shouldDirty: true });
    setDatePickerVersion(datePickerVersion + 1);
  };

  const changeDate = (
    field: "startDate" | "endDate",
    date: Date | undefined,
  ): void => {
    setOffset(0);
    if (date && field === "endDate") {
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      form.setValue(field, end, { shouldDirty: true });
      return;
    }
    form.setValue(field, date, { shouldDirty: true });
  };

  return (
    <WidgetShell className="min-w-0">
      <WidgetHeader
        title={t("widget.title")}
        backButton={
          canGoBack && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => pop()}
            >
              <ChevronLeft className="h-4 w-4" />
              {t("widget.header.back")}
            </Button>
          )
        }
        actions={
          isInteractive && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label={t("widget.header.refresh")}
              onClick={() => void read?.refetch()}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )
        }
      />
      {isInteractive && (
        <Div className="flex min-w-0 flex-col gap-3">
          <Div className="grid min-w-0 grid-cols-1 gap-3 @sm:grid-cols-2">
            <Div className="flex min-w-0 flex-col gap-1">
              <Span className="text-xs font-medium">
                {t("get.fields.search.label")}
              </Span>
              <Input
                type="text"
                name="search"
                aria-label={t("get.fields.search.label")}
                placeholder={t("get.fields.search.placeholder")}
                value={search}
                onChangeText={(value) => {
                  setOffset(0);
                  form.setValue("search", value, { shouldDirty: true });
                }}
              />
            </Div>
            <Div className="flex min-w-0 flex-col gap-1">
              <Span className="text-xs font-medium">
                {t("get.fields.errorType.label")}
              </Span>
              <Input
                type="text"
                name="errorType"
                aria-label={t("get.fields.errorType.label")}
                placeholder={t("get.fields.errorType.placeholder")}
                value={errorType}
                onChangeText={(value) => {
                  setOffset(0);
                  form.setValue("errorType", value, { shouldDirty: true });
                }}
              />
            </Div>
            {(["startDate", "endDate"] as const).map((key) => (
              <Div key={key} className="flex min-w-0 flex-col gap-1">
                <Span className="text-xs font-medium">
                  {t(`get.fields.${key}.label`)}
                </Span>
                <DatePicker
                  key={datePickerVersion}
                  name={key}
                  placeholder={t(`get.fields.${key}.label`)}
                  value={key === "startDate" ? startDate : endDate}
                  onChange={(date) => changeDate(key, date)}
                />
              </Div>
            ))}
          </Div>
          <Div className="flex flex-wrap items-center gap-2">
            {ErrorLogStatusFilterOptions.map(({ label, value }) => (
              <Button
                key={value}
                type="button"
                variant={status === value ? "secondary" : "outline"}
                size="sm"
                aria-pressed={status === value}
                onClick={() => {
                  setOffset(0);
                  form.setValue("status", value, { shouldDirty: true });
                }}
              >
                {t(label)}
              </Button>
            ))}
            {hasFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFilters}
              >
                {t("widget.action.clear")}
              </Button>
            )}
          </Div>
        </Div>
      )}

      <FormAlertWidget field={{}} />
      {isLoading && (
        <Div aria-live="polite">
          <LoadingBlock message={t("widget.loading")} />
        </Div>
      )}
      {data && !hasError && !isLoading && (
        <>
          <Div
            aria-live="polite"
            className="flex flex-wrap gap-x-3 text-xs text-muted-foreground"
          >
            <Span>
              {t("widget.pagination.matches", {
                count: data.totalCount.toLocaleString(locale),
              })}
            </Span>
            <Span>
              {t("widget.header.activeCount", {
                count: data.unresolvedCount.toLocaleString(locale),
              })}
            </Span>
          </Div>
          {data.logs.length === 0 ? (
            <EmptyBlock
              icon={<AlertTriangle className="size-8" />}
              title={t("widget.empty")}
              message={
                hasFilters ? t("widget.emptyFiltered") : t("widget.emptyActive")
              }
            />
          ) : (
            data.logs.map((log) => (
              <ErrorLogCard
                key={log.id}
                log={log}
                onUpdate={() =>
                  navigateRelated(
                    async () => (await import("./definition")).PATCH,
                    {
                      data: {
                        fingerprint: log.fingerprint,
                        resolved: !log.resolved,
                      },
                      renderInModal: true,
                      popNavigationOnSuccess: 1,
                    },
                  )
                }
              />
            ))
          )}
          {isInteractive && (offset > 0 || data.hasMore) && (
            <Div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
              <Span className="text-sm text-muted-foreground">
                {t("widget.pagination.info", {
                  page: Math.floor(offset / pageSize) + 1,
                  totalPages: Math.max(
                    1,
                    Math.ceil(data.totalCount / pageSize),
                  ),
                  total: data.totalCount,
                })}
              </Span>
              <Div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={offset <= 0}
                  onClick={() => setOffset(Math.max(0, offset - pageSize))}
                >
                  {t("widget.pagination.prev")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!data.hasMore}
                  onClick={() => setOffset(offset + pageSize)}
                >
                  {t("widget.pagination.next")}
                </Button>
              </Div>
            </Div>
          )}
        </>
      )}
    </WidgetShell>
  );
}

export function UpdateErrorLogContainer({
  field,
}: {
  field: (typeof endpoints.PATCH)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof endpoints.PATCH>();
  const data = useWidgetValue<typeof endpoints.PATCH>();
  const widgetIsInteractive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const isInteractive = widgetIsInteractive && !responseOnly;
  const { pop, canGoBack } = useWidgetNavigation();
  return (
    <WidgetShell className="min-w-0">
      <WidgetHeader
        title={t("patch.title")}
        backButton={
          canGoBack && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => pop()}
            >
              {t("widget.header.back")}
            </Button>
          )
        }
      />
      <FormAlertWidget field={{}} />
      {isInteractive && (
        <>
          <TextFieldWidget
            fieldName="fingerprint"
            field={field.children.fingerprint}
          />
          <TextFieldWidget fieldName="id" field={field.children.id} />
          <BooleanFieldWidget
            fieldName="resolved"
            field={field.children.resolved}
          />
          <SubmitButtonWidget field={field.children.submit} />
        </>
      )}
      {data && (
        <DetailGrid columns={2}>
          <DetailField
            label={t("patch.response.fingerprint.title")}
            value={data.responseFingerprint}
            mono
            copyable
          />
          <DetailField
            label={t("patch.response.resolved.title")}
            value={
              data.responseResolved
                ? t("widget.status.resolved")
                : t("widget.status.active")
            }
          />
          <DetailField
            label={t("patch.response.affectedRows.title")}
            value={data.affectedRows.toString()}
          />
        </DetailGrid>
      )}
    </WidgetShell>
  );
}
