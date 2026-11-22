/**
 * Remote Connections Widget
 *
 * Cloud context:  Connect guide (paid gate for unpaid customers), what a linked
 *                 instance may do, and the account's linked instances (view +
 *                 disconnect). Connecting is done from the instance, not here.
 * Local context:  "Connect to cloud" pitch + existing connection list.
 */

"use client";

import { isCliPlatform, Platform } from "next-vibe/platforms/platforms";
import { Badge } from "next-vibe/ui/components/badge";
import { Button, type ButtonMouseEvent } from "next-vibe/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe/ui/components/card";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { CheckCircle2 } from "next-vibe/ui/components/icons/CheckCircle2";
import { Link2 } from "next-vibe/ui/components/icons/Link2";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Lock } from "next-vibe/ui/components/icons/Lock";
import { Pencil } from "next-vibe/ui/components/icons/Pencil";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { Shield } from "next-vibe/ui/components/icons/Shield";
import { SiGithub } from "next-vibe/ui/components/icons/SiGithub";
import { Terminal } from "next-vibe/ui/components/icons/Terminal";
import { Trash2 } from "next-vibe/ui/components/icons/Trash2";
import { WifiOff } from "next-vibe/ui/components/icons/WifiOff";
import { Link } from "next-vibe/ui/components/link";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Span } from "next-vibe/ui/components/span";
import {
  StatusPill,
  type StatusPillVariant,
} from "next-vibe/ui/components/status-pill";
import { Code, H3, P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { usePathname } from "next-vibe/ui/hooks/use-pathname";
import type { JSX } from "react";
import { useState } from "react";

import { CreditsTabHeader } from "@/credits/credits-tab-header";
import { GITHUB_REPO_URL } from "@/env/constants";

import { coreClientEnv as envClient } from "../../core/env-client";
import { VibeMode } from "../../env/env-util";
import { UserPermissionRole } from "../../identity/roles/enum";
import { usePickerCallback } from "../../unified-ui/_shared/picker-context";
import { useRelatedEntityNavigation } from "../../unified-ui/_shared/related-entities";
import {
  useWidgetEndpointMutations,
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
} from "../../unified-ui/_shared/use-widget-context";
import { apiClient } from "../../unified-ui/hooks/store";
import { FormAlertWidget } from "../../unified-ui/widgets/interactive/form-alert/widget";
import { getSyncHealthIssue } from "../health-types";
import type endpoints from "./definition";
import type { RemoteConnection } from "./definition";
import { FleetHealthReport } from "./fleet-health";

function connectionStatus(
  conn: RemoteConnection,
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>,
): { label: string; variant: StatusPillVariant } {
  if (!conn.hasToken && !conn.remoteUrl) {
    return { label: t("widget.selfBadge"), variant: "muted" };
  }
  if (conn.requiresReauth) {
    return { label: t("widget.health.reauthRequired"), variant: "danger" };
  }
  if (!conn.isActive || conn.healthStatus === "disconnected") {
    return { label: t("widget.health.disconnected"), variant: "muted" };
  }
  if (!conn.hasToken) {
    return { label: t("widget.registeredBadge"), variant: "muted" };
  }
  if (conn.healthStatus === "critical") {
    return { label: t("widget.health.bridgeFailed"), variant: "danger" };
  }
  if (!conn.lastSyncedAt) {
    return { label: t("widget.health.noSyncRecorded"), variant: "warning" };
  }
  if (getSyncHealthIssue(Date.parse(conn.lastSyncedAt))) {
    return { label: t("fleet.issue.staleSync"), variant: "warning" };
  }
  if (conn.wsConnectedAt) {
    return { label: t("widget.health.socketOpen"), variant: "success" };
  }
  return { label: t("widget.health.syncRecorded"), variant: "info" };
}

// ─── Shared action buttons ────────────────────────────────────────────────────

function AddConnectionButton({
  navigate,
  label,
  variant = "default",
}: {
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  label: string;
  variant?: "default" | "outline";
}): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: ButtonMouseEvent): Promise<void> => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      const defs = await import("../connect/definition");
      navigate(defs.default.POST, { popNavigationOnSuccess: 1 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      size="sm"
      variant={variant}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
      ) : (
        <Plus className="h-3.5 w-3.5 mr-1" />
      )}
      {label}
    </Button>
  );
}

