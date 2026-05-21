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

import { CorvinaRoleType } from "../enums";
import type definition from "./definition";
import type { CorvinaRolesListResponseOutput } from "./definition";

type RoleItem = CorvinaRolesListResponseOutput["roles"][number];

function TypeBadge({ type }: { type: RoleItem["type"] }): React.JSX.Element {
  const colorMap: Record<RoleItem["type"], string> = {
    [CorvinaRoleType.APPLICATION]:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    [CorvinaRoleType.DEVICE]:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    [CorvinaRoleType.UNDEFINED]: "bg-muted text-muted-foreground",
  };
  return (
    <Span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium",
        colorMap[type],
      )}
    >
      {type}
    </Span>
  );
}

export function RolesListContainer(): React.JSX.Element {
  const { pop: goBack, push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const isLoading = data === undefined;
  const result = data as CorvinaRolesListResponseOutput | null | undefined;

  const handleRoleClick = (roleId: number, orgId: number): void => {
    void (async (): Promise<void> => {
      const roleDetail = await import("../[roleId]/definition");
      navigate(roleDetail.default.GET, {
        urlPathParams: { orgId, roleId },
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
      ) : !result || result.roles.length === 0 ? (
        <Div className="px-4 py-8 text-center">
          <Span className="text-sm text-muted-foreground">
            {t("get.widget.emptyState")}
          </Span>
        </Div>
      ) : (
        <Div className="flex flex-col divide-y">
          {result.roles.map((role) => (
            <Button
              key={role.id}
              type="button"
              variant="ghost"
              className="flex items-center gap-3 px-4 py-3 text-left h-auto rounded-none justify-start"
              onClick={() => handleRoleClick(role.id, 0)}
            >
              <Div className="flex flex-col min-w-0 flex-1">
                <Span className="text-sm font-medium">
                  {role.label ?? role.name}
                </Span>
                {role.description && (
                  <Span className="text-xs text-muted-foreground truncate">
                    {role.description}
                  </Span>
                )}
              </Div>
              <Div className="flex gap-1 shrink-0">
                <TypeBadge type={role.type} />
                <Span
                  className={cn(
                    "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium",
                    role.enabled
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {role.enabled
                    ? t("get.widget.badges.enabled")
                    : t("get.widget.badges.disabled")}
                </Span>
                {role.defaultStar && (
                  <Span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-warning/10 text-warning">
                    {t("get.widget.badges.defaultRole")}
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
