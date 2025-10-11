/**
 * Leads Source Legend Component
 * Provides a legend with source-specific controls for toggling visibility
 */

"use client";

import { Eye, EyeOff } from "lucide-react";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Switch } from "next-vibe-ui/ui/switch";
import type { JSX } from "react";

import type { LeadSourceValues } from "@/app/api/[locale]/v1/core/leads/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface SourceLegendItem {
  source: typeof LeadSourceValues;
  name: string;
  color: string;
  visible: boolean;
  count: number;
  percentage: number;
}

interface LeadsSourceLegendProps {
  locale: CountryLanguage;
  sources: SourceLegendItem[];
  onToggleSource: (source: typeof LeadSourceValues) => void;
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
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {title || t("leads.admin.stats.sources.legend.title")}
          </CardTitle>
          <Badge variant="outline">
            {visibleCount}/{totalCount}{" "}
            {t("leads.admin.stats.sources.legend.visible")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Control buttons */}
        <div className="flex items-center justify-between pb-2 border-b">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onShowAll}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {t("leads.admin.stats.legend.showAll")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onHideAll}
              className="flex items-center gap-2"
            >
              <EyeOff className="h-4 w-4" />
              {t("leads.admin.stats.legend.hideAll")}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleAll}
            className="flex items-center gap-2"
          >
            {visibleCount === totalCount ? (
              <>
                <EyeOff className="h-4 w-4" />
                {t("leads.admin.stats.legend.hideAll")}
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                {t("leads.admin.stats.legend.showAll")}
              </>
            )}
          </Button>
        </div>

        {/* Source legend items */}
        <div className="space-y-3">
          {sources.map((source) => (
            <div
              key={source.source}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: source.color }}
                  />
                  <Switch
                    checked={source.visible}
                    onCheckedChange={() => onToggleSource(source.source)}
                  />
                </div>
                <div>
                  <div
                    className={`font-medium ${source.visible ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {t(source.source)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("leads.admin.stats.sources.legend.leads", {
                      count: source.count,
                      percentage: source.percentage.toFixed(1),
                    })}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleSource(source.source)}
                className="opacity-60 hover:opacity-100"
              >
                {source.visible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="pt-2 border-t">
          <div className="text-sm text-muted-foreground">
            {t("leads.admin.stats.sources.legend.summary", {
              visible: visibleCount,
              total: totalCount,
              percentage:
                totalCount > 0
                  ? ((visibleCount / totalCount) * 100).toFixed(1)
                  : 0,
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
