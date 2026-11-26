"use client";

import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatQuantity } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useApiQuery } from "next-vibe/unified-ui/hooks/use-api-query";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX, ReactNode } from "react";
import { z } from "zod";

import getDefinition from "./[transferId]/get/definition";
import { transferStatusLabel, transferStatusVariant } from "./status";

export function TransferAction({
  action,
  transferId,
  completed,
  picker,
  submit,
}: {
  action: "dispatch" | "receive" | "cancel";
  transferId: string;
  completed: boolean;
  picker: ReactNode;
  submit: ReactNode;
}): JSX.Element {
  const t = useWidgetTranslation<typeof getDefinition.GET>();
  const navigation = useWidgetNavigation();
  const interactive = useWidgetIsInteractive();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const locale = useWidgetLocale();
  const valid = z.uuid().safeParse(transferId).success;
  const query = useApiQuery({
    endpoint: getDefinition.GET,
    urlPathParams: { transferId },
    options: { enabled: interactive && valid && !completed },
    logger,
    user,
  });
  const transfer =
    query.data?.result.id === transferId ? query.data.result : undefined;
  const dispatch = action === "dispatch";
  const expected =
    action === "cancel"
      ? ["DRAFT", "IN_TRANSIT"]
      : [dispatch ? "DRAFT" : "IN_TRANSIT"];
  const copy = {
    dispatch: {
      title: "transferGet.get.widget.dispatch",
      description: "transferDispatch.post.description",
      success: "transferDispatch.post.success.title",
      conflict: "transferDispatch.post.errors.conflict.description",
    },
    receive: {
      title: "transferGet.get.widget.receive",
      description: "transferReceive.post.description",
      success: "transferReceive.post.success.title",
      conflict: "transferReceive.post.errors.conflict.description",
    },
    cancel: {
      title: "transferGet.get.widget.cancel",
      description: "transferCancel.post.description",
      success: "transferCancel.post.success.title",
      conflict: "transferCancel.post.errors.conflict.description",
    },
  } as const;
  const title = t(copy[action].title);
  const back = (): void => {
    if (navigation.canGoBack) {
      navigation.pop();
    } else if (valid) {
      navigation.push(getDefinition.GET, { urlPathParams: { transferId } });
    } else {
      void import("./list/definition").then(({ default: list }) =>
        navigation.push(list.GET),
      );
    }
  };
  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={title}
        subtitle={t(copy[action].description)}
        backButton={
          interactive && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="self-start gap-1.5 -ml-2"
              onClick={back}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              {t(
                valid
                  ? "transferDispatch.post.widget.backToTransfer"
                  : "transferList.get.titleShort",
              )}
            </Button>
          )
        }
      />
      <FormAlertWidget field={{}} />
      {completed ? (
        <ResultBanner variant="success" title={t(copy[action].success)}>
          {interactive && (
            <Button type="button" size="sm" variant="outline" onClick={back}>
              {t("transferDispatch.post.widget.backToTransfer")}
            </Button>
          )}
        </ResultBanner>
      ) : !valid ? (
        picker
      ) : query.error ? (
        <EmptyBlock
          title={query.error.message}
          action={{
            label: t("transferGet.get.widget.retry"),
            onClick: () => void query.refetch(),
          }}
        />
      ) : !transfer ? (
        <Skeleton className="h-24 w-full" />
      ) : (
        <Div className="flex min-w-0 flex-col gap-4 rounded-lg border bg-card p-4">
          <WidgetHeader
            title={transfer.reference || t("transferGet.get.titleShort")}
            border={false}
            titleAccessory={
              <StatusPill
                status={transferStatusLabel(transfer.status, t)}
                variant={transferStatusVariant(transfer.status)}
              />
            }
          />
          <DetailGrid>
            <DetailField
              label={t("transferGet.get.response.fromWarehouseName")}
              value={transfer.fromWarehouseName}
            />
            <DetailField
              label={t("transferGet.get.response.toWarehouseName")}
              value={transfer.toWarehouseName}
            />
          </DetailGrid>
          {transfer.items.length > 0 && (
            <Div className="divide-y rounded-md border">
              {transfer.items.map((item) => (
                <Div
                  key={item.id}
                  className="flex min-w-0 items-baseline justify-between gap-3 px-3 py-2 text-sm"
                >
                  <Span className="min-w-0 break-words">
                    {item.productName}
                  </Span>
                  <Span className="shrink-0 tabular-nums text-muted-foreground">
                    {formatQuantity(item.quantityRequested, locale)}
                  </Span>
                </Div>
              ))}
            </Div>
          )}
          {!expected.includes(transfer.status) ? (
            <EmptyBlock title={t(copy[action].conflict)} />
          ) : !transfer.canManage ? (
            <EmptyBlock
              title={t("transferDispatch.post.errors.forbidden.title")}
            />
          ) : action !== "cancel" && !transfer.items.length ? (
            <EmptyBlock title={t("transferGet.get.widget.noItems")} />
          ) : (
            <Div className="self-end">{submit}</Div>
          )}
        </Div>
      )}
    </WidgetShell>
  );
}
