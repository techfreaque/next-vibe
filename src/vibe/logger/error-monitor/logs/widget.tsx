"use client";

import {
  type AnalyticsFilterChip,
  AnalyticsSegmented,
  AnalyticsToolbar,
  BreakdownTable,
  KpiGrid,
  KpiTile,
  TimeSeriesChart,
} from "next-vibe/ui/components/analytics";
import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { CheckCircle2 } from "next-vibe/ui/components/icons/CheckCircle2";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Filter } from "next-vibe/ui/components/icons/Filter";
import { Input } from "next-vibe/ui/components/input";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Pre } from "next-vibe/ui/components/pre";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "next-vibe/ui/components/sheet";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { type JSX, useState } from "react";

import { Platform } from "../../../platforms/platforms";
import { cn } from "../../../unified-ui/_shared/cn";
import { useRelatedEntityNavigation } from "../../../unified-ui/_shared/related-entities";
import {
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "../../../unified-ui/_shared/use-widget-context";
import { AnalyticsRange } from "../../../unified-ui/analytics/enum";
import { sparkline } from "../../../unified-ui/analytics/format";
import { useEndpoint } from "../../../unified-ui/hooks/use-endpoint";
import { BooleanFieldWidget } from "../../../unified-ui/widgets/form-fields/boolean-field/widget";
import { TextFieldWidget } from "../../../unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "../../../unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "../../../unified-ui/widgets/interactive/submit-button/widget";
import { ERROR_LOGS_PAGE_SIZE } from "./constants";
import type endpoints from "./definition";
import type {
  ErrorLogsRequestOutput,
  ErrorLogsResponseOutput,
} from "./definition";
import endpointDefinitions from "./definition";
import {
  ERROR_LOG_TREND_SERIES,
  ErrorLogLevelFilter,
  ErrorLogLevelFilterOptions,
  ErrorLogSort,
  ErrorLogSortOptions,
  ErrorLogSourceFilter,
  ErrorLogSourceFilterOptions,
  ErrorLogStatusFilter,
  ErrorLogTrendSplit,
  ErrorLogTrendSplitOptions,
} from "./enum";

type ErrorLog = ErrorLogsResponseOutput["logs"][number];
type SecondaryFilters = Pick<
  ErrorLogsRequestOutput,
  "status" | "level" | "source"
>;
type GetT = ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>;

const DAY_MS = 24 * 60 * 60 * 1000;
const CLIENT_PREFIX = /^\[client\] /;
/** CLI/MCP: up to this many classes print in full, more print one line each. */
const CLI_DETAIL_THRESHOLD = 3;

const SERIES_LABEL = {
  [ERROR_LOG_TREND_SERIES.NEW]: "widget.series.new",
  [ERROR_LOG_TREND_SERIES.RECURRING]: "widget.series.recurring",
  [ERROR_LOG_TREND_SERIES.ERROR]: "widget.series.error",
  [ERROR_LOG_TREND_SERIES.WARN]: "widget.series.warn",
  [ERROR_LOG_TREND_SERIES.CLIENT]: "widget.series.client",
  [ERROR_LOG_TREND_SERIES.SERVER]: "widget.series.server",
} as const;

const SERIES_COLOR = {
  [ERROR_LOG_TREND_SERIES.NEW]: "negative",
  [ERROR_LOG_TREND_SERIES.RECURRING]: "warning",
  [ERROR_LOG_TREND_SERIES.ERROR]: "negative",
  [ERROR_LOG_TREND_SERIES.WARN]: "warning",
  [ERROR_LOG_TREND_SERIES.CLIENT]: 3,
  [ERROR_LOG_TREND_SERIES.SERVER]: 1,
} as const;

function isSeriesKey(key: string): key is keyof typeof SERIES_LABEL {
  return key in SERIES_LABEL;
}

/** Last day (YYYY-MM-DD) of the bucket that starts at `key`. */
function bucketEnd(key: string, bucket: "day" | "week" | "month"): string {
  const start = new Date(`${key}T00:00:00.000Z`);
  if (bucket === "day") {
    return key;
  }
  if (bucket === "week") {
    return new Date(start.getTime() + 6 * DAY_MS).toISOString().slice(0, 10);
  }
  return new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0))
    .toISOString()
    .slice(0, 10);
}

function relativeTime(iso: string, locale: string): string {
  const diffMs = new Date(iso).getTime() - Date.now();
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const minutes = Math.round(diffMs / 60_000);
  if (Math.abs(minutes) < 60) {
    return rtf.format(minutes, "minute");
  }
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 48) {
    return rtf.format(hours, "hour");
  }
  return rtf.format(Math.round(hours / 24), "day");
}

/** Absolute timestamp, one format and one zone on every surface. */
function date(value: string): string {
  return `${value.slice(0, 16).replace("T", " ")} UTC`;
}

function shortDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });
}

