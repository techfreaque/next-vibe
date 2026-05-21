"use client";

import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Clock } from "next-vibe-ui/ui/icons/Clock";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetContext,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";
import type { WalletHistoryResponseOutput } from "./definition";

type Transaction = WalletHistoryResponseOutput["transactions"][number];

function resultColorClass(result: string): string {
  if (result === "SUCCESS") {
    return "text-green-600 dark:text-green-400";
  }
  if (result === "FAILURE") {
    return "text-destructive";
  }
  return "text-muted-foreground";
}

function resultBadgeClass(result: string): string {
  if (result === "SUCCESS") {
    return "bg-green-500/10 text-green-600 dark:text-green-400";
  }
  if (result === "FAILURE") {
    return "bg-destructive/10 text-destructive";
  }
  return "bg-muted text-muted-foreground";
}

function formatDate(date: Date | null): string {
  if (date === null) {
    return "—";
  }
  return date.toLocaleString();
}

function formatDateShort(date: Date | null): string {
  if (date === null) {
    return "none";
  }
  return date.toISOString().slice(0, 19).replace("T", " ");
}

function TransactionRow({
  tx,
  compact,
}: {
  tx: Transaction;
  compact: boolean;
}): React.JSX.Element {
  if (compact) {
    return (
      <Div className="py-1 text-sm font-mono">
        <Span
          className={cn("font-semibold", resultColorClass(tx.executionResult))}
        >
          {tx.executionResult}
        </Span>
        <Span className="ml-2 text-muted-foreground">{`#${tx.id}`}</Span>
        <Span className="ml-2">{`amt:${tx.amount}`}</Span>
        <Span className="ml-2 text-muted-foreground">
          {`ts:${formatDateShort(tx.createdAt)}`}
        </Span>
        {tx.description !== null && tx.description !== "" && (
          <Span className="ml-2 text-muted-foreground/70">{` ${tx.description}`}</Span>
        )}
        {tx.failureReason !== null && (
          <Span className="ml-2 text-destructive">{` [${tx.failureReason}]`}</Span>
        )}
      </Div>
    );
  }

  return (
    <Div className="flex items-start gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-accent transition-colors">
      <Div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
        <Clock className="h-4 w-4 text-primary" />
      </Div>

      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold",
              resultBadgeClass(tx.executionResult),
            )}
          >
            {tx.executionResult}
          </Span>
          <Span className="text-xs text-muted-foreground font-mono">
            {`#${tx.id}`}
          </Span>
          {tx.description !== null && tx.description !== "" && (
            <Span className="text-xs text-muted-foreground truncate max-w-[200px]">
              {tx.description}
            </Span>
          )}
        </Div>
        {tx.failureReason !== null && (
          <Div className="mt-1 text-xs text-destructive">
            {tx.failureReason}
          </Div>
        )}
        <Div className="mt-1 flex items-center gap-3 flex-wrap">
          {tx.sourceWalletId !== null && (
            <Span className="text-xs text-muted-foreground font-mono">
              {`from:${tx.sourceWalletId}`}
            </Span>
          )}
          {tx.targetWalletId !== null && (
            <Span className="text-xs text-muted-foreground font-mono">
              {`to:${tx.targetWalletId}`}
            </Span>
          )}
          {tx.authorizedBy !== null && (
            <Span className="text-xs text-muted-foreground">
              {`auth:${tx.authorizedBy}`}
            </Span>
          )}
        </Div>
      </Div>

      <Div className="flex flex-col items-end gap-0.5 shrink-0">
        <Span
          className={cn(
            "text-sm font-semibold font-mono",
            tx.amount < 0
              ? "text-destructive"
              : "text-green-600 dark:text-green-400",
          )}
        >
          {tx.amount > 0 ? `+${tx.amount}` : String(tx.amount)}
        </Span>
        <Span className="text-xs text-muted-foreground">
          {formatDate(tx.createdAt)}
        </Span>
      </Div>
    </Div>
  );
}

export function WalletHistoryContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { endpointMutations } = useWidgetContext();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const transactions = data?.transactions ?? [];
  const total = data?.total ?? 0;
  const isLoading = data === undefined;
  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  if (isCompact) {
    if (!data) {
      return <Div />;
    }
    return (
      <Div className="font-mono text-sm p-2">
        <Div className="font-semibold mb-1">
          {t("get.widget.title")} ({transactions.length}/{total})
          {isMcp && ` — use page/pageSize to paginate`}
        </Div>
        {transactions.length === 0 ? (
          <Div className="text-muted-foreground">
            {t("get.widget.noItemsFound")}
          </Div>
        ) : (
          transactions.map((tx, idx) => (
            <TransactionRow key={idx} tx={tx} compact={true} />
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
          onClick={() => {
            pop();
          }}
          title={t("get.widget.back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Clock className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("get.widget.title")}
          {total > 0 && (
            <Span className="ml-2 text-xs text-muted-foreground font-normal">
              ({total})
            </Span>
          )}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))]">
        {isLoading ? (
          <Div className="h-48 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </Div>
        ) : transactions.length === 0 ? (
          <Div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <Clock className="h-8 w-8 opacity-30" />
            <Span className="text-sm">{t("get.widget.noItemsFound")}</Span>
          </Div>
        ) : (
          transactions.map((tx, idx) => (
            <TransactionRow key={idx} tx={tx} compact={false} />
          ))
        )}
      </Div>
    </Div>
  );
}
