/**
 * Remote Connections Widget
 *
 * Cloud context:  Connect guide (paid gate for unpaid customers), what a linked
 *                 instance may do, and the account's linked instances (view +
 *                 disconnect). Connecting is done from the instance, not here.
 * Local context:  "Connect to cloud" pitch + existing connection list.
 */

"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button, type ButtonMouseEvent } from "next-vibe/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe/ui/components/card";
import { Div } from "next-vibe/ui/components/div";
import { Activity } from "next-vibe/ui/components/icons/Activity";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { CheckCircle2 } from "next-vibe/ui/components/icons/CheckCircle2";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
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
import { Separator } from "next-vibe/ui/components/separator";
import { Span } from "next-vibe/ui/components/span";
import { Code, H3, P } from "next-vibe/ui/components/typography";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import type { JSX } from "react";
import { useState } from "react";

import { CreditsTabHeader } from "@/credits/credits-tab-header";
import { GITHUB_REPO_URL } from "@/env/constants";

import { coreClientEnv as envClient } from "../../core/env-client";
import { VibeMode } from "../../env/env-util";
import { UserPermissionRole } from "../../identity/roles/enum";
import { usePickerCallback } from "../../unified-ui/_shared/picker-context";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "../../unified-ui/_shared/use-widget-context";
import { apiClient } from "../../unified-ui/hooks/store";
import type endpoints from "./definition";
import type { RemoteConnection } from "./definition";

// ─── Health indicator ─────────────────────────────────────────────────────────

type HealthStatus = "healthy" | "warning" | "critical" | "disconnected";

function HealthDot({ health }: { health: HealthStatus }): JSX.Element {
  if (health === "healthy") {
    return <Activity className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />;
  }
  if (health === "warning") {
    return (
      <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
    );
  }
  if (health === "critical") {
    return <AlertCircle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />;
  }
  return (
    <WifiOff className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
  );
}

