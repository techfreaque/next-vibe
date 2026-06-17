"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { BarChart } from "next-vibe-ui/ui/icons/BarChart";
import { Building } from "next-vibe-ui/ui/icons/Building";
import { Span } from "next-vibe-ui/ui/span";
import { usePickerCallback } from "next-vibe-ui/unified/_shared/picker-context";
import {
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { type JSX, useEffect, useRef } from "react";

import type definition from "./definition";
import type { CoaPeriodListResponseOutput } from "./definition";

type Period = NonNullable<CoaPeriodListResponseOutput["periods"]>[number];

const STATUS_VARIANT_MAP: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  OPEN: "default",
  CLOSED: "secondary",
  LOCKED: "destructive",
};

const STATUS_COLOR_MAP: Record<string, string> = {
  OPEN: "bg-emerald-600 hover:bg-emerald-600",
  CLOSED: "",
  LOCKED: "",
};

function fmtDate(d: Date | string): string {
  if (d instanceof Date) {
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  return String(d).slice(0, 10);
}

function PeriodRow({
  period,
  onView,
  statusLabel,
}: {
  period: Period;
  onView: (id: string) => void;
  statusLabel: string;
}): JSX.Element {
  const isOpen = period.status === "OPEN";
  const statusVariant = STATUS_VARIANT_MAP[period.status] ?? "secondary";
  const statusColorClass = STATUS_COLOR_MAP[period.status] ?? "";

  return (
    <Div
      className={`flex items-center gap-3 py-2.5 px-4 border-b last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer ${isOpen ? "bg-green-50/30 dark:bg-green-900/10" : ""}`}
      onClick={() => {
        onView(period.id);
      }}
    >
      <Div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <Span
          className={`text-sm font-medium ${isOpen ? "text-foreground" : "text-muted-foreground"}`}
        >
          {period.name}
        </Span>
        <Span className="text-xs text-muted-foreground">
          {fmtDate(period.startDate)} — {fmtDate(period.endDate)}
        </Span>
      </Div>
      <Badge
        variant={statusVariant}
        className={`text-xs shrink-0 ${statusColorClass}`}
      >
        {statusLabel}
      </Badge>
    </Div>
  );
}

export function CoaPeriodListWidget(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: {
    field: (typeof definition.GET)["fields"];
  },
): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const onPick =
    usePickerCallback<
      NonNullable<
        (typeof definition.GET.types.ResponseOutput)["periods"]
      >[number]
    >();
  const isPickerMode = !!onPick;

  // Auto-load on mount — companyId is optional, backend returns all companies
  const didAutoSubmit = useRef(false);
  useEffect(() => {
    if (!onSubmit || didAutoSubmit.current) {
      return;
    }
    didAutoSubmit.current = true;
    onSubmit();
  }, [onSubmit]);

  const handleView = (periodId: string): void => {
    if (isPickerMode) {
      const period = (data?.periods ?? []).find((p) => p.id === periodId);
      if (period && onPick) {
        onPick(period);
        navigation.pop();
      }
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../[periodId]/get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { periodId },
      });
    })();
  };

  const handleCreate = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../create/definition");
      navigation.push(def.default.POST, {});
    })();
  };

  // Loading state
  if (!data) {
    return (
      <Div className="flex flex-col items-center gap-4 py-10 rounded-lg border border-dashed">
        <Div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted border-2 border-dashed border-muted-foreground/30">
          <Building className="h-6 w-6 text-muted-foreground" />
        </Div>
        <Span className="text-sm text-muted-foreground">
          {t("get.widget.loading")}
        </Span>
      </Div>
    );
  }

  const periods = data.periods ?? [];

  return (
    <Div className="flex flex-col gap-4">
      {/* Header bar */}
      <Div className="flex items-center justify-between gap-2">
        <Span className="text-sm text-muted-foreground">
          {periods.length} {t("get.response.periods")}
        </Span>
        {!isPickerMode && (
          <Button variant="default" size="sm" onClick={handleCreate}>
            {t("get.widget.createButton")}
          </Button>
        )}
      </Div>

      {/* Period list or empty state */}
      {periods.length > 0 ? (
        <Div className="rounded-md border overflow-hidden">
          <Div className="flex items-center gap-3 px-4 py-2 bg-muted/50 border-b text-xs font-medium text-muted-foreground">
            <Span className="flex-1">{t("get.response.name")}</Span>
            <Span className="shrink-0">{t("get.response.status")}</Span>
          </Div>
          {periods.map((period) => (
            <PeriodRow
              key={period.id}
              period={period}
              onView={handleView}
              statusLabel={t(
                `enums.periodStatus.${period.status}` as Parameters<
                  typeof t
                >[0],
              )}
            />
          ))}
        </Div>
      ) : (
        <Div className="flex flex-col items-center gap-3 py-12 text-center border border-dashed rounded-md">
          <BarChart className="h-8 w-8 text-muted-foreground" />
          <Span className="text-sm text-muted-foreground">
            {t("get.widget.empty")}
          </Span>
          {!isPickerMode && (
            <Button variant="default" size="sm" onClick={handleCreate}>
              {t("get.widget.createButton")}
            </Button>
          )}
        </Div>
      )}
    </Div>
  );
}
