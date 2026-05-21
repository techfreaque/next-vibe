"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Edit } from "next-vibe-ui/ui/icons/Edit";
import { Save } from "next-vibe-ui/ui/icons/Save";
import { Server } from "next-vibe-ui/ui/icons/Server";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
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
import type {
  DeviceLicenseDeleteResponseOutput,
  DeviceLicenseUpdateResponseOutput,
} from "./definition";

// ── Shared helpers ────────────────────────────────────────────────────────────

function formatDate(date: Date | string | null | undefined): string {
  if (!date) {
    return "—";
  }
  if (date instanceof Date) {
    return date.toLocaleDateString();
  }
  return new Date(date).toLocaleDateString();
}

function TopBar({
  onBack,
  icon,
  title,
  children,
}: {
  onBack: () => void;
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="flex items-center gap-2 px-3 py-2.5 border-b shrink-0">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0 shrink-0"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <Span className="text-muted-foreground shrink-0">{icon}</Span>
      <Span className="font-bold text-sm mr-auto truncate">{title}</Span>
      {children}
    </Div>
  );
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="rounded-2xl border bg-card overflow-hidden">
      <Div className="flex items-center gap-2 px-4 py-2.5 border-b bg-muted/20">
        <Span className="text-muted-foreground">{icon}</Span>
        <Span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {title}
        </Span>
      </Div>
      <Div className="p-4">{children}</Div>
    </Div>
  );
}

function DataRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}): React.JSX.Element {
  return (
    <Div className="flex items-start gap-3 py-2 border-b last:border-b-0">
      <Span className="w-32 shrink-0 text-xs text-muted-foreground pt-0.5">
        {label}
      </Span>
      <Span
        className={cn(
          "flex-1 text-xs font-medium break-all",
          mono === true && "font-mono",
        )}
      >
        {value ?? "—"}
      </Span>
    </Div>
  );
}

function FormField({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="flex flex-col gap-1.5">
      <Label className="text-xs font-semibold">{label}</Label>
      {children}
      {description && (
        <Span className="text-[11px] text-muted-foreground">{description}</Span>
      )}
    </Div>
  );
}

// ── Result card used in both containers ───────────────────────────────────────

function LicenseResultCard({
  result,
  t,
  prefix,
}: {
  result: DeviceLicenseUpdateResponseOutput | DeviceLicenseDeleteResponseOutput;
  t: (key: string) => string;
  prefix: "put" | "delete";
}): React.JSX.Element {
  return (
    <SectionCard
      icon={<Check className="h-3.5 w-3.5 text-success" />}
      title={t(`${prefix}.success.title`)}
    >
      <DataRow label={t("put.response.id")} value={String(result.id)} mono />
      <DataRow
        label={t("put.response.activationKey")}
        value={result.activationKey}
        mono
      />
      {result.serialNumber && (
        <DataRow
          label={t("put.response.serialNumber")}
          value={result.serialNumber}
          mono
        />
      )}
      {result.clientName && (
        <DataRow
          label={t("put.response.clientName")}
          value={result.clientName}
        />
      )}
      <DataRow
        label={t("put.response.fromDateVpn")}
        value={formatDate(result.fromDateVpn)}
      />
      <DataRow
        label={t("put.response.toDateVpn")}
        value={formatDate(result.toDateVpn)}
      />
      <DataRow
        label={t("put.response.activationDate")}
        value={formatDate(result.activationDate)}
      />
      {result.vpnValidityMonths !== null &&
        result.vpnValidityMonths !== undefined && (
          <DataRow
            label={t("put.response.vpnValidityMonths")}
            value={`${result.vpnValidityMonths} mo`}
          />
        )}
    </SectionCard>
  );
}

// ── Update container ──────────────────────────────────────────────────────────

export function DeviceLicenseUpdateContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PUT>();
  const form = useWidgetForm<typeof definition.PUT>();
  const onSubmit = useWidgetOnSubmit();
  const result = useWidgetValue<typeof definition.PUT>();

  const isCompact = platform === Platform.CLI || platform === Platform.MCP;

  const handleBack = useCallback((): void => {
    pop();
  }, [pop]);

  const serialNumber = form.watch("serialNumber") ?? "";
  const clientName = form.watch("clientName") ?? "";
  const notes = form.watch("notes") ?? "";
  const vpnValidityMonths = form.watch("vpnValidityMonths");
  const vpnAccountingDisabled = form.watch("vpnAccountingDisabled") ?? false;

  if (isCompact) {
    if (result !== null && result !== undefined) {
      return (
        <Div className="font-mono text-xs p-2">
          {`updated:#${result.id} serial:${result.serialNumber ?? "—"} key:${result.activationKey}`}
        </Div>
      );
    }
    return <Div />;
  }

  if (result !== null && result !== undefined) {
    return (
      <Div className="flex flex-col min-h-0 bg-background">
        <TopBar
          onBack={handleBack}
          icon={<Edit className="h-3.5 w-3.5" />}
          title={t("put.success.title")}
        />
        <Div className="overflow-y-auto flex-1 max-h-[min(700px,calc(100dvh-80px))] p-4 flex flex-col gap-3">
          <LicenseResultCard
            result={result}
            t={t as (key: string) => string}
            prefix="put"
          />
          <Button
            type="button"
            variant="ghost"
            className="w-full h-9 gap-2 text-xs"
            onClick={handleBack}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("put.widget.back")}
          </Button>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col min-h-0 bg-background">
      <TopBar
        onBack={handleBack}
        icon={<Edit className="h-3.5 w-3.5" />}
        title={t("put.title")}
      />
      <Div className="overflow-y-auto flex-1 max-h-[min(700px,calc(100dvh-80px))] p-4 flex flex-col gap-3">
        <SectionCard
          icon={<Server className="h-3.5 w-3.5" />}
          title={t("put.title")}
        >
          <Div className="flex flex-col gap-4">
            <FormField
              label={t("put.serialNumber.label")}
              description={t("put.serialNumber.description")}
            >
              <Input
                value={serialNumber}
                onChange={(e) =>
                  form.setValue("serialNumber", e.target.value, {
                    shouldDirty: true,
                  })
                }
                placeholder="SN-ABC-001"
              />
            </FormField>
            <FormField
              label={t("put.clientName.label")}
              description={t("put.clientName.description")}
            >
              <Input
                value={clientName}
                onChange={(e) =>
                  form.setValue("clientName", e.target.value, {
                    shouldDirty: true,
                  })
                }
              />
            </FormField>
            <FormField
              label={t("put.notes.label")}
              description={t("put.notes.description")}
            >
              <Input
                value={notes}
                onChange={(e) =>
                  form.setValue("notes", e.target.value, {
                    shouldDirty: true,
                  })
                }
              />
            </FormField>
            <FormField
              label={t("put.vpnValidityMonths.label")}
              description={t("put.vpnValidityMonths.description")}
            >
              <Input
                type="number"
                value={vpnValidityMonths}
                onChange={(e) =>
                  form.setValue(
                    "vpnValidityMonths",
                    e.target.value ? Number(e.target.value) : undefined,
                    { shouldDirty: true },
                  )
                }
              />
            </FormField>
            <Div className="flex items-center gap-2 py-1">
              <Checkbox
                id="put-vpn-accounting-disabled"
                checked={vpnAccountingDisabled}
                onCheckedChange={(checked) => {
                  form.setValue("vpnAccountingDisabled", Boolean(checked), {
                    shouldDirty: true,
                  });
                }}
              />
              <Label
                htmlFor="put-vpn-accounting-disabled"
                className="text-xs font-medium cursor-pointer"
              >
                {t("put.vpnAccountingDisabled.label")}
              </Label>
            </Div>
          </Div>
        </SectionCard>

        <Button
          type="button"
          variant="default"
          className="w-full h-10 gap-2 text-sm font-semibold"
          onClick={onSubmit ?? undefined}
        >
          <Save className="h-4 w-4" />
          {t("put.submitButton.label")}
        </Button>
      </Div>
    </Div>
  );
}

// ── Delete container ──────────────────────────────────────────────────────────

export function DeviceLicenseDeleteContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.DELETE>();
  const form = useWidgetForm<typeof definition.DELETE>();
  const onSubmit = useWidgetOnSubmit();
  const result = useWidgetValue<typeof definition.DELETE>();

  const isCompact = platform === Platform.CLI || platform === Platform.MCP;

  const handleBack = useCallback((): void => {
    pop();
  }, [pop]);

  const deleteOrgResourceId = form.watch("deleteOrgResourceId") ?? "";

  if (isCompact) {
    if (result !== null && result !== undefined) {
      return (
        <Div className="font-mono text-xs p-2">
          {`deleted:#${result.id} key:${result.activationKey}`}
        </Div>
      );
    }
    return <Div />;
  }

  if (result !== null && result !== undefined) {
    return (
      <Div className="flex flex-col min-h-0 bg-background">
        <TopBar
          onBack={handleBack}
          icon={<Trash2 className="h-3.5 w-3.5 text-destructive" />}
          title={t("delete.success.title")}
        />
        <Div className="overflow-y-auto flex-1 max-h-[min(700px,calc(100dvh-80px))] p-4 flex flex-col gap-3">
          <LicenseResultCard
            result={result}
            t={t as (key: string) => string}
            prefix="delete"
          />
          <Button
            type="button"
            variant="ghost"
            className="w-full h-9 gap-2 text-xs"
            onClick={handleBack}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("delete.widget.back")}
          </Button>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col min-h-0 bg-background">
      <TopBar
        onBack={handleBack}
        icon={<Trash2 className="h-3.5 w-3.5 text-destructive" />}
        title={t("delete.title")}
      />
      <Div className="overflow-y-auto flex-1 max-h-[min(700px,calc(100dvh-80px))] p-4 flex flex-col gap-3">
        <SectionCard
          icon={<Trash2 className="h-3.5 w-3.5 text-destructive" />}
          title={t("delete.title")}
        >
          <FormField
            label={t("delete.deleteOrgResourceId.label")}
            description={t("delete.deleteOrgResourceId.description")}
          >
            <Input
              value={deleteOrgResourceId}
              onChange={(e) =>
                form.setValue("deleteOrgResourceId", e.target.value, {
                  shouldDirty: true,
                })
              }
              placeholder="exorde.connex.connectika"
              className="font-mono"
            />
          </FormField>
        </SectionCard>

        <Button
          type="button"
          variant="destructive"
          className="w-full h-10 gap-2 text-sm font-semibold"
          onClick={onSubmit ?? undefined}
        >
          <Trash2 className="h-4 w-4" />
          {t("delete.submitButton.label")}
        </Button>
      </Div>
    </Div>
  );
}
