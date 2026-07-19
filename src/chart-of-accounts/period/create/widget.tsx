"use client";

import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { ChevronLeft } from "next-vibe/ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe/ui/ui/span";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { DateFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/date-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function CoaPeriodCreateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const handleView = (periodId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../[periodId]/get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { periodId },
      });
    })();
  };

  if (data?.id) {
    return (
      <Div className="flex flex-col gap-4">
        <Div className="flex flex-col gap-2 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
          <Span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
            {t("post.success.title")}
          </Span>
          <Span className="text-base font-semibold mt-1">{data.name_out}</Span>
        </Div>
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={() => {
            handleView(data.id);
          }}
        >
          {t("post.widget.viewButton")}
        </Button>
      </Div>
    );
  }

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
          {t("post.widget.back")}
        </Button>
      )}

      <Span className="text-base font-semibold">{t("post.title")}</Span>

      <Div className="flex flex-col gap-3">
        <EntityPickerFieldWidget
          fieldName="companyId"
          field={withValue(field.children.companyId, undefined, null)}
        />
        <TextFieldWidget
          fieldName="name"
          field={withValue(field.children.name, undefined, null)}
        />
        <Div className="grid grid-cols-2 gap-3">
          <DateFieldWidget
            fieldName="startDate"
            field={withValue(field.children.startDate, undefined, null)}
          />
          <DateFieldWidget
            fieldName="endDate"
            field={withValue(field.children.endDate, undefined, null)}
          />
        </Div>
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST> field={{}} />
    </Div>
  );
}
