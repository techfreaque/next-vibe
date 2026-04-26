/**
 * Custom Widget for Skill Vote
 * Toggle-upvote button showing current vote state, count, and trust level
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { CheckCircle2 } from "next-vibe-ui/ui/icons/CheckCircle2";
import { ThumbsUp } from "next-vibe-ui/ui/icons/ThumbsUp";
import { Span } from "next-vibe-ui/ui/span";
import { type JSX } from "react";

import {
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import { SkillTrustLevel } from "../../enum";
import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function SkillVoteContainer({ field }: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex flex-row gap-2">
        <NavigateButtonWidget field={children.backButton} />
        {/* Vote button - dynamic text based on current vote state */}
        <SubmitButtonWidget<typeof definition.POST>
          field={{
            ...children.submitButton,
            text: data?.voted ? "post.button.unvote" : "post.button.vote",
            variant: data?.voted ? "default" : "outline",
          }}
        />
      </Div>

      {/* Result after voting */}
      {data && (
        <Div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
          <Div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ThumbsUp className="h-4 w-4" />
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
