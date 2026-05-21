"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { XCircle } from "next-vibe-ui/ui/icons/XCircle";
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

export function WalletTransferContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const result = useWidgetValue<typeof definition.POST>();

  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  const sourceWalletIdValue = form.watch("sourceWalletId") ?? "";
  const targetWalletIdValue = form.watch("targetWalletId") ?? "";
  const amountValue = String(form.watch("amount") ?? "");
  const orderIdValue = form.watch("orderId") ?? "";
  const ordinalValue = String(form.watch("ordinal") ?? "");
  const authorizedByValue = form.watch("authorizedBy") ?? "";
  const sourceOrgValue = form.watch("sourceOrgResourceId") ?? "";
  const descValue = form.watch("transferDescription") ?? "";

  const sourceWalletIdError = form.formState.errors.sourceWalletId?.message;
  const targetWalletIdError = form.formState.errors.targetWalletId?.message;
  const amountError = form.formState.errors.amount?.message;

  if (isCompact) {
    if (result !== null && result !== undefined) {
      const success = result.executionResult === "SUCCESS";
      return (
        <Div className="font-mono text-sm p-2">
          <Div className="font-semibold mb-1">
            {t("post.widget.resultTitle")}
          </Div>
          <Div>{`tx #${result.id}: ${result.executionResult} amount:${result.amount}${result.failureReason ? ` reason:${result.failureReason}` : ""}`}</Div>
          {success && (
            <Div>{`${result.sourceWalletId} → ${result.targetWalletId}`}</Div>
          )}
        </Div>
      );
    }
    return <Div />;
  }

  const isSuccess =
    result !== null &&
    result !== undefined &&
    result.executionResult === "SUCCESS";
  const isFailure =
    result !== null &&
    result !== undefined &&
    result.executionResult !== "SUCCESS";

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
        <Span className="font-semibold text-sm mr-auto">
          {t("post.widget.title")}
        </Span>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))] p-4 space-y-4">
        <Div className="grid grid-cols-2 gap-4">
          <Div className="space-y-1.5">
            <Label htmlFor="transfer-source">
              {t("post.sourceWalletId.label")}
            </Label>
            <Input
              id="transfer-source"
              type="text"
              value={sourceWalletIdValue}
              onChange={(e) => {
                form.setValue("sourceWalletId", e.target.value, {
                  shouldDirty: true,
                });
              }}
              placeholder={t("post.sourceWalletId.placeholder")}
            />
            {sourceWalletIdError ? (
              <Span className="text-xs text-destructive">
                {sourceWalletIdError}
              </Span>
            ) : (
              <Span className="text-xs text-muted-foreground">
                {t("post.sourceWalletId.description")}
              </Span>
            )}
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="transfer-target">
              {t("post.targetWalletId.label")}
            </Label>
            <Input
              id="transfer-target"
              type="text"
              value={targetWalletIdValue}
              onChange={(e) => {
                form.setValue("targetWalletId", e.target.value, {
                  shouldDirty: true,
                });
              }}
              placeholder={t("post.targetWalletId.placeholder")}
            />
            {targetWalletIdError ? (
              <Span className="text-xs text-destructive">
                {targetWalletIdError}
              </Span>
            ) : (
              <Span className="text-xs text-muted-foreground">
                {t("post.targetWalletId.description")}
              </Span>
            )}
          </Div>
        </Div>

        <Div className="grid grid-cols-2 gap-4">
          <Div className="space-y-1.5">
            <Label htmlFor="transfer-amount">{t("post.amount.label")}</Label>
            <Input
              id="transfer-amount"
              type="text"
              value={amountValue}
              onChange={(e) => {
                const v = e.target.value;
                const n = Number(v);
                if (!isNaN(n)) {
                  form.setValue("amount", n, { shouldDirty: true });
                }
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
            <Label htmlFor="transfer-orderId">{t("post.orderId.label")}</Label>
            <Input
              id="transfer-orderId"
              type="text"
              value={orderIdValue}
              onChange={(e) => {
                form.setValue("orderId", e.target.value || undefined, {
                  shouldDirty: true,
                });
              }}
              placeholder={t("post.orderId.placeholder")}
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.orderId.description")}
            </Span>
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="transfer-ordinal">{t("post.ordinal.label")}</Label>
            <Input
              id="transfer-ordinal"
              type="text"
              value={ordinalValue}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "") {
                  form.setValue("ordinal", undefined, { shouldDirty: true });
                } else {
                  const n = Number(v);
                  if (!isNaN(n)) {
                    form.setValue("ordinal", n, { shouldDirty: true });
                  }
                }
              }}
              placeholder={t("post.ordinal.placeholder")}
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.ordinal.description")}
            </Span>
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="transfer-authorizedBy">
              {t("post.authorizedBy.label")}
            </Label>
            <Input
              id="transfer-authorizedBy"
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
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="transfer-sourceOrg">
            {t("post.sourceOrgResourceId.label")}
          </Label>
          <Input
            id="transfer-sourceOrg"
            type="text"
            value={sourceOrgValue}
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
          <Label htmlFor="transfer-desc">
            {t("post.transferDescription.label")}
          </Label>
          <Input
            id="transfer-desc"
            type="text"
            value={descValue}
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

        <Button
          type="button"
          variant="default"
          className="w-full gap-2"
          onClick={onSubmit ?? undefined}
        >
          {t("post.submitButton.label")}
        </Button>

        {result !== null && result !== undefined && (
          <Div className="mt-4 rounded-xl border bg-card p-4 space-y-3">
            <Div className="flex items-center gap-2">
              {isSuccess ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <XCircle className="h-4 w-4 text-destructive" />
              )}
              <Span className="font-semibold text-sm">
                {t("post.widget.resultTitle")}
              </Span>
              <Span
                className={`ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  isSuccess
                    ? "bg-success/10 text-success"
                    : isFailure
                      ? "bg-destructive/10 text-destructive"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {result.executionResult}
              </Span>
            </Div>

            <Div className="grid grid-cols-2 gap-3 text-sm">
              <Div className="space-y-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.id")}
                </Span>
                <Div className="font-mono text-xs">{result.id}</Div>
              </Div>
              <Div className="space-y-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.amount")}
                </Span>
                <Div className="font-mono text-xs font-semibold">
                  {result.amount}
                </Div>
              </Div>
              <Div className="space-y-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.sourceWalletId")}
                </Span>
                <Div className="font-mono text-xs">{result.sourceWalletId}</Div>
              </Div>
              <Div className="space-y-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.targetWalletId")}
                </Span>
                <Div className="font-mono text-xs">{result.targetWalletId}</Div>
              </Div>
              {result.failureReason !== null &&
                result.failureReason !== undefined && (
                  <Div className="col-span-2 space-y-0.5">
                    <Span className="text-xs text-muted-foreground">
                      {t("post.response.failureReason")}
                    </Span>
                    <Div className="text-xs text-destructive">
                      {result.failureReason}
                    </Div>
                  </Div>
                )}
            </Div>
          </Div>
        )}
      </Div>
    </Div>
  );
}
