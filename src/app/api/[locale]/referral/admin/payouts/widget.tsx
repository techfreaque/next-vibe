/**
 * Admin Payouts Widget
 * List all payout requests with approve/reject/complete actions
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";

import {
  useWidgetNavigation,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";
import type { AdminPayoutsGetResponseOutput } from "./definition";

const STATUS_COLORS: Record<string, string> = {
  "enums.payoutStatus.pending":
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "enums.payoutStatus.approved":
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "enums.payoutStatus.rejected":
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "enums.payoutStatus.processing":
    "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  "enums.payoutStatus.completed":
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "enums.payoutStatus.failed":
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

interface CustomWidgetProps {
  field: {
    value: AdminPayoutsGetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
}

export function AdminPayoutsContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const data = field.value;
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();

  const handleAction = (
    requestId: string,
    action: "approve" | "reject" | "complete",
  ): void => {
    void (async (): Promise<void> => {
      const def = await import("./definition");
      navigation.push(def.POST, {
        data: { requestId, action },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  if (!data) {
    return <Div />;
  }

  const { items } = data;

  if (items.length === 0) {
    return (
      <Div className="text-center py-8 text-sm text-muted-foreground">
        {t("admin.payouts.widget.empty")}
      </Div>
    );
  }

  return (
    <Div className="divide-y">
      {items.map((item) => (
        <Div
          key={item.id}
          className="flex items-start justify-between gap-3 py-4"
        >
          <Div className="flex-1 min-w-0 space-y-1">
            <Div className="flex items-center gap-2 flex-wrap">
              <Span className="font-medium text-sm">{item.userEmail}</Span>
              <Badge
                className={
                  STATUS_COLORS[item.status] ?? "bg-muted text-muted-foreground"
                }
              >
                {t(item.status as Parameters<typeof t>[0])}
              </Badge>
            </Div>
            <Div className="text-sm text-muted-foreground">
              <Span className="tabular-nums">
                {item.amountCents.toLocaleString()}
              </Span>{" "}
              {t("admin.payouts.widget.credits")}
              {"  "}
              {t(item.currency as Parameters<typeof t>[0])}
            </Div>
            {item.walletAddress ? (
              <Div className="text-xs text-muted-foreground truncate max-w-xs">
                {item.walletAddress}
              </Div>
            ) : null}
            {item.rejectionReason ? (
              <Div className="text-xs text-red-600 dark:text-red-400">
                {item.rejectionReason}
              </Div>
            ) : null}
            <Div className="text-xs text-muted-foreground">
              {new Date(item.createdAt).toLocaleDateString()}
            </Div>
          </Div>
          <Div className="flex flex-col gap-1 shrink-0">
            {item.status === "enums.payoutStatus.pending" ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={(): void => handleAction(item.id, "approve")}
                >
                  {t("admin.payouts.widget.approve")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs text-red-600"
                  onClick={(): void => handleAction(item.id, "reject")}
                >
                  {t("admin.payouts.widget.reject")}
                </Button>
              </>
            ) : null}
            {item.status === "enums.payoutStatus.approved" ? (
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={(): void => handleAction(item.id, "complete")}
              >
                {t("admin.payouts.widget.complete")}
              </Button>
            ) : null}
          </Div>
        </Div>
      ))}
    </Div>
  );
}
