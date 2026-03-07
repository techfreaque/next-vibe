/**
 * Remote Connections Widget
 *
 * Cloud context:  Marketing panel (sell local install) + connect form for
 *                 users who already have a local instance running.
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
import type { JSX } from "react";
import { useState } from "react";

import {
  useWidgetNavigation,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { envClient } from "@/config/env-client";

import type endpoints from "./definition";
import type { RemoteConnectionsListResponseOutput } from "./definition";

interface WidgetProps {
  field: {
    value: RemoteConnectionsListResponseOutput | null | undefined;
  } & (typeof endpoints.GET)["fields"];
  fieldName: string;
}

type Connection = RemoteConnectionsListResponseOutput["connections"][number];

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
}: {
  conn: Connection;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
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
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </Button>
  );
}

function EditButton({
  conn,
  navigate,
}: {
  conn: Connection;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
}): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: ButtonMouseEvent): Promise<void> => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      const defs = await import("../[instanceId]/definition");
      navigate(defs.default.PATCH, {
        urlPathParams: { instanceId: conn.instanceId },
        data: { friendlyName: conn.friendlyName },
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
}: {
  conn: Connection;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
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
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4 text-destructive" />
      )}
    </Button>
  );
}

// ─── Connection row ───────────────────────────────────────────────────────────

function ConnectionRow({
  conn,
  navigate,
  t,
}: {
  conn: Connection;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>;
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

  return (
    <Div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40">
      <Link2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <Div className="flex flex-col min-w-0 flex-1">
        <Div className="flex items-center gap-2">
          <Span className="text-sm font-medium truncate">
            {conn.friendlyName}
          </Span>
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
          {conn.instanceId}
          {conn.remoteUrl ? ` → ${conn.remoteUrl}` : ""}
        </Span>
        {conn.lastSyncedAt && (
          <Span className="text-xs text-muted-foreground">
            {t("widget.lastSynced")}:{" "}
            {new Date(conn.lastSyncedAt).toLocaleString()}
          </Span>
        )}
      </Div>
      <Div className="flex items-center gap-0 flex-shrink-0">
        <ViewButton conn={conn} navigate={navigate} />
        <EditButton conn={conn} navigate={navigate} />
        <DisconnectButton conn={conn} navigate={navigate} />
      </Div>
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

// ─── Cloud view: marketing + connect form ─────────────────────────────────────

function CloudView({
  connections,
  navigate,
  t,
}: {
  connections: Connection[];
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>;
}): JSX.Element {
  return (
    <Div className="flex flex-col gap-6 p-4">
      {/* Hero */}
      <Div className="flex flex-col gap-2">
        <H3 className="text-xl font-bold tracking-tight">
          {t("widget.cloud.heroTitle")}
        </H3>
        <P className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          {t("widget.cloud.heroSubtitle")}
        </P>
      </Div>

      {/* Feature grid */}
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

      {/* CTA buttons */}
      <Div className="flex flex-wrap gap-3">
        <Link
          href="https://github.com/techfreaque/next-vibe"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <SiGithub className="h-4 w-4" />
          {t("widget.cloud.githubCta")}
        </Link>
        <Link
          href="https://github.com/techfreaque/next-vibe#quick-start"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted transition-colors"
        >
          {t("widget.cloud.quickstartCta")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Div>

      <Separator />

      {/* Connect section */}
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
          <Div className="flex flex-col gap-3">
            <Div className="flex flex-col divide-y rounded-lg border overflow-hidden">
              {connections.map((conn) => (
                <ConnectionRow
                  key={conn.instanceId}
                  conn={conn}
                  navigate={navigate}
                  t={t}
                />
              ))}
            </Div>
            <Div className="flex">
              <AddConnectionButton
                navigate={navigate}
                label={t("widget.connectButton")}
                variant="outline"
              />
            </Div>
          </Div>
        ) : (
          <Div className="flex flex-col items-start gap-3 p-4 rounded-lg border border-dashed bg-muted/30">
            <Div className="flex items-center gap-2 text-muted-foreground">
              <WifiOff className="h-4 w-4" />
              <P className="text-sm">{t("widget.emptyStateCloud")}</P>
            </Div>
            <AddConnectionButton
              navigate={navigate}
              label={t("widget.connectButton")}
            />
          </Div>
        )}
      </Div>
    </Div>
  );
}

// ─── Local view: pitch + connection list ──────────────────────────────────────

function LocalView({
  connections,
  navigate,
  t,
}: {
  connections: Connection[];
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>;
}): JSX.Element {
  return (
    <Div className="flex flex-col gap-0">
      {/* Connect to cloud pitch */}
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
          <AddConnectionButton
            navigate={navigate}
            label={t("widget.connectButtonLocal")}
          />
        </CardContent>
      </Card>

      {/* Connection list */}
      <Div className="flex items-center gap-2 px-4 py-3 border-b">
        <Link2 className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {connections.length > 0
            ? t("widget.local.connectionsTitle")
            : t("widget.local.noConnectionsYet")}
        </Span>
        {connections.length > 0 && (
          <AddConnectionButton
            navigate={navigate}
            label={t("widget.addButton")}
          />
        )}
      </Div>

      {connections.length > 0 ? (
        <Div className="flex flex-col divide-y">
          {connections.map((conn) => (
            <ConnectionRow
              key={conn.instanceId}
              conn={conn}
              navigate={navigate}
              t={t}
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

export function RemoteConnectionsListContainer({
  field,
}: WidgetProps): JSX.Element {
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const { push: navigate } = useWidgetNavigation();

  const connections = field.value?.connections ?? [];
  const isCloud = envClient.VIBE_IS_CLOUD;

  if (isCloud) {
    return <CloudView connections={connections} navigate={navigate} t={t} />;
  }

  return <LocalView connections={connections} navigate={navigate} t={t} />;
}
