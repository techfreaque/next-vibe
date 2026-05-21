"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";

import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import { Save } from "next-vibe-ui/ui/icons/Save";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";

import type definition from "./definition";

function formatDate(epoch: number | null | undefined): string {
  if (epoch === null || epoch === undefined) {
    return "—";
  }
  return new Date(epoch).toLocaleDateString();
}

function ProductField({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}): React.JSX.Element {
  return (
    <Div className="flex flex-col gap-0.5">
      <Span className="text-xs text-muted-foreground">{label}</Span>
      <Span className={`text-sm font-medium${mono ? " font-mono" : ""}`}>
        {value}
      </Span>
    </Div>
  );
}

function ProductBadge({
  value,
  active,
}: {
  value: string;
  active?: boolean;
}): React.JSX.Element {
  return (
    <Span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
      }`}
    >
      {value}
    </Span>
  );
}

export function ProductDetailContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const isMcp = platform === Platform.MCP;

  if (!data) {
    return <Div />;
  }

  if (isMcp) {
    const parts = [
      `product #${data.productId}: ${data.code} [${data.label}]`,
      `  type:${data.type} trial:${data.trial ? "Y" : "N"} dealer:${data.dealer ? "Y" : "N"}`,
      `  autorenew-default:${data.autorenewDefaultValueForNewLicenses ? "Y" : "N"}`,
      data.orgResourceId ? `  org:${data.orgResourceId}` : "",
    ].filter(Boolean);
    return (
      <Div className="font-mono text-sm p-2 whitespace-pre">
        {parts.join("\n")}
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
          onClick={() => {
            pop();
          }}
          title={t("get.widget.back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Span className="font-semibold text-sm mr-auto">
          {t("get.widget.title")}
        </Span>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))] p-4 space-y-4">
        <Div className="flex items-center gap-3">
          <Div className="flex-1 min-w-0">
            <Div className="flex items-center gap-2 flex-wrap">
              <Span className="font-semibold">{data.label}</Span>
              <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {data.type}
              </Span>
              {data.trial && (
                <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                  {t("get.response.trial")}
                </Span>
              )}
            </Div>
            <Span className="text-xs text-muted-foreground font-mono">
              {data.code}
            </Span>
          </Div>
        </Div>

        <Div className="grid grid-cols-2 gap-3">
          <ProductField
            label={t("get.response.id")}
            value={String(data.productId)}
            mono
          />
          <ProductField
            label={t("get.response.orgResourceId")}
            value={data.orgResourceId ?? "—"}
            mono
          />
          <ProductField
            label={t("get.response.creationDate")}
            value={formatDate(data.creationDate)}
          />
          <ProductField
            label={t("get.response.lastModified")}
            value={formatDate(data.lastModified)}
          />
          <Div className="flex flex-col gap-0.5">
            <Span className="text-xs text-muted-foreground">
              {t("get.response.dealer")}
            </Span>
            <ProductBadge
              value={data.dealer ? "Yes" : "No"}
              active={data.dealer}
            />
          </Div>
          <Div className="flex flex-col gap-0.5">
            <Span className="text-xs text-muted-foreground">
              {t("get.response.autorenewDefault")}
            </Span>
            <ProductBadge
              value={
                data.autorenewDefaultValueForNewLicenses
                  ? "Enabled"
                  : "Disabled"
              }
              active={data.autorenewDefaultValueForNewLicenses}
            />
          </Div>
        </Div>
      </Div>
    </Div>
  );
}

export function ProductUpdateContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PUT>();
  const form = useWidgetForm<typeof definition.PUT>();
  const onSubmit = useWidgetOnSubmit();
  const result = useWidgetValue<typeof definition.PUT>();

  const isMcp = platform === Platform.MCP;
  const isCli = platform === Platform.CLI;
  const isCompact = isCli || isMcp;

  const codeValue = form.watch("code") ?? "";
  const typeValue = form.watch("type") ?? "";
  const productLabelValue = form.watch("productLabel") ?? "";

  if (isCompact) {
    if (result !== null && result !== undefined) {
      return (
        <Div className="font-mono text-sm p-2">
          {`product #${result.productId}: ${result.code} [${result.productLabel}] type:${result.type}`}
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
          title={t("put.widget.back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Span className="font-semibold text-sm mr-auto">
          {t("put.widget.title")}
        </Span>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))] p-4 space-y-4">
        <Div className="grid grid-cols-2 gap-4">
          <Div className="space-y-1.5">
            <Label htmlFor="product-update-code">{t("put.code.label")}</Label>
            <Input
              id="product-update-code"
              type="text"
              value={codeValue}
              onChange={(e) => {
                form.setValue("code", e.target.value, { shouldDirty: true });
              }}
              placeholder="CORVINA_STANDARD"
            />
            <Span className="text-xs text-muted-foreground">
              {t("put.code.description")}
            </Span>
          </Div>
          <Div className="space-y-1.5">
            <Label htmlFor="product-update-type">{t("put.type.label")}</Label>
            <Input
              id="product-update-type"
              type="text"
              value={typeValue}
              onChange={(e) => {
                form.setValue("type", e.target.value, { shouldDirty: true });
              }}
              placeholder="STANDARD"
            />
            <Span className="text-xs text-muted-foreground">
              {t("put.type.description")}
            </Span>
          </Div>
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="product-update-label">
            {t("put.productLabel.label")}
          </Label>
          <Input
            id="product-update-label"
            type="text"
            value={productLabelValue}
            onChange={(e) => {
              form.setValue("productLabel", e.target.value, {
                shouldDirty: true,
              });
            }}
            placeholder="Corvina Standard"
          />
          <Span className="text-xs text-muted-foreground">
            {t("put.productLabel.description")}
          </Span>
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full gap-2"
          onClick={onSubmit ?? undefined}
        >
          <Save className="h-4 w-4" />
          {t("put.submitButton.label")}
        </Button>

        {result !== null && result !== undefined && (
          <Div className="rounded-xl border bg-card p-4 space-y-2">
            <Span className="font-semibold text-sm text-success block">
              {`#${result.productId} ${result.code} — ${result.productLabel}`}
            </Span>
          </Div>
        )}
      </Div>
    </Div>
  );
}

export function ProductDeleteContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.DELETE>();
  const onSubmit = useWidgetOnSubmit();
  const result = useWidgetValue<typeof definition.DELETE>();

  const isMcp = platform === Platform.MCP;
  const isCli = platform === Platform.CLI;
  const isCompact = isCli || isMcp;

  if (isCompact) {
    if (result !== null && result !== undefined) {
      return (
        <Div className="font-mono text-sm p-2">
          {`deleted product #${result.productId}: ${result.code} [${result.label}]`}
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
          title={t("delete.widget.back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Span className="font-semibold text-sm mr-auto">
          {t("delete.widget.title")}
        </Span>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))] p-4 space-y-4">
        <Button
          type="button"
          variant="destructive"
          className="w-full gap-2"
          onClick={onSubmit ?? undefined}
        >
          <Trash2 className="h-4 w-4" />
          {t("delete.productId.label")}
        </Button>

        {result !== null && result !== undefined && (
          <Div className="rounded-xl border bg-card p-4 space-y-2">
            <Span className="font-semibold text-sm text-destructive block">
              {`deleted #${result.productId}: ${result.code}`}
            </Span>
          </Div>
        )}
      </Div>
    </Div>
  );
}
