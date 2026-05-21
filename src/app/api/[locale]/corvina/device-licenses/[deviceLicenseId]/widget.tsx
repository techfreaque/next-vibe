"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";
import type {
  DeviceLicenseDeleteResponseOutput,
  DeviceLicenseUpdateResponseOutput,
} from "./definition";

function DeviceField({
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
      <Span
        className={`text-sm font-medium${mono === true ? " font-mono" : ""}`}
      >
        {value}
      </Span>
    </Div>
  );
}

function formatDate(date: Date | null | undefined): string {
  if (date === null || date === undefined) {
    return "—";
  }
  return date.toLocaleDateString();
}

function DeviceLicenseResultCard({
  result,
  labels,
}: {
  result: DeviceLicenseUpdateResponseOutput | DeviceLicenseDeleteResponseOutput;
  labels: {
    id: string;
    activationKey: string;
    serialNumber: string;
    clientName: string;
    fromDateVpn: string;
    toDateVpn: string;
    activationDate: string;
    vpnValidityMonths: string;
  };
}): React.JSX.Element {
  return (
    <Div className="rounded-md border p-3 mt-2 grid grid-cols-2 gap-2">
      <DeviceField label={labels.id} value={result.id} />
      <DeviceField
        label={labels.activationKey}
        value={result.activationKey}
        mono
      />
      <DeviceField
        label={labels.serialNumber}
        value={result.serialNumber ?? "—"}
        mono
      />
      <DeviceField label={labels.clientName} value={result.clientName ?? "—"} />
      <DeviceField
        label={labels.fromDateVpn}
        value={formatDate(result.fromDateVpn)}
      />
      <DeviceField
        label={labels.toDateVpn}
        value={formatDate(result.toDateVpn)}
      />
      <DeviceField
        label={labels.activationDate}
        value={formatDate(result.activationDate)}
      />
      <DeviceField
        label={labels.vpnValidityMonths}
        value={
          result.vpnValidityMonths !== null &&
          result.vpnValidityMonths !== undefined
            ? `${result.vpnValidityMonths} mo`
            : "—"
        }
      />
    </Div>
  );
}

export function DeviceLicenseUpdateContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const t = useWidgetTranslation<typeof definition.PUT>();
  const result = useWidgetValue<typeof definition.PUT>();
  const { pop } = useWidgetNavigation();
  const form = useWidgetForm<typeof definition.PUT>();
  const vpnAccountingDisabledValue =
    form.watch("vpnAccountingDisabled") ?? false;
  const isMcp = platform === Platform.MCP;

  const handleBack = useCallback((): void => {
    pop();
  }, [pop]);

  if (result !== null && result !== undefined && isMcp) {
    return (
      <Div className="font-mono text-sm p-2">
        {`updated device #${result.id} serial:${result.serialNumber ?? "—"} key:${result.activationKey}`}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("put.widget.back")}
        </Button>
      </Div>

      <FormAlertWidget field={{}} />

      <Div className="grid grid-cols-2 gap-3">
        <Div className="col-span-2">
          <Label className="text-xs text-muted-foreground">
            {t("put.deviceLicenseId.label")}
          </Label>
          <Input type="number" name="deviceLicenseId" readOnly />
        </Div>
        <Div className="col-span-1">
          <Label className="text-xs text-muted-foreground">
            {t("put.serialNumber.label")}
          </Label>
          <Input type="text" name="serialNumber" />
        </Div>
        <Div className="col-span-1">
          <Label className="text-xs text-muted-foreground">
            {t("put.clientName.label")}
          </Label>
          <Input type="text" name="clientName" />
        </Div>
        <Div className="col-span-2">
          <Label className="text-xs text-muted-foreground">
            {t("put.notes.label")}
          </Label>
          <Input type="text" name="notes" />
        </Div>
        <Div className="col-span-1">
          <Label className="text-xs text-muted-foreground">
            {t("put.vpnValidityMonths.label")}
          </Label>
          <Input type="number" name="vpnValidityMonths" />
        </Div>
        <Div className="col-span-1 flex items-center gap-2 pt-5">
          <Checkbox
            id="put-vpn-accounting-disabled"
            checked={vpnAccountingDisabledValue}
            onCheckedChange={(checked) => {
              form.setValue("vpnAccountingDisabled", Boolean(checked), {
                shouldDirty: true,
              });
            }}
          />
          <Label htmlFor="put-vpn-accounting-disabled" className="text-xs">
            {t("put.vpnAccountingDisabled.label")}
          </Label>
        </Div>
      </Div>

      <SubmitButtonWidget<typeof definition.PUT>
        field={{
          text: "put.submitButton.label",
          loadingText: "put.submitButton.loadingText",
          icon: "save",
          variant: "primary",
        }}
      />

      {result !== null && result !== undefined && (
        <DeviceLicenseResultCard
          result={result}
          labels={{
            id: t("put.response.id"),
            activationKey: t("put.response.activationKey"),
            serialNumber: t("put.response.serialNumber"),
            clientName: t("put.response.clientName"),
            fromDateVpn: t("put.response.fromDateVpn"),
            toDateVpn: t("put.response.toDateVpn"),
            activationDate: t("put.response.activationDate"),
            vpnValidityMonths: t("put.response.vpnValidityMonths"),
          }}
        />
      )}
    </Div>
  );
}

export function DeviceLicenseDeleteContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const t = useWidgetTranslation<typeof definition.DELETE>();
  const result = useWidgetValue<typeof definition.DELETE>();
  const { pop } = useWidgetNavigation();
  const isMcp = platform === Platform.MCP;

  const handleBack = useCallback((): void => {
    pop();
  }, [pop]);

  if (result !== null && result !== undefined && isMcp) {
    return (
      <Div className="font-mono text-sm p-2">
        {`deleted device #${result.id} key:${result.activationKey}`}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("delete.widget.back")}
        </Button>
      </Div>

      <FormAlertWidget field={{}} />

      <Div className="grid grid-cols-1 gap-3">
        <Div>
          <Label className="text-xs text-muted-foreground">
            {t("delete.deviceLicenseId.label")}
          </Label>
          <Input type="number" name="deviceLicenseId" />
        </Div>
        <Div>
          <Label className="text-xs text-muted-foreground">
            {t("delete.deleteOrgResourceId.label")}
          </Label>
          <Input type="text" name="deleteOrgResourceId" />
        </Div>
      </Div>

      <SubmitButtonWidget<typeof definition.DELETE>
        field={{
          text: "delete.submitButton.label",
          loadingText: "delete.submitButton.loadingText",
          icon: "trash",
          variant: "destructive",
        }}
      />

      {result !== null && result !== undefined && (
        <Div className="mt-2">
          <Span className="text-sm font-semibold text-destructive">
            {`${t("delete.widget.deletedDevice")} #${result.id}`}
          </Span>
          <DeviceLicenseResultCard
            result={result}
            labels={{
              id: t("put.response.id"),
              activationKey: t("put.response.activationKey"),
              serialNumber: t("put.response.serialNumber"),
              clientName: t("put.response.clientName"),
              fromDateVpn: t("put.response.fromDateVpn"),
              toDateVpn: t("put.response.toDateVpn"),
              activationDate: t("put.response.activationDate"),
              vpnValidityMonths: t("put.response.vpnValidityMonths"),
            }}
          />
        </Div>
      )}
    </Div>
  );
}
