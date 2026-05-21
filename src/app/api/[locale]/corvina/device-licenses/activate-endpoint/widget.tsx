"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ShieldPlus } from "next-vibe-ui/ui/icons/ShieldPlus";
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

function formatDate(val: string | Date | null | undefined): string {
  if (!val) {
    return "—";
  }
  if (val instanceof Date) {
    return val.toLocaleDateString();
  }
  return new Date(val).toLocaleDateString();
}

export function DeviceLicenseActivateEndpointContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const result = useWidgetValue<typeof definition.POST>();

  const isMcp = platform === Platform.MCP;
  const isCli = platform === Platform.CLI;
  const isCompact = isCli || isMcp;

  const activationKeyValue = form.watch("activationKey") ?? "";
  const aliasValue = form.watch("alias") ?? "";
  const deviceSerialNumberValue = form.watch("deviceSerialNumber") ?? "";
  const endpointDescriptionValue = form.watch("endpointDescription") ?? "";
  const orgResourceIdValue = form.watch("orgResourceId") ?? "";
  const logicalIdValue = form.watch("logicalId") ?? "";
  const numOfSecondsVpnValue = form.watch("numOfSecondsVpn");
  const autorenewVpnValue = form.watch("autorenewVpn") ?? false;
  const gatewayIdValue = form.watch("gatewayId") ?? "";

  if (isCompact) {
    if (result !== null && result !== undefined) {
      return (
        <Div className="font-mono text-sm p-2">
          {`activated endpoint: ${result.logicalIdOut} key:${result.activationKeyOut ?? "?"}`}
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
        <ShieldPlus className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("post.widget.title")}
        </Span>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))] p-4 space-y-4">
        <Div className="grid grid-cols-2 gap-4">
          <Div className="space-y-1.5">
            <Label htmlFor="act-ep-activation-key">
              {t("post.activationKey.label")}
            </Label>
            <Input
              id="act-ep-activation-key"
              type="text"
              value={activationKeyValue}
              onChange={(e) => {
                form.setValue("activationKey", e.target.value, {
                  shouldDirty: true,
                });
              }}
              placeholder={t("post.activationKey.placeholder")}
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.activationKey.description")}
            </Span>
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="act-ep-alias">{t("post.alias.label")}</Label>
            <Input
              id="act-ep-alias"
              type="text"
              value={aliasValue}
              onChange={(e) => {
                form.setValue("alias", e.target.value, {
                  shouldDirty: true,
                });
              }}
              placeholder={t("post.alias.placeholder")}
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.alias.description")}
            </Span>
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="act-ep-serial">
              {t("post.deviceSerialNumber.label")}
            </Label>
            <Input
              id="act-ep-serial"
              type="text"
              value={deviceSerialNumberValue}
              onChange={(e) => {
                form.setValue("deviceSerialNumber", e.target.value, {
                  shouldDirty: true,
                });
              }}
              placeholder={t("post.deviceSerialNumber.placeholder")}
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.deviceSerialNumber.description")}
            </Span>
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="act-ep-description">
              {t("post.endpointDescription.label")}
            </Label>
            <Input
              id="act-ep-description"
              type="text"
              value={endpointDescriptionValue}
              onChange={(e) => {
                form.setValue("endpointDescription", e.target.value, {
                  shouldDirty: true,
                });
              }}
              placeholder={t("post.endpointDescription.placeholder")}
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.endpointDescription.description")}
            </Span>
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="act-ep-org">{t("post.orgResourceId.label")}</Label>
            <Input
              id="act-ep-org"
              type="text"
              value={orgResourceIdValue}
              onChange={(e) => {
                form.setValue("orgResourceId", e.target.value, {
                  shouldDirty: true,
                });
              }}
              placeholder={t("post.orgResourceId.placeholder")}
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.orgResourceId.description")}
            </Span>
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="act-ep-logical-id">
              {t("post.logicalId.label")}
            </Label>
            <Input
              id="act-ep-logical-id"
              type="text"
              value={logicalIdValue}
              onChange={(e) => {
                form.setValue("logicalId", e.target.value, {
                  shouldDirty: true,
                });
              }}
              placeholder={t("post.logicalId.placeholder")}
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.logicalId.description")}
            </Span>
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="act-ep-vpn-seconds">
              {t("post.numOfSecondsVpn.label")}
            </Label>
            <Input
              id="act-ep-vpn-seconds"
              type="number"
              value={numOfSecondsVpnValue}
              onChange={(e) => {
                form.setValue("numOfSecondsVpn", e.target.value, {
                  shouldDirty: true,
                });
              }}
              placeholder={t("post.numOfSecondsVpn.placeholder")}
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.numOfSecondsVpn.description")}
            </Span>
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="act-ep-gateway-id">
              {t("post.gatewayId.label")}
            </Label>
            <Input
              id="act-ep-gateway-id"
              type="text"
              value={gatewayIdValue}
              onChange={(e) => {
                form.setValue("gatewayId", e.target.value, {
                  shouldDirty: true,
                });
              }}
              placeholder={t("post.gatewayId.placeholder")}
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.gatewayId.description")}
            </Span>
          </Div>

          <Div className="flex flex-col gap-2 pt-6">
            <Div className="flex items-center gap-2">
              <Checkbox
                id="act-ep-autorenew-vpn"
                checked={autorenewVpnValue}
                onCheckedChange={(checked) => {
                  form.setValue("autorenewVpn", Boolean(checked) as never, {
                    shouldDirty: true,
                  });
                }}
              />
              <Label htmlFor="act-ep-autorenew-vpn">
                {t("post.autorenewVpn.label")}
              </Label>
            </Div>
            <Span className="text-xs text-muted-foreground">
              {t("post.autorenewVpn.description")}
            </Span>
          </Div>
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full gap-2"
          onClick={onSubmit ?? undefined}
        >
          <ShieldPlus className="h-4 w-4" />
          {t("post.submitButton.label")}
        </Button>

        {result !== null && result !== undefined && (
          <Div className="rounded-xl border bg-card p-4 space-y-3">
            <Span className="font-semibold text-sm text-success block">
              {result.logicalIdOut}
            </Span>
            <Div className="grid grid-cols-2 gap-2 text-sm">
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.activationKey")}
                </Span>
                <Span className="font-mono">
                  {result.activationKeyOut ?? "—"}
                </Span>
              </Div>
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.serialNumber")}
                </Span>
                <Span className="font-mono">{result.serialNumber ?? "—"}</Span>
              </Div>
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.clientName")}
                </Span>
                <Span>{result.clientName ?? "—"}</Span>
              </Div>
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.fromDateVpn")}
                </Span>
                <Span>{formatDate(result.fromDateVpn)}</Span>
              </Div>
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.toDateVpn")}
                </Span>
                <Span>{formatDate(result.toDateVpn)}</Span>
              </Div>
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.activationDate")}
                </Span>
                <Span>{formatDate(result.activationDate)}</Span>
              </Div>
            </Div>
          </Div>
        )}
      </Div>
    </Div>
  );
}
