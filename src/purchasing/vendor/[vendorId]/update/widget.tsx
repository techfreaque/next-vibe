"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { CurrencySelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/currency-select-field/widget";
import { EmailFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/email-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { PhoneFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/phone-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { UrlFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/url-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useEffect, useMemo, useRef } from "react";

import getDefinition from "../get/definition";
import type definition from "./definition";

export function VendorUpdateWidget({
  field,
}: {
  field: (typeof definition.PATCH)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.PATCH>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PATCH>();
  const form = useWidgetForm<typeof definition.PATCH>();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const vendorId = form?.watch("vendorId") ?? "";

  // Load the current vendor so the form opens with its saved values.
  const getOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { vendorId },
        queryOptions: { enabled: vendorId !== "" },
      },
    }),
    [vendorId],
  );
  const read = useEndpoint(getDefinition, getOptions, logger, user).read;
  const vendor = read?.data?.result;

  const filledFor = useRef<string | null>(null);
  useEffect(() => {
    if (!vendor || !form || filledFor.current === vendor.id) {
      return;
    }
    filledFor.current = vendor.id;
    const opts = { shouldDirty: false } as const;
    form.setValue("name", vendor.name, opts);
    form.setValue("code", vendor.code ?? undefined, opts);
    form.setValue("email", vendor.email ?? undefined, opts);
    form.setValue("phone", vendor.phone ?? undefined, opts);
    form.setValue("website", vendor.website ?? undefined, opts);
    form.setValue("vatNumber", vendor.vatNumber ?? undefined, opts);
    form.setValue("taxId", vendor.taxId ?? undefined, opts);
    form.setValue("addressLine1", vendor.addressLine1 ?? undefined, opts);
    form.setValue("addressLine2", vendor.addressLine2 ?? undefined, opts);
    form.setValue("city", vendor.city ?? undefined, opts);
    form.setValue("region", vendor.region ?? undefined, opts);
    form.setValue("postalCode", vendor.postalCode ?? undefined, opts);
    form.setValue("country", vendor.country ?? undefined, opts);
    form.setValue("defaultCurrency", vendor.defaultCurrency, opts);
    form.setValue(
      "defaultPaymentTermsDays",
      vendor.defaultPaymentTermsDays ?? undefined,
      opts,
    );
    form.setValue("notes", vendor.notes ?? undefined, opts);
    form.setValue("isActive", vendor.isActive, opts);
  }, [vendor, form]);

  const backButton = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => navigation.pop()}
      className="-ml-1 gap-1.5 self-start"
    >
      <ChevronLeft className="h-4 w-4" />
      {t("vendorUpdate.patch.widget.backToVendor")}
    </Button>
  ) : undefined;

  const result = data?.result;
  if (result !== undefined) {
    return (
      <AdminForm
        title={result.nameResponse}
        backButton={backButton}
        primaryAction={
          navigation.canGoBack ? (
            <Button type="button" onClick={() => navigation.pop()}>
              {t("vendorUpdate.patch.widget.viewVendor")}
            </Button>
          ) : null
        }
      >
        <ResultBanner
          variant="success"
          title={t("vendorUpdate.patch.success.title")}
          message={t("vendorUpdate.patch.success.description")}
        />
      </AdminForm>
    );
  }

  return (
    <AdminForm
      title={t("vendorUpdate.patch.widget.title")}
      description={vendor?.name}
      backButton={backButton}
      secondaryActions={
        navigation.canGoBack ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => navigation.pop()}
          >
            {t("vendorUpdate.patch.widget.cancel")}
          </Button>
        ) : undefined
      }
      primaryAction={
        <SubmitButtonWidget<typeof definition.PATCH>
          field={{ text: "vendorUpdate.patch.widget.save" }}
        />
      }
    >
      {vendorId !== "" && !vendor && read?.isLoading ? (
        <LoadingBlock />
      ) : (
        <>
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

          <AdminFormSection
            title={t("vendorUpdate.patch.widget.sectionStatus")}
          >
            <BooleanFieldWidget
              fieldName="isActive"
              field={withValue(field.children.isActive, undefined, null)}
            />
          </AdminFormSection>
        </>
      )}
    </AdminForm>
  );
}
