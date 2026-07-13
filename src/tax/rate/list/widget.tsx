"use client";
// Tax rate list widget — displays all tax rates with translated type badges
import { Badge } from "next-vibe/ui/ui/badge";
import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { Span } from "next-vibe/ui/ui/span";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import { TaxType } from "../../enum";
import type definition from "./definition";
import type { TaxRateListResponseOutput } from "./definition";

type TaxRate = NonNullable<TaxRateListResponseOutput["rates"]>[number];

const TAX_TYPE_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  [TaxType.VAT]: "default",
  [TaxType.GST]: "secondary",
  [TaxType.SALES]: "outline",
  [TaxType.WITHHOLDING]: "outline",
  [TaxType.NONE]: "secondary",
};

function TaxRateRow({
  rate,
  onEdit,
  onDelete,
  labelDefault,
  labelActive,
  labelInactive,
  labelEdit,
  labelDelete,
  labelCompound,
  labelType,
  isPickerMode,
}: {
  rate: TaxRate;
  onEdit: () => void;
  onDelete: () => void;
  labelDefault: string;
  labelActive: string;
  labelInactive: string;
  labelEdit: string;
  labelDelete: string;
  labelCompound: string;
  labelType: string;
  isPickerMode: boolean;
}): JSX.Element {
  const typeVariant = TAX_TYPE_VARIANT[rate.type] ?? "outline";

  return (
    <Div
      className={[
        "flex items-center gap-3 py-3 px-4 border-b last:border-b-0 transition-colors group cursor-pointer",
        rate.isActive ? "hover:bg-muted/30" : "opacity-55 hover:bg-muted/10",
      ].join(" ")}
      onClick={onEdit}
    >
      {/* Left: name, code, location */}
      <Div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="text-sm font-semibold group-hover:text-primary transition-colors">
            {rate.name}
          </Span>
          {rate.isDefault ? (
            <Badge
              variant="secondary"
              className="text-xs py-0 h-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-semibold"
            >
              {labelDefault}
            </Badge>
          ) : null}
          {rate.isCompound ? (
            <Badge
              variant="outline"
              className="text-xs py-0 h-4 text-violet-600 dark:text-violet-400 border-violet-500/30"
            >
              {labelCompound}
            </Badge>
          ) : null}
        </Div>
        <Div className="flex gap-2 text-xs text-muted-foreground items-center">
          <Span className="font-mono tracking-tight">{rate.code}</Span>
          {rate.country ? (
            <>
              {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
              <Span className="opacity-40">·</Span>
              <Span>{rate.country}</Span>
            </>
          ) : null}
          {rate.region ? (
            <>
              {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
              <Span className="opacity-40">·</Span>
              <Span>{rate.region}</Span>
            </>
          ) : null}
        </Div>
      </Div>

      {/* Right: type, rate % (prominent), active status, actions */}
      <Div className="flex items-center gap-3 shrink-0">
        <Badge variant={typeVariant} className="text-xs font-medium">
          {labelType}
        </Badge>

        {/* Rate % — the most important number, shown large */}
        <Span className="text-base font-bold font-mono tabular-nums w-16 text-right">
          {(rate.rate * 100).toFixed(1)}
          {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}%
        </Span>

        <Badge
          variant={rate.isActive ? "default" : "secondary"}
          className={[
            "text-xs font-medium",
            rate.isActive
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
              : "",
          ].join(" ")}
        >
          {rate.isActive ? labelActive : labelInactive}
        </Badge>

        {!isPickerMode && (
          <Div
            className="flex items-center gap-1"
            onClick={(e): void => e.stopPropagation()}
          >
            <Button
              size="sm"
              variant="ghost"
              className="text-xs h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e): void => {
                e.stopPropagation();
                onEdit();
              }}
            >
              {labelEdit}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-xs h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={(e): void => {
                e.stopPropagation();
                onDelete();
              }}
            >
              {labelDelete}
            </Button>
          </Div>
        )}
      </Div>
    </Div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TaxRateListWidget(_props: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const onPick =
    usePickerCallback<
      NonNullable<(typeof definition.GET.types.ResponseOutput)["rates"]>[number]
    >();
  const isPickerMode = !!onPick;

  const handleCreate = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../create/definition");
      navigation.push(def.default.POST, {});
    })();
  };

  const handleBackToCatalog = (): void => {
    void (async (): Promise<void> => {
      const def =
        await import("@/app/api/[locale]/products/catalog/list/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  const handleEdit = (rateId: string): void => {
    if (isPickerMode) {
      const rate = (data?.rates ?? []).find((r) => r.id === rateId);
      if (rate && onPick) {
        onPick(rate);
        navigation.pop();
      }
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../[rateId]/update/definition");
      navigation.push(def.default.PATCH, { urlPathParams: { rateId } });
    })();
  };

  const handleDelete = (rateId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../[rateId]/delete/definition");
      navigation.push(def.default.POST, { urlPathParams: { rateId } });
    })();
  };

  const labelDefault = t("rate.list.widget.labelDefault");
  const labelActive = t("rate.list.widget.labelActive");
  const labelInactive = t("rate.list.widget.labelInactive");
  const labelEdit = t("rate.list.widget.labelEdit");
  const labelDelete = t("rate.list.widget.labelDelete");
  const labelCompound = t("rate.list.widget.labelCompound");
  const labelAddRate = t("rate.list.widget.addRate");
  const labelEmpty = t("rate.list.widget.empty");
  const labelEmptySetup = t("rate.list.widget.emptySetup");
  const labelRateHeader = t("rate.list.widget.columnRate");
  const labelTypeRateStatus = t("rate.list.widget.columnTypeRateActions");
  const labelBackToCatalog = t("rate.list.widget.backToCatalog");

  const rates = data?.rates ?? [];
  const hasData = data !== undefined;
  const hasNoRatesAtAll = hasData && rates.length === 0;

  return (
    <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-4">
      {/* Back nav + header */}
      <Div className="flex items-center justify-between gap-3">
        <Div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-xs text-muted-foreground h-7 px-2 -ml-2"
            onClick={handleBackToCatalog}
          >
            {labelBackToCatalog}
          </Button>
          {data?.total !== undefined ? (
            <Span className="text-xs text-muted-foreground tabular-nums">
              {data.total} {t("rate.list.response.total").toLowerCase()}
            </Span>
          ) : null}
        </Div>
        {!isPickerMode && (
          <Button size="sm" variant="default" onClick={handleCreate}>
            {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
            <Span className="mr-1 font-bold">+</Span>
            {labelAddRate}
          </Button>
        )}
      </Div>

      {/* Tax rates list */}
      {rates.length > 0 ? (
        <Div className="rounded-lg border overflow-hidden">
          {/* Column header */}
          <Div className="flex items-center gap-3 px-4 py-2 bg-muted/40 border-b text-xs font-medium text-muted-foreground">
            <Span className="flex-1">{labelRateHeader}</Span>
            <Span className="shrink-0">{labelTypeRateStatus}</Span>
          </Div>
          {rates.map((rate) => (
            <TaxRateRow
              key={rate.id}
              rate={rate}
              onEdit={(): void => handleEdit(rate.id)}
              onDelete={(): void => handleDelete(rate.id)}
              labelDefault={labelDefault}
              labelActive={labelActive}
              labelInactive={labelInactive}
              labelEdit={labelEdit}
              labelDelete={labelDelete}
              labelCompound={labelCompound}
              labelType={t(rate.type as Parameters<typeof t>[0])}
              isPickerMode={isPickerMode}
            />
          ))}
        </Div>
      ) : hasNoRatesAtAll ? (
        /* Distinct empty state when NO rates exist — invoicing is blocked */
        <Div className="flex flex-col items-center gap-4 py-14 text-center border-2 border-dashed border-amber-500/30 rounded-lg bg-amber-500/5">
          <Div className="rounded-full bg-amber-500/15 p-4">
            <Span className="text-2xl">
              {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
              ⚠️
            </Span>
          </Div>
          <Div className="flex flex-col gap-1 max-w-xs">
            <Span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              {labelEmptySetup}
            </Span>
          </Div>
          {!isPickerMode && (
            <Button size="sm" variant="default" onClick={handleCreate}>
              {labelAddRate}
            </Button>
          )}
        </Div>
      ) : hasData ? (
        <Div className="flex flex-col items-center gap-3 py-14 text-center">
          <Div className="rounded-full bg-muted/50 p-4">
            <Span className="text-2xl text-muted-foreground">
              {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
              🧾
            </Span>
          </Div>
          <Span className="text-sm text-muted-foreground max-w-xs">
            {labelEmpty}
          </Span>
          {!isPickerMode && (
            <Button size="sm" variant="outline" onClick={handleCreate}>
              {labelAddRate}
            </Button>
          )}
        </Div>
      ) : null}
    </Div>
  );
}
