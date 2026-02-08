"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";

import favoritesEndpoint from "@/app/api/[locale]/agent/chat/favorites/definition";
import { useChatFavorites } from "@/app/api/[locale]/agent/chat/favorites/hooks";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { SelectorOnboarding } from "./selector-onboarding";

type SelectorView = "onboarding" | "favorites" | "loading";

interface SelectorContentProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  logger: EndpointLogger;
}

export function SelectorContent({
  locale,
  user,
  logger,
}: SelectorContentProps): JSX.Element {
  const { t } = simpleT(locale);

  // Get characters from chat context (already fetched by useChat)
  const { characters } = useChatContext();

  // Fetch favorites - only when content is rendered (popover open)
  const { favorites, isInitialLoading: favoritesLoading } = useChatFavorites({
    logger,
    characters,
  });

  // Local state
  const [view, setView] = useState<SelectorView>("loading");
  const [onboardingSelectedId, setOnboardingSelectedId] = useState<
    string | null
  >(null);

  const needsOnboarding = useMemo(() => {
    return !favoritesLoading && favorites.length === 0;
  }, [favorites, favoritesLoading]);

  useEffect(() => {
    if (!favoritesLoading && view !== "onboarding") {
      setView(needsOnboarding ? "onboarding" : "favorites");
    }
  }, [favoritesLoading, needsOnboarding, view]);

  if (view === "loading") {
    return (
      <Div className="flex items-center justify-center p-8">
        <Div className="flex flex-col items-center gap-3">
          <Div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <Span className="text-sm text-muted-foreground">
            {t("app.chat.selector.loading")}
          </Span>
        </Div>
      </Div>
    );
  }

  if (view === "onboarding") {
    return (
      <SelectorOnboarding
        initialSelectedId={onboardingSelectedId}
        onSelectedIdChange={setOnboardingSelectedId}
        favorites={favorites}
        locale={locale}
        logger={logger}
      />
    );
  }

  return (
    <EndpointsPage endpoint={favoritesEndpoint} locale={locale} user={user} />
  );
}
