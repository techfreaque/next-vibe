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

type ExecutionItem =
  (typeof definition.POST)["types"]["ResponseOutput"]["items"][number];

function ExecutionResultRow({
  item,
  compact,
}: {
  item: ExecutionItem;
  compact: boolean;
}): React.JSX.Element {
  if (compact) {
    return (
      <Div className="py-1 text-sm font-mono">
        {`txnId:${item.preauthorizedCreditTransactionId ?? "—"} ordinal:${item.ordinal ?? "—"} result:${item.executionResult ?? "—"}`}
      </Div>
    );
  }
  return (
    <Div className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0">
      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-semibold text-sm">
            {`ordinal:${item.ordinal ?? "—"}`}
          </Span>
          <Span className="text-xs text-muted-foreground">
            {item.executionResult ?? "—"}
          </Span>
        </Div>
        <Div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground font-mono flex-wrap">
          <Span>{`txnId:${item.preauthorizedCreditTransactionId ?? "—"}`}</Span>
          <Span>{`issuer:${item.issuer ?? "—"}`}</Span>
        </Div>
      </Div>
    </Div>
  );
}

export function PreauthorizedTransactionsExecutionsCreateContainer(): React.JSX.Element {
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

  if (result !== null && result !== undefined && isCompact) {
    const items = result.items;
    return (
      <Div className="font-mono text-sm p-2">
        <Div className="font-semibold mb-1">
          {t("post.widget.title")} ({items.length})
        </Div>
        {items.length === 0 ? (
          <Div>{t("post.widget.noItemsFound")}</Div>
        ) : (
          items.map((item, idx) => (
            <ExecutionResultRow key={idx} item={item} compact={true} />
          ))
        )}
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

      <Div className="grid grid-cols-2 gap-3">
        <Div className="col-span-1">
          <Label className="text-xs text-muted-foreground">
            {t("post.preauthorizedCreditTransactionId.label")}
          </Label>
          <Input type="number" name="preauthorizedCreditTransactionId" />
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

      {result !== null && result !== undefined && result.items.length > 0 && (
        <Div className="mt-2">
          <Span className="text-sm font-semibold">
            {t("post.widget.title")} ({result.items.length})
          </Span>
          <Div className="border rounded-md mt-1">
            {result.items.map((item, idx) => (
              <ExecutionResultRow key={idx} item={item} compact={false} />
            ))}
          </Div>
        </Div>
      )}
    </Div>
  );
}