function healthLabel(
  health: HealthStatus,
  transportMode: string | null | undefined,
  isReverseEntry: boolean,
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>,
): string {
  if (health === "disconnected") {
    return t("widget.health.disconnected");
  }
  if (health === "healthy") {
    if (isReverseEntry) {
      return t("widget.health.incomingActive");
    }
    return transportMode === "reverse-ws"
      ? t("widget.health.tunnelOpen")
      : t("widget.health.bridgeActive");
  }
  if (health === "warning") {
    return transportMode === "reverse-ws"
      ? t("widget.health.tunnelWarning")
      : t("widget.health.bridgeWarning");
  }
  // critical
  return transportMode === "reverse-ws"
    ? t("widget.health.tunnelLost")
    : t("widget.health.bridgeFailed");
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
  const isSelf = !conn.hasToken && conn.remoteUrl === "";
  const health = conn.requiresReauth ? "critical" : conn.healthStatus;
  const isIncoming = conn.isReverseEntry;

  const handleRowClick =
    isPickerMode && onPick
      ? (): void => onPick(conn)
      : (): void => {
          void (async (): Promise<void> => {
            const defs = await import("../[instanceId]/definition");
            navigate(defs.default.GET, {
              urlPathParams: { instanceId: conn.instanceId },
            });
          })();
        };

  const transportLabel =
    conn.hasToken && !isIncoming
      ? conn.isActive
        ? null // shown via health status
        : null
      : null;

  const statusText = isSelf
    ? t("widget.selfBadge")
    : !conn.hasToken
      ? t("widget.registeredBadge")
      : conn.requiresReauth
        ? t("widget.health.reauthRequired")
        : healthLabel(health, conn.transportMode, isIncoming, t);

  return (
    <Div
      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 cursor-pointer transition-colors"
      onClick={handleRowClick}
    >
      {/* Health / type indicator */}
      {isSelf ? (
        <Link2 className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
      ) : !conn.hasToken ? (
        <Link2 className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
      ) : (
        <HealthDot health={health} />
      )}

      <Div className="flex flex-col min-w-0 flex-1">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="text-sm font-medium">{conn.instanceId}</Span>
          {isSelf && (
            <Badge variant="secondary" className="text-[10px]">
              {t("widget.selfBadge")}
            </Badge>
          )}
          {isIncoming && (
            <Badge variant="outline" className="text-[10px]">
              {t("widget.incomingBadge")}
            </Badge>
          )}
          {conn.isInferenceProvider && (
            <Badge variant="outline" className="text-[10px]">
              {t("widget.inferenceProviderBadge")}
            </Badge>
          )}
          {!isSelf && conn.hasToken && conn.transportMode && (
            <Badge variant="outline" className="text-[10px]">
              {t("widget.transportBadge", {
                out:
                  conn.transportMode === "reverse-ws"
                    ? t("widget.transport.reverseWs")
                    : t("widget.transport.directHttp"),
                in:
                  conn.remoteTransportMode === "reverse-ws"
                    ? t("widget.transport.reverseWs")
                    : t("widget.transport.directHttp"),
              })}
            </Badge>
          )}
        </Div>

        <Div className="flex items-center gap-2 mt-0.5">
          {!isSelf && conn.hasToken && (
            <Span
              className={`text-xs ${
                health === "healthy"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : health === "warning"
                    ? "text-amber-600 dark:text-amber-400"
                    : health === "critical"
                      ? "text-red-600 dark:text-red-400"
                      : "text-muted-foreground"
              }`}
            >
              {statusText}
            </Span>
          )}
          {!isSelf && (conn.remoteUrl || conn.localUrl) && (
            <Span className="text-xs text-muted-foreground font-mono truncate">
              {conn.remoteUrl || conn.localUrl}
            </Span>
          )}
          {transportLabel}
        </Div>
      </Div>

      {!isPickerMode && (
        <Div className="flex items-center gap-1 flex-shrink-0">
          {canManage && !isSelf && conn.hasToken && !isIncoming && (
            <ReconnectButton conn={conn} navigate={navigate} t={t} />
          )}
          {canManage && <EditButton conn={conn} navigate={navigate} t={t} />}
          {!isSelf && (
            <DisconnectButton conn={conn} navigate={navigate} t={t} />
          )}
        </Div>
      )}

      {isPickerMode && (
        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
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

          <Separator />
        </>
      )}

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
}: {
  connections: RemoteConnection[];
  selfInstanceId: string | null;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>;
  onPick: ((conn: RemoteConnection) => void) | undefined;
  isPickerMode: boolean;
  isAdmin: boolean;
}): JSX.Element {
  const hasProblems = connections.some(
    (c) =>
      c.isActive &&
      (c.healthStatus === "critical" || c.healthStatus === "warning"),
  );

  return (
    <Div className="flex flex-col gap-0">
      {/* Connect to cloud pitch — admins only */}
      {isAdmin && (
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
            <Div className="flex items-center justify-between gap-3">
              <Div className="flex flex-col gap-1">
                <Div className="flex items-center gap-2">
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

      {/* Connection list header — only when there is a list to head */}
      {connections.length > 0 && (
        <Div className="flex items-center gap-2 px-4 py-3 border-b">
          <Link2 className="h-4 w-4 text-muted-foreground" />
          <Span className="font-semibold text-sm mr-auto">
            {t("widget.local.connectionsTitle")}
          </Span>
          {hasProblems && <AlertTriangle className="h-4 w-4 text-warning" />}
        </Div>
      )}

      {connections.length > 0 ? (
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
    </Div>
  );
}

// ─── Root container ───────────────────────────────────────────────────────────

export function RemoteConnectionsListContainer(): JSX.Element {
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const { push: navigate } = useWidgetNavigation();
  const data = useWidgetValue<typeof endpoints.GET>();
  const onPick = usePickerCallback<RemoteConnection>();
  const user = useWidgetUser();
  const isPickerMode = !!onPick;

  const connections = data?.connections ?? [];
  const selfInstanceId = data?.selfInstanceId ?? null;
  const isCloud = envClient.NEXT_PUBLIC_VIBE_MODE === VibeMode.CLOUD;
  const isAdmin =
    !user.isPublic && user.roles?.includes(UserPermissionRole.ADMIN) === true;

  // Non-admins can only ever be connected TO (connect is admin-only), so they
  // get the connect guide on any instance, not the admin's local panel.
  if (isCloud || !isAdmin) {
    return (
      <WidgetShell>
        <CreditsTabHeader activeTab="remote" />
        <CloudView
          connections={connections}
          access={data?.access ?? { canConnect: isAdmin, maxConnections: null }}
          navigate={navigate}
          t={t}
          onPick={onPick}
          isPickerMode={isPickerMode}
          isAdmin={isAdmin}
        />
      </WidgetShell>
    );
  }

  return (
    <WidgetShell>
      <CreditsTabHeader activeTab="remote" />
      <LocalView
        connections={connections}
        selfInstanceId={selfInstanceId}
        navigate={navigate}
        t={t}
        onPick={onPick}
        isPickerMode={isPickerMode}
        isAdmin={isAdmin}
      />
    </WidgetShell>
  );
}
