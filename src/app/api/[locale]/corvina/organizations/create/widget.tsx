"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Building } from "next-vibe-ui/ui/icons/Building";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
  useWidgetForm,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";
import type { CorvinaOrganizationCreateResponseOutput } from "./definition";

type CreatedOrg = CorvinaOrganizationCreateResponseOutput;

export function OrgCreateContainer(): React.JSX.Element {
  const { pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const data = useWidgetValue<typeof definition.POST>();

  const created = data as CreatedOrg | undefined;
  const nameValue = form.watch("name") ?? "";
  const displayNameValue = form.watch("displayName") ?? "";
  const enabledValue = form.watch("enabled") ?? true;

  if (created) {
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
            {t("post.response.title")}
          </Span>
        </Div>
        <Div className="px-4 py-6 flex flex-col items-center gap-4">
          <Div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
            <Building className="h-5 w-5 text-success" />
          </Div>
          <Div className="w-full divide-y border rounded-lg px-4">
            <Div className="flex items-center justify-between py-2">
              <Span className="text-xs text-muted-foreground">
                {t("post.response.organization.id")}
              </Span>
              <Span className="text-sm font-mono font-medium">
                {created.orgId}
              </Span>
            </Div>
            <Div className="flex items-center justify-between py-2">
              <Span className="text-xs text-muted-foreground">
                {t("post.response.organization.name")}
              </Span>
              <Span className="text-sm font-mono font-medium">
                {created.nameResult}
              </Span>
            </Div>
            {created.displayNameResult && (
              <Div className="flex items-center justify-between py-2">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.organization.displayName")}
                </Span>
                <Span className="text-sm font-medium">
                  {created.displayNameResult}
                </Span>
              </Div>
            )}
            {created.createdAt && (
              <Div className="flex items-center justify-between py-2">
                <Span className="text-xs text-muted-foreground">
                  {t("post.response.organization.createdAt")}
                </Span>
                <Span className="text-xs text-muted-foreground">
                  {created.createdAt}
                </Span>
              </Div>
            )}
          </Div>
        </Div>
      </Div>
    );
  }

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
          {t("post.container.title")}
        </Span>
      </Div>

      <Div className="px-4 py-3 flex flex-col gap-4">
        <Div>
          <Label className="block text-xs font-medium mb-1">
            {t("post.name.label")}
            <Span className="block text-xs text-muted-foreground font-normal mb-1">
              {t("post.name.description")}
            </Span>
          </Label>
          <Input
            value={nameValue}
            onChange={(e) =>
              form.setValue("name", e.target.value, { shouldDirty: true })
            }
            placeholder={t("post.name.placeholder")}
            className="w-full font-mono"
          />
        </Div>

        <Div>
          <Label className="block text-xs font-medium mb-1">
            {t("post.displayName.label")}
            <Span className="block text-xs text-muted-foreground font-normal mb-1">
              {t("post.displayName.description")}
            </Span>
          </Label>
          <Input
            value={displayNameValue}
            onChange={(e) =>
              form.setValue("displayName", e.target.value, {
                shouldDirty: true,
              })
            }
            placeholder={t("post.displayName.placeholder")}
            className="w-full"
          />
        </Div>

        <Div className="flex items-center justify-between py-2 border rounded-lg px-3">
          <Div>
            <Span className="text-sm font-medium">
              {t("post.enabled.label")}
            </Span>
            <Span className="block text-xs text-muted-foreground">
              {t("post.enabled.description")}
            </Span>
          </Div>
          <Button
            type="button"
            onClick={() =>
              form.setValue("enabled", !enabledValue, { shouldDirty: true })
            }
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors p-0 min-h-0 shadow-none",
              enabledValue ? "bg-primary" : "bg-input",
            )}
          >
            <Span
              className={cn(
                "pointer-events-none inline-block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
                enabledValue ? "translate-x-4" : "translate-x-0",
              )}
            />
          </Button>
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full gap-2"
          onClick={onSubmit ?? undefined}
        >
          <Plus className="h-4 w-4" />
          {t("post.submitButton.label")}
        </Button>
      </Div>
    </Div>
  );
}
