"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Key } from "next-vibe-ui/ui/icons/Key";
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
import type { LicenseCreateResponseOutput } from "./definition";

function formatDate(epoch: number | null | undefined): string {
  if (epoch === null || epoch === undefined) {
    return "—";
  }
  return new Date(epoch).toLocaleDateString();
}

function LicenseCreateResult({
  result,
  labels,
}: {
  result: LicenseCreateResponseOutput;
  labels: {
    resultTitle: string;
    licenseId: string;
    productLabel: string;
    productCode: string;
    productType: string;
    code: string;
    autorenew: string;
    expirationDate: string;
    activationDate: string;
    creationDate: string;
    orgResourceId: string;
    price: string;
    currency: string;
  };
}): React.JSX.Element {
  return (
    <Div className="mt-4 rounded-xl border bg-card p-4 space-y-3">
      <Div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-success" />
        <Span className="font-semibold text-sm">{labels.resultTitle}</Span>
      </Div>

      <Div className="grid grid-cols-2 gap-3 text-sm">
        <Div className="space-y-0.5">
          <Span className="text-xs text-muted-foreground">
            {labels.licenseId}
          </Span>
          <Div className="font-mono text-xs">{result.licenseId}</Div>
        </Div>

        <Div className="space-y-0.5">
          <Span className="text-xs text-muted-foreground">{labels.code}</Span>
          <Div className="font-mono text-xs">{result.code}</Div>
        </Div>

        <Div className="space-y-0.5">
          <Span className="text-xs text-muted-foreground">
            {labels.productLabel}
          </Span>
          <Div className="font-mono text-xs">{result.productLabel}</Div>
        </Div>

        <Div className="space-y-0.5">
          <Span className="text-xs text-muted-foreground">
            {labels.productCode}
          </Span>
          <Div className="font-mono text-xs">{result.productCode}</Div>
        </Div>

        <Div className="space-y-0.5">
          <Span className="text-xs text-muted-foreground">
            {labels.productType}
          </Span>
          <Div className="font-mono text-xs">{result.productType}</Div>
        </Div>

        <Div className="space-y-0.5">
          <Span className="text-xs text-muted-foreground">
            {labels.autorenew}
          </Span>
          <Div className="font-mono text-xs">
            {result.autorenew ? "Yes" : "No"}
          </Div>
        </Div>

        {result.expirationDate !== null &&
          result.expirationDate !== undefined && (
            <Div className="space-y-0.5">
              <Span className="text-xs text-muted-foreground">
                {labels.expirationDate}
              </Span>
              <Div className="font-mono text-xs">
                {formatDate(result.expirationDate)}
              </Div>
            </Div>
          )}

        {result.creationDate !== null && result.creationDate !== undefined && (
          <Div className="space-y-0.5">
            <Span className="text-xs text-muted-foreground">
              {labels.creationDate}
            </Span>
            <Div className="font-mono text-xs">
              {formatDate(result.creationDate)}
            </Div>
          </Div>
        )}

        {result.price !== null && result.price !== undefined && (
          <Div className="space-y-0.5">
            <Span className="text-xs text-muted-foreground">
              {labels.price}
            </Span>
            <Div className="font-mono text-xs">
              {result.price} {result.currency ?? ""}
            </Div>
          </Div>
        )}

        {result.orgResourceId !== null &&
          result.orgResourceId !== undefined && (
            <Div className="col-span-2 space-y-0.5">
              <Span className="text-xs text-muted-foreground">
                {labels.orgResourceId}
              </Span>
              <Div className="font-mono text-xs">{result.orgResourceId}</Div>
            </Div>
          )}
      </Div>
    </Div>
  );
}

