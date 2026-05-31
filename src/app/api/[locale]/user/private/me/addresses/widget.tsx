/**
 * User Addresses Widget
 * Lists saved addresses with billing/delivery badges and edit/delete actions.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";

type AddressItem = NonNullable<
  ReturnType<typeof useWidgetValue<typeof definition.GET>>
>["addresses"][number];

function AddressCard({
  address,
  t,
  onEdit,
  onDelete,
}: {
  address: AddressItem;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
  onEdit: (addressId: string) => void;
  onDelete: (addressId: string) => void;
}): JSX.Element {
  const parts = [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Div className="rounded-md border p-4 space-y-2">
      <Div className="flex items-start justify-between gap-3">
        <Div className="space-y-1">
          <Div className="font-medium text-sm">{address.label}</Div>
          {address.fullName ? (
            <Div className="text-sm text-muted-foreground">
              {address.fullName}
            </Div>
          ) : null}
          <Div className="text-sm text-muted-foreground">{parts}</Div>
        </Div>
        <Div className="flex flex-col gap-1.5 shrink-0">
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={(): void => onEdit(address.id)}
          >
            {t("list.widget.edit")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs text-destructive"
            onClick={(): void => onDelete(address.id)}
          >
            {t("list.widget.delete")}
          </Button>
        </Div>
      </Div>
      <Div className="flex gap-2 flex-wrap">
        {address.isDefaultBilling ? (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs">
            {t("list.widget.billing")}
          </Badge>
        ) : null}
        {address.isDefaultDelivery ? (
          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs">
            {t("list.widget.delivery")}
          </Badge>
        ) : null}
      </Div>
    </Div>
  );
}

export function UserAddressesContainer(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();

  const handleEdit = (addressId: string): void => {
    void (async (): Promise<void> => {
      const addressDef =
        await import("@/app/api/[locale]/user/private/me/addresses/[addressId]/definition");
      navigation.push(addressDef.default.PATCH, {
        urlPathParams: { addressId },
      });
    })();
  };

  const handleDelete = (addressId: string): void => {
    void (async (): Promise<void> => {
      const addressDef =
        await import("@/app/api/[locale]/user/private/me/addresses/[addressId]/definition");
      navigation.push(addressDef.default.DELETE, {
        urlPathParams: { addressId },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleAdd = (): void => {
    void (async (): Promise<void> => {
      const selfDef = await import("./definition");
      navigation.push(selfDef.default.POST, {});
    })();
  };

  if (!data) {
    return <Div />;
  }

  const { addresses } = data;

  return (
    <Div className="space-y-3">
      <Div className="flex justify-end">
        <Button size="sm" onClick={handleAdd}>
          {t("list.widget.addAddress")}
        </Button>
      </Div>

      {addresses.length === 0 ? (
        <Div className="text-center py-10 text-sm text-muted-foreground">
          <Span>{t("list.widget.empty")}</Span>
        </Div>
      ) : (
        <Div className="space-y-3">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              t={t}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </Div>
      )}
    </Div>
  );
}

export function UserAddressCreateContainer(): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const handleBack = (): void => {
    void (async (): Promise<void> => {
      const selfDef = await import("./definition");
      navigation.push(selfDef.default.GET, {});
    })();
  };

  if (!data) {
    return <Div />;
  }

  return (
    <Div className="space-y-4">
      <Div className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
        {t("create.widget.saved")}
      </Div>
      <Div className="text-xs text-muted-foreground">{data.responseLabel}</Div>
      <Button size="sm" variant="outline" onClick={handleBack}>
        {t("create.widget.backToAddresses")}
      </Button>
    </Div>
  );
}
