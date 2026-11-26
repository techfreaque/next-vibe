"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { RecordTable } from "next-vibe/ui/components/record-table";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatPercent } from "next-vibe/unified-ui/_shared/format-money";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import { ReportCompanyPicker } from "@/chart-of-accounts/reports/balance-sheet/report-controls";

import { TaxTypeDB } from "../../enum";
import type definition from "./definition";
import type { TaxRateListResponseOutput } from "./definition";

type TaxRate = NonNullable<TaxRateListResponseOutput["rates"]>[number];

export function TaxRateListWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const form = useWidgetForm<typeof definition.GET>();
  const companyId = form.watch("companyId");
  const page = form.watch("page") ?? 1;
  const pageSize = form.watch("pageSize") ?? 20;
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof definition.GET>();
  const onPick = usePickerCallback<TaxRate>();
  const interactive = useWidgetIsInteractive();
  const response = useWidgetResponse();
  const read = useWidgetEndpointMutations()?.read;
  const refresh = (): void => {
    void read?.refetch();
  };
  const create = (): void => {
    void import("../create/definition").then(({ default: endpoint }) =>
      navigation.push(endpoint.POST, {
        data: { companyId },
        popNavigationOnSuccess: 1,
        onSuccessCallback: refresh,
      }),
    );
  };
  const edit = (rate: TaxRate): void => {
    if (onPick) {
      onPick(rate);
      return;
    }
    void import("../[rateId]/update/definition").then(({ default: endpoint }) =>
      navigation.push(endpoint.PATCH, {
        urlPathParams: { rateId: rate.id },
        popNavigationOnSuccess: 1,
        onSuccessCallback: refresh,
      }),
    );
  };
  const remove = (rate: TaxRate): void => {
    void import("../[rateId]/delete/definition").then(({ default: endpoint }) =>
      navigation.push(endpoint.POST, {
        urlPathParams: { rateId: rate.id },
        popNavigationOnSuccess: 1,
        onSuccessCallback: refresh,
      }),
    );
  };
  const title = t("rate.list.titleShort");
  const columns = [
    { id: "name", label: t("rate.list.response.rate.name") },
    { id: "location", label: t("rate.list.response.rate.country") },
    { id: "type", label: t("rate.list.response.rate.type") },
    { id: "rate", label: t("rate.list.response.rate.rate"), numeric: true },
    ...(!onPick && interactive
      ? [{ id: "actions", label: t("rate.list.widget.actions") }]
      : []),
  ];
  const rows = (data?.rates ?? []).map((row) => {
    const type = TaxTypeDB.find((value) => value === row.type);
    const name = (
      <Div className="flex flex-wrap items-center gap-2">
        {interactive ? (
          <Button
            type="button"
            variant="link"
            className="h-auto whitespace-normal p-0 text-left"
            onClick={() => edit(row)}
          >
            {row.name}
          </Button>
        ) : (
          row.name
        )}
        {row.isDefault && (
          <Badge variant="secondary">
            {t("rate.list.widget.labelDefault")}
          </Badge>
        )}
        {row.isCompound && (
          <Badge variant="outline">{t("rate.list.widget.labelCompound")}</Badge>
        )}
        <Span className="text-xs text-muted-foreground">{row.code}</Span>
      </Div>
    );
    const actions = interactive && !onPick && (
      <Div className="flex flex-wrap gap-1">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => edit(row)}
        >
          {t("rate.list.widget.labelEdit")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => remove(row)}
        >
          {t("rate.list.widget.labelDelete")}
        </Button>
      </Div>
    );
    return {
      id: row.id,
      cells: {
        name,
        actions,
        location: [row.country, row.region].filter(Boolean).join(", "),
        type: type ? t(type) : row.type,
        rate: formatPercent(row.rate, locale),
      },
    };
  });
  const pages = Math.ceil((data?.total ?? 0) / pageSize);
  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={title}
        actions={
          !onPick &&
          interactive && (
            <Button type="button" onClick={create}>
              {t("rate.list.widget.addRate")}
            </Button>
          )
        }
      />
      {interactive && (
        <ReportCompanyPicker
          selectedId={companyId}
          onChange={(id) => {
            form.setValue("page", 1);
            form.setValue("companyId", id, { shouldDirty: true });
          }}
        />
      )}
      {response?.success === false ? (
        <EmptyBlock
          title={response.message}
          action={
            read && interactive
              ? { label: t("rate.list.widget.retry"), onClick: refresh }
              : undefined
          }
        />
      ) : !data || read?.isLoadingFresh ? (
        <Skeleton className="h-28 w-full" />
      ) : !rows.length ? (
        <EmptyBlock
          title={t("rate.list.widget.empty")}
          message={
            data.salesExemptionNotice || t("rate.list.widget.emptySetup")
          }
        />
      ) : (
        <RecordTable
          label={title}
          columns={columns}
          rows={rows}
          compact={
            <Div className="divide-y rounded-lg border bg-card">
              {rows.map(({ id, cells }) => (
                <Div key={id} className="flex min-w-0 flex-col gap-2 px-3 py-3">
                  <Div className="flex flex-wrap items-center justify-between gap-2">
                    {cells.name}
                    <Span className="tabular-nums font-semibold">
                      {cells.rate}
                    </Span>
                  </Div>
                  <Span className="text-sm text-muted-foreground">
                    {[cells.type, cells.location].filter(Boolean).join(" · ")}
                  </Span>
                  {cells.actions}
                </Div>
              ))}
            </Div>
          }
        />
      )}
      {pages > 1 && interactive && (
        <Div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={page <= 1}
            onClick={() =>
              form.setValue("page", page - 1, { shouldDirty: true })
            }
          >
            {t("rate.list.widget.previous")}
          </Button>
          <Span className="text-sm tabular-nums">{`${page} / ${pages}`}</Span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={page >= pages}
            onClick={() =>
              form.setValue("page", page + 1, { shouldDirty: true })
            }
          >
            {t("rate.list.widget.next")}
          </Button>
        </Div>
      )}
    </WidgetShell>
  );
}
