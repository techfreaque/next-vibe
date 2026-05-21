"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
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

function formatDate(val: Date | string | null | undefined): string {
  if (!val) {
    return "—";
  }
  if (val instanceof Date) {
    return val.toLocaleDateString();
  }
  return new Date(val).toLocaleDateString();
}

export function DeviceLicenseVpnAutorenewContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PUT>();
  const form = useWidgetForm<typeof definition.PUT>();
  const onSubmit = useWidgetOnSubmit();
  const result = useWidgetValue<typeof definition.PUT>();

  const isMcp = platform === Platform.MCP;
  const isCli = platform === Platform.CLI;
  const isCompact = isCli || isMcp;

  const logicalIdValue = form.watch("logicalId") ?? "";
  const numOfSecondsValue = form.watch("numOfSeconds");
  const orgResourceIdValue = form.watch("orgResourceId") ?? "";
  const autorenewValue = form.watch("autorenew") ?? false;

  if (isCompact) {
    if (result !== null && result !== undefined) {
      return (
        <Div className="font-mono text-sm p-2">
          {`vpn-autorenew ${result.logicalId}: autorenew=${result.numOfSecondsAutoRenewVpn}s from=${formatDate(result.fromDateVpn)} to=${formatDate(result.toDateVpn)}`}
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
        <Shield className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("put.widget.title")}
        </Span>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))] p-4 space-y-4">
        <Div className="grid grid-cols-2 gap-4">
          <Div className="space-y-1.5">
            <Label htmlFor="vpn-autorenew-logical-id">
              {t("put.logicalId.label")}
            </Label>
            <Input
              id="vpn-autorenew-logical-id"
              type="text"
              value={logicalIdValue}
              onChange={(e) => {
                form.setValue("logicalId", e.target.value, {
                  shouldDirty: true,
                });
              }}
              placeholder={t("put.logicalId.placeholder")}
            />
            <Span className="text-xs text-muted-foreground">
              {t("put.logicalId.description")}
            </Span>
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="vpn-autorenew-seconds">
              {t("put.numOfSeconds.label")}
            </Label>
            <Input
              id="vpn-autorenew-seconds"
              type="number"
              value={numOfSecondsValue}
              onChange={(e) => {
                form.setValue("numOfSeconds", e.target.value, {
                  shouldDirty: true,
                });
              }}
              placeholder={t("put.numOfSeconds.placeholder")}
            />
            <Span className="text-xs text-muted-foreground">
              {t("put.numOfSeconds.description")}
            </Span>
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="vpn-autorenew-org">
              {t("put.orgResourceId.label")}
            </Label>
            <Input
              id="vpn-autorenew-org"
              type="text"
              value={orgResourceIdValue}
              onChange={(e) => {
                form.setValue("orgResourceId", e.target.value, {
                  shouldDirty: true,
                });
              }}
              placeholder={t("put.orgResourceId.placeholder")}
            />
            <Span className="text-xs text-muted-foreground">
              {t("put.orgResourceId.description")}
            </Span>
          </Div>

          <Div className="flex flex-col gap-2 pt-6">
            <Div className="flex items-center gap-2">
              <Checkbox
                id="vpn-autorenew-autorenew"
                checked={autorenewValue}
                onCheckedChange={(checked) => {
                  form.setValue("autorenew", Boolean(checked) as never, {
                    shouldDirty: true,
                  });
                }}
              />
              <Label htmlFor="vpn-autorenew-autorenew">
                {t("put.autorenew.label")}
              </Label>
            </Div>
            <Span className="text-xs text-muted-foreground">
              {t("put.autorenew.description")}
            </Span>
          </Div>
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full gap-2"
          onClick={onSubmit ?? undefined}
        >
          <Shield className="h-4 w-4" />
          {t("put.submitButton.label")}
        </Button>

        {result !== null && result !== undefined && (
          <Div className="rounded-xl border bg-card p-4 space-y-3">
            <Span className="font-semibold text-sm text-success block">
              {result.logicalId}
            </Span>
            <Div className="grid grid-cols-2 gap-2 text-sm">
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("put.response.serialNumber")}
                </Span>
                <Span className="font-mono">{result.serialNumber ?? "—"}</Span>
              </Div>
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("put.response.clientName")}
                </Span>
                <Span>{result.clientName ?? "—"}</Span>
              </Div>
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("put.response.fromDateVpn")}
                </Span>
                <Span>{formatDate(result.fromDateVpn)}</Span>
              </Div>
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("put.response.toDateVpn")}
                </Span>
                <Span>{formatDate(result.toDateVpn)}</Span>
              </Div>
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("put.response.numOfSecondsAutoRenewVpn")}
                </Span>
                <Span className="font-mono">
                  {result.numOfSecondsAutoRenewVpn ?? "—"}
                </Span>
              </Div>
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("put.response.vpnValidityMonths")}
                </Span>
                <Span>{result.vpnValidityMonths ?? "—"}</Span>
              </Div>
            </Div>
          </Div>
        )}
      </Div>
    </Div>
  );
}