export function LicenseCreateContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const result = useWidgetValue<typeof definition.POST>();

  const productIdValue = form.watch("productId");
  const autorenewValue = form.watch("autorenew") ?? false;
  const expirationDateValue = form.watch("expirationDate");
  const priceValue = form.watch("price");
  const currencyValue = form.watch("currency") ?? "";
  const externalRefValue = form.watch("externalRef") ?? "";
  const targetOrgResourceIdValue = form.watch("targetOrgResourceId") ?? "";

  const productIdError = form.formState.errors.productId?.message;
  const autorenewError = form.formState.errors.autorenew?.message;
  const expirationDateError = form.formState.errors.expirationDate?.message;
  const priceError = form.formState.errors.price?.message;
  const currencyError = form.formState.errors.currency?.message;
  const externalRefError = form.formState.errors.externalRef?.message;
  const targetOrgResourceIdError =
    form.formState.errors.targetOrgResourceId?.message;

  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  const resultLabels = {
    resultTitle: t("post.widget.resultTitle"),
    licenseId: t("post.response.licenseId"),
    productLabel: t("post.response.productLabel"),
    productCode: t("post.response.productCode"),
    productType: t("post.response.productType"),
    code: t("post.response.code"),
    autorenew: t("post.autorenew.label"),
    expirationDate: t("post.expirationDate.label"),
    activationDate: t("post.response.activationDate"),
    creationDate: t("post.response.creationDate"),
    orgResourceId: t("post.response.orgResourceId"),
    price: t("post.price.label"),
    currency: t("post.currency.label"),
  };

  if (isCompact) {
    if (result !== null && result !== undefined) {
      return (
        <Div className="font-mono text-sm p-2">
          <Div className="font-semibold mb-1">
            {t("post.widget.resultTitle")}
          </Div>
          <Div>{`license #${result.licenseId}: ${result.code} [${result.productLabel}] autorenew:${result.autorenew ? "Y" : "N"}`}</Div>
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
        <Key className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("post.widget.title")}
        </Span>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))] p-4 space-y-4">
        <Div className="space-y-1.5">
          <Label htmlFor="license-product-id">
            {t("post.productId.label")}
          </Label>
          <Input
            id="license-product-id"
            type="text"
            value={productIdValue !== undefined ? String(productIdValue) : ""}
            onChange={(e) => {
              const parsed = Number(e.target.value);
              if (!isNaN(parsed)) {
                form.setValue("productId", parsed, { shouldDirty: true });
              }
            }}
            placeholder={t("post.productId.placeholder")}
          />
          {productIdError ? (
            <Span className="text-xs text-destructive">{productIdError}</Span>
          ) : (
            <Span className="text-xs text-muted-foreground">
              {t("post.productId.description")}
            </Span>
          )}
        </Div>

        <Div className="flex items-center gap-3">
          <Checkbox
            id="license-autorenew"
            checked={autorenewValue}
            onCheckedChange={(v) => {
              form.setValue("autorenew", v === true, { shouldDirty: true });
            }}
          />
          <Div className="space-y-0.5">
            <Label htmlFor="license-autorenew" className="cursor-pointer">
              {t("post.autorenew.label")}
            </Label>
            {autorenewError ? (
              <Span className="text-xs text-destructive">{autorenewError}</Span>
            ) : (
              <Span className="text-xs text-muted-foreground">
                {t("post.autorenew.description")}
              </Span>
            )}
          </Div>
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="license-expiration-date">
            {t("post.expirationDate.label")}
          </Label>
          <Input
            id="license-expiration-date"
            type="text"
            value={
              expirationDateValue !== undefined && expirationDateValue !== null
                ? String(expirationDateValue)
                : ""
            }
            onChange={(e) => {
              const v = e.target.value;
              if (v === "") {
                form.setValue("expirationDate", undefined, {
                  shouldDirty: true,
                });
              } else {
                const parsed = Number(v);
                if (!isNaN(parsed)) {
                  form.setValue("expirationDate", parsed, {
                    shouldDirty: true,
                  });
                }
              }
            }}
            placeholder={t("post.expirationDate.placeholder")}
          />
          {expirationDateError ? (
            <Span className="text-xs text-destructive">
              {expirationDateError}
            </Span>
          ) : (
            <Span className="text-xs text-muted-foreground">
              {t("post.expirationDate.description")}
            </Span>
          )}
        </Div>

        <Div className="grid grid-cols-2 gap-4">
          <Div className="space-y-1.5">
            <Label htmlFor="license-price">{t("post.price.label")}</Label>
            <Input
              id="license-price"
              type="text"
              value={
                priceValue !== undefined && priceValue !== null
                  ? String(priceValue)
                  : ""
              }
              onChange={(e) => {
                const v = e.target.value;
                if (v === "") {
                  form.setValue("price", undefined, { shouldDirty: true });
                } else {
                  const parsed = Number(v);
                  if (!isNaN(parsed)) {
                    form.setValue("price", parsed, { shouldDirty: true });
                  }
                }
              }}
              placeholder={t("post.price.placeholder")}
            />
            {priceError ? (
              <Span className="text-xs text-destructive">{priceError}</Span>
            ) : (
              <Span className="text-xs text-muted-foreground">
                {t("post.price.description")}
              </Span>
            )}
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="license-currency">{t("post.currency.label")}</Label>
            <Input
              id="license-currency"
              type="text"
              value={currencyValue}
              onChange={(e) =>
                form.setValue("currency", e.target.value || undefined, {
                  shouldDirty: true,
                })
              }
              placeholder={t("post.currency.placeholder")}
            />
            {currencyError ? (
              <Span className="text-xs text-destructive">{currencyError}</Span>
            ) : (
              <Span className="text-xs text-muted-foreground">
                {t("post.currency.description")}
              </Span>
            )}
          </Div>
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="license-external-ref">
            {t("post.externalRef.label")}
          </Label>
          <Input
            id="license-external-ref"
            type="text"
            value={externalRefValue}
            onChange={(e) =>
              form.setValue("externalRef", e.target.value || undefined, {
                shouldDirty: true,
              })
            }
            placeholder={t("post.externalRef.placeholder")}
          />
          {externalRefError ? (
            <Span className="text-xs text-destructive">{externalRefError}</Span>
          ) : (
            <Span className="text-xs text-muted-foreground">
              {t("post.externalRef.description")}
            </Span>
          )}
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="license-target-org">
            {t("post.targetOrgResourceId.label")}
          </Label>
          <Input
            id="license-target-org"
            type="text"
            value={targetOrgResourceIdValue}
            onChange={(e) =>
              form.setValue(
                "targetOrgResourceId",
                e.target.value || undefined,
                { shouldDirty: true },
              )
            }
            placeholder={t("post.targetOrgResourceId.placeholder")}
          />
          {targetOrgResourceIdError ? (
            <Span className="text-xs text-destructive">
              {targetOrgResourceIdError}
            </Span>
          ) : (
            <Span className="text-xs text-muted-foreground">
              {t("post.targetOrgResourceId.description")}
            </Span>
          )}
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full gap-2"
          onClick={onSubmit ?? undefined}
        >
          <Key className="h-4 w-4" />
          {t("post.submitButton.label")}
        </Button>

        {result !== null && result !== undefined && (
          <LicenseCreateResult result={result} labels={resultLabels} />
        )}
      </Div>
    </Div>
  );
}
