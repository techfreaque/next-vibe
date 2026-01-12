"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { MessageSquare, Users } from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import { H1, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { TOTAL_MODEL_COUNT } from "@/app/api/[locale]/products/repository-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface HeroProps {
  locale: CountryLanguage;
  activeUserCount: number;
  totalConversations: number;
}

/**
 * Format number for display (e.g., 1000 -> "1K", 1000000 -> "1M")
 */
function formatCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return count.toString();
}

const Hero = ({
  locale,
  activeUserCount,
  totalConversations,
}: HeroProps): JSX.Element => {
  const { t } = simpleT(locale);

  const formattedUsers = formatCount(activeUserCount);
  const formattedConversations = formatCount(totalConversations);

  return (
    <Div className="relative w-full overflow-hidden">
      {/* Gradient background */}
      <Div className="absolute inset-0 bg-linear-to-br from-background via-muted/20 to-background" />

      {/* Subtle grid pattern with blur */}
      <Div className="absolute inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-size-[64px_64px] blur-[0.5px] opacity-60" />

      <Div className="container relative px-4 py-24 md:py-32 lg:py-40">
        <MotionDiv
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Main heading */}
          <H1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6">
            {t("app.story._components.home.hero.title")}
          </H1>

          {/* Subtitle */}
          <P className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            {t("app.story._components.home.hero.subtitle", {
              modelCount: TOTAL_MODEL_COUNT,
            })}
          </P>

          {/* CTA buttons */}
          <Div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="text-base h-12 px-8 w-full sm:w-auto"
              asChild
            >
              <Link href={`/${locale}`}>
                <MessageSquare className="mr-2 h-5 w-5" />
                {t("app.story._components.home.hero.cta")}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base h-12 px-8 w-full sm:w-auto"
              asChild
            >
              <Link href={`/${locale}/threads/public`}>
                <Users className="mr-2 h-5 w-5" />
                {t("app.story._components.home.hero.secondaryCta")}
              </Link>
            </Button>
          </Div>

          {/* Stats */}
          <MotionDiv
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Div className="text-center">
              <P className="text-3xl font-bold">{formattedUsers}+</P>
              <P className="text-sm text-muted-foreground mt-1">
                {t("app.story._components.home.hero.stats.usersLabel")}
              </P>
            </Div>
            <Div className="text-center">
              <P className="text-3xl font-bold">{TOTAL_MODEL_COUNT}</P>
              <P className="text-sm text-muted-foreground mt-1">
                {t("app.story._components.home.hero.stats.modelsLabel")}
              </P>
            </Div>
            <Div className="text-center">
              <P className="text-3xl font-bold">{formattedConversations}+</P>
              <P className="text-sm text-muted-foreground mt-1">
                {t("app.story._components.home.hero.stats.messagesLabel")}
              </P>
            </Div>
          </MotionDiv>
        </MotionDiv>
      </Div>
    </Div>
  );
};

export default Hero;
