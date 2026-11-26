"use client";

import { Button } from "next-vibe/ui/components/button";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
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
import { EmailFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/email-field/widget";
import { PhoneFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/phone-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { UrlFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/url-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX } from "react";

import type definition from "./definition";

export function CompanyUpdateWidget({
  field,
}: {
  field: (typeof definition.PATCH)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.PATCH>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PATCH>();
  const saved = Boolean(data?.result?.id);

  const handleViewCompany = (): void => {
    if (!data?.result?.id) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { companyId: data.result.id },
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
      {t("patch.widget.back")}
    </Button>
  ) : undefined;

  return (
    <AdminForm
      title={t("patch.title")}
      description={t("patch.description")}
      backButton={backButton}
      primaryAction={
        saved ? null : (
          <SubmitButtonWidget<typeof definition.PATCH> field={{}} />
        )
      }
    >
      {data?.result?.id ? (
        <ResultBanner
          variant="success"
          title={t("patch.success.title")}
          message={data.result.name}
        >
          <Button
            type="button"
            size="sm"
            onClick={handleViewCompany}
            className="gap-1.5"
          >
            {t("patch.widget.viewCompany")}
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </ResultBanner>
      ) : (
        <AdminFormSection title={t("patch.title")} columns={2}>
          <TextFieldWidget
            fieldName="fields.name"
            field={withValue(
              field.children.fields.children.name,
              undefined,
              null,
            )}
          />
          <SelectFieldWidget
            fieldName="fields.type"
            field={withValue(
              field.children.fields.children.type,
              undefined,
              null,
            )}
          />
          <TextFieldWidget
            fieldName="fields.vatNumber"
            field={withValue(
              field.children.fields.children.vatNumber,
              undefined,
              null,
            )}
          />
          <TextFieldWidget
            fieldName="fields.country"
            field={withValue(
              field.children.fields.children.country,
              undefined,
              null,
            )}
          />
          <TextFieldWidget
            fieldName="fields.currency"
            field={withValue(
              field.children.fields.children.currency,
              undefined,
              null,
            )}
          />
          <EmailFieldWidget
            fieldName="fields.email"
            field={withValue(
              field.children.fields.children.email,
              undefined,
              null,
            )}
          />
          <PhoneFieldWidget
            fieldName="fields.phone"
            field={withValue(
              field.children.fields.children.phone,
              undefined,
              null,
            )}
          />
          <UrlFieldWidget
            fieldName="fields.website"
            field={withValue(
              field.children.fields.children.website,
              undefined,
              null,
            )}
          />
        </AdminFormSection>
      )}
    </AdminForm>
  );
}
