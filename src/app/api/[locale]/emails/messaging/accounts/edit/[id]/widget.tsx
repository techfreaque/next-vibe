"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Edit } from "next-vibe-ui/ui/icons/Edit";
import React, { useCallback } from "react";

import {
  useWidgetNavigation,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type messagingAccountEditEndpoints from "./definition";

export function MessagingAccountEditContainer(): React.JSX.Element {
  const { push: navigate, canGoBack, pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof messagingAccountEditEndpoints.PUT>();

  const handleBack = useCallback((): void => {
    if (canGoBack) {
      pop();
    } else {
      void (async (): Promise<void> => {
        const listDef = await import("../../list/definition");
        navigate(listDef.default.GET);
      })();
    }
  }, [navigate, canGoBack, pop]);

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("get.title")}
        </Button>
      </Div>
      <Div className="flex items-center gap-2">
        <Edit className="h-5 w-5" />
        <Div className="text-lg font-semibold">{t("put.title")}</Div>
      </Div>
    </Div>
  );
}
