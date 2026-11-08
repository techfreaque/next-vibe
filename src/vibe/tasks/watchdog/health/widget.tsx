/**
 * Task Health Widget
 * Running tasks (age, turns, tool calls, spend, cancel), recent failures with
 * their last error, and open incidents (resolve). One widget, all platforms.
 */

"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetEndpointMutations,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useApiMutation } from "next-vibe/unified-ui/hooks/use-api-mutation";
import type { JSX } from "react";

import cancelDefinitions from "../cancel/definition";
import type definition from "./definition";
import type { TaskHealthGetResponseOutput } from "./definition";

type RunningTask = TaskHealthGetResponseOutput["running"][number];
type Incident = TaskHealthGetResponseOutput["incidents"][number];
type HealthT = ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;

function formatAge(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

function SectionTitle({
  title,
  count,
}: {
  title: string;
  count: number;
}): JSX.Element {
  return (
    <Div className="flex items-center gap-2">
      <H3 className="text-sm font-semibold">{title}</H3>
      <Badge variant={count > 0 ? "secondary" : "outline"}>{count}</Badge>
    </Div>
  );
}

function RunningRow({
  task,
  t,
  numberFormat,
  busy,
  onCancel,
}: {
  task: RunningTask;
  t: HealthT;
  numberFormat: Intl.NumberFormat;
  busy: boolean;
  onCancel: (taskId: string) => void;
}): JSX.Element {
  const nearLimit = task.ageMs > task.limitMs * 0.8;
  return (
    <Div className="flex flex-col gap-2 px-4 py-3">
      <Div className="flex items-start justify-between gap-3">
        <Div className="flex flex-col gap-1 min-w-0">
          <Span className="text-sm font-semibold truncate">{task.name}</Span>
          <Span className="text-xs text-muted-foreground truncate">
            {task.routeId}
            {task.goal
              ? ` · ${t("health.get.widget.goal", { goal: task.goal })}`
              : ""}
          </Span>
        </Div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => onCancel(task.id)}
        >
          {busy
            ? t("health.get.widget.cancelling")
            : t("health.get.widget.cancel")}
        </Button>
      </Div>
      <Span className="text-xs text-muted-foreground tabular-nums">
        {[
          `${t("health.get.widget.age")}: ${formatAge(task.ageMs)} (${t("health.get.widget.limit", { limit: formatAge(task.limitMs) })})`,
          `${t("health.get.widget.turns")}: ${numberFormat.format(task.turns)}`,
          `${t("health.get.widget.toolCalls")}: ${numberFormat.format(task.toolCalls)}`,
          `${t("health.get.widget.spend")}: ${t("health.get.widget.credits", { amount: numberFormat.format(task.spend) })}`,
        ].join(" · ")}
      </Span>
      {nearLimit && (
        <Badge variant="destructive" className="self-start">
          {formatAge(task.ageMs)}
        </Badge>
      )}
    </Div>
  );
}

function IncidentRow({
  incident,
  t,
  busy,
  onResolve,
}: {
  incident: Incident;
  t: HealthT;
  busy: boolean;
  onResolve: (incidentId: string) => void;
}): JSX.Element {
  return (
    <Div className="flex items-start justify-between gap-3 px-4 py-3">
      <Div className="flex flex-col gap-1 min-w-0">
        <Div className="flex items-center gap-2">
          <Badge variant="destructive">{t(incident.type)}</Badge>
          <Span className="text-sm font-semibold truncate">
            {incident.taskName}
          </Span>
        </Div>
        <Span className="text-xs text-muted-foreground">{incident.reason}</Span>
        <Span className="text-xs text-muted-foreground tabular-nums">
          {new Date(incident.createdAt).toLocaleString()}
        </Span>
      </Div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={busy}
        onClick={() => onResolve(incident.id)}
      >
        {t("health.get.widget.resolve")}
      </Button>
    </Div>
  );
}

