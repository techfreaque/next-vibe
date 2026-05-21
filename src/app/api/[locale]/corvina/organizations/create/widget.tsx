"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Building } from "next-vibe-ui/ui/icons/Building";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

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
import type { CorvinaOrganizationCreateResponseOutput } from "./definition";

type CreatedOrg = CorvinaOrganizationCreateResponseOutput;

function Toggle({
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
    <Div className="flex items-center justify-between px-4 py-3">
      <Div className="flex-1 min-w-0 pr-4">
        <Span className="text-sm font-medium block">{label}</Span>
        <Span className="block text-xs text-muted-foreground mt-0.5">
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

export function OrgCreateContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const data = useWidgetValue<typeof definition.POST>();

  const created = data as CreatedOrg | undefined;
  const isCompact = platform === Platform.CLI || platform === Platform.MCP;

  const nameValue = form.watch("name") ?? "";
  const displayNameValue = form.watch("displayName") ?? "";
  const enabledValue = form.watch("enabled") ?? true;

  // ── Compact ──
  if (isCompact) {
    if (!created) {
      return <Div />;
    }
    return (
      <Div className="flex-col">
        <Div>{`created: ${created.nameResult} (${created.orgId})`}</Div>
        {created.displayNameResult && (
          <Div>{`displayName: ${created.displayNameResult}`}</Div>
        )}
      </Div>
    );
  }

  // ── Success ──
  if (created) {
    return (
      <Div className="flex flex-col min-h-0 bg-background">
        <Div className="flex items-center gap-2 px-3 py-2.5 border-b shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 shrink-0"
            onClick={() => goBack()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Building className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <Span className="font-bold text-sm mr-auto">
            {t("post.success.title")}
          </Span>
        </Div>

        <Div className="p-6 flex flex-col items-center gap-5">
          <Div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
            <Check className="h-7 w-7 text-success" />
          </Div>
          <Div className="text-center">
            <Span className="block font-bold text-base">
              {created.displayNameResult ?? created.nameResult}
            </Span>
            <Span className="block text-sm text-muted-foreground mt-1">
              {t("post.success.description")}
            </Span>
          </Div>

          <Div className="w-full rounded-2xl border bg-card overflow-hidden">
            <Div className="flex items-center gap-3 px-4 py-3 border-b">
              <Span className="text-xs text-muted-foreground w-24 shrink-0">
                {t("post.response.organization.id")}
              </Span>
              <Span className="text-xs font-mono font-medium">
                {created.orgId}
              </Span>
            </Div>
            <Div className="flex items-center gap-3 px-4 py-3 border-b">
              <Span className="text-xs text-muted-foreground w-24 shrink-0">
                {t("post.response.organization.name")}
              </Span>
              <Span className="text-xs font-mono font-medium">
                {created.nameResult}
              </Span>
            </Div>
            {created.createdAt && (
              <Div className="flex items-center gap-3 px-4 py-3">
                <Span className="text-xs text-muted-foreground w-24 shrink-0">
                  {t("post.response.organization.createdAt")}
                </Span>
                <Span className="text-xs text-muted-foreground">
                  {new Date(created.createdAt).toLocaleString()}
                </Span>
              </Div>
            )}
          </Div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 mt-1"
            onClick={() => goBack()}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("post.backButton.label")}
          </Button>
        </Div>
      </Div>
    );
  }

  // ── Form ──
  return (
    <Div className="flex flex-col min-h-0 bg-background">
      <Div className="flex items-center gap-2 px-3 py-2.5 border-b shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 shrink-0"
          onClick={() => goBack()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Building className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <Span className="font-bold text-sm mr-auto">
          {t("post.container.title")}
        </Span>
      </Div>

      <Div className="overflow-y-auto flex-1 max-h-[min(700px,calc(100dvh-80px))] p-4 flex flex-col gap-3">
        <Div className="rounded-2xl border bg-card overflow-hidden">
          <Div className="flex items-center gap-2 px-4 py-2.5 border-b bg-muted/20">
            <Building className="h-3.5 w-3.5 text-muted-foreground" />
            <Span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {t("post.container.title")}
            </Span>
          </Div>
          <Div className="p-4 flex flex-col gap-4">
            <Div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold">
                {t("post.name.label")}
              </Label>
              <Input
                value={nameValue}
                onChange={(e) =>
                  form.setValue("name", e.target.value, { shouldDirty: true })
                }
                placeholder={t("post.name.placeholder")}
                className="font-mono"
              />
              <Span className="text-[11px] text-muted-foreground">
                {t("post.name.description")}
              </Span>
            </Div>

            <Div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold">
                {t("post.displayName.label")}
              </Label>
              <Input
                value={displayNameValue}
                onChange={(e) =>
                  form.setValue("displayName", e.target.value, {
                    shouldDirty: true,
                  })
                }
                placeholder={t("post.displayName.placeholder")}
              />
              <Span className="text-[11px] text-muted-foreground">
                {t("post.displayName.description")}
              </Span>
            </Div>
          </Div>

          <Toggle
            value={enabledValue}
            onToggle={() =>
              form.setValue("enabled", !enabledValue, { shouldDirty: true })
            }
            label={t("post.enabled.label")}
            description={t("post.enabled.description")}
          />
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full h-10 gap-2 text-sm font-semibold"
          onClick={onSubmit ?? undefined}
        >
          <Plus className="h-4 w-4" />
          {t("post.submitButton.label")}
        </Button>
      </Div>
    </Div>
  );
}
