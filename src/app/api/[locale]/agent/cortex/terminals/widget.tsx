/**
 * Cortex Terminals Widget
 * Lists active terminal sessions with status, cwd, and last command time.
 * Uses WidgetShell/WidgetHeader/EmptyBlock/ListItem/StatusPill per widget.md.
 */

"use client";

import { Button, type ButtonMouseEvent } from "next-vibe/ui/web/ui/button";
import { Div } from "next-vibe/ui/web/ui/div";
import { EmptyBlock } from "next-vibe/ui/web/ui/empty-block";
import { ChevronLeft } from "next-vibe/ui/web/ui/icons/ChevronLeft";
import { Terminal } from "next-vibe/ui/web/ui/icons/Terminal";
import { ListItem } from "next-vibe/ui/web/ui/list-item";
import { LoadingBlock } from "next-vibe/ui/web/ui/loading-block";
import { MetricCard } from "next-vibe/ui/web/ui/metric-card";
import { MetricGrid } from "next-vibe/ui/web/ui/metric-grid";
import { Span } from "next-vibe/ui/web/ui/span";
import { StatusPill } from "next-vibe/ui/web/ui/status-pill";
import { WidgetHeader } from "next-vibe/ui/web/ui/widget-header";
import { WidgetShell } from "next-vibe/ui/web/ui/widget-shell";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { type JSX } from "react";

import type definition from "./definition";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CortexTerminalsWidget(_props: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();

  // --- Cross-endpoint navigation ---

  const navToExec = (): void => {
    void (async (): Promise<void> => {
      const def =
        await import("@/app/api/[locale]/agent/cortex/exec/definition");
      navigate(def.default.POST, {});
    })();
  };

  const handleNavExec = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    navToExec();
  };

  const handleNavConnections = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def =
        await import("@/app/api/[locale]/ssh/connections/list/definition");
      navigate(def.default.GET, {});
    })();
  };

  const handleOpenTerminal =
    (terminalId: string, connectionSlug: string) =>
    (e: ButtonMouseEvent): void => {
      e.stopPropagation();
      void (async (): Promise<void> => {
        const def =
          await import("@/app/api/[locale]/agent/cortex/exec/definition");
        navigate(def.default.POST, {
          data: {
            path: `/ssh/${connectionSlug}`,
            terminalId,
          },
        });
      })();
    };

  return (
    <WidgetShell>
      <WidgetHeader
        title={t("widget.title")}
        backButton={
          canGoBack ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => pop()}
              className="gap-1.5 -ml-1"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("widget.back")}
            </Button>
          ) : undefined
        }
        actions={
          <Div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleNavExec}
              className="text-xs"
            >
              {t("widget.openExec")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleNavConnections}
              className="text-xs"
            >
              {t("widget.manageConnections")}
            </Button>
          </Div>
        }
      />

      <FormAlertWidget field={{}} />

      {!data ? (
        <LoadingBlock message={t("get.status.loading")} />
      ) : data.total === 0 ? (
        <EmptyBlock
          icon={<Terminal className="h-8 w-8" />}
          title={t("widget.noTerminals")}
          message={t("widget.noTerminalsHint")}
          action={{
            label: t("widget.openExec"),
            onClick: navToExec,
          }}
        />
      ) : (
        <>
          <MetricGrid columns={2}>
            <MetricCard
              label={t("widget.terminalCount")}
              value={data.total}
              variant="info"
            />
          </MetricGrid>

          <Div className="flex flex-col divide-y divide-border rounded-lg border overflow-hidden">
            {data.terminals.map(
              (terminal: {
                terminalId: string;
                connectionSlug: string;
                cwd: string;
                name: string;
                openedAt: Date;
                lastCommandAt: Date;
                status: string;
              }) => (
                <ListItem
                  key={terminal.terminalId}
                  title={terminal.connectionSlug}
                  subtitle={terminal.cwd}
                  badges={
                    <StatusPill
                      status={t("widget.activeStatus")}
                      variant="success"
                    />
                  }
                  meta={
                    <Div className="flex items-center gap-2">
                      <Span className="text-[10px] text-muted-foreground">
                        {t("widget.lastCommand")}{" "}
                        {new Date(terminal.lastCommandAt).toLocaleString(
                          locale,
                        )}
                      </Span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleOpenTerminal(
                          terminal.terminalId,
                          terminal.connectionSlug,
                        )}
                        className="text-xs h-6"
                      >
                        {t("widget.openTerminal")}
                      </Button>
                    </Div>
                  }
                />
              ),
            )}
          </Div>
        </>
      )}
    </WidgetShell>
  );
}
