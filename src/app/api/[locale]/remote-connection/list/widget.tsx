/**
 * Remote Connections Widget
 *
 * Cloud context:  Marketing panel (sell local install) + read-only connection
 *                 list. Connecting is done from the local side, not from cloud.
 * Local context:  "Connect to cloud" pitch + existing connection list.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button, type ButtonMouseEvent } from "next-vibe-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { CheckCircle2 } from "next-vibe-ui/ui/icons/CheckCircle2";
import { Eye } from "next-vibe-ui/ui/icons/Eye";
import { Link2 } from "next-vibe-ui/ui/icons/Link2";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { SiGithub } from "next-vibe-ui/ui/icons/SiGithub";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { WifiOff } from "next-vibe-ui/ui/icons/WifiOff";
import { Link } from "next-vibe-ui/ui/link";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import { H3, P } from "next-vibe-ui/ui/typography";
import { WidgetShell } from "next-vibe-ui/ui/widget-shell";
import { usePickerCallback } from "next-vibe-ui/unified/_shared/picker-context";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import type { JSX } from "react";
import { useState } from "react";

import { CreditsTabHeader } from "@/app/api/[locale]/credits/credits-tab-header";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { GITHUB_REPO_URL } from "@/config/constants";
import { envClient } from "@/config/env-client";

import type endpoints from "./definition";
import type { RemoteConnection } from "./definition";

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

function ViewButton({
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
      navigate(defs.default.GET, {
        urlPathParams: { instanceId: conn.instanceId },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
      className="gap-1.5 text-xs h-7"
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Eye className="h-3.5 w-3.5" />
      )}
      {t("widget.viewButton")}
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
      const defs = await import("../self-rename/definition");
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
}: {
  conn: RemoteConnection;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>;
  onPick: ((conn: RemoteConnection) => void) | undefined;
  isPickerMode: boolean;
}): JSX.Element {
  const isSelf = !conn.hasToken && conn.remoteUrl === "";
  const badge = conn.hasToken
    ? t("widget.connectedBadge")
    : isSelf
      ? t("widget.selfBadge")
      : t("widget.registeredBadge");
  const badgeVariant = conn.hasToken
    ? "default"
    : isSelf
      ? "secondary"
      : "outline";

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

  return (
    <Div
      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 cursor-pointer"
      onClick={handleRowClick}
    >
      <Link2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <Div className="flex flex-col min-w-0 flex-1">
        <Div className="flex items-center gap-2">
          <Span className="text-sm font-medium">{conn.instanceId}</Span>
          <Badge variant={badgeVariant} className="text-[10px]">
            {badge}
          </Badge>
          {!conn.isActive && (
            <Badge variant="destructive" className="text-[10px]">
              {t("widget.inactiveBadge")}
            </Badge>
          )}
        </Div>
        <Span className="text-xs text-muted-foreground font-mono truncate">
          {conn.remoteUrl || "—"}
        </Span>
        {conn.lastSyncedAt && (
          <Span className="text-xs text-muted-foreground">
            {t("widget.lastSynced")}:{" "}
            {new Date(conn.lastSyncedAt).toLocaleString()}
          </Span>
        )}
      </Div>
      {!isPickerMode && (
        <Div className="flex items-center gap-1 flex-shrink-0">
          <ViewButton conn={conn} navigate={navigate} t={t} />
          <EditButton conn={conn} navigate={navigate} t={t} />
          <DisconnectButton conn={conn} navigate={navigate} t={t} />
        </Div>
      )}
    </Div>
  );
}

// ─── Feature card (cloud marketing) ──────────────────────────────────────────

function FeatureCard({
  title,
  body,
}: {
  title: string;
  body: string;
}): JSX.Element {
  return (
    <Div className="flex flex-col gap-1.5 p-4 rounded-lg border bg-card">
      <Div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
        <Span className="text-sm font-semibold">{title}</Span>
      </Div>
      <P className="text-xs text-muted-foreground leading-relaxed">{body}</P>
    </Div>
  );
}

// ─── Cloud view: marketing + read-only connection list ────────────────────────

function CloudView({
  connections,
  navigate,
  t,
  onPick,
  isPickerMode,
}: {
  connections: RemoteConnection[];
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>;
  onPick: ((conn: RemoteConnection) => void) | undefined;
  isPickerMode: boolean;
}): JSX.Element {
  return (
    <Div className="flex flex-col gap-6 p-4">
      {/* Hero + features + CTA — full mode only */}
      {!isPickerMode && (
        <>
          <Div className="flex flex-col gap-2">
            <H3 className="text-xl font-bold tracking-tight">
              {t("widget.cloud.heroTitle")}
            </H3>
            <P className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {t("widget.cloud.heroSubtitle")}
            </P>
          </Div>

          <Div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FeatureCard
              title={t("widget.cloud.feature1Title")}
              body={t("widget.cloud.feature1Body")}
            />
            <FeatureCard
              title={t("widget.cloud.feature2Title")}
              body={t("widget.cloud.feature2Body")}
            />
            <FeatureCard
              title={t("widget.cloud.feature3Title")}
              body={t("widget.cloud.feature3Body")}
            />
            <FeatureCard
              title={t("widget.cloud.feature4Title")}
              body={t("widget.cloud.feature4Body")}
            />
          </Div>

          <Div className="flex flex-wrap gap-3">
            <Link
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <SiGithub className="h-4 w-4" />
              {t("widget.cloud.githubCta")}
            </Link>
            <Link
              href={`${GITHUB_REPO_URL}#quick-start`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted transition-colors"
            >
              {t("widget.cloud.quickstartCta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Div>

          <Separator />
        </>
      )}

      {/* Connected instances (read-only on cloud) */}
      <Div className="flex flex-col gap-4">
        <Div className="flex flex-col gap-1">
          <Span className="text-sm font-semibold">
            {t("widget.cloud.alreadyHaveLocal")}
          </Span>
          <P className="text-xs text-muted-foreground">
            {t("widget.cloud.alreadyHaveLocalSub")}
          </P>
        </Div>

        {connections.length > 0 ? (
          <Div className="flex flex-col divide-y rounded-lg border overflow-hidden">
            {connections.map((conn) => (
              <ConnectionRow
                key={conn.instanceId}
                conn={conn}
                navigate={navigate}
                t={t}
                onPick={onPick}
                isPickerMode={isPickerMode}
              />
            ))}
          </Div>
        ) : (
          <Div className="flex flex-col items-start gap-3 p-4 rounded-lg border border-dashed bg-muted/30">
            <Div className="flex items-center gap-2 text-muted-foreground">
              <WifiOff className="h-4 w-4" />
              <P className="text-sm">{t("widget.emptyStateCloud")}</P>
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

      {/* Connection list */}
      <Div className="flex items-center gap-2 px-4 py-3 border-b">
        <Link2 className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {connections.length > 0
            ? t("widget.local.connectionsTitle")
            : t("widget.local.noConnectionsYet")}
        </Span>
      </Div>

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
            />
          ))}
        </Div>
      ) : (
        <Div className="flex flex-col items-center justify-center py-10 px-6 text-center text-muted-foreground gap-2">
          <WifiOff className="h-8 w-8 opacity-30" />
          <P className="text-sm">{t("widget.emptyState")}</P>
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
  const isCloud = envClient.NEXT_PUBLIC_VIBE_IS_CLOUD;
  const isAdmin =
    !user.isPublic && user.roles?.includes(UserPermissionRole.ADMIN) === true;

  if (isCloud) {
    return (
      <WidgetShell>
        <CreditsTabHeader activeTab="remote" />
        <CloudView
          connections={connections}
          navigate={navigate}
          t={t}
          onPick={onPick}
          isPickerMode={isPickerMode}
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
