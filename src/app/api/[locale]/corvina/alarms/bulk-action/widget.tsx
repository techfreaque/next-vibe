"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import {
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";

export function BulkAlarmActionContainer(): React.JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();

  const succeeded = data !== undefined && data.success;

  if (succeeded) {
    return (
      <Div className="px-4 py-8 flex flex-col items-center gap-3 text-center">
        <Div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
          <Check className="h-5 w-5 text-success" />
        </Div>
        <Span className="font-semibold text-sm">
          {t("post.widget.successTitle")}
        </Span>
        <Span className="text-sm text-muted-foreground">{data.message}</Span>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4 px-4 py-4">
      <Button
        type="button"
        variant="destructive"
        className="w-full gap-2"
        onClick={onSubmit ?? undefined}
      >
        {onSubmit === null ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" />
        )}
        {onSubmit === null
          ? t("post.widget.submitLoading")
          : t("post.widget.submitButton")}
      </Button>
    </Div>
  );
}