function ReconnectButton({
  conn,
  navigate,
  t,
}: {
  conn: RemoteConnection;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>;
}): JSX.Element | null {
  const [isLoading, setIsLoading] = useState(false);
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const locale = useWidgetLocale();

  // Incoming entries and healthy connections don't need a reconnect button
  if (conn.isReverseEntry || conn.healthStatus === "healthy") {
    return null;
  }

  const label = conn.requiresReauth
    ? t("widget.reconnectButton.reauth")
    : conn.healthStatus === "disconnected"
      ? t("widget.reconnectButton.reconnect")
      : conn.healthStatus === "critical"
        ? t("widget.reconnectButton.retry")
        : t("widget.reconnectButton.resync");

  const handleClick = async (e: ButtonMouseEvent): Promise<void> => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      if (conn.requiresReauth) {
        const defs = await import("../connect/definition");
        navigate(defs.default.POST, {
          data: { remoteUrl: conn.remoteUrl },
          popNavigationOnSuccess: 1,
        });
        return;
      }
      const defs = await import("../[instanceId]/definition");
      await apiClient.mutate(
        defs.default.PATCH,
        logger,
        user,
        {
          reconnectNow: true,
          // The list row carries no stored syncScope; the reconnect only
          // re-establishes transport, so pass the sensible full default. The
          // server keeps the persisted scope for anything not overridden.
          syncScope: {
            memories: true,
            documents: true,
            skills: true,
            favorites: true,
            threads: false,
          },
        },
        { instanceId: conn.instanceId },
        locale,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant={conn.healthStatus === "disconnected" ? "outline" : "destructive"}
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
      className="gap-1.5 text-xs h-7"
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <RefreshCw className="h-3.5 w-3.5" />
      )}
      {label}
    </Button>
  );
}

function EditButton({
  conn,
  navigate,
  t,
}: {
  conn: RemoteConnection;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>;
}): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: ButtonMouseEvent): Promise<void> => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      const defs = await import("../[instanceId]/definition");
      navigate(defs.default.PATCH, {
        urlPathParams: { instanceId: conn.instanceId },
        getEndpoint: defs.default.GET,
        prefillFromGet: true,
        popNavigationOnSuccess: 1,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
      className="gap-1.5 text-xs h-7"
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Pencil className="h-3.5 w-3.5" />
      )}
      {t("widget.editButton")}
    </Button>
  );
}

function RenameSelfButton({
  navigate,
}: {
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
}): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: ButtonMouseEvent): Promise<void> => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      const defs = await import("../self/rename/definition");
      navigate(defs.default.PATCH, {
        popNavigationOnSuccess: 1,
        renderInModal: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Pencil className="h-4 w-4" />
      )}
    </Button>
  );
}

function DisconnectButton({
  conn,
  navigate,
  t,
}: {
  conn: RemoteConnection;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>;
}): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: ButtonMouseEvent): Promise<void> => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      const defs = await import("../[instanceId]/definition");
      navigate(defs.default.DELETE, {
        urlPathParams: { instanceId: conn.instanceId },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
      className="gap-1.5 text-xs h-7 text-destructive hover:text-destructive"
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Trash2 className="h-3.5 w-3.5" />
      )}
      {t("widget.deleteButton")}
    </Button>
  );
}

// ─── Connection row ───────────────────────────────────────────────────────────

