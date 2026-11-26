"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "next-vibe/ui/components/alert";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function ProductCategoryCreateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const handleViewList = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../list/definition");
      navigate(def.default.GET, {});
    })();
  };

  const result = data?.result;
  const details = field.children.details.children;
  const back = canGoBack ? (
    <Button type="button" variant="ghost" size="sm" onClick={() => pop()}>
      <ChevronLeft className="size-4" aria-hidden="true" />
      {t("post.widget.back")}
    </Button>
  ) : undefined;

  return (
    <WidgetShell layout="page">
      <WidgetHeader size="page" title={t("post.title")} backButton={back} />
      {result ? (
        <Div className="flex max-w-2xl flex-col gap-4">
          <Alert variant="success">
            <AlertTitle>{t("post.success.title")}</AlertTitle>
            <AlertDescription>{result.name}</AlertDescription>
          </Alert>
          <Div className="flex flex-wrap gap-2">
            <Button type="button" className="min-h-10" onClick={handleViewList}>
              {t("post.widget.backToList")}
            </Button>
          </Div>
        </Div>
      ) : (
        <Div className="flex max-w-2xl flex-col gap-4 rounded-xl border bg-card p-4 @md:p-6">
          <TextFieldWidget
            fieldName="details.name"
            field={withValue(details.name, undefined, null)}
          />
          <Div className="grid grid-cols-1 gap-4 @md:grid-cols-2">
            <EntityPickerFieldWidget
              fieldName="details.parentId"
              field={withValue(details.parentId, undefined, null)}
            />
            <NumberFieldWidget
              fieldName="details.sortOrder"
              field={withValue(details.sortOrder, undefined, null)}
            />
          </Div>
          <FormAlertWidget field={{}} />
          <Div className="flex justify-end">
            <SubmitButtonWidget<typeof definition.POST> field={{}} />
          </Div>
        </Div>
      )}
    </WidgetShell>
  );
}
