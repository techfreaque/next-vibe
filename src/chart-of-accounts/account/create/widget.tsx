"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
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
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
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
  const { children } = field;

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
      <WidgetShell layout="page" className="mx-auto w-full max-w-3xl">
        <ResultBanner
          variant="success"
          title={t("post.success.title")}
          message={`${data.code_out} · ${data.name_out}`}
        />
        <Div className="flex flex-wrap gap-2">
          <Button
            type="button"
            className="w-full @md:w-auto"
            onClick={() => {
              handleView(data.id);
            }}
          >
            {t("post.widget.viewButton")}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full @md:w-auto"
            onClick={handleAddAnother}
          >
            {t("post.widget.addAnotherButton")}
          </Button>
        </Div>
      </WidgetShell>
    );
  }

  return (
    <AdminForm
      title={t("post.title")}
      description={t("post.description")}
      backButton={
        navigation.canGoBack && (
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
        )
      }
      primaryAction={
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "post.widget.save" }}
        />
      }
    >
      <AdminFormSection title={t("post.widget.sectionAccount")}>
        <EntityPickerFieldWidget
          fieldName="companyId"
          field={{
            ...withValue(children.companyId, undefined, null),
            description: undefined,
          }}
        />
        <Div className="grid gap-3 @md:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]">
          <TextFieldWidget
            fieldName="code"
            field={withValue(children.code, undefined, null)}
          />
          <TextFieldWidget
            fieldName="name"
            field={withValue(children.name, undefined, null)}
          />
        </Div>
      </AdminFormSection>
      <AdminFormSection title={t("post.widget.sectionClassification")}>
        <Div className="grid gap-3 @md:grid-cols-2">
          <SelectFieldWidget
            fieldName="type"
            field={withValue(children.type, undefined, null)}
          />
          <SelectFieldWidget
            fieldName="subtype"
            field={withValue(children.subtype, undefined, null)}
          />
        </Div>
        <EntityPickerFieldWidget
          fieldName="parentId"
          field={withValue(children.parentId, undefined, null)}
        />
      </AdminFormSection>
    </AdminForm>
  );
}
