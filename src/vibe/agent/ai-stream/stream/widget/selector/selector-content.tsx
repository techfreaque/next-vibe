"use client";

import {
  type ChatT,
  scopedTranslation as chatScopedTranslation,
} from "../../../../chat/i18n";
import { useTourState } from "../../../../chat/tour-state";
import favoritesEndpoint from "../../../../skills/favorites/definition";
import { useChatFavorites } from "../../../../skills/favorites/hooks/hooks";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/ui/div";
import { Span } from "next-vibe/ui/ui/span";
import {
  useWidgetLogger,
  useWidgetPlatform,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";

const SelectorOnboarding = lazy(() =>
  import("./selector-onboarding").then((mod) => ({
    default: mod.SelectorOnboarding,
  })),
);

type SelectorView = "onboarding" | "favorites" | "loading";

interface SelectorContentProps {
  locale: CountryLanguage;
}

function LoadingSpinner({ t }: { t: ChatT }): JSX.Element {
  return (
    <Div className="flex items-center justify-center p-8">
      <Div className="flex flex-col items-center gap-3">
        <Div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <Span className="text-sm text-muted-foreground">
          {t("selector.loading")}
        </Span>
      </Div>
    </Div>
  );
}

export function SelectorContent({ locale }: SelectorContentProps): JSX.Element {
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const platform = useWidgetPlatform();
  const { t } = chatScopedTranslation.scopedT(locale);
  const setOnboardingComplete = useTourState((s) => s.setOnboardingComplete);
  const setOnboardingCompanionId = useTourState(
    (s) => s.setOnboardingCompanionId,
  );
  const tourActive = useTourState((s) => s.isActive);
  const { favorites, isInitialLoading: favoritesLoading } = useChatFavorites(
    logger,
    {
      activeFavoriteId: null,
    },
  );

  const [view, setView] = useState<SelectorView>("loading");

  const needsOnboarding = useMemo(() => {
    return !favoritesLoading && favorites.length === 0;
  }, [favorites, favoritesLoading]);

  useEffect(() => {
    if (!favoritesLoading && view !== "onboarding") {
      const nextView = needsOnboarding ? "onboarding" : "favorites";
      setView(nextView);
      // Tour is waiting for onboarding signal - fire it immediately when skipping onboarding
      if (nextView === "favorites" && tourActive) {
        setOnboardingComplete(true);
      }
    }
  }, [
    favoritesLoading,
    needsOnboarding,
    tourActive,
    setOnboardingComplete,
    view,
  ]);

  if (view === "loading") {
    return <LoadingSpinner t={t} />;
  }

  if (view === "onboarding") {
    return (
      <Suspense fallback={<LoadingSpinner t={t} />}>
        <SelectorOnboarding
          locale={locale}
          onDone={(firstCompanionId) => {
            setView("favorites");
            setOnboardingCompanionId(firstCompanionId);
            setOnboardingComplete(true);
          }}
        />
      </Suspense>
    );
  }

  return (
    <EndpointsPage
      endpoint={favoritesEndpoint}
      locale={locale}
      user={user}
      logger={logger}
      platform={platform}
    />
  );
}
