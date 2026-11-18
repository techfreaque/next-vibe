"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import {
  useWidgetLogger,
  useWidgetPlatform,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";
import { lazy, Suspense, useMemo, useState } from "react";

import {
  type ChatT,
  scopedTranslation as chatScopedTranslation,
} from "../../../../chat/i18n";
import favoritesEndpoint from "../../../../skills/favorites/definition";
import { useChatFavorites } from "../../../../skills/favorites/hooks/hooks";

const SelectorCompanionSetup = lazy(() =>
  import("../onboarding/selector-companion-setup").then((mod) => ({
    default: mod.SelectorCompanionSetup,
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

  // Once favorites load, pick the view (onboarding sticks until onDone).
  // Adjusted during render instead of in an effect to avoid a cascading render.
  if (!favoritesLoading && view !== "onboarding") {
    const nextView = needsOnboarding ? "onboarding" : "favorites";
    if (nextView !== view) {
      setView(nextView);
    }
  }

  if (view === "loading") {
    return <LoadingSpinner t={t} />;
  }

  if (view === "onboarding") {
    return (
      <Suspense fallback={<LoadingSpinner t={t} />}>
        <SelectorCompanionSetup
          locale={locale}
          onDone={() => setView("favorites")}
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
