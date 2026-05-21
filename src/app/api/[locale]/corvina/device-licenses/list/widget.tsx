"use client";

import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
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
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";

import definition from "./definition";
import type { DeviceLicensesListResponseOutput } from "./definition";

type DeviceLicenseItem =
  DeviceLicensesListResponseOutput["deviceLicenses"][number];

function DeviceLicenseRow({
  license,
  compact,
}: {
  license: DeviceLicenseItem;
  compact: boolean;
}): React.JSX.Element {
  if (compact) {
    return (
      <Div className="py-1 text-sm font-mono">
        <Span className="font-semibold">{`id:${license.id}`}</Span>
        {license.serialNumber !== null &&
          license.serialNumber !== undefined && (
            <Span className="ml-2">{`serial:${license.serialNumber}`}</Span>
          )}
        {license.clientName !== null && license.clientName !== undefined && (
          <Span className="ml-2">{`client:${license.clientName}`}</Span>
        )}
        <Span className="ml-2">{`used:${license.used ? "Y" : "N"}`}</Span>
      </Div>
    );
  }

  return (
    <Div className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-accent transition-colors">
      <Div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <Shield className="h-4 w-4 text-primary" />
      </Div>

      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-semibold text-sm font-mono">{`#${license.id}`}</Span>
          {license.serialNumber !== null &&
            license.serialNumber !== undefined && (
              <Span className="text-xs text-muted-foreground font-mono">
                {license.serialNumber}
              </Span>
            )}
          {license.clientName !== null && license.clientName !== undefined && (
            <Span className="text-xs font-medium">{license.clientName}</Span>
          )}
        </Div>
        <Div className="mt-1 flex items-center gap-2 flex-wrap">
          {license.realm !== null && license.realm !== undefined && (
            <Span className="text-xs text-muted-foreground font-mono">
              {license.realm}
            </Span>
          )}
          <Span
            className={
              license.used
                ? "text-xs font-semibold text-success"
                : "text-xs text-muted-foreground"
            }
          >
            {license.used ? "used" : "unused"}
          </Span>
          {license.deleted && (
            <Span className="text-xs font-semibold text-destructive">
              deleted
            </Span>
          )}
          {license.vpnEnabled === true && (
            <Span className="text-xs font-mono text-primary">vpn</Span>
          )}
        </Div>
      </Div>

      <Div className="flex flex-col items-end gap-0.5 shrink-0">
        {license.orgResourceId !== null &&
          license.orgResourceId !== undefined && (
            <Span className="text-xs text-muted-foreground font-mono">
              {license.orgResourceId}
            </Span>
          )}
        {license.activationKey !== "" && (
          <Span className="text-xs text-muted-foreground/60 font-mono">
            {license.activationKey}
          </Span>
        )}
      </Div>
    </Div>
  );
}

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

export function DeviceLicensesListContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { endpointMutations } = useWidgetContext();
  const { pop, push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const licenses = data?.deviceLicenses ?? [];
  const total = data?.total ?? 0;
  const isLoading = data === undefined;
  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleCreate = useCallback((): void => {
    void (async (): Promise<void> => {
      navigate(definition.POST, {});
    })();
  }, [navigate]);

  if (isCompact) {
    if (!data) {
      return <Div />;
    }
    return (
      <Div className="font-mono text-sm p-2">
        <Div className="font-semibold mb-1">
          {t("get.widget.title")} ({licenses.length}/{total})
          {isMcp && ` — use page/pageSize to paginate`}
        </Div>
        {licenses.length === 0 ? (
          <Div className="text-muted-foreground">
            {t("get.widget.noItemsFound")}
          </Div>
        ) : (
          licenses.map((license, idx) => (
            <DeviceLicenseRow key={idx} license={license} compact={true} />
          ))
        )}
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
        <Shield className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("get.widget.title")}
          {total > 0 && (
            <Span className="ml-2 text-xs text-muted-foreground font-normal">
              ({total})
            </Span>
          )}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCreate}
          title={t("post.title")}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title={t("get.widget.refresh")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))]">
        {isLoading ? (
          <Div className="h-48 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </Div>
        ) : licenses.length === 0 ? (
          <Div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <Shield className="h-8 w-8 opacity-30" />
            <Span className="text-sm">{t("get.widget.noItemsFound")}</Span>
          </Div>
        ) : (
          licenses.map((license, idx) => (
            <DeviceLicenseRow key={idx} license={license} compact={false} />
          ))
        )}
      </Div>
    </Div>
  );
}

