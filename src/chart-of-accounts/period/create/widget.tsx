"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { DateFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/date-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
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
  const created = Boolean(data?.id);

  const handleView = (periodId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../[periodId]/get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { periodId },
      });
    })();
  };

  const backButton = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => navigation.pop()}
    >
      <ChevronLeft className="h-4 w-4" />
      {t("post.widget.back")}
    </Button>
  ) : undefined;

  return (
    <AdminForm
      title={t("post.title")}
      backButton={backButton}
      primaryAction={
        created ? null : (
          <SubmitButtonWidget<typeof definition.POST> field={{}} />
        )
      }
    >
      {data?.id ? (
        <ResultBanner
          variant="success"
          title={t("post.success.title")}
          message={data.name_out}
        >
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
        </ResultBanner>
      ) : (
        <AdminFormSection title={t("post.title")}>
          <EntityPickerFieldWidget
            fieldName="companyId"
            field={withValue(field.children.companyId, undefined, null)}
          />
          <TextFieldWidget
            fieldName="name"
            field={withValue(field.children.name, undefined, null)}
          />
          <Div className="grid grid-cols-1 gap-3 @md:grid-cols-2">
            <DateFieldWidget
              utcCalendarDay
              fieldName="startDate"
              field={withValue(field.children.startDate, undefined, null)}
            />
            <DateFieldWidget
              utcCalendarDay
              fieldName="endDate"
              field={withValue(field.children.endDate, undefined, null)}
            />
          </Div>
        </AdminFormSection>
      )}
    </AdminForm>
  );
}
