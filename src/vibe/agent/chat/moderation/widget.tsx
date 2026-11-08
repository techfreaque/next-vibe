/**
 * Custom Widget for Chat Moderation
 * GET: queue of reported / hidden public-feed + shared threads with
 * dismiss / remove / ban-author actions (same shape as skills moderation).
 */

"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { CheckCircle2 } from "next-vibe/ui/components/icons/CheckCircle2";
import { EyeOff } from "next-vibe/ui/components/icons/EyeOff";
import { RotateCcw } from "next-vibe/ui/components/icons/RotateCcw";
import { UserX } from "next-vibe/ui/components/icons/UserX";
import { Span } from "next-vibe/ui/components/span";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetContext,
  useWidgetLogger,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { apiClient } from "next-vibe/unified-ui/hooks/store";
import BadgeWidget from "next-vibe/unified-ui/widgets/display-only/badge/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { type JSX, useState } from "react";

import {
  ThreadModerationAction,
  type ThreadModerationActionValue,
  ThreadModerationStatus,
  type ThreadModerationStatusValue,
  ThreadReportReason,
} from "../enum";
import definition from "./definition";

const REASON_KEYS = {
  [ThreadReportReason.SPAM]: "get.reasons.spam",
  [ThreadReportReason.ILLEGAL]: "get.reasons.illegal",
  [ThreadReportReason.ABUSE]: "get.reasons.abuse",
  [ThreadReportReason.CSAM_FLAG]: "get.reasons.csamFlag",
  [ThreadReportReason.OTHER]: "get.reasons.other",
} as const;

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

export function ChatModerationContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const { locale } = useWidgetContext();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const [statuses, setStatuses] = useState<
    Record<string, typeof ThreadModerationStatusValue>
  >({});
  const [pending, setPending] = useState<string | null>(null);

  const act = (
    id: string,
    action: typeof ThreadModerationActionValue,
  ): void => {
    setPending(id);
    void (async (): Promise<void> => {
      try {
        const res = await apiClient.mutate(
          definition.PATCH,
          logger,
          user,
          { id, action },
          undefined,
          locale,
        );
        if (res?.success) {
          setStatuses((prev) => ({ ...prev, [id]: res.data.patchStatus }));
        }
      } finally {
        setPending(null);
      }
    })();
  };

  const threads = data?.threads ?? [];
  const totalCount = data?.totalCount ?? 0;

  return (
    <Div className="flex flex-col gap-4 p-4" data-testid="chat-moderation">
      <Div className="flex flex-row gap-2">
        <NavigateButtonWidget field={children.backButton} />
      </Div>

      <Div className="flex items-center justify-between">
        <Div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <Span className="font-semibold text-base">{t("get.title")}</Span>
        </Div>
        <BadgeWidget
          field={withValue(children.totalCount, totalCount, data ?? {})}
          fieldName="totalCount"
        />
      </Div>

      {threads.length === 0 ? (
        <Div className="rounded-lg border border-border bg-muted/30 p-8 text-center">
          <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
          <Span className="text-sm text-muted-foreground">
            {t("get.empty")}
          </Span>
        </Div>
      ) : (
        <Div className="flex flex-col gap-2">
          {threads.map((thread) => {
            const status = statuses[thread.id] ?? thread.moderationStatus;
            const settled = statuses[thread.id] !== undefined;
            const busy = pending === thread.id;
            return (
              <Div
                key={thread.id}
                data-testid={`moderation-row-${thread.id}`}
                className={`flex flex-col gap-2 rounded-lg border px-4 py-3 ${
                  settled
                    ? "opacity-60 border-border"
                    : "border-warning/30 bg-warning/5"
                }`}
              >
                <Div className="flex flex-col gap-0.5 min-w-0">
                  <Span className="text-sm font-medium truncate">
                    {thread.title}
                  </Span>
                  <Div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <Span className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-warning" />
                      {thread.reportCount}
                    </Span>
                    <Span className="capitalize">
                      {status === ThreadModerationStatus.UNDER_REVIEW
                        ? t("get.status.underReview")
                        : status === ThreadModerationStatus.REMOVED
                          ? t("get.status.removed")
                          : t("get.status.visible")}
                    </Span>
                    <Span>{thread.rootFolderId}</Span>
                    {thread.authorName && <Span>u/{thread.authorName}</Span>}
                    {thread.authorBanned && (
                      <Span className="text-destructive">
                        {t("get.status.authorBanned")}
                      </Span>
                    )}
                  </Div>
                  {thread.reasons.length > 0 && (
                    <Span className="text-xs text-muted-foreground">
                      {thread.reasons.map((r) => t(REASON_KEYS[r])).join(" · ")}
                    </Span>
                  )}
                  {thread.latestNote && (
                    <Span className="text-xs italic text-muted-foreground line-clamp-2">
                      {t("get.note", { note: thread.latestNote })}
                    </Span>
                  )}
                </Div>

                <Div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={busy}
                    data-testid="moderation-dismiss"
                    className="gap-1.5 text-xs"
                    onClick={() =>
                      act(thread.id, ThreadModerationAction.DISMISS)
                    }
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <Span>{t("get.action.dismiss")}</Span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={busy}
                    data-testid="moderation-remove"
                    className="gap-1.5 text-xs"
                    onClick={() =>
                      act(thread.id, ThreadModerationAction.REMOVE)
                    }
                  >
                    <EyeOff className="h-3.5 w-3.5" />
                    <Span>{t("get.action.remove")}</Span>
                  </Button>
                  {thread.authorId && !thread.authorBanned && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={busy}
                      data-testid="moderation-ban"
                      className="gap-1.5 text-xs"
                      onClick={() =>
                        act(thread.id, ThreadModerationAction.BAN_AUTHOR)
                      }
                    >
                      <UserX className="h-3.5 w-3.5" />
                      <Span>{t("get.action.banAuthor")}</Span>
                    </Button>
                  )}
                </Div>
              </Div>
            );
          })}
        </Div>
      )}
    </Div>
  );
}
