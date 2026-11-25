"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { BarChart } from "next-vibe/ui/components/icons/BarChart";
import { Building } from "next-vibe/ui/components/icons/Building";
import { Span } from "next-vibe/ui/components/span";
import { formatDocDate } from "next-vibe/unified-ui/_shared/format-money";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { type JSX, useEffect, useRef } from "react";

import { PeriodStatus } from "../../enum";
import type definition from "./definition";
import type { CoaPeriodListResponseOutput } from "./definition";

type Period = NonNullable<CoaPeriodListResponseOutput["periods"]>[number];

function PeriodRow({
  period,
  onView,
  statusLabel,
  locale,
}: {
  period: Period;
  onView: (id: string) => void;
  statusLabel: string;
  locale: CountryLanguage;
}): JSX.Element {
  const isOpen = period.status === PeriodStatus.OPEN;
  const statusVariant = isOpen
    ? "default"
    : period.status === PeriodStatus.LOCKED
      ? "destructive"
      : "secondary";

  return (
    <Div
      className={`flex items-center gap-3 py-2.5 px-4 border-b last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer `}
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
          {`${formatDocDate(period.startDate, locale)} – ${formatDocDate(period.endDate, locale)}`}
        </Span>
      </Div>
      <Badge variant={statusVariant} className="text-xs shrink-0">
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
  const locale = useWidgetLocale();
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
        <Div className="flex flex-wrap items-center gap-2">
          <Span className="text-sm font-medium">{t("get.title")}</Span>
          <Badge variant="outline">
            {new Intl.NumberFormat(locale).format(periods.length)}
          </Badge>
        </Div>
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
              locale={locale}
              onView={handleView}
              statusLabel={t(
                period.status === PeriodStatus.OPEN
                  ? PeriodStatus.OPEN
                  : period.status === PeriodStatus.LOCKED
                    ? PeriodStatus.LOCKED
                    : PeriodStatus.CLOSED,
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
