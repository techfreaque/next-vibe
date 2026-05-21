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
import type { PreauthorizedTransactionGetResponseOutput } from "./definition";

function TransactionResultCard({
  result,
  labels,
}: {
  result: PreauthorizedTransactionGetResponseOutput;
  labels: {
    id: string;
    orderId: string;
    amount: string;
    state: string;
    targetWalletId: string;
  };
}): React.JSX.Element {
  return (
    <Div className="rounded-md border p-3 mt-2 grid grid-cols-2 gap-2">
      <Div className="flex flex-col gap-0.5">
        <Span className="text-xs text-muted-foreground">{labels.id}</Span>
        <Span className="text-sm font-medium">{result.id ?? "—"}</Span>
      </Div>
      <Div className="flex flex-col gap-0.5">
        <Span className="text-xs text-muted-foreground">{labels.orderId}</Span>
        <Span className="text-sm font-medium font-mono">{result.orderId}</Span>
      </Div>
      <Div className="flex flex-col gap-0.5">
        <Span className="text-xs text-muted-foreground">{labels.amount}</Span>
        <Span className="text-sm font-medium">{result.amount}</Span>
      </Div>
      <Div className="flex flex-col gap-0.5">
        <Span className="text-xs text-muted-foreground">{labels.state}</Span>
        <Span className="text-sm font-medium">{result.state ?? "—"}</Span>
      </Div>
      <Div className="col-span-2 flex flex-col gap-0.5">
        <Span className="text-xs text-muted-foreground">
          {labels.targetWalletId}
        </Span>
        <Span className="text-sm font-medium font-mono">
          {result.targetWalletId}
        </Span>
      </Div>
    </Div>
  );
}

export function PreauthorizedTransactionGetContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const t = useWidgetTranslation<typeof definition.GET>();
  const result = useWidgetValue<typeof definition.GET>();
  const { pop } = useWidgetNavigation();
  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  const handleBack = useCallback((): void => {
    pop();
  }, [pop]);

  if (result !== null && result !== undefined && isMcp) {
    return (
      <Div className="font-mono text-sm p-2">
        {`txn id:${result.id ?? "—"} order:${result.orderId} amount:${result.amount} state:${result.state ?? "—"}`}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4 p-4">
      {!isCompact && (
        <Div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("get.widget.back")}
          </Button>
        </Div>
      )}

      <FormAlertWidget field={{}} />

      <Div className="grid grid-cols-1 gap-3">
        <Div>
          <Label className="text-xs text-muted-foreground">
            {t("get.transactionId.label")}
          </Label>
          <Input type="number" name="transactionId" />
        </Div>
      </Div>

      <SubmitButtonWidget<typeof definition.GET>
        field={{
          text: "get.submitButton.label",
          loadingText: "get.submitButton.loadingText",
          icon: "search",
          variant: "primary",
        }}
      />

      {result !== null && result !== undefined && (
        <TransactionResultCard
          result={result}
          labels={{
            id: t("get.response.id"),
            orderId: t("get.response.orderId"),
            amount: t("get.response.amount"),
            state: t("get.response.state"),
            targetWalletId: t("get.response.targetWalletId"),
          }}
        />
      )}
    </Div>
  );
}

export function PreauthorizedTransactionRevokeContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const t = useWidgetTranslation<typeof definition.DELETE>();
  const result = useWidgetValue<typeof definition.DELETE>();
  const { pop } = useWidgetNavigation();
  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  const handleBack = useCallback((): void => {
    pop();
  }, [pop]);

  if (result !== null && result !== undefined && isMcp) {
    return (
      <Div className="font-mono text-sm p-2">
        {`revoked txn id:${result.id ?? "—"} order:${result.orderId} state:${result.state ?? "—"}`}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4 p-4">
      {!isCompact && (
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
        <Div className="mt-2">
          <Span className="text-sm font-semibold text-destructive">
            {`${t("delete.widget.revokedTransaction")} #${result.id ?? "—"}`}
          </Span>
          <TransactionResultCard
            result={result}
            labels={{
              id: t("get.response.id"),
              orderId: t("get.response.orderId"),
              amount: t("get.response.amount"),
              state: t("get.response.state"),
              targetWalletId: t("get.response.targetWalletId"),
            }}
          />
        </Div>
      )}
    </Div>
  );
}
