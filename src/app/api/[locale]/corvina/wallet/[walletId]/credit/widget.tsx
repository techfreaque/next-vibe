"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Save } from "next-vibe-ui/ui/icons/Save";
import { Wallet } from "next-vibe-ui/ui/icons/Wallet";
import { Input } from "next-vibe-ui/ui/input";
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
import type { WalletCreditResponseOutput } from "./definition";

function CreditTransactionResult({
  result,
  labels,
}: {
  result: WalletCreditResponseOutput;
  labels: {
    resultTitle: string;
    success: string;
    failed: string;
    executionResult: string;
    id: string;
    amount: string;
    createdAt: string;
    failureReason: string;
    targetWalletId: string;
  };
}): React.JSX.Element {
  const isSuccess = result.executionResult === "SUCCESS";
  const isFailure = result.executionResult === "FAILURE";

  return (
    <Div className="mt-4 rounded-xl border bg-card p-4 space-y-3">
      <Div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-success" />
        <Span className="font-semibold text-sm">{labels.resultTitle}</Span>
      </Div>

      <Div className="grid grid-cols-2 gap-3 text-sm">
        <Div className="col-span-2 space-y-0.5">
          <Span className="text-xs text-muted-foreground">
            {labels.executionResult}
          </Span>
          <Div
            className={`font-mono text-xs font-semibold ${
              isSuccess
                ? "text-success"
                : isFailure
                  ? "text-destructive"
                  : "text-muted-foreground"
            }`}
          >
            {result.executionResult}
          </Div>
        </Div>

        <Div className="space-y-0.5">
          <Span className="text-xs text-muted-foreground">{labels.id}</Span>
          <Div className="font-mono text-xs">{result.id}</Div>
        </Div>

        <Div className="space-y-0.5">
          <Span className="text-xs text-muted-foreground">{labels.amount}</Span>
          <Div className="font-mono text-xs">{result.amount}</Div>
        </Div>

        {result.createdAt !== null && result.createdAt !== undefined && (
          <Div className="col-span-2 space-y-0.5">
            <Span className="text-xs text-muted-foreground">
              {labels.createdAt}
            </Span>
            <Div className="font-mono text-xs">
              {result.createdAt instanceof Date
                ? result.createdAt.toISOString()
                : String(result.createdAt)}
            </Div>
          </Div>
        )}

        {result.failureReason !== null &&
          result.failureReason !== undefined && (
            <Div className="col-span-2 space-y-0.5">
              <Span className="text-xs text-muted-foreground">
                {labels.failureReason}
              </Span>
              <Div className="text-xs text-destructive">
                {result.failureReason}
              </Div>
            </Div>
          )}

        {result.targetWalletId !== null &&
          result.targetWalletId !== undefined && (
            <Div className="col-span-2 space-y-0.5">
              <Span className="text-xs text-muted-foreground">
                {labels.targetWalletId}
              </Span>
              <Div className="font-mono text-xs">{result.targetWalletId}</Div>
            </Div>
          )}
      </Div>

      <Span className="text-xs text-muted-foreground block">
        {isSuccess ? labels.success : isFailure ? labels.failed : ""}
      </Span>
    </Div>
  );
}

