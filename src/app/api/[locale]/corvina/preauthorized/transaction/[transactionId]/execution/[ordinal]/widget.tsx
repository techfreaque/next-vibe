"use client";

import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
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

export function PreauthorizedExecutionCreateContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const t = useWidgetTranslation<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>();
  const { pop } = useWidgetNavigation();
  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  const handleBack = useCallback((): void => {
    pop();
  }, [pop]);

  if (result !== null && result !== undefined && isMcp) {
    return (
      <Div className="font-mono text-sm p-2">
        {`execution txnId:${result.preauthorizedCreditTransactionId ?? "—"} ordinal:${result.ordinal ?? "—"} result:${result.executionResult ?? "—"}`}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4 p-4">
      {!isCompact && (
        <Div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("post.widget.back")}
          </Button>
        </Div>
      )}

      <FormAlertWidget field={{}} />

      <Div className="grid grid-cols-2 gap-3">
        <Div className="col-span-1">
          <Label className="text-xs text-muted-foreground">
            {t("post.transactionId.label")}
          </Label>
          <Input type="number" name="transactionId" />
        </Div>
        <Div className="col-span-1">
          <Label className="text-xs text-muted-foreground">
            {t("post.ordinal.label")}
          </Label>
          <Input type="number" name="ordinal" />
        </Div>
      </Div>

      <SubmitButtonWidget<typeof definition.POST>
        field={{
          text: "post.submitButton.label",
          loadingText: "post.submitButton.loadingText",
          icon: "play",
          variant: "primary",
        }}
      />

      {result !== null && result !== undefined && (
        <Div className="rounded-md border p-3 mt-2 grid grid-cols-2 gap-2">
          <Div className="flex flex-col gap-0.5">
            <Span className="text-xs text-muted-foreground">
              {t("post.response.preauthorizedCreditTransactionId")}
            </Span>
            <Span className="text-sm font-medium">
              {result.preauthorizedCreditTransactionId ?? "—"}
            </Span>
          </Div>
          <Div className="flex flex-col gap-0.5">
            <Span className="text-xs text-muted-foreground">
              {t("post.response.ordinal")}
            </Span>
            <Span className="text-sm font-medium">{result.ordinal ?? "—"}</Span>
          </Div>
          <Div className="flex flex-col gap-0.5">
            <Span className="text-xs text-muted-foreground">
              {t("post.response.executionResult")}
            </Span>
            <Span className="text-sm font-medium">
              {result.executionResult ?? "—"}
            </Span>
          </Div>
          <Div className="flex flex-col gap-0.5">
            <Span className="text-xs text-muted-foreground">
              {t("post.response.issuer")}
            </Span>
            <Span className="text-sm font-medium">{result.issuer ?? "—"}</Span>
          </Div>
        </Div>
      )}
    </Div>
  );
}
