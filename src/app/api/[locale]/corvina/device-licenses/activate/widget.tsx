"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
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

// ── Shared helpers ────────────────────────────────────────────────────────────

function formatDate(val: Date | string | null | undefined): string {
  if (!val) {
    return "—";
  }
  if (val instanceof Date) {
    return val.toLocaleDateString();
  }
  return new Date(val).toLocaleDateString();
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

// ── Container ─────────────────────────────────────────────────────────────────

export function DeviceLicenseActivateContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const result = useWidgetValue<typeof definition.POST>();

  const isCompact = platform === Platform.CLI || platform === Platform.MCP;

  const handleBack = useCallback((): void => {
    pop();
  }, [pop]);

  const activationKey = form.watch("activationKey") ?? "";
  const alias = form.watch("alias") ?? "";
  const deviceSerialNumber = form.watch("deviceSerialNumber") ?? "";
  const activateDescription = form.watch("activateDescription") ?? "";
  const orgResourceId = form.watch("orgResourceId") ?? "";
  const logicalId = form.watch("logicalId") ?? "";
  const numOfSecondsVpn = form.watch("numOfSecondsVpn");
  const autorenewVpn = form.watch("autorenewVpn") ?? false;

  if (isCompact) {
    if (result !== null && result !== undefined) {
      return (
        <Div className="font-mono text-xs p-2">
          {`activated:#${result.id} key:${result.activationKeyOut} used:${String(result.used)}`}
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
          icon={<Shield className="h-3.5 w-3.5 text-success" />}
          title={t("post.success.title")}
        />
        <Div className="overflow-y-auto flex-1 max-h-[min(700px,calc(100dvh-80px))] p-4 flex flex-col gap-3">
          <Div className="flex flex-col items-center gap-4 py-4">
            <Div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center">
              <Check className="h-7 w-7 text-success" />
            </Div>
            <Span className="font-bold text-base font-mono">
              {result.activationKeyOut}
            </Span>
            <Span className="text-xs text-muted-foreground text-center">
              {t("post.success.description")}
            </Span>
          </Div>
          <SectionCard
            icon={<Shield className="h-3.5 w-3.5" />}
            title={t("post.widget.result")}
          >
            <DataRow
              label={t("post.response.id")}
              value={String(result.id)}
              mono
            />
            <DataRow
              label={t("post.response.activationKey")}
              value={result.activationKeyOut}
              mono
            />
            {result.serialNumber && (
              <DataRow
                label={t("post.response.serialNumber")}
                value={result.serialNumber}
                mono
              />
            )}
            {result.realm && (
              <DataRow
                label={t("post.response.realm")}
                value={result.realm}
                mono
              />
            )}
            {result.orgResourceIdOut && (
              <DataRow
                label={t("post.response.orgResourceId")}
                value={result.orgResourceIdOut}
                mono
              />
            )}
            {result.activationDate && (
              <DataRow
                label={t("post.response.activationDate")}
                value={formatDate(result.activationDate)}
              />
            )}
          </SectionCard>
          <Button
            type="button"
            variant="ghost"
            className="w-full h-9 gap-2 text-xs"
            onClick={handleBack}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("post.widget.back")}
          </Button>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col min-h-0 bg-background">
      <TopBar
        onBack={handleBack}
        icon={<Shield className="h-3.5 w-3.5" />}
        title={t("post.widget.title")}
      />
      <Div className="overflow-y-auto flex-1 max-h-[min(700px,calc(100dvh-80px))] p-4 flex flex-col gap-3">
        <SectionCard
          icon={<Shield className="h-3.5 w-3.5" />}
          title={t("post.title")}
        >
          <Div className="flex flex-col gap-4">
            <FormField
              label={t("post.activationKey.label")}
              description={t("post.activationKey.description")}
            >
              <Input
                value={activationKey}
                onChange={(e) =>
                  form.setValue("activationKey", e.target.value, {
                    shouldDirty: true,
                  })
                }
                placeholder="ACT-KEY-001"
                className="font-mono"
              />
            </FormField>
            <Div className="grid grid-cols-2 gap-3">
              <FormField
                label={t("post.alias.label")}
                description={t("post.alias.description")}
              >
                <Input
                  value={alias}
                  onChange={(e) =>
                    form.setValue("alias", e.target.value || undefined, {
                      shouldDirty: true,
                    })
                  }
                />
              </FormField>
              <FormField
                label={t("post.deviceSerialNumber.label")}
                description={t("post.deviceSerialNumber.description")}
              >
                <Input
                  value={deviceSerialNumber}
                  onChange={(e) =>
                    form.setValue(
                      "deviceSerialNumber",
                      e.target.value || undefined,
                      { shouldDirty: true },
                    )
                  }
                  placeholder="SN-ABC-001"
                  className="font-mono"
                />
              </FormField>
              <FormField
                label={t("post.orgResourceId.label")}
                description={t("post.orgResourceId.description")}
              >
                <Input
                  value={orgResourceId}
                  onChange={(e) =>
                    form.setValue(
                      "orgResourceId",
                      e.target.value || undefined,
                      { shouldDirty: true },
                    )
                  }
                  className="font-mono"
                />
              </FormField>
              <FormField
                label={t("post.logicalId.label")}
                description={t("post.logicalId.description")}
              >
                <Input
                  value={logicalId}
                  onChange={(e) =>
                    form.setValue("logicalId", e.target.value || undefined, {
                      shouldDirty: true,
                    })
                  }
                  className="font-mono"
                />
              </FormField>
            </Div>
            <FormField
              label={t("post.activateDescription.label")}
              description={t("post.activateDescription.description")}
            >
              <Input
                value={activateDescription}
                onChange={(e) =>
                  form.setValue(
                    "activateDescription",
                    e.target.value || undefined,
                    { shouldDirty: true },
                  )
                }
              />
            </FormField>
            <FormField
              label={t("post.numOfSecondsVpn.label")}
              description={t("post.numOfSecondsVpn.description")}
            >
              <Input
                type="number"
                value={numOfSecondsVpn}
                onChange={(e) =>
                  form.setValue(
                    "numOfSecondsVpn",
                    e.target.value ? Number(e.target.value) : undefined,
                    { shouldDirty: true },
                  )
                }
                placeholder="3600"
              />
            </FormField>
            <Div className="flex items-center gap-2 py-1">
              <Checkbox
                id="act-autorenew-vpn"
                checked={autorenewVpn}
                onCheckedChange={(checked) => {
                  form.setValue("autorenewVpn", Boolean(checked), {
                    shouldDirty: true,
                  });
                }}
              />
              <Label
                htmlFor="act-autorenew-vpn"
                className="text-xs font-medium cursor-pointer"
              >
                {t("post.autorenewVpn.label")}
              </Label>
            </Div>
          </Div>
        </SectionCard>

        <Button
          type="button"
          variant="default"
          className="w-full h-10 gap-2 text-sm font-semibold"
          onClick={onSubmit ?? undefined}
          disabled={activationKey === ""}
        >
          <Shield className="h-4 w-4" />
          {t("post.submitButton.label")}
        </Button>
      </Div>
    </Div>
  );
}