export function WalletCreditContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const result = useWidgetValue<typeof definition.POST>();

  const walletIdValue = form.watch("walletId") ?? "";
  const orderIdValue = form.watch("orderId") ?? "";
  const ordinalRaw = form.watch("ordinal");
  const ordinalValue = ordinalRaw !== undefined ? String(ordinalRaw) : "";
  const authorizedByValue = form.watch("authorizedBy") ?? "";
  const amountRaw = form.watch("amount");
  const amountValue = amountRaw !== undefined ? String(amountRaw) : "";
  const sourceOrgResourceIdValue = form.watch("sourceOrgResourceId") ?? "";
  const sourceWalletIdValue = form.watch("sourceWalletId") ?? "";
  const transferDescriptionValue = form.watch("transferDescription") ?? "";
  const transactionSubjectTypeValue =
    form.watch("transactionSubjectType") ?? "";
  const transactionSubjectRefValue = form.watch("transactionSubjectRef") ?? "";
  const transactionSubjectQuantityRaw = form.watch(
    "transactionSubjectQuantity",
  );
  const transactionSubjectQuantityValue =
    transactionSubjectQuantityRaw !== undefined
      ? String(transactionSubjectQuantityRaw)
      : "";

  const walletIdError = form.formState.errors.walletId?.message;
  const orderIdError = form.formState.errors.orderId?.message;
  const amountError = form.formState.errors.amount?.message;

  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  const resultLabels = {
    resultTitle: t("post.widget.resultTitle"),
    success: t("post.widget.success"),
    failed: t("post.widget.failed"),
    executionResult: t("post.response.executionResult"),
    id: t("post.response.id"),
    amount: t("post.response.amount"),
    createdAt: t("post.response.createdAt"),
    failureReason: t("post.response.failureReason"),
    targetWalletId: t("post.response.targetWalletId"),
  };

  if (isCompact) {
    if (result !== null && result !== undefined) {
      const line = `tx #${result.id}: ${result.executionResult} amount:${result.amount}${result.failureReason !== null && result.failureReason !== undefined ? ` reason:${result.failureReason}` : ""}`;
      return (
        <Div className="font-mono text-sm p-2">
          <Div className="font-semibold mb-1">
            {t("post.widget.resultTitle")}
          </Div>
          <Div>{line}</Div>
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
        <Wallet className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("post.widget.title")}
        </Span>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))] p-4 space-y-4">
        <Div className="space-y-1.5">
          <Label htmlFor="credit-wallet-id">{t("post.walletId.label")}</Label>
          <Input
            id="credit-wallet-id"
            type="text"
            value={walletIdValue}
            onChange={(e) => {
              form.setValue("walletId", e.target.value, { shouldDirty: true });
            }}
            placeholder={t("post.walletId.placeholder")}
          />
          {walletIdError ? (
            <Span className="text-xs text-destructive">{walletIdError}</Span>
          ) : (
            <Span className="text-xs text-muted-foreground">
              {t("post.walletId.description")}
            </Span>
          )}
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="credit-order-id">{t("post.orderId.label")}</Label>
          <Input
            id="credit-order-id"
            type="text"
            value={orderIdValue}
            onChange={(e) => {
              form.setValue("orderId", e.target.value, { shouldDirty: true });
            }}
            placeholder={t("post.orderId.placeholder")}
          />
          {orderIdError ? (
            <Span className="text-xs text-destructive">{orderIdError}</Span>
          ) : (
            <Span className="text-xs text-muted-foreground">
              {t("post.orderId.description")}
            </Span>
          )}
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="credit-amount">{t("post.amount.label")}</Label>
          <Input
            id="credit-amount"
            type="text"
            value={amountValue}
            onChange={(e) => {
              const num = Number(e.target.value);
              form.setValue("amount", Number.isNaN(num) ? 0 : num, {
                shouldDirty: true,
              });
            }}
            placeholder={t("post.amount.placeholder")}
          />
          {amountError ? (
            <Span className="text-xs text-destructive">{amountError}</Span>
          ) : (
            <Span className="text-xs text-muted-foreground">
              {t("post.amount.description")}
            </Span>
          )}
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="credit-authorized-by">
            {t("post.authorizedBy.label")}
          </Label>
          <Input
            id="credit-authorized-by"
            type="text"
            value={authorizedByValue}
            onChange={(e) => {
              form.setValue("authorizedBy", e.target.value || undefined, {
                shouldDirty: true,
              });
            }}
            placeholder={t("post.authorizedBy.placeholder")}
          />
          <Span className="text-xs text-muted-foreground">
            {t("post.authorizedBy.description")}
          </Span>
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="credit-ordinal">{t("post.ordinal.label")}</Label>
          <Input
            id="credit-ordinal"
            type="text"
            value={ordinalValue}
            onChange={(e) => {
              const num = Number(e.target.value);
              form.setValue(
                "ordinal",
                e.target.value === ""
                  ? undefined
                  : Number.isNaN(num)
                    ? undefined
                    : num,
                { shouldDirty: true },
              );
            }}
            placeholder={t("post.ordinal.placeholder")}
          />
          <Span className="text-xs text-muted-foreground">
            {t("post.ordinal.description")}
          </Span>
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="credit-source-org">
            {t("post.sourceOrgResourceId.label")}
          </Label>
          <Input
            id="credit-source-org"
            type="text"
            value={sourceOrgResourceIdValue}
            onChange={(e) => {
              form.setValue(
                "sourceOrgResourceId",
                e.target.value || undefined,
                { shouldDirty: true },
              );
            }}
            placeholder={t("post.sourceOrgResourceId.placeholder")}
          />
          <Span className="text-xs text-muted-foreground">
            {t("post.sourceOrgResourceId.description")}
          </Span>
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="credit-source-wallet">
            {t("post.sourceWalletId.label")}
          </Label>
          <Input
            id="credit-source-wallet"
            type="text"
            value={sourceWalletIdValue}
            onChange={(e) => {
              form.setValue("sourceWalletId", e.target.value || undefined, {
                shouldDirty: true,
              });
            }}
            placeholder={t("post.sourceWalletId.placeholder")}
          />
          <Span className="text-xs text-muted-foreground">
            {t("post.sourceWalletId.description")}
          </Span>
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="credit-transfer-description">
            {t("post.transferDescription.label")}
          </Label>
          <Input
            id="credit-transfer-description"
            type="text"
            value={transferDescriptionValue}
            onChange={(e) => {
              form.setValue(
                "transferDescription",
                e.target.value || undefined,
                { shouldDirty: true },
              );
            }}
            placeholder={t("post.transferDescription.placeholder")}
          />
          <Span className="text-xs text-muted-foreground">
            {t("post.transferDescription.description")}
          </Span>
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="credit-subject-type">
            {t("post.transactionSubjectType.label")}
          </Label>
          <Input
            id="credit-subject-type"
            type="text"
            value={transactionSubjectTypeValue}
            onChange={(e) => {
              form.setValue(
                "transactionSubjectType",
                e.target.value || undefined,
                { shouldDirty: true },
              );
            }}
            placeholder={t("post.transactionSubjectType.placeholder")}
          />
          <Span className="text-xs text-muted-foreground">
            {t("post.transactionSubjectType.description")}
          </Span>
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="credit-subject-ref">
            {t("post.transactionSubjectRef.label")}
          </Label>
          <Input
            id="credit-subject-ref"
            type="text"
            value={transactionSubjectRefValue}
            onChange={(e) => {
              form.setValue(
                "transactionSubjectRef",
                e.target.value || undefined,
                { shouldDirty: true },
              );
            }}
            placeholder={t("post.transactionSubjectRef.placeholder")}
          />
          <Span className="text-xs text-muted-foreground">
            {t("post.transactionSubjectRef.description")}
          </Span>
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="credit-subject-quantity">
            {t("post.transactionSubjectQuantity.label")}
          </Label>
          <Input
            id="credit-subject-quantity"
            type="text"
            value={transactionSubjectQuantityValue}
            onChange={(e) => {
              const num = Number(e.target.value);
              form.setValue(
                "transactionSubjectQuantity",
                e.target.value === ""
                  ? undefined
                  : Number.isNaN(num)
                    ? undefined
                    : num,
                { shouldDirty: true },
              );
            }}
            placeholder={t("post.transactionSubjectQuantity.placeholder")}
          />
          <Span className="text-xs text-muted-foreground">
            {t("post.transactionSubjectQuantity.description")}
          </Span>
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="credit-next-renewal">
            {t("post.nextRenewalDate.label")}
          </Label>
          <Input
            id="credit-next-renewal"
            type="text"
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") {
                form.setValue("nextRenewalDate", undefined, {
                  shouldDirty: true,
                });
              } else {
                const parsed = new Date(val);
                if (!Number.isNaN(parsed.getTime())) {
                  form.setValue("nextRenewalDate", parsed, {
                    shouldDirty: true,
                  });
                }
              }
            }}
            placeholder={t("post.nextRenewalDate.placeholder")}
          />
          <Span className="text-xs text-muted-foreground">
            {t("post.nextRenewalDate.description")}
          </Span>
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full gap-2"
          onClick={onSubmit ?? undefined}
        >
          <Save className="h-4 w-4" />
          {t("post.submitButton.label")}
        </Button>

        {result !== null && result !== undefined && (
          <CreditTransactionResult result={result} labels={resultLabels} />
        )}
      </Div>
    </Div>
  );
}
