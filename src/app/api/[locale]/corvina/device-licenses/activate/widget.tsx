"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useState } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetContext,
  useWidgetNavigation,
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
      <Span className="text-sm font-medium font-mono">{value}</Span>
    </Div>
  );
}

export function DeviceLicenseActivateContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { endpointMutations } = useWidgetContext();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>();

  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  const [activationKey, setActivationKey] = useState("");
  const [alias, setAlias] = useState("");
  const [deviceSerialNumber, setDeviceSerialNumber] = useState("");
  const [activateDescription, setActivateDescription] = useState("");
  const [orgResourceId, setOrgResourceId] = useState("");
  const [logicalId, setLogicalId] = useState("");
  const [numOfSecondsVpn, setNumOfSecondsVpn] = useState<number | undefined>(
    undefined,
  );
  const [autorenewVpn, setAutorenewVpn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback((): void => {
    setIsSubmitting(true);
    void endpointMutations?.create
      ?.submit({
        activationKey,
        alias: alias !== "" ? alias : undefined,
        deviceSerialNumber:
          deviceSerialNumber !== "" ? deviceSerialNumber : undefined,
        activateDescription:
          activateDescription !== "" ? activateDescription : undefined,
        orgResourceId: orgResourceId !== "" ? orgResourceId : undefined,
        logicalId: logicalId !== "" ? logicalId : undefined,
        numOfSecondsVpn: numOfSecondsVpn,
        autorenewVpn: autorenewVpn,
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }, [
    endpointMutations,
    activationKey,
    alias,
    deviceSerialNumber,
    activateDescription,
    orgResourceId,
    logicalId,
    numOfSecondsVpn,
    autorenewVpn,
  ]);

  if (isCompact && result !== null && result !== undefined) {
    return (
      <Div className="font-mono text-sm p-2">
        {`activated #${result.id} key:${result.activationKeyOut} used:${result.used}`}
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
        <Shield className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("post.widget.title")}
        </Span>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))] p-4">
        <Div className="grid grid-cols-2 gap-3">
          <Div className="col-span-2 space-y-1.5">
            <Label htmlFor="act-activation-key">
              {t("post.activationKey.label")}
            </Label>
            <Input
              id="act-activation-key"
              type="text"
              value={activationKey}
              onChange={(e) => {
                setActivationKey(e.target.value);
              }}
              placeholder="ACT-KEY-001"
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.activationKey.description")}
            </Span>
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="act-alias">{t("post.alias.label")}</Label>
            <Input
              id="act-alias"
              type="text"
              value={alias}
              onChange={(e) => {
                setAlias(e.target.value);
              }}
              placeholder=""
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.alias.description")}
            </Span>
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="act-serial">
              {t("post.deviceSerialNumber.label")}
            </Label>
            <Input
              id="act-serial"
              type="text"
              value={deviceSerialNumber}
              onChange={(e) => {
                setDeviceSerialNumber(e.target.value);
              }}
              placeholder="SN-ABC-001"
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.deviceSerialNumber.description")}
            </Span>
          </Div>

          <Div className="col-span-2 space-y-1.5">
            <Label htmlFor="act-description">
              {t("post.activateDescription.label")}
            </Label>
            <Input
              id="act-description"
              type="text"
              value={activateDescription}
              onChange={(e) => {
                setActivateDescription(e.target.value);
              }}
              placeholder=""
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.activateDescription.description")}
            </Span>
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="act-org-resource-id">
              {t("post.orgResourceId.label")}
            </Label>
            <Input
              id="act-org-resource-id"
              type="text"
              value={orgResourceId}
              onChange={(e) => {
                setOrgResourceId(e.target.value);
              }}
              placeholder=""
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.orgResourceId.description")}
            </Span>
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="act-logical-id">{t("post.logicalId.label")}</Label>
            <Input
              id="act-logical-id"
              type="text"
              value={logicalId}
              onChange={(e) => {
                setLogicalId(e.target.value);
              }}
              placeholder=""
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.logicalId.description")}
            </Span>
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="act-vpn-seconds">
              {t("post.numOfSecondsVpn.label")}
            </Label>
            <Input
              id="act-vpn-seconds"
              type="number"
              value={numOfSecondsVpn}
              onChange={(e) => {
                setNumOfSecondsVpn(e.target.value);
              }}
              placeholder="3600"
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.numOfSecondsVpn.description")}
            </Span>
          </Div>

          <Div className="flex items-center gap-2 pt-6">
            <Checkbox
              id="act-autorenew-vpn"
              checked={autorenewVpn}
              onCheckedChange={(checked) => {
                setAutorenewVpn(checked === true);
              }}
            />
            <Label htmlFor="act-autorenew-vpn">
              {t("post.autorenewVpn.label")}
            </Label>
          </Div>
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full gap-2 mt-4"
          onClick={handleSubmit}
          disabled={isSubmitting || activationKey === ""}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("post.submitButton.loadingText")}
            </>
          ) : (
            <>
              <Shield className="h-4 w-4" />
              {t("post.submitButton.label")}
            </>
          )}
        </Button>

        {result !== null && result !== undefined && (
          <Div className="mt-4 rounded-xl border bg-card p-4 space-y-3">
            <Span className="font-semibold text-sm text-success">
              {t("post.widget.result")}
            </Span>
            <Div className="grid grid-cols-2 gap-3">
              <ResultRow
                label={t("post.response.id")}
                value={String(result.id)}
              />
              <ResultRow
                label={t("post.response.activationKey")}
                value={result.activationKeyOut}
              />
              {result.serialNumber !== null &&
                result.serialNumber !== undefined && (
                  <ResultRow
                    label={t("post.response.serialNumber")}
                    value={result.serialNumber}
                  />
                )}
              {result.realm !== null && result.realm !== undefined && (
                <ResultRow
                  label={t("post.response.realm")}
                  value={result.realm}
                />
              )}
              {result.orgResourceIdOut !== null &&
                result.orgResourceIdOut !== undefined && (
                  <ResultRow
                    label={t("post.response.orgResourceId")}
                    value={result.orgResourceIdOut}
                  />
                )}
              <ResultRow
                label={t("post.response.used")}
                value={result.used ? "Yes" : "No"}
              />
              <ResultRow
                label={t("post.response.deleted")}
                value={result.deleted ? "Yes" : "No"}
              />
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
