/**
 * SSH Connections List Widget — Unified Machine View
 *
 * Shows all reachable machines: local shell, SSH servers, and remote instances.
 * Uses WidgetShell/WidgetHeader/ListItem/StatusPill/EmptyBlock per widget.md.
 */

"use client";

import { Button, type ButtonMouseEvent } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { EmptyBlock } from "next-vibe-ui/ui/empty-block";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Server } from "next-vibe-ui/ui/icons/Server";
import { Terminal } from "next-vibe-ui/ui/icons/Terminal";
import { ListItem } from "next-vibe-ui/ui/list-item";
import { LoadingBlock } from "next-vibe-ui/ui/loading-block";
import { MetricCard } from "next-vibe-ui/ui/metric-card";
import { MetricGrid } from "next-vibe-ui/ui/metric-grid";
import { StatusPill } from "next-vibe-ui/ui/status-pill";
import { WidgetHeader } from "next-vibe-ui/ui/widget-header";
import { WidgetShell } from "next-vibe-ui/ui/widget-shell";
import { type JSX, useCallback } from "react";

import { usePickerCallback } from "next-vibe-ui/unified/_shared/picker-context";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";

import type endpoints from "./definition";

type Connection = NonNullable<
  (typeof endpoints.GET.types.ResponseOutput)["connections"]
>[number];

function getSubtitle(conn: Connection): string {
  if (conn.connectionType === "remote") {
    return conn.host;
  }
  if (conn.connectionType === "local") {
    return `${conn.username}@localhost`;
  }
  return `${conn.username}@${conn.host}:${String(conn.port)}`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ConnectionsListContainer(_props: {
  field: (typeof endpoints.GET)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const data = useWidgetValue<typeof endpoints.GET>();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();

  const onPick = usePickerCallback<Connection>();
  const isPickerMode = !!onPick;

  const connections = data?.connections ?? [];

  // --- Navigation handlers ---

  const handleAddSsh = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("../create/definition");
      navigate(def.POST, {
        popNavigationOnSuccess: 1,
      });
    })();
  }, [navigate]);

  const handleConnectRemote = useCallback((): void => {
    void (async (): Promise<void> => {
      const def =
        await import("@/app/api/[locale]/remote-connection/connect/definition");
      navigate(def.default.POST, { popNavigationOnSuccess: 1 });
    })();
  }, [navigate]);

  const handleRowClick = useCallback(
    (conn: Connection): void => {
      if (isPickerMode && onPick) {
        onPick(conn);
        pop();
        return;
      }

      if (conn.connectionType === "remote" && conn.remoteInstanceId) {
        // Navigate to remote connection detail
        void (async (): Promise<void> => {
          const def =
            await import("@/app/api/[locale]/remote-connection/[instanceId]/definition");
          navigate(def.default.GET, {
            urlPathParams: { instanceId: conn.remoteInstanceId! },
          });
        })();
        return;
      }

      // Navigate to SSH connection detail (local or ssh)
      void (async (): Promise<void> => {
        const def = await import("../[id]/definition");
        navigate(def.PATCH, {
          urlPathParams: { id: conn.id },
          getEndpoint: def.GET,
          prefillFromGet: true,
          popNavigationOnSuccess: 1,
        });
      })();
    },
    [isPickerMode, onPick, navigate, pop],
  );

  const handleOpenTerminal = useCallback(
    (conn: Connection) =>
      (e: ButtonMouseEvent): void => {
        e.stopPropagation();
        const slug = conn.label.toLowerCase().replace(/\s+/g, "-");
        void (async (): Promise<void> => {
          const def =
            await import("@/app/api/[locale]/agent/cortex/exec/definition");
          navigate(def.default.POST, {
            data: { path: `/ssh/${slug}` },
          });
        })();
      },
    [navigate],
  );

  // --- Badge helpers ---

  const typeBadge = (conn: Connection): JSX.Element => {
    const labels: Record<string, string> = {
      local: t("widget.localType"),
      ssh: t("widget.sshType"),
      remote: t("widget.remoteType"),
    };
    const variants: Record<string, "info" | "default" | "warning"> = {
      local: "info",
      ssh: "default",
      remote: "warning",
    };
    return (
      <StatusPill
        status={labels[conn.connectionType] ?? conn.connectionType}
        variant={variants[conn.connectionType] ?? "default"}
      />
    );
  };

  const healthBadge = (conn: Connection): JSX.Element | null => {
    if (!conn.health) {
      return null;
    }
    const labels: Record<string, string> = {
      healthy: t("widget.healthHealthy"),
      warning: t("widget.healthWarning"),
      critical: t("widget.healthCritical"),
      disconnected: t("widget.healthDisconnected"),
    };
    const variants: Record<string, "success" | "warning" | "danger"> = {
      healthy: "success",
      warning: "warning",
      critical: "danger",
      disconnected: "danger",
    };
    return (
      <StatusPill
        status={labels[conn.health] ?? conn.health}
        variant={variants[conn.health] ?? "default"}
      />
    );
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
          !isPickerMode ? (
            <Div className="flex items-center gap-1">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={handleAddSsh}
                className="text-xs gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                {t("widget.addSsh")}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={handleConnectRemote}
                className="text-xs"
              >
                {t("widget.connectRemote")}
              </Button>
            </Div>
          ) : undefined
        }
      />

      <FormAlertWidget field={{}} />

      {!data ? (
        <LoadingBlock message={t("get.title")} />
      ) : connections.length === 0 ? (
        <EmptyBlock
          icon={<Server className="h-8 w-8" />}
          title={t("widget.noConnections")}
          message={t("widget.noConnectionsHint")}
          action={{
            label: t("widget.addSsh"),
            onClick: handleAddSsh,
          }}
        />
      ) : (
        <>
          {!isPickerMode && (
            <MetricGrid columns={2}>
              <MetricCard
                label={t("widget.title")}
                value={connections.length}
                variant="info"
              />
            </MetricGrid>
          )}

          <Div className="flex flex-col gap-2">
            {connections.map((conn) => (
              <ListItem
                key={conn.id}
                title={conn.label}
                subtitle={getSubtitle(conn)}
                onClick={() => handleRowClick(conn)}
                badges={
                  <Div className="flex items-center gap-1">
                    {typeBadge(conn)}
                    {healthBadge(conn)}
                    {conn.isDefault && (
                      <StatusPill
                        status={t("widget.defaultBadge")}
                        variant="info"
                      />
                    )}
                  </Div>
                }
                actions={
                  !isPickerMode ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleOpenTerminal(conn)}
                      className="text-xs h-6 gap-1"
                    >
                      <Terminal className="h-3 w-3" />
                      {t("widget.openTerminal")}
                    </Button>
                  ) : undefined
                }
              />
            ))}
          </Div>
        </>
      )}
    </WidgetShell>
  );
}
