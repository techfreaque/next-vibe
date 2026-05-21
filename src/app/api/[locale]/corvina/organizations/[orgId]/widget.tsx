"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { PackageCheck } from "next-vibe-ui/ui/icons/PackageCheck";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Save } from "next-vibe-ui/ui/icons/Save";
import { Server } from "next-vibe-ui/ui/icons/Server";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { CorvinaOrgStatusValue } from "../enums";
import { CorvinaOrgStatus } from "../enums";
import type definition from "./definition";
import type { CorvinaOrganizationGetResponseOutput } from "./definition";

type Org = CorvinaOrganizationGetResponseOutput;

const STATUS_COLORS: Record<typeof CorvinaOrgStatusValue, string> = {
  [CorvinaOrgStatus.DONE]: "bg-success/10 text-success",
  [CorvinaOrgStatus.NEW]: "bg-muted text-muted-foreground",
  [CorvinaOrgStatus.PROVISIONING]: "bg-warning/10 text-warning",
  [CorvinaOrgStatus.DELETING]: "bg-warning/10 text-warning",
  [CorvinaOrgStatus.DELETED]: "bg-muted text-muted-foreground",
};

function Badge({
  on,
  onLabel,
  offLabel,
}: {
  on: boolean;
  onLabel: string;
  offLabel: string;
}): React.JSX.Element {
  return (
    <Span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        on ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
      )}
    >
      {on ? onLabel : offLabel}
    </Span>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="flex items-start justify-between py-2 border-b last:border-b-0">
      <Span className="text-xs text-muted-foreground w-40 shrink-0">
        {label}
      </Span>
      <Span className="text-sm font-medium text-right flex-1 break-all">
        {value}
      </Span>
    </Div>
  );
}

function BoolToggle({
  value,
  onToggle,
  label,
  description,
}: {
  value: boolean;
  onToggle: () => void;
  label: string;
  description: string;
}): React.JSX.Element {
  return (
    <Div className="flex items-center justify-between py-2">
      <Div>
        <Span className="text-sm font-medium">{label}</Span>
        <Span className="block text-xs text-muted-foreground">
          {description}
        </Span>
      </Div>
      <Button
        type="button"
        onClick={onToggle}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors p-0 min-h-0 shadow-none",
          value ? "bg-primary" : "bg-input",
        )}
      >
        <Span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
            value ? "translate-x-4" : "translate-x-0",
          )}
        />
      </Button>
    </Div>
  );
}

