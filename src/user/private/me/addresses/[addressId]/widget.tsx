"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "next-vibe/ui/components/alert-dialog";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { PhoneFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/phone-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";
import { useEffect, useRef } from "react";

import addressesDefinition, {
  type UserAddressesGetResponseOutput,
} from "../definition";
import type definition from "./definition";

function useSavedAddress(addressId: string | undefined): {
  address: UserAddressesGetResponseOutput["addresses"][number] | undefined;
  isLoading: boolean | undefined;
} {
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const { read } = useEndpoint(
    { GET: addressesDefinition.GET },
    { read: { queryOptions: { enabled: Boolean(addressId) } } },
    logger,
    user,
  );
  return {
    address: read?.data?.addresses.find((item) => item.id === addressId),
    isLoading: Boolean(addressId) && read?.isLoading,
  };
}

function useOpenAddressList(): () => void {
  const { push } = useWidgetNavigation();
  return (): void => {
    push(addressesDefinition.GET, {});
  };
}

export function UserAddressPatchContainer({
  field,
}: {
  field: (typeof definition.PATCH)["fields"];
}): JSX.Element {
  const { children } = field;
  const data = useWidgetValue<typeof definition.PATCH>();
  const form = useWidgetForm<typeof definition.PATCH>();
  const t = useWidgetTranslation<typeof definition.PATCH>();
  const openList = useOpenAddressList();
  const target = children.addressId.schema.safeParse(form?.watch("addressId"));
  const { address, isLoading } = useSavedAddress(target.data);
  const prefilledId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!address || !form || prefilledId.current === address.id) {
      return;
    }
    const load = new AbortController();
    // The mutation renderer also seeds the path parameter on mount. Apply
    // the saved address after that seed, including when the list is cached.
    queueMicrotask(() => {
      if (load.signal.aborted) {
        return;
      }
      prefilledId.current = address.id;
      form.reset({
        addressId: address.id,
        label: address.label,
        fullName: address.fullName,
        company: address.company,
        phone: address.phone,
        vatNumber: address.vatNumber,
        taxId: address.taxId,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        region: address.region,
        postalCode: address.postalCode,
        country: address.country,
        isDefaultBilling: address.isDefaultBilling,
        isDefaultDelivery: address.isDefaultDelivery,
      });
    });
    return (): void => load.abort();
  }, [address, form]);

  return (
    <WidgetShell className="min-w-0">
      <WidgetHeader
        title={t(data?.updated ? "update.success.title" : "update.title")}
        backButton={
          target.success && (
            <Button type="button" variant="ghost" size="sm" onClick={openList}>
              <ChevronLeft className="h-4 w-4" />
              {t("update.widget.backToAddresses")}
            </Button>
          )
        }
        className="flex-wrap"
      />
      <FormAlertWidget field={{}} />
      {data?.updated ? (
        <P>{t("update.widget.updated")}</P>
      ) : address ? (
        <SectionGroup title={address.label}>
          <Div className="flex flex-col gap-4">
            <TextFieldWidget fieldName="label" field={children.label} />
            <Div className="grid grid-cols-1 gap-4 @lg:grid-cols-2">
              <TextFieldWidget fieldName="fullName" field={children.fullName} />
              <TextFieldWidget fieldName="company" field={children.company} />
              <PhoneFieldWidget fieldName="phone" field={children.phone} />
              <TextFieldWidget
                fieldName="vatNumber"
                field={children.vatNumber}
              />
              <TextFieldWidget fieldName="taxId" field={children.taxId} />
            </Div>

            <TextFieldWidget
              fieldName="addressLine1"
              field={children.addressLine1}
            />
            <TextFieldWidget
              fieldName="addressLine2"
              field={children.addressLine2}
            />
            <Div className="grid grid-cols-1 gap-4 @lg:grid-cols-2">
              <TextFieldWidget fieldName="city" field={children.city} />
              <TextFieldWidget fieldName="region" field={children.region} />
              <TextFieldWidget
                fieldName="postalCode"
                field={children.postalCode}
              />
              <TextFieldWidget fieldName="country" field={children.country} />
              <BooleanFieldWidget
                fieldName="isDefaultBilling"
                field={children.isDefaultBilling}
              />
              <BooleanFieldWidget
                fieldName="isDefaultDelivery"
                field={children.isDefaultDelivery}
              />
            </Div>
            <SubmitButtonWidget<typeof definition.PATCH>
              field={{ text: "widget.saveChanges", className: "self-start" }}
            />
          </Div>
        </SectionGroup>
      ) : isLoading ? (
        <LoadingBlock />
      ) : (
        <EmptyBlock
          title={t(
            target.success
              ? "widget.addressUnavailable"
              : "widget.chooseAddress",
          )}
          action={{
            label: t("update.widget.backToAddresses"),
            onClick: openList,
          }}
        />
      )}
    </WidgetShell>
  );
}

export function UserAddressDeleteContainer({
  field,
}: {
  field: (typeof definition.DELETE)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.DELETE>();
  const t = useWidgetTranslation<typeof definition.DELETE>();
  const openList = useOpenAddressList();
  const form = useWidgetForm<typeof definition.DELETE>();
  const onSubmit = useWidgetOnSubmit();
  const isSubmitting = useWidgetIsSubmitting();
  const target = field.children.addressId.schema.safeParse(
    form?.watch("addressId"),
  );
  const { address, isLoading } = useSavedAddress(target.data);
  const addressLine =
    address &&
    [
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.postalCode,
      address.country,
    ]
      .filter(Boolean)
      .join(", ");

  return (
    <WidgetShell className="min-w-0">
      <WidgetHeader
        title={t(data?.deleted ? "delete.success.title" : "delete.title")}
        backButton={
          target.success && (
            <Button type="button" variant="ghost" size="sm" onClick={openList}>
              <ChevronLeft className="h-4 w-4" />
              {t("delete.widget.backToAddresses")}
            </Button>
          )
        }
        className="flex-wrap"
      />
      <FormAlertWidget field={{}} />
      {data?.deleted ? (
        <P>{t("delete.widget.deleted")}</P>
      ) : address ? (
        <SectionGroup title={address.label}>
          <P className="mb-4 break-words text-sm text-muted-foreground">
            {addressLine}
          </P>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                disabled={!onSubmit || isSubmitting}
              >
                {t("widget.reviewDeletion")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("delete.title")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("widget.confirmDeletion", { label: address.label })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("widget.cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={onSubmit}>
                  {t("delete.title")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SectionGroup>
      ) : isLoading ? (
        <LoadingBlock />
      ) : (
        <EmptyBlock
          title={t(
            target.success
              ? "widget.addressUnavailable"
              : "widget.chooseAddress",
          )}
          action={{
            label: t("delete.widget.backToAddresses"),
            onClick: openList,
          }}
        />
      )}
    </WidgetShell>
  );
}
