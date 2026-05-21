"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Trash } from "next-vibe-ui/ui/icons/Trash";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import {
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";

export function DeviceDeleteContainer(): React.JSX.Element {
  const { pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.DELETE>();
  const onSubmit = useWidgetOnSubmit();

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

      <Div className="px-4 py-6 flex flex-col items-center gap-4">
        <Div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <Trash className="h-5 w-5 text-destructive" />
        </Div>
        <Div className="text-center">
          <Span className="block font-semibold">{t("delete.title")}</Span>
          <Span className="block text-sm text-muted-foreground mt-1">
            {t("delete.widget.warning")}
          </Span>
        </Div>
        <Div className="flex gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => goBack()}
          >
            {t("delete.widget.cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="flex-1 gap-2"
            onClick={onSubmit ?? undefined}
          >
            <Trash className="h-4 w-4" />
            {t("delete.widget.confirm")}
          </Button>
        </Div>
      </Div>
    </Div>
  );
}
