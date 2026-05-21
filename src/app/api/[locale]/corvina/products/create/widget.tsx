"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Box } from "next-vibe-ui/ui/icons/Box";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
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
import type { ProductCreateResponseOutput } from "./definition";

function formatDate(epoch: number | null | undefined): string {
  if (epoch === null || epoch === undefined) {
    return "—";
  }
  return new Date(epoch).toLocaleDateString();
}

function ProductCreateResult({
  result,
  labels,
}: {
  result: ProductCreateResponseOutput;
  labels: {
    resultTitle: string;
    id: string;
    code: string;
    type: string;
    productLabel: string;
    dealer: string;
    trial: string;
    creationDate: string;
    lastModified: string;
    autorenewDefaultValueForNewLicenses: string;
    orgResourceId: string;
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
          <Span className="text-xs text-muted-foreground">{labels.id}</Span>
          <Div className="font-mono text-xs">{result.id}</Div>
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
          <Span className="text-xs text-muted-foreground">{labels.type}</Span>
          <Div className="font-mono text-xs">{result.type}</Div>
        </Div>

        <Div className="space-y-0.5">
          <Span className="text-xs text-muted-foreground">{labels.trial}</Span>
          <Div className="font-mono text-xs">{result.trial ? "Yes" : "No"}</Div>
        </Div>

        <Div className="space-y-0.5">
          <Span className="text-xs text-muted-foreground">
            {labels.autorenewDefaultValueForNewLicenses}
          </Span>
          <Div className="font-mono text-xs">
            {result.autorenewDefaultValueForNewLicenses ? "Yes" : "No"}
          </Div>
        </Div>

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

        {result.lastModified !== null && result.lastModified !== undefined && (
          <Div className="space-y-0.5">
            <Span className="text-xs text-muted-foreground">
              {labels.lastModified}
            </Span>
            <Div className="font-mono text-xs">
              {formatDate(result.lastModified)}
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

export function ProductCreateContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const result = useWidgetValue<typeof definition.POST>();

  const codeValue = form.watch("code") ?? "";
  const typeValue = form.watch("type") ?? "";
  const productLabelValue = form.watch("productLabel") ?? "";
  const trialValue = form.watch("trial") ?? false;
  const autorenewValue =
    form.watch("autorenewDefaultValueForNewLicenses") ?? false;
  const orgResourceIdValue = form.watch("orgResourceId") ?? "";

  const codeError = form.formState.errors.code?.message;
  const typeError = form.formState.errors.type?.message;
  const productLabelError = form.formState.errors.productLabel?.message;
  const trialError = form.formState.errors.trial?.message;
  const autorenewError =
    form.formState.errors.autorenewDefaultValueForNewLicenses?.message;
  const orgResourceIdError = form.formState.errors.orgResourceId?.message;

  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  const resultLabels = {
    resultTitle: t("post.widget.resultTitle"),
    id: t("post.response.id"),
    code: t("post.response.code"),
    type: t("post.response.type"),
    productLabel: t("post.response.productLabel"),
    dealer: t("post.response.dealer"),
    trial: t("post.response.trial"),
    creationDate: t("post.response.creationDate"),
    lastModified: t("post.response.lastModified"),
    autorenewDefaultValueForNewLicenses: t(
      "post.response.autorenewDefaultValueForNewLicenses",
    ),
    orgResourceId: t("post.response.orgResourceId"),
  };

  if (isCompact) {
    if (result !== null && result !== undefined) {
      return (
        <Div className="font-mono text-sm p-2">
          <Div>{`product #${result.id}: ${result.code} [${result.productLabel}] type:${result.type}`}</Div>
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
        <Box className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("post.widget.title")}
        </Span>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))] p-4 space-y-4">
        <Div className="grid grid-cols-2 gap-4">
          <Div className="space-y-1.5">
            <Label htmlFor="product-code">{t("post.code.label")}</Label>
            <Input
              id="product-code"
              type="text"
              value={codeValue}
              onChange={(e) =>
                form.setValue("code", e.target.value, { shouldDirty: true })
              }
              placeholder={t("post.code.placeholder")}
            />
            {codeError ? (
              <Span className="text-xs text-destructive">{codeError}</Span>
            ) : (
              <Span className="text-xs text-muted-foreground">
                {t("post.code.description")}
              </Span>
            )}
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="product-type">{t("post.type.label")}</Label>
            <Input
              id="product-type"
              type="text"
              value={typeValue}
              onChange={(e) =>
                form.setValue("type", e.target.value, { shouldDirty: true })
              }
              placeholder={t("post.type.placeholder")}
            />
            {typeError ? (
              <Span className="text-xs text-destructive">{typeError}</Span>
            ) : (
              <Span className="text-xs text-muted-foreground">
                {t("post.type.description")}
              </Span>
            )}
          </Div>
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="product-label">{t("post.productLabel.label")}</Label>
          <Input
            id="product-label"
            type="text"
            value={productLabelValue}
            onChange={(e) =>
              form.setValue("productLabel", e.target.value, {
                shouldDirty: true,
              })
            }
            placeholder={t("post.productLabel.placeholder")}
          />
          {productLabelError ? (
            <Span className="text-xs text-destructive">
              {productLabelError}
            </Span>
          ) : (
            <Span className="text-xs text-muted-foreground">
              {t("post.productLabel.description")}
            </Span>
          )}
        </Div>

        <Div className="flex items-center gap-3">
          <Checkbox
            id="product-trial"
            checked={trialValue}
            onCheckedChange={(v) => {
              form.setValue("trial", v === true, { shouldDirty: true });
            }}
          />
          <Div className="space-y-0.5">
            <Label htmlFor="product-trial" className="cursor-pointer">
              {t("post.trial.label")}
            </Label>
            {trialError ? (
              <Span className="text-xs text-destructive">{trialError}</Span>
            ) : (
              <Span className="text-xs text-muted-foreground">
                {t("post.trial.description")}
              </Span>
            )}
          </Div>
        </Div>

        <Div className="flex items-center gap-3">
          <Checkbox
            id="product-autorenew"
            checked={autorenewValue}
            onCheckedChange={(v) => {
              form.setValue("autorenewDefaultValueForNewLicenses", v === true, {
                shouldDirty: true,
              });
            }}
          />
          <Div className="space-y-0.5">
            <Label htmlFor="product-autorenew" className="cursor-pointer">
              {t("post.autorenewDefaultValueForNewLicenses.label")}
            </Label>
            {autorenewError ? (
              <Span className="text-xs text-destructive">{autorenewError}</Span>
            ) : (
              <Span className="text-xs text-muted-foreground">
                {t("post.autorenewDefaultValueForNewLicenses.description")}
              </Span>
            )}
          </Div>
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="product-org-resource-id">
            {t("post.orgResourceId.label")}
          </Label>
          <Input
            id="product-org-resource-id"
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
          <Box className="h-4 w-4" />
          {t("post.submitButton.label")}
        </Button>

        {result !== null && result !== undefined && (
          <ProductCreateResult result={result} labels={resultLabels} />
        )}
      </Div>
    </Div>
  );
}
