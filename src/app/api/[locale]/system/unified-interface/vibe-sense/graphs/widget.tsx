/**
 * Vibe Sense — Graph List Widget
 * Summary stats + card grid showing all pipeline graphs
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Activity } from "next-vibe-ui/ui/icons/Activity";
import { GitBranch } from "next-vibe-ui/ui/icons/GitBranch";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { AlertCircle } from "next-vibe-ui/ui/icons/AlertCircle";
import { Archive } from "next-vibe-ui/ui/icons/Archive";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { User } from "next-vibe-ui/ui/icons/User";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import React, { useCallback, useMemo } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetEndpointMutations,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { formatSimpleDate } from "@/i18n/core/localization-utils";

import type definition from "./definition";

type GraphListResponseOutput = typeof definition.GET.types.ResponseOutput;

type GraphSummary = NonNullable<GraphListResponseOutput>["graphs"][number];

interface CustomWidgetProps {
  field: {
    value: GraphListResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
      <Div className="flex items-center justify-between">
        <Span className="text-xs text-muted-foreground">{label}</Span>
        {icon}
      </Div>
      <Span className="text-2xl font-bold tabular-nums">
        {value.toLocaleString()}
      </Span>
    </Div>
  );
}

function GraphCard({
  graph,
  locale,
  t,
  onClick,
  onArchive,
}: {
  graph: GraphSummary;
  locale: ReturnType<typeof useWidgetLocale>;
  t: ReturnType<typeof useWidgetTranslation<(typeof definition)["GET"]>>;
  onClick: () => void;
  onArchive: () => void;
}): React.JSX.Element {
  const isSystem = graph.ownerType === "system";

  return (
    <Button
      variant="ghost"
      className="cursor-pointer text-left w-full h-auto p-0 hover:bg-transparent"
      onClick={onClick}
    >
      <Card className="group hover:border-primary/50 focus-within:ring-2 focus-within:ring-primary/40 transition-colors h-full">
        <CardContent className="pt-4">
          <Div className="flex items-start gap-3">
            {/* Icon circle */}
            <Div
              className={cn(
                "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                graph.isActive ? "bg-primary/10" : "bg-muted",
              )}
            >
              <GitBranch
                className={cn(
                  "h-5 w-5",
                  graph.isActive ? "text-primary" : "text-muted-foreground",
                )}
              />
            </Div>

            {/* Content */}
            <Div className="flex-1 min-w-0">
              {/* Name + badge row */}
              <Div className="flex items-center gap-2 mb-1">
                <P className="font-semibold text-sm truncate">{graph.name}</P>
                <Badge
                  variant={graph.isActive ? "default" : "secondary"}
                  className="text-xs flex-shrink-0"
                >
                  {graph.isActive ? t("widget.active") : t("widget.inactive")}
                </Badge>
              </Div>

              {/* Slug */}
              <P className="text-xs text-muted-foreground font-mono truncate mb-1">
                {graph.slug}
              </P>

              {/* Description */}
              {graph.description && (
                <P className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {graph.description}
                </P>
              )}

              {/* Footer: owner type + date + archive */}
              <Div className="flex items-center justify-between">
                <Div className="flex items-center gap-1 text-muted-foreground">
                  {isSystem ? (
                    <Shield className="h-3 w-3" />
                  ) : (
                    <User className="h-3 w-3" />
                  )}
                  <Span className="text-xs capitalize">{graph.ownerType}</Span>
                </Div>
                <Div className="flex items-center gap-2">
                  {!isSystem && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      title={t("widget.archive")}
                      onClick={(e) => {
                        e.stopPropagation();
                        onArchive();
                      }}
                    >
                      <Archive className="h-3 w-3" />
                    </Button>
                  )}
                  <Span className="text-xs text-muted-foreground">
                    {formatSimpleDate(new Date(graph.createdAt), locale)}
                  </Span>
                </Div>
              </Div>
            </Div>
          </Div>
        </CardContent>
      </Card>
    </Button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function GraphListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const locale = useWidgetLocale();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const endpointMutations = useWidgetEndpointMutations();

  const data = field.value;
  const isLoading = data === null || data === undefined;
  const isError = data !== null && data !== undefined && !data.graphs;
  const isRefreshing = endpointMutations?.read?.isLoading ?? false;

  const graphs = useMemo(() => data?.graphs ?? [], [data?.graphs]);

  // ── Computed stats ──────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const total = graphs.length;
    const active = graphs.filter((g) => g.isActive).length;
    const system = graphs.filter((g) => g.ownerType === "system").length;
    const admin = graphs.filter((g) => g.ownerType === "admin").length;
    return { total, active, system, admin };
  }, [graphs]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleView = useCallback(
    (graph: GraphSummary): void => {
      void (async (): Promise<void> => {
        const dataDef =
          await import("@/app/api/[locale]/system/unified-interface/vibe-sense/graphs/[id]/data/definition");
        navigation.push(dataDef.default.GET, {
          urlPathParams: { id: graph.id },
        });
      })();
    },
    [navigation],
  );

  const handleCreate = useCallback((): void => {
    void (async (): Promise<void> => {
      const graphsDef = await import("./definition");
      navigation.push(graphsDef.default.POST, {
        renderInModal: true,
        onSuccessCallback: () => {
          endpointMutations?.read?.refetch?.();
        },
      });
    })();
  }, [navigation, endpointMutations]);

  const handleArchive = useCallback(
    (graph: GraphSummary): void => {
      void (async (): Promise<void> => {
        const archiveDef =
          await import("@/app/api/[locale]/system/unified-interface/vibe-sense/graphs/[id]/archive/definition");
        navigation.push(archiveDef.default.POST, {
          urlPathParams: { id: graph.id },
          renderInModal: true,
          onSuccessCallback: () => endpointMutations?.read?.refetch?.(),
        });
      })();
    },
    [navigation, endpointMutations],
  );

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        <Span className="font-semibold text-base">
          {t("list.container.title")}
          {graphs.length > 0 && (
            <Span className="ml-2 text-sm text-muted-foreground font-normal">
              ({graphs.length})
            </Span>
          )}
        </Span>
        <Div className="flex-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title={t("widget.refresh")}
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </Button>
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={handleCreate}
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          {t("widget.createGraph")}
        </Button>
      </Div>

      {isLoading ? (
        <Div className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Div>
      ) : isError ? (
        <Div className="h-[300px] flex flex-col items-center justify-center gap-3">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <P className="text-sm text-muted-foreground">{t("widget.error")}</P>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            {t("widget.refresh")}
          </Button>
        </Div>
      ) : graphs.length > 0 ? (
        <>
          {/* Summary stat cards */}
          <Div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              label={t("widget.stats.total")}
              value={stats.total}
              icon={<GitBranch className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              label={t("widget.stats.active")}
              value={stats.active}
              icon={
                <Activity className="h-4 w-4 text-green-500 dark:text-green-400" />
              }
            />
            <StatCard
              label={t("widget.stats.system")}
              value={stats.system}
              icon={
                <Shield className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              }
            />
            <StatCard
              label={t("widget.stats.admin")}
              value={stats.admin}
              icon={
                <User className="h-4 w-4 text-orange-500 dark:text-orange-400" />
              }
            />
          </Div>

          {/* Graph cards grid */}
          <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {graphs.map((graph) => (
              <GraphCard
                key={graph.id}
                graph={graph}
                locale={locale}
                t={t}
                onClick={() => handleView(graph)}
                onArchive={() => handleArchive(graph)}
              />
            ))}
          </Div>
        </>
      ) : (
        <Div className="text-center text-muted-foreground py-12">
          <Div className="mb-2">{t("widget.empty")}</Div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCreate}
            className="gap-1 mt-4"
          >
            <Plus className="h-4 w-4" />
            {t("widget.createGraph")}
          </Button>
        </Div>
      )}
    </Div>
  );
}