function ConnectionRow({
  conn,
  navigate,
  t,
  onPick,
  isPickerMode,
  canManage,
}: {
  conn: RemoteConnection;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>;
  onPick: ((conn: RemoteConnection) => void) | undefined;
  isPickerMode: boolean;
  /** Settings (PATCH) are admin-only; customers view and disconnect. */
  canManage: boolean;
}): JSX.Element {
  const locale = useWidgetLocale();
  const widgetIsInteractive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const isInteractive = widgetIsInteractive && !responseOnly;
  const navigateRelated = useRelatedEntityNavigation();
  const isSelf = !conn.hasToken && conn.remoteUrl === "";
  const status = connectionStatus(conn, t);
  const remoteUrl = conn.remoteUrl || conn.localUrl;
  const date = (value: string): string =>
    new Date(value).toLocaleString(locale, { timeZoneName: "short" });

  const handleView = (): void => {
    if (isPickerMode && onPick) {
      onPick(conn);
      return;
    }
    navigateRelated(
      async () => (await import("../[instanceId]/definition")).default.GET,
      {
        urlPathParams: { instanceId: conn.instanceId },
      },
    );
  };

  return (
    <Div className="flex min-w-0 flex-col gap-3 px-4 py-3">
      <Div className="flex flex-wrap items-center gap-2">
        <Span className="min-w-0 text-sm font-medium [overflow-wrap:anywhere]">
          {conn.instanceId}
        </Span>
        <StatusPill status={status.label} variant={status.variant} />
        {conn.isReverseEntry && (
          <Badge variant="outline">{t("widget.incomingBadge")}</Badge>
        )}
        {conn.isInferenceProvider && (
          <Badge variant="outline">{t("widget.inferenceProviderBadge")}</Badge>
        )}
      </Div>
      {!isSelf && (
        <DetailGrid columns={2}>
          {remoteUrl && (
            <DetailField label={t("widget.remoteUrl")} value={remoteUrl} mono />
          )}
          <DetailField
            label={t("widget.lastSynced")}
            value={
              conn.lastSyncedAt ? date(conn.lastSyncedAt) : t("widget.never")
            }
          />
          {conn.wsConnectedAt && (
            <DetailField
              label={t("widget.socketSince")}
              value={date(conn.wsConnectedAt)}
            />
          )}
          {(conn.transportMode || conn.remoteTransportMode) && (
            <DetailField
              label={t("widget.transportLabel")}
              value={t("widget.transportBadge", {
                out: conn.transportMode
                  ? t(
                      conn.transportMode === "reverse-ws"
                        ? "widget.transport.reverseWs"
                        : "widget.transport.directHttp",
                    )
                  : t("widget.transport.unknown"),
                in: conn.remoteTransportMode
                  ? t(
                      conn.remoteTransportMode === "reverse-ws"
                        ? "widget.transport.reverseWs"
                        : "widget.transport.directHttp",
                    )
                  : t("widget.transport.unknown"),
              })}
            />
          )}
        </DetailGrid>
      )}
      {isInteractive && (
        <Div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleView}
            aria-label={t("widget.viewConnection", {
              instance: conn.instanceId,
            })}
          >
            {isPickerMode ? t("widget.pickConnection") : t("widget.viewButton")}
          </Button>
          {!isPickerMode && (
            <>
              {canManage &&
                !isSelf &&
                conn.hasToken &&
                !conn.isReverseEntry && (
                  <ReconnectButton conn={conn} navigate={navigate} t={t} />
                )}
              {canManage && (
                <EditButton conn={conn} navigate={navigate} t={t} />
              )}
              {!isSelf && (
                <DisconnectButton conn={conn} navigate={navigate} t={t} />
              )}
            </>
          )}
        </Div>
      )}
    </Div>
  );
}

// ─── Cloud view: connect guide + the account's linked instances ──────────────

function GuideStep({
  index,
  title,
  body,
  children,
}: {
  index: number;
  title: string;
  body: string;
  children?: JSX.Element;
}): JSX.Element {
  return (
    <Div className="flex gap-3">
      <Span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
        {index}
      </Span>
      <Div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Span className="text-sm font-semibold">{title}</Span>
        <P className="m-0 text-sm leading-relaxed text-muted-foreground">
          {body}
        </P>
        {children}
      </Div>
    </Div>
  );
}

