"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Building } from "next-vibe-ui/ui/icons/Building";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";
import type { CorvinaOrgDeleteResponseOutput } from "./definition";

type OrgDeleted = CorvinaOrgDeleteResponseOutput;

export function OrgDeleteContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.DELETE>();
  const onSubmit = useWidgetOnSubmit();
  const data = useWidgetValue<typeof definition.DELETE>();

  const isCompact = platform === Platform.CLI || platform === Platform.MCP;
  const deleted = data as OrgDeleted | null | undefined;
  const isDeleted = deleted !== undefined && deleted !== null;

  // ── Compact ──
  if (isCompact) {
    if (isDeleted) {
      return (
        <Div className="flex-col">
          <Div>{`deleted: ${deleted.name} (#${deleted.id})`}</Div>
        </Div>
      );
    }
    return <Div />;
  }

  // ── Success ──
  if (isDeleted) {
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
          <Span className="font-bold text-sm mr-auto">
            {t("delete.widget.deletedTitle")}
          </Span>
        </Div>
        <Div className="p-8 flex flex-col items-center gap-4 text-center">
          <Div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
            <Check className="h-7 w-7 text-success" />
          </Div>
          <Div>
            <Span className="block font-bold text-base">{deleted.name}</Span>
            <Span className="block text-xs font-mono text-muted-foreground mt-1">
              #{deleted.id}
            </Span>
            <Span className="block text-sm text-muted-foreground mt-2">
              {t("delete.widget.deletedDescription")}
            </Span>
          </Div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 mt-2"
            onClick={() => goBack()}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("delete.widget.backButton")}
          </Button>
        </Div>
      </Div>
    );
  }

  // ── Confirm ──
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
        <Trash2 className="h-3.5 w-3.5 text-destructive shrink-0" />
        <Span className="font-bold text-sm mr-auto">{t("delete.title")}</Span>
      </Div>

      <Div className="p-6 flex flex-col items-center gap-5">
        <Div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <Building className="h-7 w-7 text-destructive" />
        </Div>

        <Div className="w-full rounded-2xl border border-destructive/20 bg-destructive/5 p-4 flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <Span className="text-sm text-destructive leading-relaxed">
            {t("delete.widget.warning")}
          </Span>
        </Div>

        <Div className="flex gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-10"
            onClick={() => goBack()}
          >
            {t("delete.widget.cancelButton")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="flex-1 h-10 gap-2"
            onClick={onSubmit ?? undefined}
          >
            <Trash2 className="h-4 w-4" />
            {t("delete.widget.confirmButton")}
          </Button>
        </Div>
      </Div>
    </Div>
  );
}