export function DeviceLicenseCreateContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { endpointMutations } = useWidgetContext();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>();

  const isMcp = platform === Platform.MCP;
  const isCli = platform === Platform.CLI;
  const isCompact = isCli || isMcp;

  const [activationKey, setActivationKey] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [notes, setNotes] = useState("");
  const [vpnValidityMonthsStr, setVpnValidityMonthsStr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback((): void => {
    setIsSubmitting(true);
    void endpointMutations?.create
      ?.submit({
        activationKey,
        serialNumber: serialNumber !== "" ? serialNumber : undefined,
        clientName: clientName !== "" ? clientName : undefined,
        notes: notes !== "" ? notes : undefined,
        vpnValidityMonths:
          vpnValidityMonthsStr !== ""
            ? Number(vpnValidityMonthsStr)
            : undefined,
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }, [
    endpointMutations,
    activationKey,
    serialNumber,
    clientName,
    notes,
    vpnValidityMonthsStr,
  ]);

  if (isCompact && result) {
    return (
      <Div className="font-mono text-sm p-2">
        {`created device #${result.id}: serial:${result.serialNumberOut ?? "—"} key:${result.activationKey}`}
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
        <Plus className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("post.widget.title")}
        </Span>
      </Div>

      <Div className="p-4 flex flex-col gap-4">
        <FormAlertWidget field={{}} />

        <Div className="grid grid-cols-2 gap-3">
          <Div className="space-y-1.5">
            <Label htmlFor="dl-activation-key">
              {t("post.activationKey.label")}
            </Label>
            <Input
              id="dl-activation-key"
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
            <Label htmlFor="dl-serial-number">
              {t("post.serialNumber.label")}
            </Label>
            <Input
              id="dl-serial-number"
              type="text"
              value={serialNumber}
              onChange={(e) => {
                setSerialNumber(e.target.value);
              }}
              placeholder="SN-ABC-001"
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.serialNumber.description")}
            </Span>
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="dl-client-name">{t("post.clientName.label")}</Label>
            <Input
              id="dl-client-name"
              type="text"
              value={clientName}
              onChange={(e) => {
                setClientName(e.target.value);
              }}
              placeholder="Acme Corp"
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.clientName.description")}
            </Span>
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="dl-vpn-validity">
              {t("post.vpnValidityMonths.label")}
            </Label>
            <Input
              id="dl-vpn-validity"
              type="text"
              value={vpnValidityMonthsStr}
              onChange={(e) => {
                setVpnValidityMonthsStr(e.target.value);
              }}
              placeholder="12"
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.vpnValidityMonths.description")}
            </Span>
          </Div>

          <Div className="col-span-2 space-y-1.5">
            <Label htmlFor="dl-notes">{t("post.notes.label")}</Label>
            <Input
              id="dl-notes"
              type="text"
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
              }}
              placeholder=""
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.notes.description")}
            </Span>
          </Div>
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full gap-2"
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
              <Plus className="h-4 w-4" />
              {t("post.submitButton.label")}
            </>
          )}
        </Button>

        {result !== undefined && (
          <Div className="rounded-xl border bg-card p-4 space-y-3">
            <Span className="font-semibold text-sm text-success">
              {t("post.widget.result.title")}
            </Span>
            <Div className="grid grid-cols-2 gap-3">
              <ResultRow
                label={t("get.response.deviceLicenses.id")}
                value={String(result.id)}
              />
              <ResultRow
                label={t("get.response.deviceLicenses.activationKey")}
                value={result.activationKey}
              />
              {result.serialNumberOut !== null &&
                result.serialNumberOut !== undefined && (
                  <ResultRow
                    label={t("get.response.deviceLicenses.serialNumber")}
                    value={result.serialNumberOut}
                  />
                )}
              {result.clientName !== null &&
                result.clientName !== undefined && (
                  <ResultRow
                    label={t("get.response.deviceLicenses.clientName")}
                    value={result.clientName}
                  />
                )}
              {result.realm !== null && result.realm !== undefined && (
                <ResultRow
                  label={t("get.response.deviceLicenses.realm")}
                  value={result.realm}
                />
              )}
              <ResultRow
                label={t("get.response.deviceLicenses.used")}
                value={result.used ? "Yes" : "No"}
              />
            </Div>
          </Div>
        )}
      </Div>
    </Div>
  );
}
