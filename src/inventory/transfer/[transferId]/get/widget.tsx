"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { RecordTable } from "next-vibe/ui/components/record-table";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { AdminRecordDetail } from "next-vibe/unified-ui/_shared/admin-record-detail";
import {
  formatDocDate,
  formatQuantity,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetEndpointMutations,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import { transferStatusLabel, transferStatusVariant } from "../../status";
import type definition from "./definition";

export function InventoryTransferGetWidget(): JSX.Element {
  const result = useWidgetValue<typeof definition.GET>()?.result;
  const navigation = useWidgetNavigation();
  const read = useWidgetEndpointMutations()?.read;
  const response = useWidgetResponse();
  const interactive = useWidgetIsInteractive();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const browse = (): void => {
    if (navigation.canGoBack) {
      navigation.pop();
      return;
    }
    void import("../../list/definition").then(({ default: list }) =>
      navigation.push(list.GET, {
        data: result ? { companyId: result.companyId } : undefined,
      }),
    );
  };
  const back = interactive && (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      className="self-start gap-1.5 -ml-2"
      onClick={browse}
    >
      <ChevronLeft className="size-4" aria-hidden="true" />
      {t("transferList.get.titleShort")}
    </Button>
  );
  const items = result?.items ?? [];
  const editable =
    result?.canManage &&
    (result.status === "DRAFT" || result.status === "IN_TRANSIT");
  const move = (): void => {
    if (!result || !editable) {
      return;
    }
    const load =
      result.status === "DRAFT"
        ? import("../dispatch/definition")
        : import("../receive/definition");
    void load.then(({ default: action }) =>
      navigation.push(action.POST, {
        urlPathParams: { transferId: result.id },
        popNavigationOnSuccess: 1,
        onSuccessCallback: () => read?.refetch(),
      }),
    );
  };
  const cancel = (): void => {
    if (!result || !editable) {
      return;
    }
    void import("../cancel/definition").then(({ default: action }) =>
      navigation.push(action.POST, {
        urlPathParams: { transferId: result.id },
        popNavigationOnSuccess: 1,
        onSuccessCallback: () => read?.refetch(),
      }),
    );
  };
  const columns = [
    { id: "product", label: t("transferGet.get.response.productName") },
    {
      id: "requested",
      label: t("transferGet.get.response.quantityRequested"),
      numeric: true,
    },
    {
      id: "received",
      label: t("transferGet.get.response.quantityReceived"),
      numeric: true,
    },
  ];
  const rows = items.map((item) => {
    const product = <Span className="font-medium">{item.productName}</Span>;
    const received = (
      <Span
        className={
          item.quantityReceived > 0 ? undefined : "text-muted-foreground"
        }
      >
        {formatQuantity(item.quantityReceived, locale)}
      </Span>
    );
    return {
      id: item.id,
      cells: {
        product,
        requested: formatQuantity(item.quantityRequested, locale),
        received,
      },
      receivedOf: t("transferGet.get.widget.receivedOf", {
        received: formatQuantity(item.quantityReceived, locale),
        requested: formatQuantity(item.quantityRequested, locale),
      }),
      name: item.productName,
    };
  });
  const newTransfer = (): void => {
    void import("../../create/definition").then(({ default: create }) =>
      navigation.push(create.POST, {
        data: result
          ? {
              companyId: result.companyId,
              fromWarehouseId: result.fromWarehouseId,
              toWarehouseId: result.toWarehouseId,
            }
          : undefined,
      }),
    );
  };
  const facts = result
    ? [
        {
          key: "from",
          label: t("transferGet.get.response.fromWarehouseName"),
          value: result.fromWarehouseName,
        },
        {
          key: "to",
          label: t("transferGet.get.response.toWarehouseName"),
          value: result.toWarehouseName,
        },
        {
          key: "created",
          label: t("transferGet.get.response.createdAt"),
          value: formatDocDate(result.createdAt, locale),
        },
        ...(result.completedAt
          ? [
              {
                key: "completed",
                label: t("transferGet.get.response.completedAt"),
                value: formatDocDate(result.completedAt, locale),
              },
            ]
          : []),
        ...(result.notes
          ? [
              {
                key: "notes",
                label: t("transferGet.get.response.notes"),
                value: result.notes,
              },
            ]
          : []),
      ]
    : [];
  return (
    <AdminRecordDetail
      title={result?.reference || t("transferGet.get.titleShort")}
      subtitle={
        result
          ? `${result.fromWarehouseName} ${t("transferList.get.widget.arrowSeparator")} ${result.toWarehouseName}`
          : undefined
      }
      backButton={back}
      facts={facts}
      status={
        result
          ? {
              status: transferStatusLabel(result.status, t),
              variant: transferStatusVariant(result.status),
            }
          : undefined
      }
      primaryAction={
        interactive && editable && items.length > 0
          ? {
              key: "move",
              label: t(
                result.status === "DRAFT"
                  ? "transferGet.get.widget.dispatch"
                  : "transferGet.get.widget.receive",
              ),
              onClick: move,
            }
          : undefined
      }
      secondaryActions={
        interactive && editable
          ? [
              {
                key: "cancel",
                label: t("transferGet.get.widget.cancel"),
                onClick: cancel,
              },
            ]
          : undefined
      }
      technicalDetails={
        result
          ? [
              {
                key: "id",
                label: t("transferGet.get.response.id"),
                value: result.id,
              },
            ]
          : undefined
      }
      state={
        result
          ? { kind: "ready" }
          : response?.success === false
            ? {
                kind: "error",
                title: response.message,
                action:
                  read && interactive
                    ? {
                        label: t("transferGet.get.widget.retry"),
                        onClick: () => void read.refetch(),
                      }
                    : undefined,
              }
            : read?.isLoadingFresh
              ? { kind: "loading", label: t("transferList.get.widget.loading") }
              : {
                  kind: "empty",
                  title: t("transferGet.get.widget.select"),
                  message: t("transferGet.get.description"),
                  action: interactive
                    ? {
                        label: t("transferList.get.titleShort"),
                        onClick: browse,
                      }
                    : undefined,
                }
      }
    >
      <Div className="flex min-w-0 flex-col gap-3">
        <WidgetHeader
          title={t("transferGet.get.response.items")}
          border={false}
        />
        {rows.length ? (
          <RecordTable
            columns={columns}
            rows={rows}
            label={t("transferGet.get.response.items")}
            compact={
              <Div className="divide-y rounded-lg border bg-card">
                {rows.map(({ id, name, receivedOf }) => (
                  <Div
                    key={id}
                    className="flex min-w-0 items-baseline justify-between gap-3 px-3 py-2.5"
                  >
                    <Span className="min-w-0 break-words font-medium">
                      {name}
                    </Span>
                    <Span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                      {receivedOf}
                    </Span>
                  </Div>
                ))}
              </Div>
            }
          />
        ) : (
          <EmptyBlock
            title={t("transferGet.get.widget.noItems")}
            message={t("transferGet.get.widget.noItemsHint")}
            action={
              interactive && result?.canManage
                ? {
                    label: t("transferGet.get.widget.newTransfer"),
                    onClick: newTransfer,
                  }
                : undefined
            }
          />
        )}
      </Div>
    </AdminRecordDetail>
  );
}
