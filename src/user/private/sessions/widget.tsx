"use client";

import { Alert, AlertDescription } from "next-vibe/ui/ui/alert";
import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { EmptyBlock } from "next-vibe/ui/ui/empty-block";
import { ChevronLeft } from "next-vibe/ui/ui/icons/ChevronLeft";
import { Key } from "next-vibe/ui/ui/icons/Key";
import { LoadingBlock } from "next-vibe/ui/ui/loading-block";
import { Span } from "next-vibe/ui/ui/span";
import { StatusPill } from "next-vibe/ui/ui/status-pill";
import { WidgetHeader } from "next-vibe/ui/ui/widget-header";
import { WidgetShell } from "next-vibe/ui/ui/widget-shell";
import {
  useWidgetContext,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { apiClient } from "next-vibe/unified-ui/hooks/store";
import type { JSX } from "react";
import { useState } from "react";

import revokeEndpoints from "./[id]/definition";
import type definition from "./definition";

type Session = NonNullable<
  ReturnType<typeof useWidgetValue<typeof definition.GET>>
>["sessions"][number];

export function UserSessionsContainer(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const { pop, canGoBack } = useWidgetNavigation();
  const { endpointMutations } = useWidgetContext();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const [revoking, setRevoking] = useState<string | null>(null);
  const [revokeError, setRevokeError] = useState<string | null>(null);

  const handleRevoke = (session: Session): void => {
    setRevoking(session.id);
    setRevokeError(null);
    void (async (): Promise<void> => {
      const result = await apiClient.mutate(
        revokeEndpoints.DELETE,
        logger,
        user,
        undefined,
        { id: session.id },
        locale,
      );
      setRevoking(null);
      if (!result.success) {
        setRevokeError(result.message ?? "Failed to revoke session");
        return;
      }
      endpointMutations?.read?.refetch?.();
    })();
  };

  if (!data) {
    return <LoadingBlock message={t("widget.loading")} />;
  }

  const { sessions } = data;

  return (
    <WidgetShell>
      <WidgetHeader
        title={t("list.title")}
        backButton={
          canGoBack ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(): void => {
                pop();
              }}
              className="gap-1.5 -ml-1"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("widget.back")}
            </Button>
          ) : undefined
        }
      />

      {revokeError ? (
        <Alert variant="destructive" className="mx-1">
          <AlertDescription>{revokeError}</AlertDescription>
        </Alert>
      ) : undefined}

      {sessions.length === 0 ? (
        <EmptyBlock
          icon={<Key />}
          title={t("widget.empty")}
          message={t("widget.emptyHint")}
        />
      ) : (
        <Div className="flex flex-col divide-y divide-border">
          {sessions.map((session) => (
            <Div key={session.id} className="flex items-center gap-3 py-3 px-1">
              <Div className="flex-1 min-w-0">
                <Div className="flex items-center gap-2 flex-wrap">
                  <Span className="text-sm font-medium truncate">
                    {session.name ?? t("widget.browserSession")}
                  </Span>
                  {session.isCurrentSession && (
                    <StatusPill
                      status="current"
                      variant="success"
                      label={t("widget.currentSession")}
                    />
                  )}
                </Div>
                <Span className="text-xs text-muted-foreground">
                  {t("widget.created")}{" "}
                  {new Date(session.createdAt).toLocaleDateString(locale)}
                  {session.expiresAt
                    ? ` · ${t("widget.expires")} ${new Date(session.expiresAt).toLocaleDateString(locale)}`
                    : ` · ${t("widget.never")}`}
                </Span>
              </Div>
              {!session.isCurrentSession && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={revoking === session.id}
                  className="shrink-0 text-destructive hover:text-destructive"
                  onClick={(): void => handleRevoke(session)}
                >
                  {revoking === session.id
                    ? t("widget.revoking")
                    : t("widget.revoke")}
                </Button>
              )}
            </Div>
          ))}
        </Div>
      )}
    </WidgetShell>
  );
}