export function TaskHealthWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const mutations = useWidgetEndpointMutations();
  const cancelMutation = useApiMutation(cancelDefinitions.POST, logger, user);
  const numberFormat = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  });

  const refetch = (): void => {
    void mutations?.read?.refetch?.();
  };
  const run = (requestData: { taskId?: string; incidentId?: string }): void => {
    void cancelMutation.mutateAsync({ requestData }).then(refetch);
  };
  const busyId = cancelMutation.isPending
    ? (cancelMutation.variables?.requestData?.taskId ??
      cancelMutation.variables?.requestData?.incidentId ??
      null)
    : null;

  return (
    <WidgetShell>
      <Div className="flex flex-col gap-4">
        <WidgetHeader
          title={t("health.get.widget.title")}
          actions={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={refetch}
              aria-label={t("health.get.widget.refresh")}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          }
        />
        <P className="text-sm text-muted-foreground">
          {t("health.get.widget.subtitle")}
        </P>

        {!data ? (
          <LoadingBlock message={t("health.get.widget.loading")} />
        ) : (
          <>
            <P className="text-sm font-medium tabular-nums">
              {t("health.get.widget.spendToday", {
                spent: numberFormat.format(data.daySpent),
                cap: numberFormat.format(data.dayCap),
              })}
            </P>

            <Div className="flex flex-col gap-2">
              <SectionTitle
                title={t("health.get.widget.running.title")}
                count={data.running.length}
              />
              {data.running.length === 0 ? (
                <P className="text-sm text-muted-foreground">
                  {t("health.get.widget.running.empty")}
                </P>
              ) : (
                <Div className="flex flex-col divide-y divide-border rounded-lg border overflow-hidden">
                  {data.running.map((task) => (
                    <RunningRow
                      key={task.id}
                      task={task}
                      t={t}
                      numberFormat={numberFormat}
                      busy={busyId === task.id}
                      onCancel={(taskId) => run({ taskId })}
                    />
                  ))}
                </Div>
              )}
            </Div>

            <Div className="flex flex-col gap-2">
              <SectionTitle
                title={t("health.get.widget.incidents.title")}
                count={data.incidents.length}
              />
              {data.incidents.length === 0 ? (
                <P className="text-sm text-muted-foreground">
                  {t("health.get.widget.incidents.empty")}
                </P>
              ) : (
                <Div className="flex flex-col divide-y divide-border rounded-lg border overflow-hidden">
                  {data.incidents.map((incident) => (
                    <IncidentRow
                      key={incident.id}
                      incident={incident}
                      t={t}
                      busy={busyId === incident.id}
                      onResolve={(incidentId) => run({ incidentId })}
                    />
                  ))}
                </Div>
              )}
            </Div>

            <Div className="flex flex-col gap-2">
              <SectionTitle
                title={t("health.get.widget.failures.title")}
                count={data.failures.length}
              />
              {data.failures.length === 0 ? (
                <P className="text-sm text-muted-foreground">
                  {t("health.get.widget.failures.empty")}
                </P>
              ) : (
                <Div className="flex flex-col divide-y divide-border rounded-lg border overflow-hidden">
                  {data.failures.map((failure) => (
                    <Div
                      key={failure.id}
                      className="flex flex-col gap-1 px-4 py-3"
                    >
                      <Div className="flex items-center gap-2">
                        <Badge variant="secondary">{failure.status}</Badge>
                        <Span className="text-sm font-semibold truncate">
                          {failure.name}
                        </Span>
                      </Div>
                      <Span className="text-xs text-muted-foreground">
                        {`${t("health.get.widget.lastError")}: ${failure.lastError ?? t("health.get.widget.noError")}`}
                      </Span>
                      <Span className="text-xs text-muted-foreground tabular-nums">
                        {new Date(failure.finishedAt).toLocaleString()}
                        {failure.durationMs !== null
                          ? ` · ${formatAge(failure.durationMs)}`
                          : ""}
                      </Span>
                    </Div>
                  ))}
                </Div>
              )}
            </Div>
          </>
        )}
      </Div>
    </WidgetShell>
  );
}
