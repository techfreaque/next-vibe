"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import { getLocalItem, setLocalItem } from "next-vibe/ui/lib/storage";
import {
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { type JSX, useCallback, useState } from "react";

import { STORAGE_KEYS } from "../../../../chat/constants";
import { useProviderAvailability } from "../../../../env-availability-store";
import { scopedTranslation } from "../../i18n";
import { CompanionCards, useCompanionCards } from "./companion-cards";
import {
  activateFavorite,
  DEFAULT_COMPANION_ID,
  refreshFavorites,
  seedCompanion,
} from "./seed";
import { trackOnboarding } from "./track";

/**
 * The selector opened with an empty favorites list (everything removed, or
 * storage wiped): same companion choice as onboarding step 1, inline.
 */
export function SelectorCompanionSetup({
  locale,
  onDone,
}: {
  locale: CountryLanguage;
  onDone: () => void;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const availability = useProviderAvailability();
  const cards = useCompanionCards({ locale, t });
  const [companionId, setCompanionId] = useState(DEFAULT_COMPANION_ID);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const companionName =
    cards.find((c) => c.id === companionId)?.name ?? companionId;
  const noProviderAvailable =
    !availability.claudeCode &&
    !availability.openRouter &&
    !availability.unbottledSystem &&
    !availability.uncensoredAI &&
    !availability.freedomGPT &&
    !availability.gabAI &&
    !availability.veniceAI &&
    !availability.nanoGPT;

  const start = useCallback(async (): Promise<void> => {
    if (busy) {
      return;
    }
    setBusy(true);
    setFailed(false);
    const deps = { user, logger, locale };
    const seeded = await seedCompanion(companionId, deps);
    if (!seeded) {
      setBusy(false);
      setFailed(true);
      return;
    }
    await activateFavorite(seeded, deps);
    await refreshFavorites(logger);
    trackOnboarding(logger, "companion_picked", {
      mode: "companion",
      step: "companion",
      companionId,
    });
    if (getLocalItem(STORAGE_KEYS.COMPANION_ONBOARDING_DONE, logger) === null) {
      setLocalItem(STORAGE_KEYS.COMPANION_ONBOARDING_DONE, "true", logger);
    }
    setBusy(false);
    onDone();
  }, [busy, user, logger, locale, companionId, onDone]);

  return (
    <Div className="flex flex-col" data-testid="selector-setup">
      <Div className="flex flex-col gap-4 px-5 pb-4 pt-5">
        <Div className="flex flex-col gap-1">
          <H3 className="text-lg font-semibold tracking-tight">
            {t("onboarding.companion.title")}
          </H3>
          <P className="text-sm leading-snug text-muted-foreground">
            {t("onboarding.companion.subtitle")}
          </P>
        </Div>
        <CompanionCards
          cards={cards}
          selectedId={companionId}
          onSelect={setCompanionId}
          onConfirm={() => void start()}
          t={t}
        />
        {noProviderAvailable ? (
          <Div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
            <Span className="text-xs font-medium text-destructive">
              {t("onboarding.noProviderAvailable")}
            </Span>
          </Div>
        ) : null}
      </Div>
      <Div className="sticky bottom-0 flex flex-col gap-2 border-t border-border bg-popover px-5 py-3">
        {failed && !busy ? (
          <Div
            role="alert"
            data-testid="selector-setup-error"
            className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <Span className="text-xs font-medium text-destructive">
              {t("onboarding.failed")}
            </Span>
          </Div>
        ) : null}
        <Button
          type="button"
          className="h-11 w-full gap-2 text-base"
          disabled={busy || noProviderAvailable}
          onClick={() => void start()}
        >
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("onboarding.saving")}
            </>
          ) : (
            <>
              {failed
                ? t("onboarding.retry")
                : t("onboarding.companion.start", { name: companionName })}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </Div>
    </Div>
  );
}
