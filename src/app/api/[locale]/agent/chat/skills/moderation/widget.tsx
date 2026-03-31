/**
 * Custom Widget for Skills Moderation
 * GET: Table of reported skills with hide/clear action buttons
 * PATCH: Standard form rendering (handled by default EndpointsPage)
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { CheckCircle2 } from "next-vibe-ui/ui/icons/CheckCircle2";
import { EyeOff } from "next-vibe-ui/ui/icons/EyeOff";
import { Span } from "next-vibe-ui/ui/span";
import { useState, type JSX } from "react";

import {
  useWidgetNavigation,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import BadgeWidget from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/badge/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";

import type definition from "./definition";
import type { SkillModerationGetResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: SkillModerationGetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
}

export function SkillModerationContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const data = field.value;
  const t = useWidgetTranslation<typeof definition.GET>();
  const { push: navigate } = useWidgetNavigation();
  const [actioned, setActioned] = useState<Set<string>>(new Set());

  const handleModerate = (id: string): void => {
    void (async (): Promise<void> => {
      const moderationDef = await import("./definition");
      navigate(moderationDef.default.PATCH, {
        data: { id, action: "hide" as const },
        onSuccessCallback: () => setActioned((prev) => new Set([...prev, id])),
      });
    })();
  };

  const skills = data?.skills ?? [];
  const totalCount = data?.totalCount ?? 0;

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex flex-row gap-2">
        <NavigateButtonWidget field={children.backButton} />
      </Div>

      {/* Header */}
      <Div className="flex items-center justify-between">
        <Div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <Span className="font-semibold text-base">{t("get.title")}</Span>
        </Div>
        <BadgeWidget
          field={withValue(children.totalCount, totalCount, data ?? {})}
          fieldName="totalCount"
        />
      </Div>

      {/* Skills table */}
      {skills.length === 0 ? (
        <Div className="rounded-lg border border-border bg-muted/30 p-8 text-center">
          <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <Span className="text-sm text-muted-foreground">
            {t("get.empty")}
          </Span>
        </Div>
      ) : (
        <Div className="flex flex-col gap-2">
          {skills.map((skill) => {
            const isActioned = actioned.has(skill.id);
            return (
              <Div
                key={skill.id}
                className={`flex items-center justify-between rounded-lg border px-4 py-3 gap-3 transition-opacity ${
                  isActioned
                    ? "opacity-40 border-border"
                    : "border-amber-200 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/10"
                }`}
              >
                {/* Skill info */}
                <Div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <Span className="text-sm font-medium truncate">
                    {skill.name}
                  </Span>
                  <Div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Span className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-amber-500" />
                      {skill.reportCount}
                    </Span>
                    {skill.voteCount > 0 && (
                      <Span>{skill.voteCount} votes</Span>
                    )}
                    {skill.status && (
                      <Span className="capitalize">{skill.status}</Span>
                    )}
                  </Div>
                </Div>

                {/* Actions */}
                {!isActioned && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="shrink-0 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => handleModerate(skill.id)}
                  >
                    <EyeOff className="h-3.5 w-3.5" />
                    <Span>{t("get.action.moderate")}</Span>
                  </Button>
                )}
              </Div>
            );
          })}
        </Div>
      )}
    </Div>
  );
}
