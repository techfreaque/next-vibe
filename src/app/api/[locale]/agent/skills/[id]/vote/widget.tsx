/**
 * Custom Widget for Skill Vote
 * Standalone vote screen: up/down buttons + current score and trust level.
 * The primary in-app interaction is the inline SkillActions control
 * (skills/_shared/skill-actions) which calls this endpoint via useEndpoint.
 */

"use client";

import { Div } from "next-vibe/ui/web/ui/div";
import { CheckCircle2 } from "next-vibe/ui/web/ui/icons/CheckCircle2";
import { Span } from "next-vibe/ui/web/ui/span";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { NavigateButtonWidget } from "next-vibe/unified-ui/interactive/navigate-button/widget";
import { type JSX } from "react";

import { SkillTrustLevel } from "../../enum";
import type definition from "./definition";
import { SkillVoteButtons } from "./vote-buttons";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function SkillVoteContainer({ field }: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const skillId = navigation.current?.params?.urlPathParams?.id ?? null;

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex flex-row items-center gap-2">
        <NavigateButtonWidget field={children.backButton} />
        {skillId ? (
          <SkillVoteButtons
            skillId={skillId}
            initialUserVote={data?.userVote ?? null}
            initialVoteCount={data?.voteCount ?? null}
          />
        ) : null}
      </Div>

      {/* Result after voting */}
      {data && (
        <Div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
          <Div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Span>
              {t("post.response.voteCount.content")}: {data.voteCount}
            </Span>
          </Div>
          {data.trustLevel === SkillTrustLevel.VERIFIED && (
            <Div className="flex items-center gap-1 text-xs text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <Span>{t("post.badge.verified")}</Span>
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}
