/**
 * Leads Source Legend Component
 * Provides a legend with source-specific controls for toggling visibility
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Eye, EyeOff } from "next-vibe-ui/ui/icons";
import { Switch } from "next-vibe-ui/ui/switch";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

interface SourceLegendItem {
  source: TranslationKey;
  name: string;
  color: string;
  visible: boolean;
  count: number;
  percentage: number;
}

interface LeadsSourceLegendProps {
  locale: CountryLanguage;
  sources: SourceLegendItem[];
  onToggleSource: (source: TranslationKey) => void;
  onToggleAll: () => void;
  onShowAll: () => void;
  onHideAll: () => void;
  title?: string;
}

export function LeadsSourceLegend({
  locale,
  sources,
  onToggleSource,
  onToggleAll,
  onShowAll,
  onHideAll,
  title,
}: LeadsSourceLegendProps): JSX.Element {
  const { t } = simpleT(locale);

  const visibleCount = sources.filter((source) => source.visible).length;
  const totalCount = sources.length;

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <Div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {title || t("app.admin.leads.leads.admin.stats.sources.legend.title")}
          </CardTitle>
          <Badge variant="outline">
            {visibleCount}/{totalCount}{" "}
            {t("app.admin.leads.leads.admin.stats.sources.legend.visible")}
          </Badge>
        </Div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Control buttons */}
        <Div className="flex items-center justify-between pb-2 border-b">
          <Div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onShowAll}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {t("app.admin.leads.leads.admin.stats.legend.showAll")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onHideAll}
              className="flex items-center gap-2"
            >
              <EyeOff className="h-4 w-4" />
              {t("app.admin.leads.leads.admin.stats.legend.hideAll")}
            </Button>
          </Div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleAll}
            className="flex items-center gap-2"
          >
            {visibleCount === totalCount ? (
              <>
                <EyeOff className="h-4 w-4" />
                {t("app.admin.leads.leads.admin.stats.legend.hideAll")}
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                {t("app.admin.leads.leads.admin.stats.legend.showAll")}
              </>
            )}
          </Button>
        </Div>

        {/* Source legend items */}
        <Div className="flex flex-col gap-3">
          {sources.map((source) => (
            <Div
              key={source.source}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <Div className="flex items-center gap-3">
                <Div className="flex items-center gap-2">
                  <Div style={{ backgroundColor: source.color }}>
                    <Div className="w-4 h-4 rounded-full" />
                  </Div>
                  <Switch
                    checked={source.visible}
                    onCheckedChange={() => onToggleSource(source.source)}
                  />
                </Div>
                <Div>
                  <Div
                    className={`font-medium ${source.visible ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {t(source.source)}
                  </Div>
                  <Div className="text-sm text-muted-foreground">
                    {t("app.admin.leads.leads.admin.stats.sources.legend.leads", {
                      count: source.count,
                      percentage: source.percentage.toFixed(1),
                    })}
                  </Div>
                </Div>
              </Div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleSource(source.source)}
                className="opacity-60 hover:opacity-100"
              >
                {source.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </Div>
          ))}
        </Div>

        {/* Summary */}
        <Div className="pt-2 border-t">
          <Div className="text-sm text-muted-foreground">
            {t("app.admin.leads.leads.admin.stats.sources.legend.summary", {
              visible: visibleCount,
              total: totalCount,
              percentage: totalCount > 0 ? ((visibleCount / totalCount) * 100).toFixed(1) : 0,
            })}
          </Div>
        </Div>
      </CardContent>
    </Card>
  );
}
