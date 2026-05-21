"use client";

import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";

type ListItem =
  (typeof definition.GET)["types"]["ResponseOutput"]["items"][number];

function TransactionRow({
  item,
  compact,
}: {
  item: ListItem;
  compact: boolean;
}): React.JSX.Element {
  if (compact) {
    return (
      <Div className="py-1 text-sm font-mono">
        {`id:${item.id ?? "—"} order:${item.orderId} amount:${item.amount} state:${item.state ?? "—"}`}
      </Div>
    );
  }
  return (
    <Div className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-accent transition-colors">
      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-semibold text-sm font-mono">
            {item.orderId}
          </Span>
          <Span className="text-xs text-muted-foreground">
            {item.state ?? "—"}
          </Span>
        </Div>
        <Div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground font-mono flex-wrap">
          <Span>{`id:${item.id ?? "—"}`}</Span>
          <Span>{`amount:${item.amount}`}</Span>
          <Span>{`wallet:${item.targetWalletId}`}</Span>
        </Div>
      </Div>
    </Div>
  );
}

export function PreauthorizedTransactionsListContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const items = data?.items ?? [];
  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  const handleBack = useCallback((): void => {
    pop();
  }, [pop]);

  if (isCompact) {
    if (!data) {
      return <Div />;
    }
    return (
      <Div className="font-mono text-sm p-2">
        <Div className="font-semibold mb-1">
          {t("get.widget.title")} ({data.total})
        </Div>
        {items.length === 0 ? (
          <Div className="text-muted-foreground">
            {t("get.widget.noItemsFound")}
          </Div>
        ) : (
          items.map((item, idx) => (
            <TransactionRow key={idx} item={item} compact={true} />
          ))
        )}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col min-h-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBack}
          title={t("get.widget.back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Span className="font-semibold text-sm mr-auto">
          {t("get.widget.title")}
          {data !== null && data !== undefined && (
            <Span className="ml-2 text-xs text-muted-foreground font-normal">
              ({data.total})
            </Span>
          )}
        </Span>
      </Div>

      <FormAlertWidget field={{}} />

      <SubmitButtonWidget<typeof definition.GET>
        field={{
          text: "get.submitButton.label",
          loadingText: "get.submitButton.loadingText",
          icon: "list",
          variant: "primary",
        }}
      />

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))]">
        {items.length === 0 ? (
          <Div className="h-48 flex items-center justify-center text-muted-foreground">
            <Span className="text-sm">{t("get.widget.noItemsFound")}</Span>
          </Div>
        ) : (
          items.map((item, idx) => (
            <TransactionRow key={idx} item={item} compact={false} />
          ))
        )}
      </Div>
    </Div>
  );
}

export function PreauthorizedTransactionsBulkCreateContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const t = useWidgetTranslation<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>();
  const { pop } = useWidgetNavigation();
  const isMcp = platform === Platform.MCP;

  const handleBack = useCallback((): void => {
    pop();
  }, [pop]);

  if (result !== null && result !== undefined && isMcp) {
    const first = result.items[0];
    return (
      <Div className="font-mono text-sm p-2">
        {`created ${result.items.length} txn(s)${first !== undefined ? ` first:id=${first.id ?? "—"} order=${first.orderId}` : ""}`}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4 p-4">
      {platform === Platform.WEB && (
        <Div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("post.widget.back")}
          </Button>
        </Div>
      )}

      <FormAlertWidget field={{}} />

      <Div className="grid grid-cols-2 gap-3">
        <Div className="col-span-1">
          <Label className="text-xs text-muted-foreground">
            {t("post.orderId.label")}
          </Label>
          <Input type="text" name="orderId" />
        </Div>
        <Div className="col-span-1">
          <Label className="text-xs text-muted-foreground">
            {t("post.targetWalletId.label")}
          </Label>
          <Input type="text" name="targetWalletId" />
        </Div>
        <Div className="col-span-1">
          <Label className="text-xs text-muted-foreground">
            {t("post.amount.label")}
          </Label>
          <Input type="number" name="amount" />
        </Div>
        <Div className="col-span-1">
          <Label className="text-xs text-muted-foreground">
            {t("post.ordinal.label")}
          </Label>
          <Input type="number" name="ordinal" />
        </Div>
        <Div className="col-span-1">
          <Label className="text-xs text-muted-foreground">
            {t("post.sourceWalletId.label")}
          </Label>
          <Input type="text" name="sourceWalletId" />
        </Div>
        <Div className="col-span-1">
          <Label className="text-xs text-muted-foreground">
            {t("post.txDescription.label")}
          </Label>
          <Input type="text" name="txDescription" />
        </Div>
      </Div>

      <SubmitButtonWidget<typeof definition.POST>
        field={{
          text: "post.submitButton.label",
          loadingText: "post.submitButton.loadingText",
          icon: "plus-circle",
          variant: "primary",
        }}
      />

      {result !== null && result !== undefined && result.items.length > 0 && (
        <Div className="rounded-md border p-3 mt-2">
          <Span className="text-xs text-muted-foreground font-semibold">
            {`${result.items.length} transaction(s) created`}
          </Span>
        </Div>
      )}
    </Div>
  );
}

export function PreauthorizedTransactionsBulkRevokeContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const t = useWidgetTranslation<typeof definition.DELETE>();
  const result = useWidgetValue<typeof definition.DELETE>();
  const { pop } = useWidgetNavigation();
  const isMcp = platform === Platform.MCP;

  const handleBack = useCallback((): void => {
    pop();
  }, [pop]);

  if (result !== null && result !== undefined && isMcp) {
    return (
      <Div className="font-mono text-sm p-2">
        {`revoked ${result.items.length} txn(s)`}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4 p-4">
      {platform === Platform.WEB && (
        <Div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("delete.widget.back")}
          </Button>
        </Div>
      )}

      <FormAlertWidget field={{}} />

      <Div className="grid grid-cols-1 gap-3">
        <Div>
          <Label className="text-xs text-muted-foreground">
            {t("delete.transactionId.label")}
          </Label>
          <Input type="number" name="transactionId" />
        </Div>
      </Div>

      <SubmitButtonWidget<typeof definition.DELETE>
        field={{
          text: "delete.submitButton.label",
          loadingText: "delete.submitButton.loadingText",
          icon: "x-circle",
          variant: "destructive",
        }}
      />

      {result !== null && result !== undefined && (
        <Div className="rounded-md border p-3 mt-2">
          <Span className="text-sm font-semibold text-destructive">
            {`${result.items.length} transaction(s) revoked`}
          </Span>
        </Div>
      )}
    </Div>
  );
}
