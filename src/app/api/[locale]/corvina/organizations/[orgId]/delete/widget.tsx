"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import {
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";
import type { CorvinaOrgDeleteResponseOutput } from "./definition";

type OrgDeleted = CorvinaOrgDeleteResponseOutput;

export function OrgDeleteContainer(): React.JSX.Element {
  const { pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.DELETE>();
  const onSubmit = useWidgetOnSubmit();
  const data = useWidgetValue<typeof definition.DELETE>();

  const isLoading = data === undefined;
  const deleted = data as OrgDeleted | null | undefined;
  const isDeleted = deleted !== undefined && deleted !== null;

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
          {t("delete.title")}
        </Span>
      </Div>

      {isLoading ? (
        <Div className="h-48 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </Div>
      ) : isDeleted ? (
        <Div className="px-4 py-6 flex flex-col items-center gap-3 text-center">
          <CheckCircle className="h-10 w-10 text-success" />
          <Span className="font-semibold text-sm">
            {t("delete.widget.deletedTitle")}
          </Span>
          <Span className="text-xs text-muted-foreground">
            {deleted.name} (#{deleted.id})
          </Span>
          <Span className="text-xs text-muted-foreground">
            {t("delete.widget.deletedDescription")}
          </Span>
        </Div>
      ) : (
        <Div className="px-4 py-4 flex flex-col gap-4">
          <Div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <Span className="text-sm text-destructive">
              {t("delete.widget.warning")}
            </Span>
          </Div>
          <Div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => goBack()}
            >
              {t("delete.widget.cancelButton")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="flex-1 gap-2"
              onClick={onSubmit ?? undefined}
            >
              <Trash2 className="h-4 w-4" />
              {t("delete.widget.confirmButton")}
            </Button>
          </Div>
        </Div>
      )}
    </Div>
  );
}
