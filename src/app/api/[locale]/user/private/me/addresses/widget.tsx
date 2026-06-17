"use client";

import { Button } from "next-vibe-ui/ui/button";
import { EmptyBlock } from "next-vibe-ui/ui/empty-block";
import { Pin } from "next-vibe-ui/ui/icons/Pin";
import { ListItem } from "next-vibe-ui/ui/list-item";
import { LoadingBlock } from "next-vibe-ui/ui/loading-block";
import { StatusPill } from "next-vibe-ui/ui/status-pill";
import { WidgetHeader } from "next-vibe-ui/ui/widget-header";
import { WidgetShell } from "next-vibe-ui/ui/widget-shell";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import type { JSX } from "react";

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
    return <LoadingBlock message={t("list.widget.loading")} />;
  }

  const { addresses } = data;

  return (
    <WidgetShell>
      <WidgetHeader
        title={t("list.title")}
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
    return <LoadingBlock />;
  }

  return (
    <WidgetShell>
      <WidgetHeader title={t("create.success.title")} />
      <Button size="sm" variant="outline" onClick={handleBack}>
        {t("create.widget.backToAddresses")}
      </Button>
    </WidgetShell>
  );
}
