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

function formatDate(epoch: number | null | undefined): string {
  if (epoch === null || epoch === undefined) {
    return "—";
  }
  return new Date(epoch).toLocaleDateString();
}

export function LicenseValidateContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const result = useWidgetValue<typeof definition.GET>();

  const licenseCodeValue = form.watch("licenseCode") ?? "";
  const licenseCodeError = form.formState.errors.licenseCode?.message;

  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  if (isCompact) {
    if (result !== null && result !== undefined) {
      const parts = [
        `license #${result.licenseId}: ${result.code}`,
        `product:${result.productLabel}`,
        `used:${result.used ? "Y" : "N"}`,
        `autorenew:${result.autorenew ? "Y" : "N"}`,
      ];
      return (
        <Div className="font-mono text-sm p-2">
          <Div className="font-semibold mb-1">{t("get.widget.valid")}</Div>
          <Div>{parts.join(" | ")}</Div>
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
          title={t("get.widget.back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Key className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("get.widget.title")}
        </Span>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))] p-4 space-y-4">
        <Div className="space-y-1.5">
          <Label htmlFor="license-code">{t("get.licenseCode.label")}</Label>
          <Input
            id="license-code"
            type="text"
            value={licenseCodeValue}
            onChange={(e) => {
              form.setValue("licenseCode", e.target.value, {
                shouldDirty: true,
              });
            }}
            placeholder={t("get.licenseCode.placeholder")}
          />
          {licenseCodeError ? (
            <Span className="text-xs text-destructive">{licenseCodeError}</Span>
          ) : (
            <Span className="text-xs text-muted-foreground">
              {t("get.licenseCode.description")}
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
          {t("get.widget.title")}
        </Button>

        {result !== null && result !== undefined && (
          <Div className="mt-4 rounded-xl border bg-card p-4 space-y-3">
            <Div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <Span className="font-semibold text-sm">
                {t("get.widget.valid")}
              </Span>
            </Div>
            <Div className="grid grid-cols-2 gap-3 text-sm">
              <Div className="space-y-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("get.response.licenseId")}
                </Span>
                <Div className="font-mono text-xs">{result.licenseId}</Div>
              </Div>
              <Div className="space-y-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("get.response.code")}
                </Span>
                <Div className="font-mono text-xs">{result.code}</Div>
              </Div>
              <Div className="space-y-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("get.response.productLabel")}
                </Span>
                <Div className="text-xs">{result.productLabel}</Div>
              </Div>
              <Div className="space-y-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("get.response.productType")}
                </Span>
                <Div className="text-xs">{result.productType}</Div>
              </Div>
              {result.expirationDate !== null &&
                result.expirationDate !== undefined && (
                  <Div className="space-y-0.5">
                    <Span className="text-xs text-muted-foreground">
                      {t("get.response.expirationDate")}
                    </Span>
                    <Div className="text-xs">
                      {formatDate(result.expirationDate)}
                    </Div>
                  </Div>
                )}
              {result.orgResourceId !== null &&
                result.orgResourceId !== undefined && (
                  <Div className="space-y-0.5">
                    <Span className="text-xs text-muted-foreground">
                      {t("get.response.orgResourceId")}
                    </Span>
                    <Div className="font-mono text-xs">
                      {result.orgResourceId}
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
