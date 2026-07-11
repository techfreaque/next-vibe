"use client";

import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { EmptyBlock } from "next-vibe/ui/ui/empty-block";
import { ChevronLeft } from "next-vibe/ui/ui/icons/ChevronLeft";
import { Pin } from "next-vibe/ui/ui/icons/Pin";
import { ListItem } from "next-vibe/ui/ui/list-item";
import { LoadingBlock } from "next-vibe/ui/ui/loading-block";
import { StatusPill } from "next-vibe/ui/ui/status-pill";
import { WidgetHeader } from "next-vibe/ui/ui/widget-header";
import { WidgetShell } from "next-vibe/ui/ui/widget-shell";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/form-fields/boolean-field/widget";
import { PhoneFieldWidget } from "next-vibe/unified-ui/form-fields/phone-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import type { JSX } from "react";
import { useMemo } from "react";

import type definition from "./definition";

type AddressItem = NonNullable<
  ReturnType<typeof useWidgetValue<typeof definition.GET>>
>["addresses"][number];

function addressLine(address: AddressItem): string {
  return [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

export function UserAddressesContainer(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();

  const handleEdit = (addressId: string): void => {
    void (async (): Promise<void> => {
      const addressDef =
        await import("@/app/api/[locale]/user/private/me/addresses/[addressId]/definition");
      navigate(addressDef.default.PATCH, {
        urlPathParams: { addressId },
      });
    })();
  };

  const handleDelete = (addressId: string): void => {
    void (async (): Promise<void> => {
      const addressDef =
        await import("@/app/api/[locale]/user/private/me/addresses/[addressId]/definition");
      navigate(addressDef.default.DELETE, {
        urlPathParams: { addressId },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleAdd = (): void => {
    void (async (): Promise<void> => {
      const selfDef = await import("./definition");
      navigate(selfDef.default.POST, { popNavigationOnSuccess: 1 });
    })();
  };

  if (!data) {
    return <LoadingBlock message={t("list.widget.loading")} />;
  }

  const { addresses } = data;

  return (
    <WidgetShell>
      <WidgetHeader
        title={t("list.title")}
        backButton={
          canGoBack ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(): void => {
                pop();
              }}
              className="gap-1.5 -ml-1"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("list.widget.back")}
            </Button>
          ) : undefined
        }
        actions={
          <Button size="sm" onClick={handleAdd}>
            {t("list.widget.addAddress")}
          </Button>
        }
      />

      {addresses.length === 0 ? (
        <EmptyBlock
          icon={<Pin />}
          title={t("list.widget.empty")}
          message={t("list.widget.emptyHint")}
          action={{ label: t("list.widget.emptyCta"), onClick: handleAdd }}
        />
      ) : (
        addresses.map((address) => (
          <ListItem
            key={address.id}
            title={address.label}
            subtitle={[address.fullName, addressLine(address)]
              .filter(Boolean)
              .join(" · ")}
            badges={
              <>
                {address.isDefaultBilling && (
                  <StatusPill
                    status="billing"
                    variant="info"
                    label={t("list.widget.billing")}
                  />
                )}
                {address.isDefaultDelivery && (
                  <StatusPill
                    status="delivery"
                    variant="success"
                    label={t("list.widget.delivery")}
                  />
                )}
              </>
            }
            actions={
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(): void => handleEdit(address.id)}
                >
                  {t("list.widget.edit")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive"
                  onClick={(): void => handleDelete(address.id)}
                >
                  {t("list.widget.delete")}
                </Button>
              </>
            }
          />
        ))
      )}
    </WidgetShell>
  );
}

interface CreateWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function UserAddressCreateContainer({
  field,
}: CreateWidgetProps): JSX.Element {
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const emptyField = useMemo(() => ({}), []);
  const children = field.children;

  return (
    <WidgetShell>
      <WidgetHeader
        title={t("create.title")}
        backButton={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(): void => {
              pop();
            }}
            className="gap-1.5 -ml-1"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("create.widget.backToAddresses")}
          </Button>
        }
      />

      <Div className="flex flex-col gap-4 p-1">
        <FormAlertWidget field={emptyField} />

        <TextFieldWidget
          fieldName="addressLabel"
          field={children.addressLabel}
        />

        <Div className="grid grid-cols-2 gap-4">
          <TextFieldWidget fieldName="fullName" field={children.fullName} />
          <TextFieldWidget fieldName="company" field={children.company} />
        </Div>

        <Div className="grid grid-cols-2 gap-4">
          <PhoneFieldWidget fieldName="phone" field={children.phone} />
          <TextFieldWidget fieldName="vatNumber" field={children.vatNumber} />
        </Div>

        <TextFieldWidget
          fieldName="addressLine1"
          field={children.addressLine1}
        />
        <TextFieldWidget
          fieldName="addressLine2"
          field={children.addressLine2}
        />

        <Div className="grid grid-cols-2 gap-4">
          <TextFieldWidget fieldName="city" field={children.city} />
          <TextFieldWidget fieldName="region" field={children.region} />
        </Div>

        <Div className="grid grid-cols-2 gap-4">
          <TextFieldWidget fieldName="postalCode" field={children.postalCode} />
          <TextFieldWidget fieldName="country" field={children.country} />
        </Div>

        <Div className="grid grid-cols-2 gap-4">
          <BooleanFieldWidget
            fieldName="isDefaultBilling"
            field={children.isDefaultBilling}
          />
          <BooleanFieldWidget
            fieldName="isDefaultDelivery"
            field={children.isDefaultDelivery}
          />
        </Div>

        <SubmitButtonWidget<typeof definition.POST> field={emptyField} />
      </Div>
    </WidgetShell>
  );
}