/** One plain-text line per class for CLI / MCP triage. */
function clip(text: string, max: number): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) {
    return flat;
  }
  const cut = flat.slice(0, max);
  const space = cut.lastIndexOf(" ");
  return `${space > max * 0.6 ? cut.slice(0, space) : cut}...`;
}

/** One plain-text line per class for CLI / MCP triage. */
function logLine(
  log: ErrorLog,
  t: GetT,
  locale: string,
  periodFrom: string,
  grouped: boolean,
): string {
  const level = log.level === "warn" ? "WARN " : "ERROR";
  const src = log.source === "client" ? "web" : "srv";
  const state = log.resolved ? ` [${t("widget.status.resolved")}]` : "";
  const where = log.endpoint ? ` @${log.endpoint}` : "";
  const isNew =
    log.firstSeen.slice(0, 10) >= periodFrom
      ? ` [${t("widget.series.new")}]`
      : "";
  const similar =
    log.similar === 0
      ? ` (${t("widget.list.cliAct", { fingerprint: log.fingerprint, resolved: log.resolved ? "false" : "true" })})`
      : grouped
        ? ` (${t("widget.list.cliGroup", { count: log.similar + 1, fingerprint: log.fingerprint, search: clip(log.message, 60).replace(/"/g, "") })})`
        : ` (${t("widget.list.similar", { count: log.similar })})`;
  const hits = t("widget.list.cliHits", {
    period: log.windowOccurrences.toLocaleString(locale),
    total: log.occurrences.toLocaleString(locale),
  });
  return `${log.fingerprint.padEnd(16)}  ${level} ${src}  ${hits}  ${log.affectedUsers}u/${log.affectedLeads}v  first ${log.firstSeen.slice(0, 10)} last ${log.createdAt.slice(0, 16).replace("T", " ")}${isNew}${state}\n    ${clip(log.message.replace(CLIENT_PREFIX, ""), 120)}${where}\n    ${similar.trim().replace(/^\(|\)$/g, "")}`;
}

