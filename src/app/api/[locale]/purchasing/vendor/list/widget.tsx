"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button, type ButtonMouseEvent } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Span } from "next-vibe-ui/ui/span";
import { usePickerCallback } from "next-vibe-ui/unified/_shared/picker-context";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import type { JSX } from "react";

import type definition from "./definition";
import type { VendorListGetResponseOutput } from "./definition";

type Vendor = NonNullable<VendorListGetResponseOutput["vendors"]>[number];

function VendorRow({
  vendor,
  onOpen,
  activeLabel,
  inactiveLabel,
  vatPrefix,
  paymentTermsPrefix,
  paymentTermsSuffix,
}: {
  vendor: Vendor;
  onOpen: (id: string) => void;
  activeLabel: string;
  inactiveLabel: string;
  vatPrefix: string;
  paymentTermsPrefix: string;
  paymentTermsSuffix: string;
}): JSX.Element {
  return (
    <Div
      className={[
        "flex items-center gap-4 px-4 py-3 hover:bg-muted/30 cursor-pointer transition-colors border-b last:border-b-0",
        !vendor.isActive ? "opacity-60" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={(): void => onOpen(vendor.id)}
    >
      {/* Avatar initial */}
      <Div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <Span className="text-sm font-semibold text-primary">
          {vendor.name.charAt(0).toUpperCase()}
        </Span>
      </Div>

      {/* Main info */}
      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="text-sm font-medium truncate">{vendor.name}</Span>
          {vendor.code ? (
            <Span className="text-xs text-muted-foreground font-mono">
              {vendor.code}
            </Span>
          ) : null}
        </Div>
        <Div className="flex items-center gap-3 mt-0.5 flex-wrap">
          {vendor.email ? (
            <Span className="text-xs text-muted-foreground">
              {vendor.email}
            </Span>
          ) : null}
          {vendor.vatNumber ? (
            <Span className="text-xs text-muted-foreground">
              {vatPrefix} {vendor.vatNumber}
            </Span>
          ) : null}
          {vendor.defaultPaymentTermsDays !== null ? (
            <Span className="text-xs text-muted-foreground">
              {paymentTermsPrefix} {vendor.defaultPaymentTermsDays}
              {paymentTermsSuffix}
            </Span>
          ) : null}
        </Div>
      </Div>

      {/* Currency + Status */}
      <Div className="flex items-center gap-2 shrink-0">
        <Badge variant="outline" className="text-xs font-mono py-0 h-5">
          {vendor.defaultCurrency}
        </Badge>
        <Badge
          variant={vendor.isActive ? "default" : "secondary"}
          className="text-xs py-0 h-5"
        >
          {vendor.isActive ? activeLabel : inactiveLabel}
        </Badge>
      </Div>
    </Div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function VendorListWidget(_props: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const onPick = usePickerCallback<{ id: string; name: string }>();
  const isPickerMode = !!onPick;

  const handleViewVendor = (vendorId: string): void => {
    if (isPickerMode) {
      const vendor = vendors.find((v) => v.id === vendorId);
      if (vendor && onPick) {
        onPick({ id: vendor.id, name: vendor.name });
        navigation.pop();
      }
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../[vendorId]/get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { vendorId },
      });
    })();
  };

  const handleCreate = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def = await import("../create/definition");
      navigation.push(def.default.POST, {});
    })();
  };

  const vendors = data?.vendors ?? [];
  const activeCount = vendors.filter((v) => v.isActive).length;
  const activeLabel = t("vendorList.get.widget.active");
  const inactiveLabel = t("vendorList.get.widget.inactive");
  const vatPrefix = t("vendorList.get.widget.vatPrefix");
  const paymentTermsPrefix = t("vendorList.get.widget.paymentTermsPrefix");
  const paymentTermsSuffix = t("vendorList.get.widget.paymentTermsSuffix");

  return (
    <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-4">
      {/* Back button */}
      {navigation.canGoBack && !isPickerMode && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigation.pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("vendorList.get.widget.back")}
        </Button>
      )}

      {/* Toolbar */}
      <Div className="flex items-center justify-between gap-3">
        {data !== undefined ? (
          <Span className="text-xs text-muted-foreground">
            {activeCount} {activeLabel} / {vendors.length}{" "}
            {t("vendorList.get.widget.total")}
          </Span>
        ) : (
          <Span />
        )}
        {!isPickerMode && (
          <Button
            type="button"
            size="sm"
            variant="default"
            onClick={handleCreate}
          >
            {t("vendorList.get.widget.createVendor")}
          </Button>
        )}
      </Div>

      {/* Loading */}
      {!data && (
        <Div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <Span className="text-sm">{t("vendorList.get.widget.loading")}</Span>
        </Div>
      )}

      {/* Vendor list */}
      {vendors.length > 0 ? (
        <Div className="rounded-lg border overflow-hidden">
          {vendors.map((vendor) => (
            <VendorRow
              key={vendor.id}
              vendor={vendor}
              onOpen={handleViewVendor}
              activeLabel={activeLabel}
              inactiveLabel={inactiveLabel}
              vatPrefix={vatPrefix}
              paymentTermsPrefix={paymentTermsPrefix}
              paymentTermsSuffix={paymentTermsSuffix}
            />
          ))}
        </Div>
      ) : data !== undefined ? (
        <Div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <Div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <Span className="text-2xl font-bold text-muted-foreground">V</Span>
          </Div>
          <Span className="text-sm font-medium">
            {t("vendorList.get.widget.empty")}
          </Span>
          {!isPickerMode && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleCreate}
            >
              {t("vendorList.get.widget.createVendor")}
            </Button>
          )}
        </Div>
      ) : null}
    </Div>
  );
}
