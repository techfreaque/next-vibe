"use client";

import { Button } from "next-vibe-ui/ui/button";
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
import type { LicensesActivationResponseOutput } from "./definition";

function formatDate(epoch: number | null | undefined): string {
  if (epoch === null || epoch === undefined) {
    return "—";
  }
  return new Date(epoch).toLocaleDateString();
}

function LicensesActivationResult({
  result,
  labels,
}: {
  result: LicensesActivationResponseOutput;
  labels: {
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
        <Span className="font-semibold text-sm">{labels.code}</Span>
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

        {result.activationDate !== null &&
          result.activationDate !== undefined && (
            <Div className="space-y-0.5">
              <Span className="text-xs text-muted-foreground">
                {labels.activationDate}
              </Span>
              <Div className="font-mono text-xs">
                {formatDate(result.activationDate)}
              </Div>
            </Div>
          )}

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

        {result.orgResourceIdResponse !== null &&
          result.orgResourceIdResponse !== undefined && (
            <Div className="col-span-2 space-y-0.5">
              <Span className="text-xs text-muted-foreground">
                {labels.orgResourceId}
              </Span>
              <Div className="font-mono text-xs">
                {result.orgResourceIdResponse}
              </Div>
            </Div>
          )}
      </Div>
    </Div>
  );
}

export function LicensesActivationContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const result = useWidgetValue<typeof definition.POST>();

  const licenseCodeValue = form.watch("licenseCode") ?? "";
  const orgResourceIdValue = form.watch("orgResourceId") ?? "";

  const licenseCodeError = form.formState.errors.licenseCode?.message;
  const orgResourceIdError = form.formState.errors.orgResourceId?.message;

  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  const resultLabels = {
    licenseId: t("post.response.licenseId"),
    productLabel: t("post.response.productLabel"),
    productCode: t("post.response.productCode"),
    productType: t("post.response.productType"),
    code: t("post.response.code"),
    autorenew: t("post.response.autorenew"),
    expirationDate: t("post.response.expirationDate"),
    activationDate: t("post.response.activationDate"),
    creationDate: t("post.response.creationDate"),
    orgResourceId: t("post.response.orgResourceId"),
    price: t("post.response.price"),
    currency: t("post.response.currency"),
  };

  if (isCompact) {
    if (result !== null && result !== undefined) {
      return (
        <Div className="font-mono text-sm p-2">
          <Div>{`license #${result.licenseId}: ${result.code} → ${result.productCode} org:${result.orgResourceIdResponse ?? "—"}`}</Div>
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
          <Label htmlFor="activation-license-code">
            {t("post.licenseCode.label")}
          </Label>
          <Input
            id="activation-license-code"
            type="text"
            value={licenseCodeValue}
            onChange={(e) =>
              form.setValue("licenseCode", e.target.value, {
                shouldDirty: true,
              })
            }
            placeholder={t("post.licenseCode.placeholder")}
          />
          {licenseCodeError ? (
            <Span className="text-xs text-destructive">{licenseCodeError}</Span>
          ) : (
            <Span className="text-xs text-muted-foreground">
              {t("post.licenseCode.description")}
            </Span>
          )}
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="activation-org-resource-id">
            {t("post.orgResourceId.label")}
          </Label>
          <Input
            id="activation-org-resource-id"
            type="text"
            value={orgResourceIdValue}
            onChange={(e) =>
              form.setValue("orgResourceId", e.target.value || undefined, {
                shouldDirty: true,
              })
            }
            placeholder={t("post.orgResourceId.placeholder")}
          />
          {orgResourceIdError ? (
            <Span className="text-xs text-destructive">
              {orgResourceIdError}
            </Span>
          ) : (
            <Span className="text-xs text-muted-foreground">
              {t("post.orgResourceId.description")}
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
          <LicensesActivationResult result={result} labels={resultLabels} />
        )}
      </Div>
    </Div>
  );
}