export function OrgDetailContainer(): React.JSX.Element {
  const { push: navigate, pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const org = data as Org | undefined;
  const isLoading = data === undefined;

  const handleEdit = useCallback((): void => {
    if (!org) {
      return;
    }
    void (async (): Promise<void> => {
      const detail = await import("./definition");
      navigate(detail.default.PUT, { urlPathParams: { orgId: org.orgId } });
    })();
  }, [navigate, org]);

  const handleDevices = useCallback((): void => {
    if (!org) {
      return;
    }
    void (async (): Promise<void> => {
      const devList = await import("./devices/list/definition");
      navigate(devList.default.GET, { urlPathParams: { orgId: org.orgId } });
    })();
  }, [navigate, org]);

  const handleApps = useCallback((): void => {
    if (!org) {
      return;
    }
    void (async (): Promise<void> => {
      const appsDef = await import("../../apps/installed/definition");
      navigate(appsDef.default.GET, {});
    })();
  }, [navigate, org]);

  return (
    <Div className="flex flex-col gap-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => goBack()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Span className="font-semibold text-sm mr-auto">
          {isLoading ? "Loading…" : (org?.label ?? t("get.title"))}
        </Span>
        {org && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDevices}
            className="gap-1"
          >
            <Server className="h-3.5 w-3.5" />
            {t("get.widget.devices")}
          </Button>
        )}
        {org && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleApps}
            className="gap-1"
          >
            <PackageCheck className="h-3.5 w-3.5" />
            {t("get.widget.apps")}
          </Button>
        )}
        {org && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="gap-1"
          >
            <Pencil className="h-3.5 w-3.5" />
            {t("get.widget.edit")}
          </Button>
        )}
      </Div>

      {isLoading ? (
        <Div className="h-48 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </Div>
      ) : !org ? null : (
        <Div className="px-4 py-3 flex flex-col gap-4">
          <Div>
            <Div className="flex items-center gap-2 mb-2">
              <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {t("get.widget.sections.identity")}
              </Span>
              <Span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                  STATUS_COLORS[org.status],
                )}
              >
                {t(org.status)}
              </Span>
            </Div>
            <InfoRow
              label={t("get.widget.labels.name")}
              value={<Span className="font-mono">{org.name}</Span>}
            />
            <InfoRow label={t("get.widget.labels.label")} value={org.label} />
            <InfoRow
              label={t("get.widget.labels.resourceId")}
              value={
                <Span className="font-mono text-xs">{org.resourceId}</Span>
              }
            />
            {org.hostname && (
              <InfoRow
                label={t("get.widget.labels.hostname")}
                value={
                  <Span className="font-mono text-xs">{org.hostname}</Span>
                }
              />
            )}
          </Div>

          <Div>
            <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
              {t("get.widget.sections.network")}
            </Span>
            <Div className="flex flex-wrap gap-2">
              <Badge
                on={org.dataEnabled}
                onLabel={t("get.widget.badges.dataOn")}
                offLabel={t("get.widget.badges.dataOff")}
              />
              <Badge
                on={org.vpnEnabled}
                onLabel={t("get.widget.badges.vpnOn")}
                offLabel={t("get.widget.badges.vpnOff")}
              />
              <Badge
                on={org.privateAccess}
                onLabel={t("get.widget.badges.private")}
                offLabel={t("get.widget.badges.public")}
              />
              {org.hostnameAllowed && (
                <Badge
                  on={true}
                  onLabel={t("get.widget.badges.customHostname")}
                  offLabel=""
                />
              )}
              {org.vpnPairingMode && (
                <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  {org.vpnPairingMode}
                </Span>
              )}
              {org.ipAddressesWhitelist && (
                <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground font-mono">
                  {org.ipAddressesWhitelist}
                </Span>
              )}
            </Div>
          </Div>

          <Div>
            <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
              {t("get.widget.sections.securityServices")}
            </Span>
            <Div className="flex flex-wrap gap-2">
              <Badge
                on={org.mfaRequired}
                onLabel={t("get.widget.badges.mfaRequired")}
                offLabel={t("get.widget.badges.mfaOff")}
              />
              <Badge
                on={org.vpnOtpRequired}
                onLabel={t("get.widget.badges.vpnOtp")}
                offLabel={t("get.widget.badges.noOtp")}
              />
              <Badge
                on={org.storeEnabled}
                onLabel={t("get.widget.badges.storeOn")}
                offLabel={t("get.widget.badges.storeOff")}
              />
              <Badge
                on={org.userCanAccess}
                onLabel={t("get.widget.badges.userAccess")}
                offLabel={t("get.widget.badges.noUserAccess")}
              />
              {org.dataTemporarilyDisabled && (
                <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                  {t("get.widget.badges.dataTemporarilyDisabled")}
                </Span>
              )}
            </Div>
          </Div>
        </Div>
      )}
    </Div>
  );
}

