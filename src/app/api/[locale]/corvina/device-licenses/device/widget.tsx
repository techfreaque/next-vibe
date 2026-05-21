"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Cpu } from "next-vibe-ui/ui/icons/Cpu";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useState } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";

function ResultRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="flex flex-col gap-0.5">
      <Span className="text-xs text-muted-foreground">{label}</Span>
      <Span className="text-sm font-medium font-mono">{value ?? "—"}</Span>
    </Div>
  );
}

export function DeviceLicenseDeviceGetContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const result = useWidgetValue<typeof definition.GET>();

  const isMcp = platform === Platform.MCP;
  const isCli = platform === Platform.CLI;
  const isCompact = isCli || isMcp;

  const serialNumberValue = form.watch("serialNumber") ?? "";
  const activationKeyValue = form.watch("activationKey") ?? "";

  if (isCompact) {
    if (result !== null && result !== undefined) {
      return (
        <Div className="font-mono text-sm p-2">
          {`${result.logicalId ?? "?"} realm:${result.realm ?? "?"} org:${result.orgResourceId ?? "?"}`}
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
        <Cpu className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("get.widget.title")}
        </Span>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))] p-4 space-y-4">
        <Div className="grid grid-cols-2 gap-3">
          <Div className="space-y-1.5">
            <Label htmlFor="device-get-serial">
              {t("get.serialNumber.label")}
            </Label>
            <Input
              id="device-get-serial"
              type="text"
              value={String(serialNumberValue)}
              onChange={(e) => {
                form.setValue("serialNumber", e.target.value as never, {
                  shouldDirty: true,
                });
              }}
              placeholder={t("get.serialNumber.placeholder")}
            />
            <Span className="text-xs text-muted-foreground">
              {t("get.serialNumber.description")}
            </Span>
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="device-get-key">
              {t("get.activationKey.label")}
            </Label>
            <Input
              id="device-get-key"
              type="text"
              value={String(activationKeyValue)}
              onChange={(e) => {
                form.setValue("activationKey", e.target.value as never, {
                  shouldDirty: true,
                });
              }}
              placeholder={t("get.activationKey.placeholder")}
            />
            <Span className="text-xs text-muted-foreground">
              {t("get.activationKey.description")}
            </Span>
          </Div>
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full gap-2"
          onClick={onSubmit ?? undefined}
        >
          <Cpu className="h-4 w-4" />
          {t("get.submitButton.label")}
        </Button>

        {result !== null && result !== undefined && (
          <Div className="rounded-xl border bg-card p-4 space-y-3">
            <Div className="grid grid-cols-2 gap-3">
              <ResultRow
                label={t("get.response.logicalId")}
                value={result.logicalId}
              />
              <ResultRow label={t("get.response.realm")} value={result.realm} />
              {result.gatewayLogicalId !== null &&
                result.gatewayLogicalId !== undefined && (
                  <ResultRow
                    label={t("get.response.gatewayLogicalId")}
                    value={result.gatewayLogicalId}
                  />
                )}
              <ResultRow label={t("get.response.label")} value={result.label} />
              <ResultRow
                label={t("get.response.orgResourceId")}
                value={result.orgResourceId}
              />
              <ResultRow
                label={t("get.response.apiKey")}
                value={result.apiKey}
              />
              {result.vpnKey !== null && result.vpnKey !== undefined && (
                <ResultRow
                  label={t("get.response.vpnKey")}
                  value={result.vpnKey}
                />
              )}
              <ResultRow
                label={t("get.response.vpnValidityMonths")}
                value={
                  result.vpnValidityMonths !== null &&
                  result.vpnValidityMonths !== undefined
                    ? String(result.vpnValidityMonths)
                    : null
                }
              />
              <ResultRow
                label={t("get.response.numOfSecondsAutoRenewVpn")}
                value={
                  result.numOfSecondsAutoRenewVpn !== null &&
                  result.numOfSecondsAutoRenewVpn !== undefined
                    ? String(result.numOfSecondsAutoRenewVpn)
                    : null
                }
              />
              <ResultRow
                label={t("get.response.vpnAccountingDisabled")}
                value={
                  result.vpnAccountingDisabled !== null &&
                  result.vpnAccountingDisabled !== undefined
                    ? result.vpnAccountingDisabled
                      ? "Yes"
                      : "No"
                    : null
                }
              />
              {result.fromDateVpn !== null &&
                result.fromDateVpn !== undefined && (
                  <ResultRow
                    label={t("get.response.fromDateVpn")}
                    value={
                      result.fromDateVpn instanceof Date
                        ? result.fromDateVpn.toLocaleDateString()
                        : String(result.fromDateVpn)
                    }
                  />
                )}
              {result.toDateVpn !== null && result.toDateVpn !== undefined && (
                <ResultRow
                  label={t("get.response.toDateVpn")}
                  value={
                    result.toDateVpn instanceof Date
                      ? result.toDateVpn.toLocaleDateString()
                      : String(result.toDateVpn)
                  }
                />
              )}
              {result.activationDate !== null &&
                result.activationDate !== undefined && (
                  <ResultRow
                    label={t("get.response.activationDate")}
                    value={
                      result.activationDate instanceof Date
                        ? result.activationDate.toLocaleDateString()
                        : String(result.activationDate)
                    }
                  />
                )}
            </Div>
          </Div>
        )}
      </Div>
    </Div>
  );
}

export function DeviceLicenseDevicePostContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { endpointMutations } = useWidgetContext();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>();

  const isMcp = platform === Platform.MCP;
  const isCli = platform === Platform.CLI;
  const isCompact = isCli || isMcp;

  const [serialNumber, setSerialNumber] = useState("");
  const [activationKey, setActivationKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback((): void => {
    setIsSubmitting(true);
    void endpointMutations?.create
      ?.submit({
        serialNumber,
        activationKey,
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }, [endpointMutations, serialNumber, activationKey]);

  if (isCompact && result !== null && result !== undefined) {
    return (
      <Div className="font-mono text-sm p-2">
        {`${result.logicalId ?? "?"} realm:${result.realm ?? "?"} org:${result.orgResourceId ?? "?"}`}
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
          title={t("post.widget.back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Cpu className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("post.widget.title")}
        </Span>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))] p-4 space-y-4">
        <Div className="grid grid-cols-2 gap-3">
          <Div className="space-y-1.5">
            <Label htmlFor="device-post-serial">
              {t("post.serialNumber.label")}
            </Label>
            <Input
              id="device-post-serial"
              type="text"
              value={serialNumber}
              onChange={(e) => {
                setSerialNumber(e.target.value);
              }}
              placeholder={t("post.serialNumber.placeholder")}
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.serialNumber.description")}
            </Span>
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="device-post-key">
              {t("post.activationKey.label")}
            </Label>
            <Input
              id="device-post-key"
              type="text"
              value={activationKey}
              onChange={(e) => {
                setActivationKey(e.target.value);
              }}
              placeholder={t("post.activationKey.placeholder")}
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.activationKey.description")}
            </Span>
          </Div>
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full gap-2"
          onClick={handleSubmit}
          disabled={isSubmitting || serialNumber === "" || activationKey === ""}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("post.submitButton.loadingText")}
            </>
          ) : (
            <>
              <Cpu className="h-4 w-4" />
              {t("post.submitButton.label")}
            </>
          )}
        </Button>

        {result !== null && result !== undefined && (
          <Div className="rounded-xl border bg-card p-4 space-y-3">
            <Div className="grid grid-cols-2 gap-3">
              <ResultRow
                label={t("post.response.logicalId")}
                value={result.logicalId}
              />
              <ResultRow
                label={t("post.response.realm")}
                value={result.realm}
              />
              {result.gatewayLogicalId !== null &&
                result.gatewayLogicalId !== undefined && (
                  <ResultRow
                    label={t("post.response.gatewayLogicalId")}
                    value={result.gatewayLogicalId}
                  />
                )}
              <ResultRow
                label={t("post.response.label")}
                value={result.label}
              />
              <ResultRow
                label={t("post.response.orgResourceId")}
                value={result.orgResourceId}
              />
              <ResultRow
                label={t("post.response.apiKey")}
                value={result.apiKey}
              />
              {result.vpnKey !== null && result.vpnKey !== undefined && (
                <ResultRow
                  label={t("post.response.vpnKey")}
                  value={result.vpnKey}
                />
              )}
              <ResultRow
                label={t("post.response.vpnValidityMonths")}
                value={
                  result.vpnValidityMonths !== null &&
                  result.vpnValidityMonths !== undefined
                    ? String(result.vpnValidityMonths)
                    : null
                }
              />
              <ResultRow
                label={t("post.response.numOfSecondsAutoRenewVpn")}
                value={
                  result.numOfSecondsAutoRenewVpn !== null &&
                  result.numOfSecondsAutoRenewVpn !== undefined
                    ? String(result.numOfSecondsAutoRenewVpn)
                    : null
                }
              />
              <ResultRow
                label={t("post.response.vpnAccountingDisabled")}
                value={
                  result.vpnAccountingDisabled !== null &&
                  result.vpnAccountingDisabled !== undefined
                    ? result.vpnAccountingDisabled
                      ? "Yes"
                      : "No"
                    : null
                }
              />
              {result.fromDateVpn !== null &&
                result.fromDateVpn !== undefined && (
                  <ResultRow
                    label={t("post.response.fromDateVpn")}
                    value={
                      result.fromDateVpn instanceof Date
                        ? result.fromDateVpn.toLocaleDateString()
                        : String(result.fromDateVpn)
                    }
                  />
                )}
              {result.toDateVpn !== null && result.toDateVpn !== undefined && (
                <ResultRow
                  label={t("post.response.toDateVpn")}
                  value={
                    result.toDateVpn instanceof Date
                      ? result.toDateVpn.toLocaleDateString()
                      : String(result.toDateVpn)
                  }
                />
              )}
              {result.activationDate !== null &&
                result.activationDate !== undefined && (
                  <ResultRow
                    label={t("post.response.activationDate")}
                    value={
                      result.activationDate instanceof Date
                        ? result.activationDate.toLocaleDateString()
                        : String(result.activationDate)
                    }
                  />
                )}
            </Div>
          </Div>
        )}
      </Div>
    </Div>
  );
}
