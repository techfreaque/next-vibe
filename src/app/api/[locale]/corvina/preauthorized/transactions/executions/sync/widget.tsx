"use client";

import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";

export function PreauthorizedTransactionsSyncContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const t = useWidgetTranslation<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>();
  const { pop } = useWidgetNavigation();
  const isMcp = platform === Platform.MCP;

  const handleBack = useCallback((): void => {
    pop();
  }, [pop]);

  if (result !== null && result !== undefined && isMcp) {
    return (
      <Div className="font-mono text-sm p-2">
        {`synchronized:${String(result.synchronized)}`}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4 p-4">
      {platform === Platform.WEB && (
        <Div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("post.widget.back")}
          </Button>
        </Div>
      )}

      <FormAlertWidget field={{}} />

      <SubmitButtonWidget<typeof definition.POST>
        field={{
          text: "post.submitButton.label",
          loadingText: "post.submitButton.loadingText",
          icon: "refresh-cw",
          variant: "primary",
        }}
      />

      {result !== null && result !== undefined && result.synchronized && (
        <Div className="rounded-md border border-green-500/30 bg-green-500/10 p-3 mt-2">
          <Span className="text-sm font-medium text-green-700 dark:text-green-400">
            {t("post.widget.synced")}
          </Span>
        </Div>
      )}
    </Div>
  );
}
