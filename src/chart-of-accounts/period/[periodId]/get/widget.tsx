"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatDocDate } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { PeriodStatus } from "../../../enum";
import type definition from "./definition";

export function CoaPeriodGetWidget({
  field,
}: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();

  const locale = useWidgetLocale();
  const period = data?.result;

  const handleClose = (): void => {
    if (!period?.id) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../close/definition");
      navigation.push(def.default.POST, {
        urlPathParams: { periodId: period.id },
      });
    })();
  };

  if (!period) {
    return (
      <Div className="flex flex-col gap-4">
        {navigation.canGoBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigation.pop()}
            className="self-start gap-1.5 -ml-1"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("periodGet.widget.back")}
          </Button>
        )}
        <EntityPickerFieldWidget
          fieldName="periodId"
          field={field.children.periodId}
        />
        <SubmitButtonWidget<typeof definition.GET>
          field={{ text: "periodGet.widget.select" as const }}
        />
      </Div>
    );
  }

  const statusVariant =
    period.status === PeriodStatus.OPEN
      ? "default"
      : period.status === PeriodStatus.LOCKED
        ? "destructive"
        : "secondary";

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        title={period.name}
        subtitle={period.companyName}
        size="page"
        backButton={
          navigation.canGoBack ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => navigation.pop()}
            >
              <ChevronLeft className="h-4 w-4" />
              {t("periodGet.widget.back")}
            </Button>
          ) : undefined
        }
      />
      <Div className="flex flex-col items-start gap-3 rounded-md border p-4">
        <Div className="flex items-center gap-2">
          <Badge variant={statusVariant} className="text-xs">
            {t(
              period.status === PeriodStatus.OPEN
                ? PeriodStatus.OPEN
                : period.status === PeriodStatus.LOCKED
                  ? PeriodStatus.LOCKED
                  : PeriodStatus.CLOSED,
            )}
          </Badge>
        </Div>
        <Div className="flex gap-4 text-sm text-muted-foreground">
          <Div className="flex flex-col gap-0.5">
            <Span className="text-xs uppercase tracking-wide font-medium">
              {t("periodGet.response.startDate")}
            </Span>
            <Span>{formatDocDate(period.startDate, locale)}</Span>
          </Div>
          <Div className="flex flex-col gap-0.5">
            <Span className="text-xs uppercase tracking-wide font-medium">
              {t("periodGet.response.endDate")}
            </Span>
            <Span>{formatDocDate(period.endDate, locale)}</Span>
          </Div>
          {period.closedAt && (
            <Div className="flex flex-col gap-0.5">
              <Span className="text-xs uppercase tracking-wide font-medium">
                {t("periodGet.response.closedAt")}
              </Span>
              <Span>{formatDocDate(period.closedAt, locale)}</Span>
            </Div>
          )}
        </Div>
      </Div>

      {period.status === PeriodStatus.OPEN && (
        <Div className="flex gap-2">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleClose}
          >
            {t("periodGet.widget.closePeriodButton")}
          </Button>
        </Div>
      )}
    </WidgetShell>
  );
}
