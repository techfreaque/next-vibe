"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { Upload } from "next-vibe/ui/components/icons/Upload";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { CategorySummaryPanel } from "next-vibe/unified-ui/_shared/category-summary-panel";
import {
  useWidgetEndpointMutations,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { resolveEndpoint } from "next-vibe/unified-ui/hooks/resolve-endpoint";
import type { JSX } from "react";

import type definition from "./definition";
import { summarizeLeads } from "./summary";

export function LeadsDashboardWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const response = useWidgetResponse();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const embedded = interactive && responseOnly;
  const { push } = useWidgetNavigation();
  const mutations = useWidgetEndpointMutations();
  const summary =
    data && (data.summary ?? summarizeLeads(data, t("widget.unnamedLead")));
  const open = ({
    alias,
    urlPathParams,
  }: {
    alias: string;
    urlPathParams?: Record<string, string>;
  }): void => {
    void resolveEndpoint(alias)
      .catch(() => null)
      .then((endpoint) => {
        if (endpoint) {
          push(endpoint, { urlPathParams });
        }
        return undefined;
      });
  };

  return (
    <WidgetShell
      layout={embedded ? "compact" : "page"}
      padding={embedded ? "none" : undefined}
    >
      {!embedded && (
        <WidgetHeader
          size="page"
          title={t("get.title")}
          subtitle={t("widget.dashboardContext")}
          actions={
            interactive && (
              <Div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => open({ alias: "leads_import_POST" })}
                >
                  <Upload className="size-4" />
                  {t("widget.importLeads")}
                </Button>
                <Button
                  type="button"
                  className="gap-1.5"
                  onClick={() => open({ alias: "leads_create_POST" })}
                >
                  <Plus className="size-4" />
                  {t("widget.newLead")}
                </Button>
              </Div>
            )
          }
        />
      )}
      {response?.success === false ? (
        <EmptyBlock
          title={t("get.errors.server.description")}
          message={response.message}
          action={
            interactive
              ? {
                  label: t("widget.retry"),
                  onClick: () => void mutations?.read?.refetch(),
                }
              : undefined
          }
        />
      ) : !summary ? (
        <Div className="grid grid-cols-2 gap-2 @xl:grid-cols-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </Div>
      ) : (
        <>
          <CategorySummaryPanel
            summary={summary}
            locale={locale}
            translate={(key, args) => t(key, args)}
            onOpen={interactive ? open : undefined}
            attentionTitle={t("widget.attention")}
            clearLabel={t("widget.noAttention")}
            unavailable={t("widget.loading")}
            recentTitle={t("widget.recentLeads")}
          />
          {!embedded && data?.totalLeadsCount === 0 && (
            <EmptyBlock
              title={t("widget.noLeadsYet")}
              message={t("widget.noLeadsHint")}
              action={
                interactive
                  ? {
                      label: t("widget.createFirst"),
                      onClick: () => open({ alias: "leads_create_POST" }),
                    }
                  : undefined
              }
            />
          )}
        </>
      )}
    </WidgetShell>
  );
}
