/**
 * Skill Landing Page - Client Component
 * Public landing page for shared skills with referral integration.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "next-vibe-ui/ui/collapsible";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { DollarSign } from "next-vibe-ui/ui/icons/DollarSign";
import { Gift } from "next-vibe-ui/ui/icons/Gift";
import { Share2 } from "next-vibe-ui/ui/icons/Share2";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { Star } from "next-vibe-ui/ui/icons/Star";
import { User } from "next-vibe-ui/ui/icons/User";
import { Users } from "next-vibe-ui/ui/icons/Users";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Link } from "next-vibe-ui/ui/link";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import { H1, H2, P } from "next-vibe-ui/ui/typography";
import { useState, type JSX } from "react";

import type { SkillGetResponseOutput } from "@/app/api/[locale]/agent/chat/skills/[id]/definition";
import { SkillOwnershipType } from "@/app/api/[locale]/agent/chat/skills/enum";
import {
  Icon,
  type IconKey,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { cn } from "@/app/api/[locale]/shared/utils";
import { configScopedTranslation } from "@/config/i18n";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

const ownershipConfig = {
  [SkillOwnershipType.SYSTEM]: {
    icon: Sparkles,
    key: "hero.builtIn" as const,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  [SkillOwnershipType.USER]: {
    icon: User,
    key: "hero.yourSkill" as const,
    color: "bg-primary/10 text-primary",
  },
  [SkillOwnershipType.PUBLIC]: {
    icon: Users,
    key: "hero.community" as const,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
};

interface SkillLandingPageProps {
  locale: CountryLanguage;
  skill: SkillGetResponseOutput | null;
  user: JwtPayloadType | null;
}

export function SkillLandingPage({
  locale,
  skill,
  user,
}: SkillLandingPageProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const [systemPromptOpen, setSystemPromptOpen] = useState(false);

  if (!skill) {
    return (
      <Div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Div className="max-w-md text-center space-y-4">
          <Div className="mx-auto w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-muted-foreground" />
          </Div>
          <H1 className="text-2xl font-bold">{t("errors.notFound")}</H1>
          <P className="text-muted-foreground">
            {t("errors.notFoundDescription", { appName })}
          </P>
          <Button asChild>
            <Link href={`/${locale}`}>{t("errors.browseSkills")}</Link>
          </Button>
        </Div>
      </Div>
    );
  }

  const ownership =
    ownershipConfig[skill.skillOwnership] ??
    ownershipConfig[SkillOwnershipType.SYSTEM];
  const OwnershipIcon = ownership.icon;
  const isLoggedIn = user !== null && !user.isPublic;

  return (
    <Div className="min-h-screen bg-background">
      {/* Header bar */}
      <Div className="bg-violet-600 border-b border-violet-700">
        <Div className="container mx-auto px-4 py-3 max-w-4xl">
          <Div className="flex items-center gap-3">
            <Div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </Div>
            <P className="text-white font-semibold text-sm">
              {t("hero.brand", { appName })}
            </P>
            <Div className="ml-auto flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-white/80 border-white/30 text-xs"
              >
                <Share2 className="h-3 w-3 mr-1" />
                {t("meta.category")}
              </Badge>
            </Div>
          </Div>
        </Div>
      </Div>

      {/* Hero */}
      <Div className="bg-violet-50 dark:bg-violet-950/20 border-b border-violet-100 dark:border-violet-900/40">
        <Div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Skill card */}
          <Div className="flex gap-5 mb-8">
            <Div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-200/60 via-violet-100/40 to-violet-50 dark:from-violet-900/40 dark:via-violet-900/20 dark:to-violet-950/20 flex items-center justify-center flex-shrink-0 shadow-sm border border-violet-200/50 dark:border-violet-800/30">
              {skill.icon ? (
                <Icon
                  icon={skill.icon as IconKey}
                  className="w-10 h-10 text-violet-600 dark:text-violet-400"
                />
              ) : (
                <Sparkles className="w-10 h-10 text-violet-400" />
              )}
            </Div>
            <Div className="flex-1 min-w-0">
              <Div className="flex items-center gap-2 mb-2 flex-wrap">
                <H1 className="text-3xl md:text-4xl font-bold leading-tight">
                  {skill.name}
                </H1>
              </Div>
              {skill.tagline && (
                <P className="text-lg text-muted-foreground mb-3">
                  {skill.tagline}
                </P>
              )}
              <Div className="flex items-center gap-3 flex-wrap">
                <Div
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium",
                    ownership.color,
                  )}
                >
                  <OwnershipIcon className="w-3 h-3" />
                  <Span>{t(ownership.key)}</Span>
                </Div>
                {skill.category && (
                  <Badge variant="secondary" className="text-xs">
                    {skill.category}
                  </Badge>
                )}
              </Div>
            </Div>
          </Div>

          {/* Description */}
          {skill.description && (
            <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 max-w-2xl">
              {skill.description}
            </P>
          )}

          {/* CTA Buttons */}
          <Div className="flex flex-col sm:flex-row gap-3">
            {isLoggedIn ? (
              <>
                <Button
                  asChild
                  size="lg"
                  className="gap-2 bg-violet-600 hover:bg-violet-700 text-white"
                >
                  <Link href={`/${locale}/threads`}>
                    <Zap className="h-4 w-4" />
                    {t("hero.trySkill")}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <Link href={`/${locale}/threads`}>
                    <Star className="h-4 w-4" />
                    {t("hero.addToFavorites")}
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  size="lg"
                  className="gap-2 bg-violet-600 hover:bg-violet-700 text-white"
                >
                  <Link href={`/${locale}/user/auth`}>
                    <Zap className="h-4 w-4" />
                    {t("hero.signUpToUse")}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <Link href={`/${locale}/user/auth`}>
                    {t("hero.logInToUse")}
                  </Link>
                </Button>
              </>
            )}
          </Div>
        </Div>
      </Div>

      <Div className="container mx-auto px-4 py-12 max-w-4xl space-y-10">
        {/* System Prompt */}
        {skill.systemPrompt ? (
          <Collapsible
            open={systemPromptOpen}
            onOpenChange={setSystemPromptOpen}
          >
            <Div className="rounded-xl border">
              <CollapsibleTrigger asChild>
                <Div className="flex items-center justify-between p-5 cursor-pointer hover:bg-accent transition-colors">
                  <Div className="flex items-center gap-3">
                    <Div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    </Div>
                    <Div>
                      <Div className="font-semibold">
                        {t("sections.systemPrompt")}
                      </Div>
                      <Div className="text-xs text-muted-foreground">
                        {t("sections.systemPromptHint")}
                      </Div>
                    </Div>
                  </Div>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform",
                      systemPromptOpen && "rotate-180",
                    )}
                  />
                </Div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Div className="px-5 pb-5 border-t pt-4">
                  <Div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                    {skill.systemPrompt}
                  </Div>
                </Div>
              </CollapsibleContent>
            </Div>
          </Collapsible>
        ) : (
          <Div className="rounded-xl border p-5">
            <Div className="flex items-center gap-3">
              <Div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </Div>
              <Div>
                <Div className="font-semibold">
                  {t("sections.systemPrompt")}
                </Div>
                <Div className="text-sm text-muted-foreground">
                  {t("sections.noSystemPrompt")}
                </Div>
              </Div>
            </Div>
          </Div>
        )}

        <Separator />

        {/* Earn CTA */}
        <Div className="rounded-2xl bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-background dark:from-emerald-950/30 dark:via-emerald-950/10 dark:to-background border border-emerald-200 dark:border-emerald-800/40 p-8">
          <Div className="flex items-start gap-4 mb-6">
            <Div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
              <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </Div>
            <Div>
              <H2 className="text-xl font-bold mb-2">{t("cta.title")}</H2>
              <P className="text-muted-foreground leading-relaxed">
                {t("cta.description")}
              </P>
            </Div>
          </Div>
          <Div className="flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Link href={`/${locale}/threads`}>
                <Gift className="h-4 w-4" />
                {t("cta.createSkill")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href={`/${locale}/user/referral`}>
                {t("cta.learnMore")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
