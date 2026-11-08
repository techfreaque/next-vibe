"use client";

/**
 * Refusal Index - Runs overview widget (admin).
 * Runs list, start a run, resume a crashed/cancelled one, open a run's results.
 */

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Play } from "next-vibe/ui/components/icons/Play";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetEndpointMutations,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import { RefusalRunStatus } from "../enum";
import type definition from "./definition";

export function RunsWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const { push: navigate } = useWidgetNavigation();
  const mutations = useWidgetEndpointMutations();

  const refresh = (): void => {
    mutations?.read?.refetch?.();
  };

  const handleStart = (resumeRunId?: string): void => {
    void (async (): Promise<void> => {
      const def = await import("./start/definition");
      navigate(def.default.POST, {
        data: resumeRunId ? { resumeRunId } : undefined,
        renderInModal: true,
        popNavigationOnSuccess: 1,
        onSuccessCallback: refresh,
      });
    })();
  };

  const handleOpen = (id: string): void => {
    void (async (): Promise<void> => {
      const def = await import("./[id]/definition");
      navigate(def.default.GET, { urlPathParams: { id } });
    })();
  };

  const handleQuestions = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../questions/definition");
      navigate(def.default.GET);
    })();
  };

  const noQuestions =
    data !== null && data !== undefined && data.activeQuestionCount === 0;

  return (
    <WidgetShell>
      <WidgetHeader
        title={t("runs.get.title")}
        actions={
          <>
            <Button type="button" variant="ghost" size="sm" onClick={refresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={noQuestions}
              onClick={(): void => handleStart()}
            >
              <Play className="h-4 w-4" />
              <Span>{t("runs.widget.start")}</Span>
            </Button>
          </>
        }
      />

      {data && (
        <Div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="outline">
            {t("runs.get.response.activeQuestionCount")}:{" "}
            {data.activeQuestionCount}
          </Badge>
          <Badge variant="outline">
            {t("runs.get.response.benchmarkModelCount")}:{" "}
            {data.benchmarkModelCount}
          </Badge>
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={handleQuestions}
          >
            {t("runs.widget.manageQuestions")}
          </Button>
        </Div>
      )}

      {noQuestions && (
        <Div className="rounded-md border border-dashed p-6 text-center">
          <P className="text-sm font-medium">
            {t("runs.widget.noQuestions.title")}
          </P>
          <P className="mt-1 text-xs text-muted-foreground">
            {t("runs.widget.noQuestions.hint")}
          </P>
        </Div>
      )}

      {data && data.runs.length === 0 && !noQuestions && (
        <Div className="rounded-md border border-dashed p-6 text-center">
          <P className="text-sm font-medium">{t("runs.widget.empty.title")}</P>
          <P className="mt-1 text-xs text-muted-foreground">
            {t("runs.widget.empty.hint")}
          </P>
        </Div>
      )}

      {data && data.runs.length > 0 && (
        <Div className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border">
          {data.runs.map((run) => (
            <Div
              key={run.id}
              className="flex flex-wrap items-center gap-3 px-4 py-3"
            >
              <Badge
                variant={
                  run.status === RefusalRunStatus.COMPLETED
                    ? "default"
                    : run.status === RefusalRunStatus.RUNNING
                      ? "secondary"
                      : "outline"
                }
              >
                {t(run.status)}
              </Badge>
              <Div className="flex min-w-0 flex-1 flex-col text-xs">
                <Span className="font-medium">
                  {new Date(run.startedAt).toLocaleString()}
                </Span>
                <Span className="text-muted-foreground">
                  {`${String(run.resultCount)}/${String(run.modelCount * run.questionCount)} ${t("runs.widget.results")}`}
                </Span>
                <Span className="text-muted-foreground">
                  {`${String(run.totalCost)}${run.budgetCredits === null ? "" : `/${String(run.budgetCredits)}`} ${t("runs.widget.credits")}`}
                </Span>
                <Span className="text-muted-foreground">
                  {`${run.judgeModelId} (${run.judgePromptVersion})`}
                </Span>
                {run.cancelReason && (
                  <Span className="text-destructive">{run.cancelReason}</Span>
                )}
              </Div>
              {(run.status === RefusalRunStatus.CANCELLED ||
                run.status === RefusalRunStatus.FAILED ||
                run.status === RefusalRunStatus.RUNNING) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(): void => handleStart(run.id)}
                >
                  {t("runs.widget.resume")}
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(): void => handleOpen(run.id)}
              >
                {t("runs.widget.open")}
              </Button>
            </Div>
          ))}
        </Div>
      )}
    </WidgetShell>
  );
}
