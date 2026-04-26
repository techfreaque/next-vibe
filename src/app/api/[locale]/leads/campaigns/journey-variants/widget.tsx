/**
 * Journey Variants Widget
 * A/B testing variant management with weight distribution bar,
 * inline weight editing, and active/inactive toggles.
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { GitBranch } from "next-vibe-ui/ui/icons/GitBranch";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Input } from "next-vibe-ui/ui/input";
import { Span } from "next-vibe-ui/ui/span";
import { Switch } from "next-vibe-ui/ui/switch";
import { P } from "next-vibe-ui/ui/typography";
import React, { useCallback, useState } from "react";

import {
  useWidgetContext,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";

// ── Types ────────────────────────────────────────────────────────────────────

type VariantItem =
  (typeof definition.GET.types.ResponseOutput)["items"][number];

interface VariantEdit {
  active?: boolean;
  weight?: number;
}

// ── Colors for weight distribution bar ───────────────────────────────────────

const VARIANT_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-yellow-500",
  "bg-red-500",
];

// ── Component ────────────────────────────────────────────────────────────────

export function JourneyVariantsWidget(): React.JSX.Element {
  const { endpointMutations } = useWidgetContext();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();
  const items = data?.items ?? [];

  const [edits, setEdits] = useState<Map<string, VariantEdit>>(new Map());
  const [isSaving, setIsSaving] = useState(false);

  const hasEdits = edits.size > 0;

  // Get effective value (edited or original)
  const getEffective = useCallback(
    <K extends keyof VariantEdit>(
      item: VariantItem,
      key: K,
    ): VariantItem[K] => {
      const edit = edits.get(item.id);
      if (edit && edit[key] !== undefined) {
        return edit[key] as VariantItem[K];
      }
      return item[key];
    },
    [edits],
  );

  // Update a single field for a variant
  const setEdit = useCallback(
    (id: string, key: keyof VariantEdit, value: boolean | number) => {
      setEdits((prev) => {
        const next = new Map(prev);
        const existing = next.get(id) ?? {};
        next.set(id, { ...existing, [key]: value });
        return next;
      });
    },
    [],
  );

  // Save all edits via PATCH
  const handleSave = useCallback(async () => {
    if (!endpointMutations?.update || edits.size === 0) {
      return;
    }
    setIsSaving(true);
    for (const [id, changes] of edits) {
      await endpointMutations.update.submit({ id, ...changes });
    }
    setEdits(new Map());
    setIsSaving(false);
  }, [edits, endpointMutations?.update]);

  // Compute active weights for distribution bar
  const activeItems = items.filter((item) => getEffective(item, "active"));
  const totalWeight = activeItems.reduce(
    (sum, item) => sum + (getEffective(item, "weight") as number),
    0,
  );

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2">
        <GitBranch className="h-5 w-5 text-muted-foreground" />
        <Span className="font-semibold text-base mr-auto">
          {t("widget.title")}
        </Span>
        <Span className="text-sm text-muted-foreground">
          {data?.total ?? 0} {t("get.response.total")}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => endpointMutations?.read?.refetch?.()}
          title={t("widget.refresh")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      {/* Empty state */}
      {items.length === 0 && (
        <Div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground text-sm">
          {t("widget.noVariants")}
        </Div>
      )}

      {/* Weight Distribution Bar */}
      {activeItems.length > 0 && (
        <Div className="flex flex-col gap-2">
          {/* Stacked bar */}
          <Div className="flex h-6 rounded-lg overflow-hidden">
            {activeItems.map((item, idx) => {
              const w = getEffective(item, "weight") as number;
              const pct = totalWeight > 0 ? (w / totalWeight) * 100 : 0;
              return (
                <Div
                  key={item.id}
                  style={{ width: `${pct}%`, minWidth: pct > 0 ? 20 : 0 }}
                >
                  <Div
                    className={`${VARIANT_COLORS[idx % VARIANT_COLORS.length]} h-full flex items-center justify-center text-white text-xs font-medium transition-all`}
                  >
                    {pct >= 10 ? `${Math.round(pct)}%` : ""}
                  </Div>
                </Div>
              );
            })}
          </Div>
          {/* Legend + total */}
          <Div className="flex items-center gap-3 flex-wrap">
            {activeItems.map((item, idx) => (
              <Div key={item.id} className="flex items-center gap-1">
                <Div
                  className={`h-2.5 w-2.5 rounded-sm ${VARIANT_COLORS[idx % VARIANT_COLORS.length]}`}
                />
                <Span className="text-xs">{item.displayName}</Span>
              </Div>
            ))}
            <Span className="text-xs text-muted-foreground ml-auto">
              {t("widget.weightLabel")}: {totalWeight}
            </Span>
            {totalWeight !== 100 && (
              <Span className="text-xs text-warning flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
              </Span>
            )}
          </Div>
        </Div>
      )}

      {/* Variant list */}
      {items.length > 0 && (
        <Div className="flex flex-col gap-2">
          {items.map((item, idx) => {
            const isActive = getEffective(item, "active") as boolean;
            const weight = getEffective(item, "weight") as number;
            const hasErrors = item.checkErrors.length > 0;

            return (
              <Card
                key={item.id}
                className={!isActive ? "opacity-60" : undefined}
              >
                <CardContent className="flex flex-col gap-2 py-3 px-4">
                  {/* Main row */}
                  <Div className="flex items-center gap-3 flex-wrap">
                    {/* Color dot */}
                    <Div
                      className={`h-3 w-3 rounded-full flex-shrink-0 ${
                        isActive
                          ? VARIANT_COLORS[idx % VARIANT_COLORS.length]
                          : "bg-muted"
                      }`}
                    />

                    {/* Display name */}
                    <Span className="font-medium text-sm flex-1 min-w-0 truncate">
                      {item.displayName}
                    </Span>

                    {/* Variant key badge */}
                    <Span className="text-xs font-mono bg-muted px-2 py-0.5 rounded hidden sm:inline">
                      {item.variantKey}
                    </Span>

                    {/* Check errors badge */}
                    {hasErrors && (
                      <Span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {item.checkErrors.length} {t("widget.checkErrorsLabel")}
                      </Span>
                    )}

                    {/* Weight input */}
                    <Div className="flex items-center gap-1.5">
                      <Span className="text-xs text-muted-foreground">
                        {t("widget.weightLabel")}:
                      </Span>
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        value={weight}
                        onChange={(e) => {
                          const num = Number(e.target.value);
                          if (!Number.isNaN(num) && num >= 1 && num <= 100) {
                            setEdit(item.id, "weight", num);
                          }
                        }}
                        className="w-16 h-7 text-sm text-center font-mono"
                      />
                    </Div>

                    {/* Active toggle */}
                    <Div className="flex items-center gap-1.5">
                      <Switch
                        checked={isActive}
                        onCheckedChange={(checked) =>
                          setEdit(item.id, "active", checked)
                        }
                      />
                      <Span className="text-xs text-muted-foreground w-14">
                        {isActive
                          ? t("widget.activeLabel")
                          : t("widget.inactiveLabel")}
                      </Span>
                    </Div>
                  </Div>

                  {/* Description */}
                  {item.description && (
                    <P className="text-xs text-muted-foreground pl-6">
                      {item.description}
                    </P>
                  )}

                  {/* Check errors */}
                  {hasErrors && (
                    <Div className="rounded bg-destructive/10 p-2 ml-6">
                      {item.checkErrors.map((err, i) => (
                        <Span
                          key={i}
                          className="text-xs text-destructive block"
                        >
                          {err}
                        </Span>
                      ))}
                    </Div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Div>
      )}

      {/* Actions bar */}
      {hasEdits && (
        <Div className="flex items-center gap-3 pt-2 border-t">
          <Span className="text-xs text-muted-foreground">
            {edits.size} {t("widget.unsavedChanges")}
          </Span>
          <Button
            size="sm"
            disabled={isSaving}
            onClick={() => void handleSave()}
            className="ml-auto"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                {t("widget.saving")}
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-1" />
                {t("widget.saveChanges")}
              </>
            )}
          </Button>
        </Div>
      )}
    </Div>
  );
}
