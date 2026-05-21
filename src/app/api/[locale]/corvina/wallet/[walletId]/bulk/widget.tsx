"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Layers } from "next-vibe-ui/ui/icons/Layers";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";
import type { WalletBulkResponseOutput } from "./definition";

type BulkItem = WalletBulkResponseOutput["items"][number];

function TransactionRow({
  item,
  compact,
  labels,
}: {
  item: BulkItem;
  compact: boolean;
  labels: {
    id: string;
    executionResult: string;
    failureReason: string;
    amount: string;
    orderId: string;
    ordinal: string;
  };
}): React.JSX.Element {
  if (compact) {
    return (
      <Div className="py-0.5 font-mono text-sm">
        {`#${item.id ?? "?"} ${item.executionResult ?? "?"}: ${item.amount ?? 0} credits ${item.orderId ?? ""}`}
      </Div>
    );
  }
  return (
    <Div className="grid grid-cols-2 gap-2 p-3 border rounded-lg text-sm">
      <Div className="flex flex-col gap-0.5">
        <Span className="text-xs text-muted-foreground">{labels.id}</Span>
        <Span className="font-mono">{item.id ?? "—"}</Span>
      </Div>
      <Div className="flex flex-col gap-0.5">
        <Span className="text-xs text-muted-foreground">
          {labels.executionResult}
        </Span>
        <Span
          className={`font-medium ${item.executionResult === "SUCCESS" ? "text-success" : item.executionResult === "FAILURE" ? "text-destructive" : "text-muted-foreground"}`}
        >
          {item.executionResult ?? "—"}
        </Span>
      </Div>
      <Div className="flex flex-col gap-0.5">
        <Span className="text-xs text-muted-foreground">{labels.amount}</Span>
        <Span className="font-mono">{item.amount ?? "—"}</Span>
      </Div>
      <Div className="flex flex-col gap-0.5">
        <Span className="text-xs text-muted-foreground">{labels.orderId}</Span>
        <Span className="font-mono">{item.orderId ?? "—"}</Span>
      </Div>
      {item.failureReason !== null && item.failureReason !== undefined && (
        <Div className="col-span-2 flex flex-col gap-0.5">
          <Span className="text-xs text-muted-foreground">
            {labels.failureReason}
          </Span>
          <Span className="text-destructive text-xs">{item.failureReason}</Span>
        </Div>
      )}
    </Div>
  );
}

export function WalletBulkContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const result = useWidgetValue<typeof definition.POST>();

  const isMcp = platform === Platform.MCP;
  const isCli = platform === Platform.CLI;
  const isCompact = isCli || isMcp;

  const targetWalletIdValue = form.watch("targetWalletId") ?? "";
  const orderIdValue = form.watch("orderId") ?? "";
  const amountValue = form.watch("amount") ?? "";
  const sourceWalletIdValue = form.watch("sourceWalletId") ?? "";
  const transferDescriptionValue = form.watch("transferDescription") ?? "";

  const transactionLabels = {
    id: t("post.response.items.id"),
    executionResult: t("post.response.items.executionResult"),
    failureReason: t("post.response.items.failureReason"),
    amount: t("post.response.items.amount"),
    orderId: t("post.response.items.orderId"),
    ordinal: t("post.response.items.ordinal"),
  };

  const items = result?.items ?? [];

  if (isCompact) {
    if (result !== null && result !== undefined) {
      return (
        <Div className="font-mono text-sm p-2">
          <Div className="font-semibold mb-1">
            {t("post.widget.title")} ({items.length})
          </Div>
          {items.length === 0 ? (
            <Div>{t("post.widget.noItems")}</Div>
          ) : (
            items.map((item, idx) => (
              <TransactionRow
                key={idx}
                item={item}
                compact={true}
                labels={transactionLabels}
              />
            ))
          )}
        </Div>
      );
    }
    return <Div />;
  }

  return (
    <Div className="flex flex-col min-h-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            pop();
          }}
          title={t("post.widget.back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Layers className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("post.widget.title")}
        </Span>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))] p-4 space-y-4">
        <Div className="grid grid-cols-2 gap-4">
          <Div className="space-y-1.5">
            <Label htmlFor="bulk-target-wallet">
              {t("post.targetWalletId.label")}
            </Label>
            <Input
              id="bulk-target-wallet"
              type="text"
              value={targetWalletIdValue}
              onChange={(e) => {
                form.setValue("targetWalletId", e.target.value, {
                  shouldDirty: true,
                });
              }}
              placeholder={t("post.targetWalletId.placeholder")}
            />
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="bulk-order-id">{t("post.orderId.label")}</Label>
            <Input
              id="bulk-order-id"
              type="text"
              value={orderIdValue}
              onChange={(e) => {
                form.setValue("orderId", e.target.value, {
                  shouldDirty: true,
                });
              }}
              placeholder={t("post.orderId.placeholder")}
            />
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="bulk-amount">{t("post.amount.label")}</Label>
            <Input
              id="bulk-amount"
              type="number"
              value={String(amountValue)}
              onChange={(e) => {
                form.setValue("amount", Number(e.target.value) as never, {
                  shouldDirty: true,
                });
              }}
              placeholder={t("post.amount.placeholder")}
            />
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="bulk-source-wallet">
              {t("post.sourceWalletId.label")}
            </Label>
            <Input
              id="bulk-source-wallet"
              type="text"
              value={sourceWalletIdValue}
              onChange={(e) => {
                form.setValue("sourceWalletId", e.target.value, {
                  shouldDirty: true,
                });
              }}
              placeholder={t("post.sourceWalletId.placeholder")}
            />
          </Div>

          <Div className="col-span-2 space-y-1.5">
            <Label htmlFor="bulk-description">
              {t("post.transferDescription.label")}
            </Label>
            <Input
              id="bulk-description"
              type="text"
              value={transferDescriptionValue}
              onChange={(e) => {
                form.setValue("transferDescription", e.target.value, {
                  shouldDirty: true,
                });
              }}
              placeholder={t("post.transferDescription.placeholder")}
            />
          </Div>
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full gap-2"
          onClick={onSubmit ?? undefined}
        >
          <Layers className="h-4 w-4" />
          {t("post.submitButton.label")}
        </Button>

        {result !== null && result !== undefined && (
          <Div className="space-y-2">
            {items.length === 0 ? (
              <Span className="text-muted-foreground text-sm">
                {t("post.widget.noItems")}
              </Span>
            ) : (
              items.map((item, idx) => (
                <TransactionRow
                  key={idx}
                  item={item}
                  compact={false}
                  labels={transactionLabels}
                />
              ))
            )}
          </Div>
        )}
      </Div>
    </Div>
  );
}
