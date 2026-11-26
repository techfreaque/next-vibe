"use client";

import { Button, type ButtonMouseEvent } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Building } from "next-vibe/ui/components/icons/Building";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { Input } from "next-vibe/ui/components/input";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { type JSX, useState } from "react";

import type definition from "./definition";
import type { VendorListGetResponseOutput } from "./definition";

type Vendor = NonNullable<VendorListGetResponseOutput["vendors"]>[number];
type VendorFilter = "all" | "active" | "inactive";

const FILTERS: readonly VendorFilter[] = ["all", "active", "inactive"];
const GRID =
  "@3xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1.4fr)_minmax(0,0.8fr)_4.5rem_6.5rem_1rem]";

export function VendorListWidget(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: { field: (typeof definition.GET)["fields"] },
): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const companyId = form?.watch("companyId");
  const onPick = usePickerCallback<{ id: string; name: string }>();
  const isPickerMode = !!onPick;
  const [filter, setFilter] = useState<VendorFilter>("active");
  const [query, setQuery] = useState("");

  const openVendor = (vendor: Vendor): void => {
    if (onPick) {
      onPick({ id: vendor.id, name: vendor.name });
      return;
    }
    void import("../[vendorId]/get/definition").then((def) =>
      navigation.push(def.default.GET, {
        urlPathParams: { vendorId: vendor.id },
      }),
    );
  };

  const createVendor = (e?: ButtonMouseEvent): void => {
    e?.stopPropagation();
    void (async (): Promise<void> => {
      const [createDef, getDef] = await Promise.all([
        import("../create/definition"),
        import("../[vendorId]/get/definition"),
      ]);
      navigation.push(createDef.default.POST, {
        data: { companyId },
        replaceOnSuccess: {
          endpoint: getDef.default.GET,
          getUrlPathParams: (responseData) => ({
            vendorId: responseData.id,
          }),
        },
      });
    })();
  };

  const vendors = (data?.vendors ?? []).toSorted((a, b) =>
    a.name.localeCompare(b.name),
  );
  const counts: Record<VendorFilter, number> = {
    all: vendors.length,
    active: vendors.filter((v) => v.isActive).length,
    inactive: vendors.filter((v) => !v.isActive).length,
  };
  const needle = query.trim().toLowerCase();
  const visible = vendors.filter(
    (v) =>
      (filter === "all" || v.isActive === (filter === "active")) &&
      (!needle ||
        [v.name, v.code, v.email, v.vatNumber].some((value) =>
          value?.toLowerCase().includes(needle),
        )),
  );

  const filterLabel = (value: VendorFilter): string =>
    value === "all"
      ? t("vendorList.get.widget.filterAll")
      : value === "active"
        ? t("vendorList.get.widget.active")
        : t("vendorList.get.widget.inactive");

  const terms = (vendor: Vendor): string =>
    vendor.defaultPaymentTermsDays === null
      ? "-"
      : t("vendorList.get.widget.paymentTerms", {
          days: String(vendor.defaultPaymentTermsDays),
        });

  const back =
    navigation.canGoBack && !isPickerMode ? (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-ml-1 gap-1.5"
        onClick={() => navigation.pop()}
      >
        <ChevronLeft className="h-4 w-4" />
        {t("vendorList.get.widget.back")}
      </Button>
    ) : undefined;

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("vendorList.get.title")}
        subtitle={t("vendorList.get.widget.subtitle")}
        backButton={back}
        actions={
          isPickerMode ? undefined : (
            <Button type="button" onClick={createVendor}>
              {t("vendorList.get.widget.createVendor")}
            </Button>
          )
        }
      />
      <FormAlertWidget field={{}} />

      {!data ? (
        <LoadingBlock message={t("vendorList.get.widget.loading")} />
      ) : vendors.length === 0 ? (
        <Div className="rounded-xl border bg-card">
          <EmptyBlock
            size="page"
            icon={<Building className="h-6 w-6" />}
            title={t("vendorList.get.widget.empty")}
            message={t("vendorList.get.widget.emptyHint")}
            action={
              isPickerMode
                ? undefined
                : {
                    label: t("vendorList.get.widget.createVendor"),
                    onClick: () => createVendor(),
                  }
            }
          />
        </Div>
      ) : (
        <>
          <Div className="flex flex-col gap-3 @2xl:flex-row @2xl:items-center @2xl:justify-between">
            <Div className="flex gap-2 overflow-x-auto">
              {FILTERS.map((value) => (
                <Button
                  key={value}
                  type="button"
                  size="sm"
                  className="min-h-10 shrink-0 gap-2 @2xl:min-h-9"
                  aria-pressed={filter === value}
                  variant={filter === value ? "default" : "outline"}
                  onClick={() => setFilter(value)}
                >
                  {filterLabel(value)}
                  <Span className="tabular-nums opacity-80">
                    {counts[value]}
                  </Span>
                </Button>
              ))}
            </Div>
            <Div className="w-full @2xl:max-w-xs">
              <Input
                type="text"
                aria-label={t("vendorList.get.widget.search")}
                placeholder={t("vendorList.get.widget.search")}
                value={query}
                onChangeText={setQuery}
              />
            </Div>
          </Div>

          <Div className="overflow-hidden rounded-xl border bg-card">
            <Div
              className={`hidden gap-4 border-b px-4 py-2.5 text-xs font-medium text-muted-foreground @3xl:grid ${GRID}`}
            >
              <Span>{t("vendorList.get.widget.colVendor")}</Span>
              <Span>{t("vendorList.get.widget.colContact")}</Span>
              <Span>
                {t("vendorList.get.response.defaultPaymentTermsDays")}
              </Span>
              <Span>{t("vendorList.get.widget.colCurrency")}</Span>
              <Span>{t("vendorList.get.widget.colStatus")}</Span>
              <Span />
            </Div>
            {visible.length === 0 ? (
              <EmptyBlock
                title={t("vendorList.get.widget.noMatch")}
                action={{
                  label: t("vendorList.get.widget.clearFilters"),
                  variant: "outline",
                  onClick: () => {
                    setQuery("");
                    setFilter("all");
                  },
                }}
              />
            ) : (
              <Div className="flex flex-col divide-y">
                {visible.map((vendor) => (
                  <Div
                    key={vendor.id}
                    tabIndex={0}
                    onClick={() => openVendor(vendor)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        openVendor(vendor);
                      }
                    }}
                    className={`flex min-h-14 cursor-pointer flex-col gap-1 px-4 py-3 transition-colors hover:bg-muted/40 @3xl:grid @3xl:items-center @3xl:gap-4 ${GRID} ${vendor.isActive ? "" : "opacity-70"}`}
                  >
                    <Div className="flex min-w-0 items-center justify-between gap-3 @3xl:block">
                      <Div className="min-w-0">
                        <Span className="block break-words text-sm font-semibold">
                          {vendor.name}
                        </Span>
                        {vendor.code || vendor.vatNumber ? (
                          <Span className="block text-xs text-muted-foreground">
                            {[
                              vendor.code,
                              vendor.vatNumber
                                ? `${t("vendorList.get.widget.vatLabel")} ${vendor.vatNumber}`
                                : null,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </Span>
                        ) : null}
                      </Div>
                      <Div className="shrink-0 @3xl:hidden">
                        <StatusPill
                          status={vendor.isActive ? "active" : "inactive"}
                          variant={vendor.isActive ? "success" : "muted"}
                          label={
                            vendor.isActive
                              ? t("vendorList.get.widget.active")
                              : t("vendorList.get.widget.inactive")
                          }
                        />
                      </Div>
                    </Div>
                    <Span className="min-w-0 break-all text-sm text-muted-foreground @3xl:break-words">
                      {vendor.email ?? (
                        <Span className="hidden @3xl:inline">-</Span>
                      )}
                    </Span>
                    <Span className="text-xs text-muted-foreground @3xl:text-sm">
                      <Span className="@3xl:hidden">
                        {`${vendor.defaultCurrency} · `}
                      </Span>
                      {terms(vendor)}
                    </Span>
                    <Span className="hidden text-sm tabular-nums @3xl:block">
                      {vendor.defaultCurrency}
                    </Span>
                    <Div className="hidden @3xl:block">
                      <StatusPill
                        status={vendor.isActive ? "active" : "inactive"}
                        variant={vendor.isActive ? "success" : "muted"}
                        label={
                          vendor.isActive
                            ? t("vendorList.get.widget.active")
                            : t("vendorList.get.widget.inactive")
                        }
                      />
                    </Div>
                    <ChevronRight className="hidden h-4 w-4 text-muted-foreground @3xl:block" />
                  </Div>
                ))}
              </Div>
            )}
            <Div className="border-t bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
              {t("vendorList.get.widget.count", {
                shown: String(visible.length),
                total: String(vendors.length),
              })}
            </Div>
          </Div>
        </>
      )}
    </WidgetShell>
  );
}
