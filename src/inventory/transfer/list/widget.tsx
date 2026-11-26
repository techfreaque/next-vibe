"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { RecordTable } from "next-vibe/ui/components/record-table";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatDocDate } from "next-vibe/unified-ui/_shared/format-money";
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
import { type JSX, useState } from "react";

import { ReportCompanyPicker } from "@/chart-of-accounts/reports/balance-sheet/report-controls";

import { transferStatusLabel, transferStatusVariant } from "../status";
import type definition from "./definition";
import type { InventoryTransferListGetResponseOutput } from "./definition";

type Transfer = InventoryTransferListGetResponseOutput["transfers"][number];
const statusTabs = [
  "ALL",
  "DRAFT",
  "IN_TRANSIT",
  "RECEIVED",
  "CANCELLED",
] as const;

export function InventoryTransferListWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const interactive = useWidgetIsInteractive();
  const response = useWidgetResponse();
  const read = useWidgetEndpointMutations()?.read;
  const companyId = form.watch("companyId");
  const onPick = usePickerCallback<Transfer>();
  const [statusFilter, setStatusFilter] =
    useState<(typeof statusTabs)[number]>("ALL");

  const open = (transfer: Transfer): void => {
    if (onPick) {
      onPick(transfer);
      return;
    }
    void import("../[transferId]/get/definition").then(
      ({ default: endpoint }) =>
        navigation.push(endpoint.GET, {
          urlPathParams: { transferId: transfer.id },
        }),
    );
  };
  const create = (): void => {
    void Promise.all([
      import("../create/definition"),
      import("../[transferId]/get/definition"),
    ]).then(([{ default: write }, { default: readEndpoint }]) =>
      navigation.push(write.POST, {
        data: { companyId },
        replaceOnSuccess: {
          endpoint: readEndpoint.GET,
          getUrlPathParams: (responseData: { result: { id: string } }) => ({
            transferId: responseData.result.id,
          }),
        },
      }),
    );
  };
  const transfers = data?.transfers ?? [];
  const filtered = transfers.filter(
    (row) => statusFilter === "ALL" || row.status === statusFilter,
  );
  const title = t("transferList.get.titleShort");
  const columns = [
    { id: "reference", label: t("transferGet.get.response.reference") },
    { id: "from", label: t("transferGet.get.response.fromWarehouseName") },
    { id: "to", label: t("transferGet.get.response.toWarehouseName") },
    { id: "date", label: t("transferGet.get.response.createdAt") },
    { id: "status", label: t("transferGet.get.response.status") },
  ];
  const rows = filtered.map((row) => {
    const reference = (
      <Button
        type="button"
        variant="link"
        className="h-auto justify-start whitespace-normal p-0 text-left"
        onClick={() => open(row)}
      >
        {row.reference || t("transferList.get.widget.viewTransfer")}
      </Button>
    );
    const status = (
      <StatusPill
        status={transferStatusLabel(row.status, t)}
        variant={transferStatusVariant(row.status)}
      />
    );
    return {
      id: row.id,
      cells: {
        reference,
        status,
        from: row.fromWarehouseName,
        to: row.toWarehouseName,
        date: formatDocDate(row.createdAt, locale),
      },
    };
  });

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={title}
        actions={
          !onPick &&
          interactive && (
            <Button type="button" onClick={create}>
              {t("transferList.get.widget.newTransfer")}
            </Button>
          )
        }
      />
      {interactive && (
        <ReportCompanyPicker
          selectedId={companyId}
          onChange={(id) =>
            form.setValue("companyId", id, { shouldDirty: true })
          }
        />
      )}
      {!onPick && interactive && (
        <Div className="flex flex-wrap items-center gap-1">
          {statusTabs.map((tab) => (
            <Button
              key={tab}
              type="button"
              size="sm"
              variant={statusFilter === tab ? "secondary" : "ghost"}
              onClick={() => setStatusFilter(tab)}
            >
              {tab === "ALL"
                ? t("transferList.get.widget.tabAll")
                : transferStatusLabel(tab, t)}
            </Button>
          ))}
        </Div>
      )}
      {response?.success === false ? (
        <EmptyBlock
          title={response.message}
          action={
            read && interactive
              ? {
                  label: t("transferGet.get.widget.retry"),
                  onClick: () => void read.refetch(),
                }
              : undefined
          }
        />
      ) : !data || read?.isLoadingFresh ? (
        <Skeleton className="h-28 w-full" />
      ) : !rows.length ? (
        <EmptyBlock
          title={t("transferList.get.widget.empty")}
          message={
            statusFilter === "ALL" && !onPick
              ? t("transferList.get.widget.emptyHint")
              : undefined
          }
          action={
            statusFilter !== "ALL"
              ? {
                  label: t("transferList.get.widget.tabAll"),
                  onClick: () => setStatusFilter("ALL"),
                }
              : undefined
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
                <Div key={id} className="flex min-w-0 flex-col gap-1 px-3 py-3">
                  <Div className="flex flex-wrap items-center justify-between gap-2">
                    {cells.reference}
                    {cells.status}
                  </Div>
                  <Span className="break-words">{`${cells.from} ${t("transferList.get.widget.arrowSeparator")} ${cells.to}`}</Span>
                  <Span className="text-sm text-muted-foreground">
                    {cells.date}
                  </Span>
                </Div>
              ))}
            </Div>
          }
        />
      )}
    </WidgetShell>
  );
}
