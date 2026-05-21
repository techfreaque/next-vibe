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

type ExecutionItem =
  (typeof definition.GET)["types"]["ResponseOutput"]["items"][number];

function ExecutionRow({
  item,
  compact,
}: {
  item: ExecutionItem;
  compact: boolean;
}): React.JSX.Element {
  if (compact) {
    return (
      <Div className="py-1 text-sm font-mono">
        {`ordinal:${item.ordinal ?? "—"} result:${item.executionResult ?? "—"} issuer:${item.issuer ?? "—"}`}
      </Div>
    );
  }
  return (
    <Div className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-accent transition-colors">
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
          {item.errorCode !== null && (
            <Span className="text-destructive">{`err:${item.errorCode}`}</Span>
          )}
        </Div>
      </Div>
    </Div>
  );
}

export function PreauthorizedExecutionsListContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const items = data?.items ?? [];
  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  const handleBack = useCallback((): void => {
    pop();
  }, [pop]);

  if (isCompact) {
    if (!data) {
      return <Div />;
    }
    return (
      <Div className="font-mono text-sm p-2">
        <Div className="font-semibold mb-1">
          {t("get.widget.title")} ({items.length})
        </Div>
        {items.length === 0 ? (
          <Div className="text-muted-foreground">
            {t("get.widget.noItemsFound")}
          </Div>
        ) : (
          items.map((item, idx) => (
            <ExecutionRow key={idx} item={item} compact={true} />
          ))
        )}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col min-h-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBack}
          title={t("get.widget.back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Span className="font-semibold text-sm mr-auto">
          {t("get.widget.title")}
          {items.length > 0 && (
            <Span className="ml-2 text-xs text-muted-foreground font-normal">
              ({items.length})
            </Span>
          )}
        </Span>
      </Div>

      <FormAlertWidget field={{}} />

      <SubmitButtonWidget<typeof definition.GET>
        field={{
          text: "get.submitButton.label",
          loadingText: "get.submitButton.loadingText",
          icon: "list",
          variant: "primary",
        }}
      />

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))]">
        {items.length === 0 ? (
          <Div className="h-48 flex items-center justify-center text-muted-foreground">
            <Span className="text-sm">{t("get.widget.noItemsFound")}</Span>
          </Div>
        ) : (
          items.map((item, idx) => (
            <ExecutionRow key={idx} item={item} compact={false} />
          ))
        )}
      </Div>
    </Div>
  );
}
