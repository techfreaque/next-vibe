"use client";

import { useSearchParams } from "next-vibe/ui/hooks/use-navigation";
import { getLocalItem, setLocalItem } from "next-vibe/ui/lib/storage";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEffect, useMemo, useRef, useState } from "react";

import { STORAGE_KEYS } from "../../../../../chat/constants";
import { useModelSelectorState } from "../../../../../chat/model-selector-state";
import { useProviderAvailability } from "../../../../../env-availability-store";
import { useChatFavorites } from "../../../../../skills/favorites/hooks/hooks";
import { useArrivalStore } from "./arrival-store";
import {
  addAndActivateArrival,
  parseArrivalSkillParam,
  refreshFavorites,
  resolveArrivalSkill,
} from "./seed";
import { trackOnboarding } from "./track";

/**
 * Pops the first-run setup inside the model selector. Renders nothing.
 *
 * - New visitor (no favorites, never shown on this device): opens the
 *   selector once; the selector shows the setup because favorites are empty.
 * - Arrival from a skill page (`?skill=`) without favorites: opens the
 *   selector every time; the setup shows the skill on top and adds it.
 * - Arrival when already set up: adds the skill and makes it active, no popup.
 * - Arrival closed without finishing: the skill is still added and active
 *   (the create path adds the default companion next to it).
 */
export function SelectorOnboardingController(): null {
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const locale = useWidgetLocale();
  const availability = useProviderAvailability();
  const searchParams = useSearchParams();
  const { favorites, isInitialLoading } = useChatFavorites(logger, {
    activeFavoriteId: null,
  });

  // The URL hook strips `?skill=` in a layout effect; read the initial URL
  // here too so the arrival is seen whichever runs first.
  const [urlArrival] = useState<string | null>(() =>
    parseArrivalSkillParam(searchParams.get("skill")),
  );
  const pendingSkillId = useArrivalStore((s) => s.pendingSkillId);
  const setPendingSkillId = useArrivalStore((s) => s.setPendingSkillId);
  const selectorOpen = useModelSelectorState((s) => s.modelSelectorOpen);
  const setModelSelectorOpen = useModelSelectorState(
    (s) => s.setModelSelectorOpen,
  );

  const deps = useMemo(
    () => ({ user, logger, locale }),
    [user, logger, locale],
  );
  const urlSeededRef = useRef(false);
  const firstRunDecidedRef = useRef(false);
  const arrivalHandledRef = useRef<string | null>(null);
  const wasOpenRef = useRef(false);
  const quickAddRunningRef = useRef(false);

  // Fresh mount: back from sign-up / log-in counts as a new start.
  useEffect(() => {
    useArrivalStore.getState().setLeavingForAuth(false);
  }, []);

  useEffect(() => {
    if (!urlSeededRef.current && urlArrival) {
      urlSeededRef.current = true;
      if (useArrivalStore.getState().pendingSkillId === null) {
        setPendingSkillId(urlArrival);
      }
    }
  }, [urlArrival, setPendingSkillId]);

  /** Add + activate the pending skill without the setup screen. */
  const quickAddArrival = useMemo(
    () =>
      async (param: string): Promise<void> => {
        if (quickAddRunningRef.current) {
          return;
        }
        quickAddRunningRef.current = true;
        try {
          const skill = await resolveArrivalSkill(param, deps);
          if (skill) {
            const added = await addAndActivateArrival(
              skill,
              favorites,
              deps,
              availability,
            );
            if (added) {
              trackOnboarding(logger, "arrival_added", {
                mode: "arrival",
                arrivalSkillId: param,
              });
            }
            await refreshFavorites(logger);
          }
        } finally {
          quickAddRunningRef.current = false;
          if (useArrivalStore.getState().pendingSkillId === param) {
            setPendingSkillId(null);
          }
        }
      },
    [deps, favorites, availability, logger, setPendingSkillId],
  );

  // Decide once favorites are known.
  useEffect(() => {
    if (!pendingSkillId) {
      // Consumed: the same skill link may arrive again later in this mount
      // (chat kept mounted while the visitor went to a skill page and back).
      arrivalHandledRef.current = null;
    }
    if (isInitialLoading) {
      return;
    }
    if (pendingSkillId) {
      if (arrivalHandledRef.current === pendingSkillId) {
        return;
      }
      arrivalHandledRef.current = pendingSkillId;
      firstRunDecidedRef.current = true;
      if (favorites.length === 0) {
        setModelSelectorOpen(true);
      } else {
        void quickAddArrival(pendingSkillId);
      }
      return;
    }
    if (firstRunDecidedRef.current) {
      return;
    }
    // A link with ?skill= is still on its way into the store.
    if (urlArrival && !urlSeededRef.current) {
      return;
    }
    firstRunDecidedRef.current = true;
    if (
      favorites.length === 0 &&
      getLocalItem(STORAGE_KEYS.SELECTOR_ONBOARDING_SHOWN, logger) === null
    ) {
      setModelSelectorOpen(true);
    }
  }, [
    isInitialLoading,
    pendingSkillId,
    favorites.length,
    urlArrival,
    logger,
    setModelSelectorOpen,
    quickAddArrival,
  ]);

  // Selector closed while the setup was still due (no favorites yet): that
  // is a dismissal. It auto-opens once per device, so remember it. A pending
  // skill link still gets its skill added and made active.
  useEffect(() => {
    const wasOpen = wasOpenRef.current;
    wasOpenRef.current = selectorOpen;
    if (
      !wasOpen ||
      selectorOpen ||
      isInitialLoading ||
      useArrivalStore.getState().leavingForAuth
    ) {
      return;
    }
    if (favorites.length === 0) {
      setLocalItem(STORAGE_KEYS.SELECTOR_ONBOARDING_SHOWN, "true", logger);
      trackOnboarding(logger, "dismissed", {
        mode: pendingSkillId ? "arrival" : "full",
        arrivalSkillId: pendingSkillId ?? undefined,
      });
    }
    if (pendingSkillId) {
      void quickAddArrival(pendingSkillId);
    }
  }, [
    selectorOpen,
    pendingSkillId,
    isInitialLoading,
    favorites.length,
    logger,
    quickAddArrival,
  ]);

  return null;
}
