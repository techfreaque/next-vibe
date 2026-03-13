/**
 * Vibe Sense — Graph List Widget
 * Summary stats + search + card grid showing all pipeline graphs
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Activity } from "next-vibe-ui/ui/icons/Activity";
import { AlertCircle } from "next-vibe-ui/ui/icons/AlertCircle";
import { Archive } from "next-vibe-ui/ui/icons/Archive";
import { GitBranch } from "next-vibe-ui/ui/icons/GitBranch";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { User } from "next-vibe-ui/ui/icons/User";
import { X } from "next-vibe-ui/ui/icons/X";
import { Input } from "next-vibe-ui/ui/input";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import React, { useCallback, useMemo, useState } from "react";

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
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent?: string;
}): React.JSX.Element {
  return (
    <Div
      className={cn(
        "rounded-xl border bg-card p-4 flex flex-col gap-2 transition-shadow hover:shadow-sm",
        accent,
      )}
    >
      <Div className="flex items-center justify-between">
        <Span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </Span>
        {icon}
      </Div>
      <Span className="text-3xl font-bold tabular-nums tracking-tight">
        {value.toLocaleString()}
      </Span>
    </Div>
  );
}

// ─── Graph Card ───────────────────────────────────────────────────────────────

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
  const isAdmin = graph.ownerType === "admin";

  return (
    <Div
      className="cursor-pointer text-left w-full block group"
      onClick={onClick}
    >
      <Card
        className={cn(
          "overflow-hidden transition-all duration-200",
          "hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5",
          graph.isActive
            ? "border-primary/20"
            : "border-border opacity-80 hover:opacity-100",
        )}
      >
        {/* Colored accent strip per owner type */}
        <Div
          className={cn(
            "h-1 w-full",
            isSystem
              ? "bg-gradient-to-r from-blue-500 to-blue-400"
              : isAdmin
                ? "bg-gradient-to-r from-orange-500 to-orange-400"
                : "bg-gradient-to-r from-muted to-muted/60",
          )}
        />
        <CardContent className="pt-3 pb-3">
          <Div className="flex items-start gap-3 min-w-0">
            {/* Icon circle */}
            <Div
              className={cn(
                "flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mt-0.5",
                graph.isActive
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <GitBranch className="h-4 w-4" />
            </Div>

            {/* Content */}
            <Div className="flex-1 min-w-0">
              {/* Name + active badge row */}
              <Div className="flex items-start justify-between gap-2 mb-1 min-w-0">
                <P className="font-semibold text-sm leading-tight truncate min-w-0 flex-1 group-hover:text-primary transition-colors">
                  {graph.name}
                </P>
                <Badge
                  variant={graph.isActive ? "default" : "secondary"}
                  className={cn(
                    "text-[10px] px-1.5 py-0 h-4.5 flex-shrink-0 mt-0.5",
                    graph.isActive &&
                      "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
                  )}
                >
                  {graph.isActive ? t("widget.active") : t("widget.inactive")}
                </Badge>
              </Div>

              {/* Slug */}
              <P className="text-[11px] text-muted-foreground font-mono truncate mb-1.5">
                {graph.slug}
              </P>

              {/* Description */}
              {graph.description && (
                <P className="text-xs text-muted-foreground mb-2.5 line-clamp-2 leading-relaxed">
                  {graph.description}
                </P>
              )}

              {/* Footer row */}
              <Div className="flex items-center justify-between min-w-0">
                <Div className="flex items-center gap-1.5 text-muted-foreground">
                  {isSystem ? (
                    <Shield className="h-3 w-3 text-blue-500" />
                  ) : (
                    <User className="h-3 w-3 text-orange-500" />
                  )}
                  <Span className="text-[11px] capitalize font-medium">
                    {graph.ownerType}
                  </Span>
                </Div>
                <Div className="flex items-center gap-2 flex-shrink-0">
                  {!isSystem && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      title={t("widget.archive")}
                      onClick={(e) => {
                        e.stopPropagation();
                        onArchive();
                      }}
                    >
                      <Archive className="h-3 w-3" />
                    </Button>
                  )}
                  <Span className="text-[11px] text-muted-foreground">
                    {formatSimpleDate(new Date(graph.createdAt), locale)}
                  </Span>
                </Div>
              </Div>
            </Div>
          </Div>
        </CardContent>
      </Card>
    </Div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({
  hasSearch,
  onClear,
  onCreate,
  t,
}: {
  hasSearch: boolean;
  onClear: () => void;
  onCreate: () => void;
  t: ReturnType<typeof useWidgetTranslation<(typeof definition)["GET"]>>;
}): React.JSX.Element {
  return (
    <Div className="flex flex-col items-center justify-center py-16 gap-4">
      <Div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center">
        <GitBranch className="h-7 w-7 text-muted-foreground/50" />
      </Div>
      {hasSearch ? (
        <>
          <Div className="text-center">
            <P className="font-medium text-sm mb-1">
              {t("widget.noMatchTitle")}
            </P>
            <P className="text-xs text-muted-foreground">
              {t("widget.noMatchHint")}
            </P>
          </Div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="gap-1.5"
          >
            <X className="h-3.5 w-3.5" />
            {t("widget.clearSearch")}
          </Button>
        </>
      ) : (
        <>
          <Div className="text-center">
            <P className="font-medium text-sm mb-1">
              {t("widget.empty").split(".")[0]}
            </P>
            <P className="text-xs text-muted-foreground max-w-[260px]">
              {t("widget.empty")}
            </P>
          </Div>
          <Button onClick={onCreate} size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            {t("widget.createGraph")}
          </Button>
        </>
      )}
    </Div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function GraphListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const locale = useWidgetLocale();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const endpointMutations = useWidgetEndpointMutations();

  const [search, setSearch] = useState("");

  const data = field.value;
  const isLoading = data === null || data === undefined;
  const isError = data !== null && data !== undefined && !data.graphs;
  const isRefreshing = endpointMutations?.read?.isLoading ?? false;

  const graphs = useMemo(() => data?.graphs ?? [], [data?.graphs]);

  // Sort newest first
  const sortedGraphs = useMemo(
    () =>
      [...graphs].toSorted(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [graphs],
  );

  const filteredGraphs = useMemo(() => {
    if (!search.trim()) {
      return sortedGraphs;
    }
    const q = search.toLowerCase();
    return sortedGraphs.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.slug.toLowerCase().includes(q) ||
        (g.description ?? "").toLowerCase().includes(q),
    );
  }, [sortedGraphs, search]);

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
      const editDef =
        await import("@/app/api/[locale]/system/unified-interface/vibe-sense/graphs/[id]/edit/definition");
      navigation.push(editDef.default.PUT, {
        urlPathParams: { id: "new" },
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

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <Div className="flex flex-col gap-3 p-4 animate-pulse">
        <Div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <Div key={i} className="h-[88px] rounded-xl bg-muted" />
          ))}
        </Div>
        <Div className="h-9 rounded-lg bg-muted w-full" />
        <Div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Div key={i} className="h-[120px] rounded-xl bg-muted" />
          ))}
        </Div>
      </Div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────

  if (isError) {
    return (
      <Div className="flex flex-col items-center justify-center gap-4 py-16">
        <Div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </Div>
        <Div className="text-center">
          <P className="font-medium text-sm text-destructive mb-1">
            {t("widget.error")}
          </P>
        </Div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {t("widget.refresh")}
        </Button>
      </Div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <Div className="flex flex-col gap-5 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        <Span className="font-bold text-base">{t("list.container.title")}</Span>
        {graphs.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {graphs.length}
          </Badge>
        )}
        <Div className="flex-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title={t("widget.refresh")}
          className="h-8 w-8 p-0"
        >
          <RefreshCw
            className={cn("h-4 w-4", isRefreshing && "animate-spin")}
          />
        </Button>
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={handleCreate}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          {t("widget.createGraph")}
        </Button>
      </Div>

      {/* Stat cards */}
      {graphs.length > 0 && (
        <Div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label={t("widget.stats.total")}
            value={stats.total}
            icon={<GitBranch className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            label={t("widget.stats.active")}
            value={stats.active}
            icon={<Activity className="h-4 w-4 text-emerald-500" />}
            accent="border-emerald-500/20"
          />
          <StatCard
            label={t("widget.stats.system")}
            value={stats.system}
            icon={<Shield className="h-4 w-4 text-blue-500" />}
            accent="border-blue-500/20"
          />
          <StatCard
            label={t("widget.stats.admin")}
            value={stats.admin}
            icon={<User className="h-4 w-4 text-orange-500" />}
            accent="border-orange-500/20"
          />
        </Div>
      )}

      {/* Search bar */}
      {graphs.length > 0 && (
        <Div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChangeText={setSearch}
            placeholder={t("widget.searchPlaceholder")}
            className="pl-9 pr-9 h-9"
          />
          {search && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              onClick={() => setSearch("")}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </Div>
      )}

      {/* Graph grid or empty state */}
      {filteredGraphs.length > 0 ? (
        <>
          {search && (
            <P className="text-xs text-muted-foreground">
              {filteredGraphs.length} {t("widget.searchResults")} &ldquo;
              {search}&rdquo;
            </P>
          )}
          <Div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredGraphs.map((graph) => (
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
        <EmptyState
          hasSearch={search.trim().length > 0}
          onClear={() => setSearch("")}
          onCreate={handleCreate}
          t={t}
        />
      )}
    </Div>
  );
}