function TrustLine({ text }: { text: string }): JSX.Element {
  return (
    <Div className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
      <P className="m-0 text-sm text-muted-foreground">{text}</P>
    </Div>
  );
}

function CloudView({
  connections,
  access,
  navigate,
  t,
  onPick,
  isPickerMode,
  isAdmin,
}: {
  connections: RemoteConnection[];
  access: { canConnect: boolean; maxConnections: number | null };
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>;
  onPick: ((conn: RemoteConnection) => void) | undefined;
  isPickerMode: boolean;
  isAdmin: boolean;
}): JSX.Element {
  const appUrl = envClient.NEXT_PUBLIC_APP_URL ?? "";
  const openBuy = (): void => {
    void (async (): Promise<void> => {
      const def = await import("@/subscription/create/definition");
      navigate(def.default.POST, {});
    })();
  };

  return (
    <Div className="flex flex-col gap-6 p-4">
      {/* Linked instances: view + disconnect (settings live on the instance) */}
      <Div className="flex flex-col gap-4">
        <Div className="flex flex-col gap-1">
          <Span className="text-sm font-semibold">
            {t("widget.cloud.alreadyHaveLocal")}
          </Span>
          <P className="m-0 text-xs text-muted-foreground">
            {t("widget.cloud.alreadyHaveLocalSub")}
          </P>
        </Div>

        {connections.length > 0 ? (
          <Div className="flex flex-col divide-y overflow-hidden rounded-lg border">
            {connections.map((conn) => (
              <ConnectionRow
                key={conn.instanceId}
                conn={conn}
                navigate={navigate}
                t={t}
                onPick={onPick}
                isPickerMode={isPickerMode}
                canManage={isAdmin}
              />
            ))}
          </Div>
        ) : (
          <Div className="flex flex-col items-start gap-3 rounded-lg border border-dashed bg-muted/30 p-4">
            <Div className="flex items-center gap-2 text-muted-foreground">
              <WifiOff className="h-4 w-4" />
              <P className="m-0 text-sm">{t("widget.emptyStateCloud")}</P>
            </Div>
          </Div>
        )}
      </Div>
      {!isPickerMode && (
        <>
          <Div className="flex flex-col gap-2">
            <H3 className="text-xl font-bold tracking-tight">
              {t("widget.cloud.heroTitle")}
            </H3>
            <P className="m-0 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {t("widget.cloud.heroSubtitle")}
            </P>
          </Div>

          {!access.canConnect ? (
            <Div
              data-testid="remote-paid-gate"
              className="flex flex-col gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
            >
              <Div className="flex items-start gap-3">
                <Lock className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <Div className="flex flex-col gap-0.5">
                  <Span className="text-sm font-semibold">
                    {t("widget.cloud.paidTitle")}
                  </Span>
                  <Span className="text-sm text-muted-foreground">
                    {t("widget.cloud.paidBody")}
                  </Span>
                </Div>
              </Div>
              <Button
                type="button"
                className="h-11 shrink-0 sm:h-10"
                onClick={openBuy}
              >
                {t("widget.cloud.paidCta")}
              </Button>
            </Div>
          ) : (
            <Div
              data-testid="remote-connect-guide"
              className="flex flex-col gap-5 rounded-lg border bg-card p-4 sm:p-5"
            >
              <Span className="text-sm font-semibold">
                {t("widget.cloud.stepsTitle")}
              </Span>
              <GuideStep
                index={1}
                title={t("widget.cloud.step1Title")}
                body={t("widget.cloud.step1Body")}
              >
                <Div className="flex flex-wrap gap-2 pt-1">
                  <Link
                    href={GITHUB_REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-3 text-sm font-medium text-background no-underline transition-opacity hover:opacity-90"
                  >
                    <SiGithub className="h-4 w-4" />
                    {t("widget.cloud.githubCta")}
                  </Link>
                  <Link
                    href={`${GITHUB_REPO_URL}#quick-start`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium no-underline transition-colors hover:bg-muted"
                  >
                    {t("widget.cloud.quickstartCta")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Div>
              </GuideStep>
              <GuideStep
                index={2}
                title={t("widget.cloud.step2Title")}
                body={t("widget.cloud.step2Body", { appUrl })}
              >
                <Div className="flex items-center gap-2 overflow-x-auto rounded-md border bg-muted/50 px-3 py-2">
                  <Terminal className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <Code className="whitespace-nowrap bg-transparent p-0 text-xs">
                    {t("widget.cloud.step2Command")}
                  </Code>
                </Div>
              </GuideStep>
              <GuideStep
                index={3}
                title={t("widget.cloud.step3Title")}
                body={t("widget.cloud.step3Body")}
              />
            </Div>
          )}

          <Div className="flex flex-col gap-2.5">
            <Div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <Span className="text-sm font-semibold">
                {t("widget.cloud.trustTitle")}
              </Span>
            </Div>
            <TrustLine text={t("widget.cloud.trust1")} />
            <TrustLine text={t("widget.cloud.trust2")} />
            <TrustLine text={t("widget.cloud.trust3")} />
            {access.maxConnections !== null && (
              <TrustLine
                text={t("widget.cloud.trust4", { max: access.maxConnections })}
              />
            )}
          </Div>
        </>
      )}
    </Div>
  );
}

// ─── Local view: pitch + connection list ──────────────────────────────────────

function LocalView({
  connections,
  selfInstanceId,
  navigate,
  t,
  onPick,
  isPickerMode,
  isAdmin,
  hideList = false,
}: {
  /** The fleet report above already lists every row (tools page). */
  hideList?: boolean;
  connections: RemoteConnection[];
  selfInstanceId: string | null;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>;
  onPick: ((conn: RemoteConnection) => void) | undefined;
  isPickerMode: boolean;
  isAdmin: boolean;
}): JSX.Element {
  return (
    <Div className="flex flex-col gap-0">
      {/* Connection list header — only when there is a list to head */}
      {!hideList && connections.length > 0 && (
        <Div className="flex items-center gap-2 px-4 py-3 border-b">
          <Link2 className="h-4 w-4 text-muted-foreground" />
          <Span className="font-semibold text-sm mr-auto">
            {t("widget.local.connectionsTitle")}
          </Span>
        </Div>
      )}

      {hideList ? null : connections.length > 0 ? (
        <Div className="flex flex-col divide-y">
          {connections.map((conn) => (
            <ConnectionRow
              key={conn.instanceId}
              conn={conn}
              navigate={navigate}
              t={t}
              onPick={onPick}
              isPickerMode={isPickerMode}
              canManage={isAdmin}
            />
          ))}
        </Div>
      ) : (
        <Div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card px-6 py-10 text-center">
          <Span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <WifiOff className="h-5 w-5" />
          </Span>
          <Div className="flex flex-col gap-1">
            <Span className="text-sm font-semibold text-foreground">
              {t("widget.local.noConnectionsYet")}
            </Span>
            <P className="m-0 max-w-sm text-sm text-muted-foreground">
              {t("widget.emptyState")}
            </P>
          </Div>
        </Div>
      )}
      {/* Connect to cloud pitch — admins only, not on the fleet health page */}
      {isAdmin && !hideList && (
        <Card className="rounded-none border-0 border-b shadow-none">
          <CardHeader className="pb-3">
            <Div className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">
                {t("widget.local.cloudTitle")}
              </CardTitle>
            </Div>
            <CardDescription className="text-sm leading-relaxed">
              {t("widget.local.cloudSubtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <Div className="flex flex-col gap-1.5 mb-4">
              {(
                [
                  "widget.local.benefit1",
                  "widget.local.benefit2",
                  "widget.local.benefit3",
                ] as const
              ).map((key) => (
                <Div key={key} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <P className="text-xs text-muted-foreground">{t(key)}</P>
                </Div>
              ))}
            </Div>
            {!isPickerMode && (
              <AddConnectionButton
                navigate={navigate}
                label={t("widget.connectButtonLocal")}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Self-identity — admins only */}
      {isAdmin && selfInstanceId && (
        <Card className="rounded-none border-0 border-b shadow-none">
          <CardHeader className="pb-3">
            <Div className="flex flex-wrap items-center justify-between gap-3">
              <Div className="flex flex-col gap-1">
                <Div className="flex flex-wrap items-center gap-2">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm">
                    {t("widget.selfIdentity.title")}
                  </CardTitle>
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {selfInstanceId}
                  </Badge>
                </Div>
                <CardDescription className="text-xs">
                  {t("widget.selfIdentity.description")}
                </CardDescription>
              </Div>
              {!isPickerMode && <RenameSelfButton navigate={navigate} />}
            </Div>
          </CardHeader>
        </Card>
      )}
    </Div>
  );
}

// ─── Root container ───────────────────────────────────────────────────────────

export function RemoteConnectionsListContainer(): JSX.Element {
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const data = useWidgetValue<typeof endpoints.GET>();
  const response = useWidgetResponse();
  const read = useWidgetEndpointMutations()?.read;
  const widgetIsInteractive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const isInteractive = widgetIsInteractive && !responseOnly;
  const [, firstSegment, secondSegment] = usePathname().split("/");
  const onPick = usePickerCallback<RemoteConnection>();
  const user = useWidgetUser();
  const isPickerMode = !!onPick;
  const isCloud = envClient.NEXT_PUBLIC_VIBE_MODE === VibeMode.CLOUD;
  const isAdmin =
    !user.isPublic && user.roles?.includes(UserPermissionRole.ADMIN) === true;
  const isToolsPage = firstSegment === "tools" || secondSegment === "tools";
  const showBillingHeader =
    isInteractive && !isPickerMode && !(isAdmin && isToolsPage);
  const hasError = response?.success === false;
  const platform = useWidgetPlatform();
  const isTextSurface = isCliPlatform(platform) || platform === Platform.MCP;
  // Admin fleet health: tools page, CLI and MCP. Never in picker mode or on
  // the customer-facing subscription pages.
  const fleet =
    isAdmin && !isPickerMode && (isToolsPage || isTextSurface)
      ? (data?.fleet ?? null)
      : null;

  if (fleet && isTextSurface) {
    return (
      <FleetHealthReport
        fleet={fleet}
        isLoading={read?.isLoading ?? false}
        onRefresh={() => void read?.refetch()}
      />
    );
  }

  return (
    <WidgetShell className="min-w-0">
      {showBillingHeader && <CreditsTabHeader activeTab="remote" />}
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
              {t("widget.back")}
            </Button>
          )
        }
        actions={
          isInteractive && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label={t("widget.refresh")}
              onClick={() => void read?.refetch()}
            >
              <RefreshCw className="size-4" />
            </Button>
          )
        }
      />
      <FormAlertWidget field={{}} />
      {!hasError && (!data || read?.isLoading) && (
        <Div aria-live="polite">
          <LoadingBlock message={t("widget.loading")} />
        </Div>
      )}
      {fleet && !hasError && (
        <FleetHealthReport
          fleet={fleet}
          isLoading={read?.isLoading ?? false}
          onRefresh={() => void read?.refetch()}
        />
      )}
      {data &&
        !hasError &&
        !read?.isLoading &&
        (isCloud || !isAdmin ? (
          <CloudView
            connections={data.connections}
            access={data.access}
            navigate={navigate}
            t={t}
            onPick={onPick}
            isPickerMode={isPickerMode}
            isAdmin={isAdmin}
          />
        ) : (
          <LocalView
            connections={data.connections}
            selfInstanceId={data.selfInstanceId}
            navigate={navigate}
            t={t}
            onPick={onPick}
            isPickerMode={isPickerMode}
            isAdmin={isAdmin}
            hideList={fleet !== null}
          />
        ))}
    </WidgetShell>
  );
}