export function OrgUpdateContainer(): React.JSX.Element {
  const { pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PUT>();
  const form = useWidgetForm<typeof definition.PUT>();
  const onSubmit = useWidgetOnSubmit();
  const data = useWidgetValue<typeof definition.PUT>();

  const isLoading = data === undefined;
  const org = data;

  const dataEnabled = form.watch("dataEnabled") ?? false;
  const vpnEnabled = form.watch("vpnEnabled") ?? false;
  const privateAccess = form.watch("privateAccess") ?? false;
  const allowDisablePrivateAccess =
    form.watch("allowDisablePrivateAccess") ?? false;
  const allowHostname = form.watch("allowHostname") ?? false;
  const storeEnabled = form.watch("storeEnabled") ?? false;
  const mfaRequired = form.watch("mfaRequired") ?? false;

  const labelValue = form.watch("label") ?? "";
  const hostnameValue = form.watch("hostname") ?? "";
  const ipWhitelistValue = form.watch("ipAddressesWhitelist") ?? "";

  return (
    <Div className="flex flex-col gap-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => goBack()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Span className="font-semibold text-sm mr-auto">
          {t("put.title")}
          {org && (
            <Span className="ml-1 text-muted-foreground font-normal">
              {"—"} {org.label}
            </Span>
          )}
        </Span>
      </Div>

      {isLoading ? (
        <Div className="h-48 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </Div>
      ) : (
        <Div className="px-4 py-3 flex flex-col gap-4">
          <Div>
            <Label className="block text-xs font-medium mb-1">
              {t("put.label.label")}
              <Span className="block text-xs text-muted-foreground font-normal mb-1">
                {t("put.label.description")}
              </Span>
            </Label>
            <Input
              value={labelValue}
              onChange={(e) =>
                form.setValue("label", e.target.value, { shouldDirty: true })
              }
              placeholder={t("put.label.placeholder")}
              className="w-full"
            />
          </Div>

          <Div>
            <Label className="block text-xs font-medium mb-1">
              {t("put.hostname.label")}
              <Span className="block text-xs text-muted-foreground font-normal mb-1">
                {t("put.hostname.description")}
              </Span>
            </Label>
            <Input
              value={hostnameValue}
              onChange={(e) =>
                form.setValue("hostname", e.target.value || null, {
                  shouldDirty: true,
                })
              }
              placeholder={t("put.hostname.placeholder")}
              className="w-full"
            />
          </Div>

          <Div>
            <Label className="block text-xs font-medium mb-1">
              {t("put.ipAddressesWhitelist.label")}
              <Span className="block text-xs text-muted-foreground font-normal mb-1">
                {t("put.ipAddressesWhitelist.description")}
              </Span>
            </Label>
            <Input
              value={ipWhitelistValue}
              onChange={(e) =>
                form.setValue("ipAddressesWhitelist", e.target.value || null, {
                  shouldDirty: true,
                })
              }
              placeholder={t("put.ipAddressesWhitelist.placeholder")}
              className="w-full"
            />
          </Div>

          <Div className="divide-y border rounded-lg px-3">
            <BoolToggle
              value={dataEnabled}
              onToggle={() =>
                form.setValue("dataEnabled", !dataEnabled, {
                  shouldDirty: true,
                })
              }
              label={t("put.dataEnabled.label")}
              description={t("put.dataEnabled.description")}
            />
            <BoolToggle
              value={vpnEnabled}
              onToggle={() =>
                form.setValue("vpnEnabled", !vpnEnabled, { shouldDirty: true })
              }
              label={t("put.vpnEnabled.label")}
              description={t("put.vpnEnabled.description")}
            />
            <BoolToggle
              value={privateAccess}
              onToggle={() =>
                form.setValue("privateAccess", !privateAccess, {
                  shouldDirty: true,
                })
              }
              label={t("put.privateAccess.label")}
              description={t("put.privateAccess.description")}
            />
            <BoolToggle
              value={allowDisablePrivateAccess}
              onToggle={() =>
                form.setValue(
                  "allowDisablePrivateAccess",
                  !allowDisablePrivateAccess,
                  { shouldDirty: true },
                )
              }
              label={t("put.allowDisablePrivateAccess.label")}
              description={t("put.allowDisablePrivateAccess.description")}
            />
            <BoolToggle
              value={allowHostname}
              onToggle={() =>
                form.setValue("allowHostname", !allowHostname, {
                  shouldDirty: true,
                })
              }
              label={t("put.allowHostname.label")}
              description={t("put.allowHostname.description")}
            />
            <BoolToggle
              value={storeEnabled}
              onToggle={() =>
                form.setValue("storeEnabled", !storeEnabled, {
                  shouldDirty: true,
                })
              }
              label={t("put.storeEnabled.label")}
              description={t("put.storeEnabled.description")}
            />
            <BoolToggle
              value={mfaRequired}
              onToggle={() =>
                form.setValue("mfaRequired", !mfaRequired, {
                  shouldDirty: true,
                })
              }
              label={t("put.mfaRequired.label")}
              description={t("put.mfaRequired.description")}
            />
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
        </Div>
      )}
    </Div>
  );
}
