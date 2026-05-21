"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { UserPlus } from "next-vibe-ui/ui/icons/UserPlus";
import { Users } from "next-vibe-ui/ui/icons/Users";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";
import type { CorvinaUsersListResponseOutput } from "./definition";

type UserItem = CorvinaUsersListResponseOutput["users"][number];

function UserAvatar({ user }: { user: UserItem }): React.JSX.Element {
  const initials =
    [user.firstName, user.lastName]
      .filter(Boolean)
      .map((n) => n?.[0]?.toUpperCase())
      .join("") ||
    user.username[0]?.toUpperCase() ||
    "?";

  return (
    <Div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
      <Span className="text-xs font-bold text-primary">{initials}</Span>
    </Div>
  );
}

export function UsersListContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop: goBack, push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const isLoading = data === undefined;
  const isCompact = platform === Platform.CLI || platform === Platform.MCP;
  const result = data as CorvinaUsersListResponseOutput | null | undefined;

  const page = (form.watch("page") as number | undefined) ?? 0;
  const orgId = (form.watch("orgId") as number | undefined) ?? 0;

  const handleUserClick = useCallback(
    (userId: number): void => {
      void (async (): Promise<void> => {
        const def = await import("../[userId]/definition");
        navigate(def.default.GET, { urlPathParams: { orgId, userId } });
      })();
    },
    [navigate, orgId],
  );

  const handleCreate = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("../create/definition");
      navigate(def.default.POST, { urlPathParams: { orgId } });
    })();
  }, [navigate, orgId]);

  const handlePrev = useCallback((): void => {
    if (page > 0) {
      form.setValue("page", page - 1, { shouldDirty: true });
    }
  }, [form, page]);

  const handleNext = useCallback((): void => {
    if (result && !result.last) {
      form.setValue("page", page + 1, { shouldDirty: true });
    }
  }, [form, page, result]);

  // ── Compact ──
  if (isCompact) {
    if (!result) {
      return <Div />;
    }
    return (
      <Div className="flex-col">
        {result.users.map((u) => (
          <Div key={u.id}>
            {`${u.username} <${u.email}>${u.mfaEnabled ? " [MFA]" : ""}${u.serviceAccount ? " [svc]" : ""}`}
          </Div>
        ))}
        <Div>{`total:${result.totalElements} page:${page + 1}/${result.totalPages}`}</Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col min-h-0 bg-background">
      {/* Top bar */}
      <Div className="flex items-center gap-2 px-3 py-2.5 border-b shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 shrink-0"
          onClick={() => goBack()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <Span className="font-bold text-sm mr-auto truncate">
          {t("get.widget.title")}
          {result && (
            <Span className="ml-1.5 text-xs font-normal text-muted-foreground">
              ({result.totalElements})
            </Span>
          )}
        </Span>
        <Button
          type="button"
          variant="default"
          size="sm"
          className="h-7 gap-1 px-2 text-xs shrink-0"
          onClick={handleCreate}
        >
          <UserPlus className="h-3 w-3" />
          {t("get.widget.createButton")}
        </Button>
      </Div>

      {/* Content */}
      {isLoading ? (
        <Div className="h-52 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <Span className="text-xs text-muted-foreground">
            {t("get.widget.loading")}
          </Span>
        </Div>
      ) : !result || result.users.length === 0 ? (
        <Div className="flex flex-col items-center justify-center gap-3 py-16">
          <Users className="h-10 w-10 text-muted-foreground/20" />
          <Span className="text-sm text-muted-foreground">
            {t("get.widget.emptyState")}
          </Span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 mt-1"
            onClick={handleCreate}
          >
            <UserPlus className="h-3.5 w-3.5" />
            {t("get.widget.createButton")}
          </Button>
        </Div>
      ) : (
        <Div className="overflow-y-auto flex-1 max-h-[min(700px,calc(100dvh-80px))]">
          <Div className="flex flex-col divide-y">
            {result.users.map((user) => (
              <Button
                key={user.id}
                type="button"
                variant="ghost"
                className="flex items-center gap-3 px-4 py-3 h-auto rounded-none justify-start hover:bg-muted/40 transition-colors"
                onClick={() => handleUserClick(user.id)}
              >
                <UserAvatar user={user} />
                <Div className="flex flex-col min-w-0 flex-1 text-left">
                  <Span className="text-sm font-semibold leading-tight truncate">
                    {[user.firstName, user.lastName]
                      .filter(Boolean)
                      .join(" ") || user.username}
                  </Span>
                  <Span className="text-xs text-muted-foreground font-mono truncate mt-0.5">
                    {user.email}
                  </Span>
                </Div>
                <Div className="flex items-center gap-1 shrink-0 flex-wrap justify-end max-w-[120px]">
                  {user.serviceAccount && (
                    <Span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-primary/10 text-primary">
                      {t("get.widget.badges.serviceAccount")}
                    </Span>
                  )}
                  <Span
                    className={cn(
                      "text-[10px] font-semibold px-1.5 py-0.5 rounded-md",
                      user.mfaEnabled
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {user.mfaEnabled
                      ? t("get.widget.badges.mfaEnabled")
                      : t("get.widget.badges.mfaDisabled")}
                  </Span>
                  {user.groupPoliciesEnabled && (
                    <Span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-warning/10 text-warning">
                      <Shield className="h-2.5 w-2.5 inline mr-0.5" />
                      {t("get.widget.badges.groupPolicies")}
                    </Span>
                  )}
                </Div>
              </Button>
            ))}
          </Div>

          {/* Pagination */}
          {result.totalPages > 1 && (
            <Div className="flex items-center justify-between px-4 py-3 border-t bg-muted/10">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 text-xs"
                onClick={handlePrev}
                disabled={page === 0}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                {t("get.widget.prev")}
              </Button>
              <Span className="text-xs text-muted-foreground">
                {page + 1} / {result.totalPages}
              </Span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 text-xs"
                onClick={handleNext}
                disabled={result.last}
              >
                {t("get.widget.next")}
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}