function ErrorLogRow({
  log,
  isFocused,
  pending,
  failed,
  isNew,
  grouped,
  onToggleResolved,
  onFocus,
  onSimilar,
}: {
  log: ErrorLog;
  isFocused: boolean;
  pending: boolean;
  failed: boolean;
  /** First seen inside the selected period */
  isNew: boolean;
  /** Narrow the list to classes with this message */
  onSimilar: () => void;
  /** Row stands for every class with this message */
  grouped: boolean;
  onToggleResolved: () => void;
  onFocus: () => void;
}): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const locale = useWidgetLocale();
  const widgetIsInteractive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const isInteractive = widgetIsInteractive && !responseOnly;
  const navigateRelated = useRelatedEntityNavigation();
  const platform = useWidgetPlatform();
  const sep =
    platform === Platform.CLI || platform === Platform.MCP ? "  ·  " : "";
  const showDetails = expanded || isFocused;

  return (
    <Div
      className={cn(
        "flex min-w-0 flex-col gap-2 border-b px-1 py-3 last:border-b-0",
        log.resolved && "opacity-70",
      )}
    >
      <Div className="flex min-w-0 items-start gap-3">
        <Div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <StatusPill
              status={
                log.level === "warn"
                  ? t("widget.severity.warning")
                  : t("widget.severity.error")
              }
              variant={log.level === "warn" ? "warning" : "danger"}
            />
            <StatusPill
              status={
                log.source === "client"
                  ? t("widget.source.client")
                  : t("widget.source.server")
              }
              variant="muted"
            />
            {isNew && (
              <StatusPill status={t("widget.series.new")} variant="info" />
            )}
            {log.resolved && (
              <StatusPill
                status={t("widget.status.resolved")}
                variant="success"
              />
            )}
            {log.endpoint && (
              <Span className="min-w-0 truncate font-mono text-xs text-muted-foreground">
                {log.endpoint}
              </Span>
            )}
          </Div>
          <Span className="line-clamp-2 text-sm font-medium [overflow-wrap:anywhere]">
            {log.message.replace(CLIENT_PREFIX, "")}
          </Span>
          <Div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs tabular-nums text-muted-foreground">
            <Span className="font-semibold text-foreground">
              {t("widget.list.hitsPeriod", {
                count: log.windowOccurrences.toLocaleString(locale),
              })}
              {sep}
            </Span>
            <Span>
              {t("widget.list.hitsTotal", {
                count: log.occurrences.toLocaleString(locale),
              })}
              {sep}
            </Span>
            {log.affectedUsers === 0 && log.affectedLeads === 0 ? (
              <Span>
                {t("widget.list.noSession")}
                {sep}
              </Span>
            ) : (
              <>
                <Span>
                  {t("widget.list.users", { count: log.affectedUsers })}
                  {sep}
                </Span>
                <Span>
                  {t("widget.list.leads", { count: log.affectedLeads })}
                  {sep}
                </Span>
              </>
            )}
            <Span title={date(log.createdAt)}>
              {t("widget.list.lastSeen", {
                date: relativeTime(log.createdAt, locale),
              })}
              {sep}
            </Span>
            <Span title={date(log.firstSeen)}>
              {t("widget.list.firstSeen", {
                date: shortDate(log.firstSeen, locale),
              })}
            </Span>
            {failed && (
              <Span className="text-destructive">
                {t("widget.list.resolveFailed")}
              </Span>
            )}
            {isInteractive && (
              <Div className="ml-auto flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 text-xs"
                  disabled={pending}
                  onClick={onToggleResolved}
                >
                  {pending
                    ? t("widget.list.resolving")
                    : grouped && log.similar > 0
                      ? t(
                          log.resolved
                            ? "widget.list.reopenGroup"
                            : "widget.list.resolveGroup",
                          { count: log.similar + 1 },
                        )
                      : log.resolved
                        ? t("widget.action.reopen")
                        : t("widget.action.resolve")}
                </Button>
                {log.similar > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2.5 text-xs"
                    onClick={onSimilar}
                  >
                    {grouped
                      ? t("widget.list.viewGroup", { count: log.similar + 1 })
                      : t("widget.list.similar", { count: log.similar })}
                  </Button>
                )}
                {!isFocused && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2.5 text-xs"
                    onClick={onFocus}
                  >
                    {t("widget.list.focus")}
                  </Button>
                )}
                {!isFocused && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2.5 text-xs"
                    aria-expanded={showDetails}
                    onClick={() => setExpanded(!expanded)}
                  >
                    {expanded ? t("widget.list.close") : t("widget.list.open")}
                  </Button>
                )}
              </Div>
            )}
          </Div>
        </Div>
        <Div className="hidden shrink-0 flex-col items-end gap-2 @md:flex">
          <Span
            aria-hidden
            className="font-mono text-xs leading-none tracking-tighter text-destructive/80"
          >
            {sparkline(log.spark, 24)}
          </Span>
        </Div>
      </Div>
      {showDetails && (
        <Div className="flex min-w-0 flex-col gap-3 rounded-md bg-muted/30 p-3">
          {sep && (
            <Span>
              {t("widget.list.cliStatus", {
                status: log.resolved
                  ? t("widget.status.resolved")
                  : t("widget.status.active"),
              })}
            </Span>
          )}
          {sep && (
            <Span>
              {t("widget.list.cliResolve", {
                fingerprint: log.fingerprint,
                resolved: log.resolved ? "false" : "true",
              })}
            </Span>
          )}
          <DetailGrid columns={3}>
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
            <DetailField
              label={t("get.fields.errorType.label")}
              value={log.errorType ?? "-"}
              mono
            />
            <DetailField
              label={t("widget.col.firstSeen")}
              value={date(log.firstSeen)}
            />
            <DetailField
              label={t("widget.col.createdAt")}
              value={date(log.createdAt)}
            />
            <DetailField
              label={t("widget.col.occurrences")}
              value={log.occurrences.toLocaleString(locale)}
            />
          </DetailGrid>
          {log.userIds.length > 0 && (
            <Div className="flex min-w-0 flex-col gap-1">
              <Span className="text-xs font-medium">
                {t("widget.list.affected")}
              </Span>
              <Div className="flex flex-wrap gap-1.5">
                {log.userIds.map((userId) => (
                  <Button
                    key={userId}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="font-mono text-xs"
                    onClick={() =>
                      navigateRelated(
                        () =>
                          import("@/users/view/definition").then(
                            (m) => m.default.GET,
                          ),
                        { data: { userId } },
                      )
                    }
                  >
                    {userId.slice(0, 8)}
                  </Button>
                ))}
                {log.affectedUsers > log.userIds.length && (
                  <Span className="self-center text-xs text-muted-foreground">
                    {t("widget.list.more", {
                      count: log.affectedUsers - log.userIds.length,
                    })}
                  </Span>
                )}
              </Div>
            </Div>
          )}
          {log.leadIds.length > 0 && (
            <Div className="flex min-w-0 flex-col gap-1">
              <Span className="text-xs font-medium">
                {t("widget.list.affectedLeads")}
              </Span>
              <Div className="flex flex-wrap gap-1.5">
                {log.leadIds.map((leadId) => (
                  <Button
                    key={leadId}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="font-mono text-xs"
                    onClick={() =>
                      navigateRelated(
                        () =>
                          import("@/leads/[id]/definition").then(
                            (m) => m.default.GET,
                          ),
                        { urlPathParams: { id: leadId } },
                      )
                    }
                  >
                    {leadId.slice(0, 8)}
                  </Button>
                ))}
                {log.affectedLeads > log.leadIds.length && (
                  <Span className="self-center text-xs text-muted-foreground">
                    {t("widget.list.more", {
                      count: log.affectedLeads - log.leadIds.length,
                    })}
                  </Span>
                )}
              </Div>
            </Div>
          )}
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
              <Pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-xs [overflow-wrap:anywhere]">
                {JSON.stringify(log.metadata, null, 2)}
              </Pre>
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}

/**
 * Domain filter with a visible label in the filter sheet. Same segmented
 * control as the period presets, so the toolbar has one active style.
 */
function SegmentedFilter<TValue extends string>({
  label,
  value,
  options,
  onSelect,
  showLabel = true,
}: {
  label: string;
  value: TValue;
  options: ReadonlyArray<{ value: TValue; label: string }>;
  onSelect: (value: TValue) => void;
  /** Visible caption above the control (sheet); the toolbar relies on aria. */
  showLabel?: boolean;
}): JSX.Element {
  return (
    <Div className="flex min-w-0 max-w-full flex-col gap-1.5">
      {showLabel && <Span className="text-xs font-medium">{label}</Span>}
      <AnalyticsSegmented
        label={label}
        value={value}
        onSelect={onSelect}
        options={options}
      />
    </Div>
  );
}

export function ErrorLogsContainer(): JSX.Element {
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const locale = useWidgetLocale();
  const platform = useWidgetPlatform();
  const isText = platform === Platform.CLI || platform === Platform.MCP;
  const form = useWidgetForm<typeof endpoints.GET>();
  const widgetIsInteractive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const isInteractive = widgetIsInteractive && !responseOnly;
  const { pop, canGoBack } = useWidgetNavigation();
  const read = useWidgetEndpointMutations()?.read;
  const response = useWidgetResponse();
  const data = useWidgetValue<typeof endpoints.GET>();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const patchEndpoint = useEndpoint(
    { PATCH: endpointDefinitions.PATCH },
    {},
    logger,
    user,
  );
  const [pendingFingerprint, setPendingFingerprint] = useState<string | null>(
    null,
  );
  const [confirmBulk, setConfirmBulk] = useState(false);
  const [filterDraft, setFilterDraft] = useState<SecondaryFilters | null>(null);
  /** Last resolve/reopen, for the confirmation line with Undo. */
  const [lastAction, setLastAction] = useState<{
    fingerprints: string[];
    label: string | null;
    resolved: boolean;
    settled: boolean;
  } | null>(null);
  /** Row of the last resolve attempt (shows its error if it failed). */
  const [failedFingerprint, setFailedFingerprint] = useState<string | null>(
    null,
  );

  const status = form.watch("status") ?? ErrorLogStatusFilter.ACTIVE;
  const level = form.watch("level") ?? ErrorLogLevelFilter.ALL;
  const source = form.watch("source") ?? ErrorLogSourceFilter.ALL;
  const split = form.watch("split") ?? ErrorLogTrendSplit.NEW_VS_RECURRING;
  const sort = form.watch("sort") ?? ErrorLogSort.WINDOW_OCCURRENCES;
  const grouped = form.watch("group") ?? true;
  const search = form.watch("search") ?? "";
  const endpointFilter = form.watch("endpoint") ?? "";
  const errorType = form.watch("errorType") ?? "";
  const fingerprint = form.watch("fingerprint") ?? "";
  const pageSize =
    data?.pageSize ?? (form.watch("limit") || ERROR_LOGS_PAGE_SIZE);
  const offset = form.watch("offset") ?? 0;
  const hasError = response?.success === false;
  const isLoading = !hasError && !data;

  const setOffset = (value: number): void =>
    form.setValue("offset", value, { shouldDirty: true });
  const setText = (
    key: "search" | "endpoint" | "errorType" | "fingerprint",
    value: string,
  ): void => {
    setOffset(0);
    form.setValue(key, value, { shouldDirty: true });
  };

  // Server-confirmed result of the last resolve/reopen: shown on the row at
  // once, before the list refetch lands (and drops it from "Active").
  const lastPatch = patchEndpoint.update?.response;
  const withConfirmed = (log: ErrorLog): ErrorLog =>
    lastAction?.settled &&
    lastPatch?.success !== false &&
    lastAction.fingerprints.includes(log.fingerprint)
      ? { ...log, resolved: lastAction.resolved }
      : log;

  const toggleResolved = (log: ErrorLog): void => {
    const submit = patchEndpoint.update?.submit;
    if (!submit) {
      return;
    }
    const action = {
      fingerprints: [log.fingerprint],
      label: clip(log.message.replace(CLIENT_PREFIX, ""), 80),
      resolved: !log.resolved,
    };
    setLastAction({ ...action, settled: false });
    setPendingFingerprint(log.fingerprint);
    setFailedFingerprint(log.fingerprint);
    void submit(
      grouped && log.similar > 0
        ? { similarTo: log.fingerprint, resolved: !log.resolved }
        : { fingerprint: log.fingerprint, resolved: !log.resolved },
    ).finally(() => {
      setPendingFingerprint(null);
      setLastAction({ ...action, settled: true });
      void read?.refetch();
    });
  };

  const resolveShown = (fingerprints: string[]): void => {
    const submit = patchEndpoint.update?.submit;
    setConfirmBulk(false);
    if (!submit || fingerprints.length === 0) {
      return;
    }
    const action = { fingerprints, label: null, resolved: true };
    setLastAction({ ...action, settled: false });
    void submit({ fingerprints, resolved: true }).finally(() => {
      setLastAction({ ...action, settled: true });
      void read?.refetch();
    });
  };

  const undoLastAction = (): void => {
    const submit = patchEndpoint.update?.submit;
    if (!submit || !lastAction) {
      return;
    }
    const next = {
      fingerprints: lastAction.fingerprints,
      label: lastAction.label,
      resolved: !lastAction.resolved,
    };
    setLastAction({ ...next, settled: false });
    void submit({
      fingerprints: next.fingerprints,
      resolved: next.resolved,
    }).finally(() => {
      setLastAction({ ...next, settled: true });
      void read?.refetch();
    });
  };
  const actionDone =
    lastAction !== null && lastAction.settled && lastPatch?.success !== false;

  const chips: AnalyticsFilterChip[] = [];
  if (search) {
    chips.push({
      key: "search",
      label: t("widget.filter.search"),
      value: search,
      onRemove: () => setText("search", ""),
    });
  }
  if (fingerprint) {
    const focused = data?.logs[0];
    chips.push({
      key: "fingerprint",
      label: t("widget.filter.fingerprint"),
      value:
        focused && focused.fingerprint === fingerprint
          ? clip(focused.message.replace(CLIENT_PREFIX, ""), 48)
          : fingerprint,
      onRemove: () => setText("fingerprint", ""),
    });
  }
  if (endpointFilter) {
    chips.push({
      key: "endpoint",
      label: t("widget.filter.endpoint"),
      value: endpointFilter,
      onRemove: () => setText("endpoint", ""),
    });
  }
  if (errorType) {
    chips.push({
      key: "errorType",
      label: t("widget.filter.errorType"),
      value: errorType,
      onRemove: () => setText("errorType", ""),
    });
  }
  const clearFilters = (): void => {
    setOffset(0);
    form.setValue("fingerprint", "", { shouldDirty: true });
    form.setValue("endpoint", "", { shouldDirty: true });
    form.setValue("errorType", "", { shouldDirty: true });
    form.setValue("search", "", { shouldDirty: true });
    form.setValue("status", ErrorLogStatusFilter.ACTIVE, { shouldDirty: true });
    form.setValue("level", ErrorLogLevelFilter.ALL, { shouldDirty: true });
    form.setValue("source", ErrorLogSourceFilter.ALL, { shouldDirty: true });
  };
  const hasFilters =
    chips.length > 0 ||
    status !== ErrorLogStatusFilter.ACTIVE ||
    level !== ErrorLogLevelFilter.ALL ||
    source !== ErrorLogSourceFilter.ALL;

  const secondaryCount =
    Number(status !== ErrorLogStatusFilter.ACTIVE) +
    Number(level !== ErrorLogLevelFilter.ALL) +
    Number(source !== ErrorLogSourceFilter.ALL);
  const liveFilters = { status, level, source };
  const applySecondary = (patch: Partial<SecondaryFilters>): void => {
    setOffset(0);
    if (patch.status !== undefined) {
      form.setValue("status", patch.status, { shouldDirty: true });
    }
    if (patch.level !== undefined) {
      form.setValue("level", patch.level, { shouldDirty: true });
    }
    if (patch.source !== undefined) {
      form.setValue("source", patch.source, { shouldDirty: true });
    }
  };
  const secondaryFilters = (
    values: SecondaryFilters,
    update: (patch: Partial<SecondaryFilters>) => void,
    showLabel: boolean,
  ): JSX.Element => (
    <>
      <SegmentedFilter
        showLabel={showLabel}
        label={t("get.fields.status.label")}
        value={values.status}
        onSelect={(value) => update({ status: value })}
        options={[
          ErrorLogStatusFilter.ACTIVE,
          ErrorLogStatusFilter.RESOLVED,
          ErrorLogStatusFilter.ALL,
        ].map((value) => ({ value, label: t(value) }))}
      />
      <SegmentedFilter
        showLabel={showLabel}
        label={t("get.fields.level.label")}
        value={values.level}
        onSelect={(value) => update({ level: value })}
        options={ErrorLogLevelFilterOptions.map((o) => ({
          value: o.value,
          label: t(o.label),
        }))}
      />
      <SegmentedFilter
        showLabel={showLabel}
        label={t("get.fields.source.label")}
        value={values.source}
        onSelect={(value) => update({ source: value })}
        options={ErrorLogSourceFilterOptions.map((o) => ({
          value: o.value,
          label: t(o.label),
        }))}
      />
    </>
  );

  const kpis = data?.kpis;
  const windowEcho = data?.window;
  const occurrencesSeries = data?.trend.series ?? [];
  const totalSpark = occurrencesSeries.reduce<number[]>(
    (acc, s) => s.values.map((v, i) => v + (acc[i] ?? 0)),
    [],
  );
  const hasTrend = totalSpark.some((count) => count > 0);
  const historyNote =
    data && windowEcho
      ? data.historySince === null
        ? t("widget.chart.historyNone")
        : data.historySince > windowEcho.from
          ? t("widget.chart.historyNote", {
              date: new Date(data.historySince).toLocaleDateString(locale, {
                month: "long",
                day: "numeric",
                timeZone: "UTC",
              }),
            })
          : null
      : null;

  return (
    <WidgetShell layout="page" className="min-w-0">
      <WidgetHeader
        size="page"
        title={t("widget.title")}
        subtitle={isInteractive ? t("widget.subtitle") : undefined}
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
      />
      {isInteractive && (
        <AnalyticsToolbar
          locale={locale}
          period={windowEcho}
          value={{
            range: form.watch("range"),
            granularity: form.watch("granularity"),
            from: form.watch("from"),
            to: form.watch("to"),
          }}
          onChange={(patch) => {
            setOffset(0);
            if (patch.range !== undefined) {
              form.setValue("range", patch.range, { shouldDirty: true });
            }
            if (patch.granularity !== undefined) {
              form.setValue("granularity", patch.granularity, {
                shouldDirty: true,
              });
            }
            if (patch.from !== undefined) {
              form.setValue("from", patch.from, { shouldDirty: true });
            }
            if (patch.to !== undefined) {
              form.setValue("to", patch.to, { shouldDirty: true });
            }
          }}
          onRefresh={() => void read?.refetch()}
          isLoading={read?.isLoading}
          filters={chips}
          onClearFilters={hasFilters ? clearFilters : undefined}
        >
          {isText ? (
            secondaryFilters(liveFilters, applySecondary, true)
          ) : (
            <>
              <Div className="hidden flex-wrap items-center gap-2 @4xl:flex">
                {secondaryFilters(liveFilters, applySecondary, false)}
              </Div>
              <Div className="@4xl:hidden">
                <Sheet
                  open={filterDraft !== null}
                  onOpenChange={(open) =>
                    setFilterDraft(open ? liveFilters : null)
                  }
                >
                  <SheetTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                    >
                      <Filter className="size-4" />
                      {secondaryCount
                        ? t("widget.filter.moreCount", {
                            count: secondaryCount,
                          })
                        : t("widget.filter.more")}
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="bottom"
                    className="max-h-[85dvh] overflow-y-auto bg-popover text-popover-foreground transition-[transform,translate] motion-reduce:transition-none motion-reduce:animate-none"
                  >
                    <SheetHeader>
                      <SheetTitle className="text-popover-foreground">
                        {t("widget.filter.more")}
                      </SheetTitle>
                      <SheetDescription>
                        {t("widget.filter.moreDescription")}
                      </SheetDescription>
                    </SheetHeader>
                    <Div className="flex flex-col items-start gap-4 px-4 pb-5">
                      {filterDraft && (
                        <>
                          {secondaryFilters(
                            filterDraft,
                            (patch) =>
                              setFilterDraft({ ...filterDraft, ...patch }),
                            true,
                          )}
                          <Button
                            type="button"
                            onClick={() => {
                              applySecondary(filterDraft);
                              setFilterDraft(null);
                            }}
                          >
                            {t("widget.filter.apply")}
                          </Button>
                        </>
                      )}
                    </Div>
                  </SheetContent>
                </Sheet>
              </Div>
            </>
          )}
        </AnalyticsToolbar>
      )}

      {!hasError && <FormAlertWidget field={{}} />}
      {hasError && (
        <EmptyBlock
          icon={<AlertTriangle className="size-7" />}
          title={t("get.errors.server.title")}
          message={t("get.errors.server.description")}
          action={
            isInteractive
              ? {
                  label: t("widget.header.refresh"),
                  onClick: () => void read?.refetch(),
                }
              : undefined
          }
        />
      )}
      {isLoading && (
        <Div aria-live="polite">
          <LoadingBlock message={t("widget.loading")} />
        </Div>
      )}
      {data && kpis && windowEcho && !hasError && !isLoading && (
        <>
          <KpiGrid columns={5}>
            {kpis.unresolvedInView !== undefined && (
              <KpiTile
                label={t("widget.kpi.unresolvedInScope")}
                wrapLabel
                value={kpis.unresolvedInView}
                locale={locale}
              />
            )}
            <KpiTile
              label={t("widget.kpi.occurrences")}
              value={kpis.occurrences.value}
              previous={kpis.occurrences.previous}
              invertDelta
              sparkline={hasTrend ? totalSpark : undefined}
              locale={locale}
            />
            <KpiTile
              label={t("widget.kpi.newClasses")}
              value={kpis.newClasses.value}
              previous={kpis.newClasses.previous}
              invertDelta
              locale={locale}
              onClick={
                isInteractive
                  ? () => {
                      setOffset(0);
                      form.setValue("sort", ErrorLogSort.FIRST_SEEN, {
                        shouldDirty: true,
                      });
                    }
                  : undefined
              }
            />
            <KpiTile
              label={t("widget.kpi.affectedUsers")}
              value={kpis.affectedUsers.value}
              previous={kpis.affectedUsers.previous}
              invertDelta
              locale={locale}
            />
            <KpiTile
              label={t("widget.kpi.affectedLeads")}
              value={kpis.affectedLeads.value}
              previous={kpis.affectedLeads.previous}
              invertDelta
              locale={locale}
            />
          </KpiGrid>

          {hasTrend && (
            <TimeSeriesChart
              title={t("widget.chart.trendTitle")}
              subtitle={
                historyNote ??
                (isInteractive ? t("widget.chart.trendSubtitle") : undefined)
              }
              buckets={data.trend.buckets}
              bucket={windowEcho.bucket}
              series={data.trend.series.map((s) => ({
                key: s.key,
                label: isSeriesKey(s.key) ? t(SERIES_LABEL[s.key]) : s.key,
                values: s.values,
                color: isSeriesKey(s.key) ? SERIES_COLOR[s.key] : undefined,
              }))}
              variant="stacked-bar"
              locale={locale}
              height={180}
              onBucketClick={
                isInteractive
                  ? (key) => {
                      setOffset(0);
                      form.setValue("range", AnalyticsRange.CUSTOM, {
                        shouldDirty: true,
                      });
                      form.setValue("from", key, { shouldDirty: true });
                      form.setValue("to", bucketEnd(key, windowEcho.bucket), {
                        shouldDirty: true,
                      });
                    }
                  : undefined
              }
              actions={
                isInteractive && (
                  <SegmentedFilter
                    showLabel={false}
                    label={t("get.fields.split.label")}
                    value={split}
                    onSelect={(value) =>
                      form.setValue("split", value, { shouldDirty: true })
                    }
                    options={ErrorLogTrendSplitOptions.map((o) => ({
                      value: o.value,
                      label: t(o.label),
                    }))}
                  />
                )
              }
            />
          )}

          {!fingerprint && data.byEndpoint.length > 0 && (
            <BreakdownTable
              title={t("widget.chart.endpointTitle")}
              subtitle={t("widget.chart.endpointSubtitle")}
              dimensionLabel={t("widget.chart.endpoint")}
              columns={[
                { key: "occurrences", label: t("widget.chart.occurrences") },
                {
                  key: "classes",
                  label: t("widget.chart.classes"),
                  secondary: true,
                },
                { key: "unresolved", label: t("widget.chart.unresolved") },
              ]}
              rows={data.byEndpoint.map((row) => ({
                id: row.key ?? "none",
                label: row.key ?? t("widget.chart.noEndpoint"),
                values: row.metrics,
                onClick:
                  isInteractive && row.key
                    ? () => setText("endpoint", row.key ?? "")
                    : undefined,
              }))}
              showShare={false}
              limit={isText ? 8 : 6}
              locale={locale}
            />
          )}

          {isInteractive && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto self-start whitespace-normal px-0 text-start text-xs text-muted-foreground"
              onClick={() => {
                clearFilters();
                form.setValue("range", AnalyticsRange.ALL_TIME, {
                  shouldDirty: true,
                });
              }}
            >
              {t("widget.kpi.unresolvedAllTimeLink", {
                count: kpis.unresolved.toLocaleString(locale),
              })}
            </Button>
          )}

          <Div className="flex min-w-0 flex-col gap-2">
            <Div className="flex flex-wrap items-end justify-between gap-2">
              <Div className="flex min-w-0 flex-col">
                <Span className="text-sm font-semibold">
                  {t("widget.list.title")}
                </Span>
                <Span
                  aria-live="polite"
                  className="text-xs text-muted-foreground"
                >
                  {t(
                    grouped
                      ? "widget.list.subtitleGrouped"
                      : "widget.list.subtitle",
                    { count: data.totalCount.toLocaleString(locale) },
                  )}
                </Span>
              </Div>
              {isInteractive && (
                <Div className="flex min-w-0 flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={grouped ? "default" : "outline"}
                    aria-pressed={grouped}
                    className="h-8 text-xs"
                    onClick={() => {
                      setOffset(0);
                      form.setValue("group", !grouped, { shouldDirty: true });
                    }}
                  >
                    {t("get.fields.group.label")}
                  </Button>
                  {status === ErrorLogStatusFilter.ACTIVE &&
                    !grouped &&
                    hasFilters &&
                    data.logs.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant={confirmBulk ? "destructive" : "outline"}
                        className="h-8 text-xs"
                        disabled={patchEndpoint.update?.isSubmitting}
                        onClick={() =>
                          confirmBulk
                            ? resolveShown(data.logs.map((l) => l.fingerprint))
                            : setConfirmBulk(true)
                        }
                      >
                        {confirmBulk
                          ? t("widget.list.bulkConfirm", {
                              count: data.logs.length,
                            })
                          : t("widget.list.bulkResolveOf", {
                              shown: data.logs.length,
                              total: data.totalCount,
                            })}
                      </Button>
                    )}
                  <Input
                    type="text"
                    name="search"
                    className="h-8 w-full text-xs @sm:w-56"
                    aria-label={t("get.fields.search.label")}
                    placeholder={t("get.fields.search.placeholder")}
                    value={search}
                    onChangeText={(value) => setText("search", value)}
                  />
                  <Input
                    type="text"
                    name="endpoint"
                    className="h-8 w-full text-xs @sm:w-48"
                    aria-label={t("get.fields.endpoint.label")}
                    placeholder={t("get.fields.endpoint.label")}
                    value={endpointFilter}
                    onChangeText={(value) => setText("endpoint", value)}
                  />
                  <Select
                    value={sort}
                    onValueChange={(value) => {
                      const next = ErrorLogSortOptions.find(
                        (o) => o.value === value,
                      );
                      if (next) {
                        setOffset(0);
                        form.setValue("sort", next.value, {
                          shouldDirty: true,
                        });
                      }
                    }}
                  >
                    <SelectTrigger
                      className="h-8 w-auto text-xs"
                      aria-label={t("get.fields.sort.label")}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ErrorLogSortOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {t(o.label)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Div>
              )}
            </Div>
            {isInteractive && actionDone && lastAction && (
              <Div
                aria-live="polite"
                className="flex flex-wrap items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm"
              >
                <Span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
                  {lastAction.label
                    ? t(
                        lastAction.resolved
                          ? "widget.list.doneResolved"
                          : "widget.list.doneReopened",
                        { label: lastAction.label },
                      )
                    : t(
                        lastAction.resolved
                          ? "widget.list.doneResolvedMany"
                          : "widget.list.doneReopenedMany",
                        { count: lastAction.fingerprints.length },
                      )}
                </Span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 text-xs"
                  disabled={patchEndpoint.update?.isSubmitting}
                  onClick={undoLastAction}
                >
                  {t("widget.list.undo")}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2.5 text-xs"
                  onClick={() => setLastAction(null)}
                >
                  {t("widget.list.dismiss")}
                </Button>
              </Div>
            )}
            {data.logs.length === 0 && actionDone ? (
              <EmptyBlock
                icon={<CheckCircle2 className="size-8" />}
                title={t("widget.list.allClear")}
                message={hasFilters ? t("widget.list.allClearHint") : undefined}
                action={
                  isInteractive && hasFilters
                    ? { label: t("widget.action.clear"), onClick: clearFilters }
                    : undefined
                }
              />
            ) : data.logs.length === 0 ? (
              <EmptyBlock
                icon={<AlertTriangle className="size-8" />}
                title={t("widget.empty")}
                message={
                  hasFilters
                    ? t("widget.emptyFiltered")
                    : t("widget.emptyActive")
                }
                action={
                  isInteractive && hasFilters
                    ? { label: t("widget.action.clear"), onClick: clearFilters }
                    : undefined
                }
              />
            ) : isText && data.logs.length > CLI_DETAIL_THRESHOLD ? (
              <Div className="flex flex-col">
                {data.logs.map((log) => (
                  <Span key={log.id}>
                    {logLine(log, t, locale, windowEcho.from, grouped)}
                  </Span>
                ))}
                <Span>{t("widget.list.cliFilters")}</Span>
                <Span>
                  {t("widget.list.cliHint", {
                    next: offset + data.logs.length,
                  })}
                </Span>
              </Div>
            ) : (
              <Div className="flex min-w-0 flex-col rounded-lg border bg-card px-3">
                {data.logs.map((log) => (
                  <ErrorLogRow
                    key={log.id}
                    log={withConfirmed(log)}
                    isFocused={!!fingerprint || isText}
                    pending={pendingFingerprint === log.fingerprint}
                    isNew={log.firstSeen.slice(0, 10) >= windowEcho.from}
                    grouped={grouped}
                    failed={
                      lastPatch?.success === false &&
                      pendingFingerprint === null &&
                      failedFingerprint === log.fingerprint
                    }
                    onToggleResolved={() => toggleResolved(withConfirmed(log))}
                    onFocus={() => {
                      form.setValue("search", "", { shouldDirty: true });
                      setText("fingerprint", log.fingerprint);
                    }}
                    onSimilar={() => {
                      form.setValue("group", false, { shouldDirty: true });
                      setText("search", log.message.slice(0, 120));
                    }}
                  />
                ))}
              </Div>
            )}
          </Div>
          {(offset > 0 || data.hasMore) && (
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
              {isInteractive && (
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
              )}
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
