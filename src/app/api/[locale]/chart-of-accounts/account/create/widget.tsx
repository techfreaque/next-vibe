"use client";

import { Button } from "next-vibe/ui/web/ui/button";
import { Div } from "next-vibe/ui/web/ui/div";
import { ChevronLeft } from "next-vibe/ui/web/ui/icons/ChevronLeft";
import { Span } from "next-vibe/ui/web/ui/span";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/form-fields/entity-picker-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function CoaAccountCreateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const handleView = (accountId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../[accountId]/get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { accountId },
      });
    })();
  };

  const handleAddAnother = (): void => {
    void (async (): Promise<void> => {
      const def = await import("./definition");
      navigation.push(def.default.POST, {});
    })();
  };

  if (data?.id) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
        <Div className="flex flex-col gap-1">
          <Span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
            {t("post.success.title")}
          </Span>
          <Div className="flex items-center gap-2 mt-1">
            <Span className="font-mono text-sm font-bold text-muted-foreground">
              {data.code_out}
            </Span>
            <Span className="text-base font-semibold text-foreground">
              {data.name_out}
            </Span>
          </Div>
        </Div>
        <Div className="flex gap-2">
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddAnother}
          >
            {t("post.widget.addAnotherButton")}
          </Button>
        </Div>
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
        <Div className="grid grid-cols-2 gap-3">
          <TextFieldWidget
            fieldName="code"
            field={withValue(field.children.code, undefined, null)}
          />
          <TextFieldWidget
            fieldName="name"
            field={withValue(field.children.name, undefined, null)}
          />
        </Div>
        <Div className="grid grid-cols-2 gap-3">
          <SelectFieldWidget
            fieldName="type"
            field={withValue(field.children.type, undefined, null)}
          />
          <SelectFieldWidget
            fieldName="subtype"
            field={withValue(field.children.subtype, undefined, null)}
          />
        </Div>
        <EntityPickerFieldWidget
          fieldName="parentId"
          field={withValue(field.children.parentId, undefined, null)}
        />
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST> field={{}} />
    </Div>
  );
}
