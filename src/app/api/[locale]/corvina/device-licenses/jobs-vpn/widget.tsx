"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
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
        <Span className={cn("text-[11px] text-muted-foreground")}>
          {description}
        </Span>
      )}
    </Div>
  );
}

export function DeviceLicensesJobsVpnContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const result = useWidgetValue<typeof definition.GET>();

  const isCompact = platform === Platform.CLI || platform === Platform.MCP;

  const handleBack = useCallback((): void => {
    pop();
  }, [pop]);

  const nowValue = form.watch("now");

  if (isCompact) {
    if (result !== null && result !== undefined) {
      return (
        <Div className="font-mono text-xs p-2">
          {result.result ?? t("get.widget.noResult")}
        </Div>
      );
    }
    return <Div />;
  }

  return (
    <Div className="flex flex-col min-h-0 bg-background">
      <TopBar
        onBack={handleBack}
        icon={<RefreshCw className="h-3.5 w-3.5" />}
        title={t("get.widget.title")}
      />
      <Div className="overflow-y-auto flex-1 max-h-[min(700px,calc(100dvh-80px))] p-4 flex flex-col gap-3">
        <SectionCard
          icon={<RefreshCw className="h-3.5 w-3.5" />}
          title={t("get.title")}
        >
          <FormField
            label={t("get.now.label")}
            description={t("get.now.description")}
          >
            <Input
              type="number"
              value={nowValue}
              onChange={(e) => {
                form.setValue(
                  "now",
                  e.target.value ? Number(e.target.value) : undefined,
                  { shouldDirty: true },
                );
              }}
              placeholder={t("get.now.placeholder")}
            />
          </FormField>
        </SectionCard>

        {result !== null && result !== undefined && (
          <SectionCard
            icon={<Check className="h-3.5 w-3.5 text-success" />}
            title={t("get.response.result")}
          >
            <Span className="font-mono text-sm text-success block">
              {result.result ?? t("get.widget.noResult")}
            </Span>
          </SectionCard>
        )}

        <Button
          type="button"
          variant="default"
          className="w-full h-10 gap-2 text-sm font-semibold"
          onClick={onSubmit ?? undefined}
        >
          <RefreshCw className="h-4 w-4" />
          {t("get.submitButton.label")}
        </Button>
      </Div>
    </Div>
  );
}
