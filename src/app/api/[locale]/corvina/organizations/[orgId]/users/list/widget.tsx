"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetNavigation,
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
    <Div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
      <Span className="text-xs font-semibold text-primary">{initials}</Span>
    </Div>
  );
}

export function UsersListContainer(): React.JSX.Element {
  const { pop: goBack, push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const isLoading = data === undefined;
  const result = data as CorvinaUsersListResponseOutput | null | undefined;

  const handleUserClick = (userId: number, orgId: number): void => {
    void (async (): Promise<void> => {
      const userDetail = await import("../[userId]/definition");
      navigate(userDetail.default.GET, {
        urlPathParams: { orgId, userId },
      });
    })();
  };

  return (
    <Div className="flex flex-col gap-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => goBack()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Span className="font-semibold text-sm mr-auto">
          {t("get.widget.title")}
          {result && (
            <Span className="ml-1 text-xs text-muted-foreground font-normal">
              ({result.totalElements})
            </Span>
          )}
        </Span>
      </Div>

      {isLoading ? (
        <Div className="h-48 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </Div>
      ) : !result || result.users.length === 0 ? (
        <Div className="px-4 py-8 text-center">
          <Span className="text-sm text-muted-foreground">
            {t("get.widget.emptyState")}
          </Span>
        </Div>
      ) : (
        <Div className="flex flex-col divide-y">
          {result.users.map((user) => (
            <Button
              key={user.id}
              type="button"
              variant="ghost"
              className="flex items-center gap-3 px-4 py-3 text-left h-auto rounded-none justify-start"
              onClick={() => handleUserClick(user.id, 0)}
            >
              <UserAvatar user={user} />
              <Div className="flex flex-col min-w-0 flex-1">
                <Span className="text-sm font-medium">{user.username}</Span>
                <Span className="text-xs text-muted-foreground truncate">
                  {user.email}
                </Span>
              </Div>
              <Div className="flex gap-1 shrink-0">
                {user.serviceAccount && (
                  <Span
                    className={cn(
                      "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium",
                      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                    )}
                  >
                    {t("get.widget.badges.serviceAccount")}
                  </Span>
                )}
                {user.mfaEnabled ? (
                  <Span
                    className={cn(
                      "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium",
                      "bg-success/10 text-success",
                    )}
                  >
                    {t("get.widget.badges.mfaEnabled")}
                  </Span>
                ) : (
                  <Span
                    className={cn(
                      "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium",
                      "bg-muted text-muted-foreground",
                    )}
                  >
                    {t("get.widget.badges.mfaDisabled")}
                  </Span>
                )}
              </Div>
            </Button>
          ))}
        </Div>
      )}
    </Div>
  );
}
