"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { Check } from "next-vibe-ui/ui/icons/Check";
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

function formatDate(val: string | Date | null | undefined): string {
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
}: {
  onBack: () => void;
  icon: React.ReactNode;
  title: string;
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

export function DeviceLicenseMigrateContainer(): React.JSX.Element {
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

  const oldActivationKeyId = form.watch("oldActivationKeyId");
  const newRealm = form.watch("newRealm") ?? "";

  if (isCompact) {
    if (result !== null && result !== undefined) {
      return (
        <Div className="font-mono text-xs p-2">
          {`migrated to realm:${result.logicalId}`}
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
          icon={<Check className="h-3.5 w-3.5 text-success" />}
          title={t("post.success.title")}
        />
        <Div className="overflow-y-auto flex-1 max-h-[min(700px,calc(100dvh-80px))] p-4 flex flex-col gap-3">
          <SectionCard
            icon={<ArrowRight className="h-3.5 w-3.5" />}
            title={t("post.success.title")}
          >
            <DataRow
              label={t("post.response.logicalId")}
              value={result.logicalId}
              mono
            />
            {result.serialNumber && (
              <DataRow
                label={t("post.response.serialNumber")}
                value={result.serialNumber}
                mono
              />
            )}
            {result.clientName && (
              <DataRow
                label={t("post.response.clientName")}
                value={result.clientName}
              />
            )}
            {result.activationKey && (
              <DataRow
                label={t("post.response.activationKey")}
                value={result.activationKey}
                mono
              />
            )}
            <DataRow
              label={t("post.response.activationDate")}
              value={formatDate(result.activationDate)}
            />
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
        icon={<ArrowRight className="h-3.5 w-3.5" />}
        title={t("post.widget.title")}
      />
      <Div className="overflow-y-auto flex-1 max-h-[min(700px,calc(100dvh-80px))] p-4 flex flex-col gap-3">
        <SectionCard
          icon={<ArrowRight className="h-3.5 w-3.5" />}
          title={t("post.title")}
        >
          <Div className="grid grid-cols-2 gap-4">
            <FormField
              label={t("post.oldActivationKeyId.label")}
              description={t("post.oldActivationKeyId.description")}
            >
              <Input
                type="number"
                value={oldActivationKeyId}
                onChange={(e) =>
                  form.setValue("oldActivationKeyId", Number(e.target.value), {
                    shouldDirty: true,
                  })
                }
                placeholder={t("post.oldActivationKeyId.placeholder")}
              />
            </FormField>
            <FormField
              label={t("post.newRealm.label")}
              description={t("post.newRealm.description")}
            >
              <Input
                value={newRealm}
                onChange={(e) =>
                  form.setValue("newRealm", e.target.value, {
                    shouldDirty: true,
                  })
                }
                placeholder={t("post.newRealm.placeholder")}
                className="font-mono"
              />
            </FormField>
          </Div>
        </SectionCard>

        <Button
          type="button"
          variant="default"
          className="w-full h-10 gap-2 text-sm font-semibold"
          onClick={onSubmit ?? undefined}
        >
          <ArrowRight className="h-4 w-4" />
          {t("post.submitButton.label")}
        </Button>
      </Div>
    </Div>
  );
}
