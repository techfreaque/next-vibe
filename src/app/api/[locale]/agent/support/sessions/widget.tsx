/**
 * Support Sessions Widget
 * Queue of pending/active support sessions with join/close actions
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";

import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";

const STATUS_STYLES: Record<string, string> = {
  pending:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  active:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  closed: "bg-muted text-muted-foreground",
};

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h`;
  }
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function SupportSessionsContainer(): React.JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();

  const handleJoin = (sessionId: string): void => {
    void (async (): Promise<void> => {
      const joinDef = await import("../join/definition");
      navigation.push(joinDef.default.POST, {
        data: { sessionId },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleClose = (sessionId: string): void => {
    void (async (): Promise<void> => {
      const closeDef = await import("../close/definition");
      navigation.push(closeDef.default.POST, {
        data: { sessionId },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  if (!data) {
    return <Div />;
  }

  const { sessions } = data;

  if (sessions.length === 0) {
    return (
      <Div className="text-center py-12 text-sm text-muted-foreground">
        {t("sessions.widget.noSessions")}
      </Div>
    );
  }

  return (
    <Div className="divide-y">
      {sessions.map((session) => (
        <Div
          key={session.id}
          className="flex items-start justify-between gap-4 py-4 px-1"
        >
          <Div className="flex-1 min-w-0 space-y-1">
            <Div className="flex items-center gap-2 flex-wrap">
              <Span className="font-medium text-sm font-mono text-xs">
                {session.id.slice(0, 8)}
              </Span>
              <Badge
                className={
                  STATUS_STYLES[session.status] ??
                  "bg-muted text-muted-foreground"
                }
              >
                {session.status === "pending"
                  ? t("sessions.widget.pending")
                  : t("sessions.widget.active")}
              </Badge>
            </Div>

            {session.initiatorInstanceUrl ? (
              <Div className="text-xs text-muted-foreground">
                {t("sessions.widget.from")}: {session.initiatorInstanceUrl}
              </Div>
            ) : null}

            <Div className="text-xs text-muted-foreground tabular-nums">
              {timeAgo(session.createdAt)} {t("sessions.widget.ago")}
            </Div>
          </Div>

          <Div className="flex flex-col gap-1.5 shrink-0">
            {session.status === "pending" ? (
              <Button
                size="sm"
                variant="default"
                className="text-xs"
                onClick={(): void => handleJoin(session.id)}
              >
                {t("sessions.widget.join")}
              </Button>
            ) : null}
            {session.status === "active" ? (
              <Button
                size="sm"
                variant="outline"
                className="text-xs text-destructive"
                onClick={(): void => handleClose(session.id)}
              >
                {t("sessions.widget.close")}
              </Button>
            ) : null}
          </Div>
        </Div>
      ))}
    </Div>
  );
}
