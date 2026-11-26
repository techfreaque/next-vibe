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
import { CurrencySelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/currency-select-field/widget";
import { EmailFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/email-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { PhoneFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/phone-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { UrlFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/url-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX } from "react";

import type definition from "./definition";

export function VendorCreateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const openVendor = (): void => {
    const id = data?.id;
    if (!id) {
      return;
    }
    void import("../[vendorId]/get/definition").then((def) =>
      navigation.push(def.default.GET, { urlPathParams: { vendorId: id } }),
    );
  };

  const openList = (): void => {
    void import("../list/definition").then((def) =>
      navigation.push(def.default.GET, {}),
    );
  };

  const backButton = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => navigation.pop()}
      className="-ml-1 gap-1.5 self-start"
    >
      <ChevronLeft className="h-4 w-4" />
      {t("vendorCreate.post.widget.back")}
    </Button>
  ) : undefined;

  if (data !== undefined) {
    return (
      <AdminForm
        title={data.nameResponse}
        description={[data.codeResponse, data.emailResponse]
          .filter(Boolean)
          .join(" · ")}
        backButton={backButton}
        secondaryActions={
          <Button type="button" variant="outline" onClick={openList}>
            {t("vendorCreate.post.widget.allVendors")}
          </Button>
        }
        primaryAction={
          <Button type="button" onClick={openVendor}>
            {t("vendorCreate.post.widget.viewVendor")}
          </Button>
        }
      >
        <ResultBanner
          variant="success"
          title={t("vendorCreate.post.success.title")}
          message={t("vendorCreate.post.success.description")}
        />
      </AdminForm>
    );
  }

  return (
    <AdminForm
      title={t("vendorCreate.post.title")}
      description={t("vendorCreate.post.widget.subtitle")}
      backButton={backButton}
      secondaryActions={
        navigation.canGoBack ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => navigation.pop()}
          >
            {t("vendorCreate.post.widget.cancel")}
          </Button>
        ) : undefined
      }
      primaryAction={
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "vendorCreate.post.title" }}
        />
      }
    >
      <AdminFormSection
        title={t("vendorUpdate.patch.widget.sectionCompany")}
        columns={2}
      >
        <Div className="@lg:col-span-2">
          <TextFieldWidget
            fieldName="name"
            field={withValue(field.children.name, undefined, null)}
          />
        </Div>
        <EntityPickerFieldWidget
          fieldName="companyId"
          field={field.children.companyId}
        />
        <TextFieldWidget
          fieldName="code"
          field={withValue(field.children.code, undefined, null)}
        />
        <TextFieldWidget
          fieldName="vatNumber"
          field={withValue(field.children.vatNumber, undefined, null)}
        />
        <TextFieldWidget
          fieldName="taxId"
          field={withValue(field.children.taxId, undefined, null)}
        />
      </AdminFormSection>

      <AdminFormSection
        title={t("vendorUpdate.patch.widget.sectionContact")}
        columns={2}
      >
        <EmailFieldWidget
          fieldName="email"
          field={withValue(field.children.email, undefined, null)}
        />
        <PhoneFieldWidget
          fieldName="phone"
          field={withValue(field.children.phone, undefined, null)}
        />
        <Div className="@lg:col-span-2">
          <UrlFieldWidget
            fieldName="website"
            field={withValue(field.children.website, undefined, null)}
          />
        </Div>
      </AdminFormSection>

      <AdminFormSection
        title={t("vendorUpdate.patch.widget.sectionAddress")}
        columns={2}
      >
        <Div className="@lg:col-span-2">
          <TextFieldWidget
            fieldName="addressLine1"
            field={withValue(field.children.addressLine1, undefined, null)}
          />
        </Div>
        <Div className="@lg:col-span-2">
          <TextFieldWidget
            fieldName="addressLine2"
            field={withValue(field.children.addressLine2, undefined, null)}
          />
        </Div>
        <TextFieldWidget
          fieldName="postalCode"
          field={withValue(field.children.postalCode, undefined, null)}
        />
        <TextFieldWidget
          fieldName="city"
          field={withValue(field.children.city, undefined, null)}
        />
        <TextFieldWidget
          fieldName="region"
          field={withValue(field.children.region, undefined, null)}
        />
        <TextFieldWidget
          fieldName="country"
          field={withValue(field.children.country, undefined, null)}
        />
      </AdminFormSection>

      <AdminFormSection
        title={t("vendorUpdate.patch.widget.sectionTerms")}
        columns={2}
      >
        <CurrencySelectFieldWidget
          fieldName="defaultCurrency"
          field={withValue(field.children.defaultCurrency, undefined, null)}
        />
        <NumberFieldWidget
          fieldName="defaultPaymentTermsDays"
          field={withValue(
            field.children.defaultPaymentTermsDays,
            undefined,
            null,
          )}
        />
        <Div className="@lg:col-span-2">
          <TextareaFieldWidget
            fieldName="notes"
            field={withValue(field.children.notes, undefined, null)}
          />
        </Div>
      </AdminFormSection>
    </AdminForm>
  );
}
