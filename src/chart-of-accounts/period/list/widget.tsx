"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Span } from "next-vibe/ui/components/span";
import {
  StatusPill,
  type StatusPillVariant,
} from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
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
  const statusVariant: StatusPillVariant = isOpen
    ? "success"
    : period.status === PeriodStatus.LOCKED
      ? "danger"
      : "muted";

  return (
    <Button
      type="button"
      variant="ghost"
      className="h-auto min-h-11 w-full justify-start gap-3 rounded-none border-b px-4 py-3 text-start font-normal last:border-b-0 hover:bg-muted/30"
      onClick={() => {
        onView(period.id);
      }}
    >
      <Span className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-normal">
        <Span
          className={`text-sm font-medium ${isOpen ? "text-foreground" : "text-muted-foreground"}`}
        >
          {period.name}
        </Span>
        <Span className="text-xs text-muted-foreground tabular-nums">
          {`${formatDocDate(period.startDate, locale)} – ${formatDocDate(period.endDate, locale)}`}
        </Span>
      </Span>
      <StatusPill
        status={period.status}
        label={statusLabel}
        variant={statusVariant}
      />
    </Button>
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

  if (!data) {
    return (
      <WidgetShell layout="page" className="mx-auto max-w-3xl">
        <WidgetHeader size="page" title={t("get.title")} />
        <LoadingBlock message={t("get.widget.loading")} />
      </WidgetShell>
    );
  }

  const periods = data.periods ?? [];

  return (
    <WidgetShell layout="page" className="mx-auto max-w-3xl">
      <WidgetHeader
        size="page"
        title={t("get.title")}
        actions={
          !isPickerMode ? (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleCreate}
            >
              {t("get.widget.createButton")}
            </Button>
          ) : undefined
        }
      />

      {periods.length > 0 ? (
        <Div className="rounded-lg border bg-card overflow-hidden">
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
        <EmptyBlock
          title={t("get.widget.empty")}
          action={
            !isPickerMode
              ? { label: t("get.widget.createButton"), onClick: handleCreate }
              : undefined
          }
        />
      )}
    </WidgetShell>
  );
}
