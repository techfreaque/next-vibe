"use client";

import { Badge } from "next-vibe/ui/ui/badge";
import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { ChevronLeft } from "next-vibe/ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe/ui/ui/span";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

function fmtDate(d: Date | string): string {
  return d instanceof Date ? d.toLocaleDateString() : String(d);
}

export function CoaPeriodGetWidget({
  field,
}: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();

  const period = data?.result;

  const handleClose = (): void => {
    if (!period?.id) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../close/definition");
      navigation.push(def.default.POST, {
        data: { periodId: period.id },
        popNavigationOnSuccess: 1,
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
    period.status === "OPEN"
      ? "default"
      : period.status === "LOCKED"
        ? "destructive"
        : "secondary";

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
      <Div className="flex flex-col gap-3 rounded-md border p-4">
        <Div className="flex items-center gap-2">
          <Span className="text-base font-semibold flex-1">{period.name}</Span>
          <Badge variant={statusVariant} className="text-xs">
            {t(
              `enums.periodStatus.${period.status}` as Parameters<typeof t>[0],
            )}
          </Badge>
        </Div>
        <Div className="flex gap-4 text-sm text-muted-foreground">
          <Div className="flex flex-col gap-0.5">
            <Span className="text-xs uppercase tracking-wide font-medium">
              {t("periodGet.response.startDate")}
            </Span>
            <Span>{fmtDate(period.startDate)}</Span>
          </Div>
          <Div className="flex flex-col gap-0.5">
            <Span className="text-xs uppercase tracking-wide font-medium">
              {t("periodGet.response.endDate")}
            </Span>
            <Span>{fmtDate(period.endDate)}</Span>
          </Div>
          {period.closedAt && (
            <Div className="flex flex-col gap-0.5">
              <Span className="text-xs uppercase tracking-wide font-medium">
                {t("periodGet.response.closedAt")}
              </Span>
              <Span>{fmtDate(period.closedAt)}</Span>
            </Div>
          )}
        </Div>
      </Div>

      {period.status === "OPEN" && (
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
    </Div>
  );
}
