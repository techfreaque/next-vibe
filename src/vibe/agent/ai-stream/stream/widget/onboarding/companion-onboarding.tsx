"use client";

import { parseError } from "next-vibe/core/utils/parse-error";
import { Button } from "next-vibe/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "next-vibe/ui/components/dialog";
import { Div, type DivRefObject } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { ArrowLeft } from "next-vibe/ui/components/icons/ArrowLeft";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { Gift } from "next-vibe/ui/components/icons/Gift";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { useSearchParams } from "next-vibe/ui/hooks/use-navigation";
import { getLocalItem, setLocalItem } from "next-vibe/ui/lib/storage";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { executeQuery } from "next-vibe/unified-ui/hooks/query-executor";
import {
  type JSX,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { FREE_CREDIT_ALLOWANCE } from "@/products/constants";

import { STORAGE_KEYS } from "../../../../chat/constants";
import { useChatNavigationStore } from "../../../../chat/hooks/use-chat-navigation-store";
import { useModelSelectorState } from "../../../../chat/model-selector-state";
import { formatSkillId, parseSkillId } from "../../../../chat/slugify";
import { useProviderAvailability } from "../../../../env-availability-store";
import { isUncensoredContent } from "../../../../models/uncensored-consent/constants";
import { useUncensoredConsent } from "../../../../models/uncensored-consent/hooks";
import { UncensoredConsentTerms } from "../../../../models/uncensored-consent/widget/consent-terms";
import skillSingleDefinition from "../../../../skills/[id]/definition";
import { useChatFavorites } from "../../../../skills/favorites/hooks/hooks";
import { getBestChatModel, getChatModelById } from "../../../models";
import { useChatInputStore } from "../../hooks/input-store";
import { getDraftKey, saveDraft } from "../../hooks/use-input-autosave";
import { scopedTranslation } from "../../i18n";
import { useArrivalStore } from "./arrival-store";
import { CompanionCards, useCompanionCards } from "./companion-cards";
import {
  DEFAULT_GOAL_ID,
  type GoalId,
  GOALS,
  goalSkillNames,
  GoalTiles,
} from "./goal-tiles";
import {
  activateFavorite,
  addSkillFavorites,
  DEFAULT_COMPANION_ID,
  defaultVariantOf,
  isCompanionSkillId,
  refreshFavorites,
  removeFavorites,
  seedBuiltInSkills,
  seedCompanion,
} from "./seed";
import { type OnboardingMode, trackOnboarding } from "./track";

type Step = "companion" | "goal";

interface Plan {
  mode: OnboardingMode;
  /** Display name of the skill the visitor arrived with (arrival mode). */
  arrivalSkillName: string | null;
  arrivalSkillId: string | null;
  /** The arrival skill runs an uncensored model (18+ confirmation needed). */
  arrivalUncensored: boolean;
  /** Model the arrival skill runs, named in the 18+ reason line. */
  arrivalModelName: string | null;
}

/**
 * First-run onboarding, mounted once in the chat.
 *
 * - New guest/account (no favorites): step 1 companion, step 2 first goal,
 *   then straight into the chat with the goal's prompt prefilled.
 * - Existing user without a companion: step 1 only, once.
 * - Arrival from a skill page (`?skill=`): the skill is added and made active
 *   first; if there was no companion, step 1 asks for one ("<skill> is
 *   added..."). The server already added Thea as the safety net, so picking
 *   someone else swaps her out.
 *
 * Every exit (skip, close, Escape) leaves the user with a companion and marks
 * the onboarding done on this device.
 */
export function CompanionOnboarding(): JSX.Element | null {
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const locale = useWidgetLocale();
  const availability = useProviderAvailability();
  const { t } = scopedTranslation.scopedT(locale);
  const searchParams = useSearchParams();
  const { favorites, isInitialLoading } = useChatFavorites(logger, {
    activeFavoriteId: null,
  });

  // The URL hook strips `?skill=` in a layout effect; whichever runs first,
  // the arrival is seen: the initial URL here, the store otherwise.
  const [urlArrival] = useState<string | null>(() => {
    const raw = searchParams.get("skill");
    return raw !== null && /^[\w-]{1,128}$/.test(raw) ? raw : null;
  });
  const storeArrival = useArrivalStore((s) => s.pendingSkillId);
  const setPendingSkillId = useArrivalStore((s) => s.setPendingSkillId);
  const setOnboardingOpen = useModelSelectorState((s) => s.setOnboardingOpen);
  const arrivalSkillParam = storeArrival ?? urlArrival;
  const activeThreadId = useChatNavigationStore((s) => s.activeThreadId);
  const currentRootFolderId = useChatNavigationStore(
    (s) => s.currentRootFolderId,
  );
  const currentSubFolderId = useChatNavigationStore(
    (s) => s.currentSubFolderId,
  );

  const [plan, setPlan] = useState<Plan | null>(null);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("companion");
  const [companionId, setCompanionId] = useState(DEFAULT_COMPANION_ID);
  const [goalId, setGoalId] = useState<GoalId>(DEFAULT_GOAL_ID);
  /** The 18+ step collapses the tiles to the picked one; "Change" reopens them */
  const [goalsExpanded, setGoalsExpanded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [decided, setDecided] = useState(false);
  const [alreadySetUp, setAlreadySetUp] = useState(false);
  const arrivalHandledRef = useRef<string | null>(null);
  const adultsRef = useRef<DivRefObject | null>(null);

  const deps = useMemo(
    () => ({ user, logger, locale }),
    [user, logger, locale],
  );
  const cards = useCompanionCards({ locale, t });
  const consent = useUncensoredConsent(user, logger);
  const companionName =
    cards.find((c) => c.id === companionId)?.name ?? companionId;

  const isDone = useCallback(
    (): boolean =>
      getLocalItem(STORAGE_KEYS.COMPANION_ONBOARDING_DONE, logger) !== null,
    [logger],
  );
  const markDone = useCallback((): void => {
    setLocalItem(STORAGE_KEYS.COMPANION_ONBOARDING_DONE, "true", logger);
  }, [logger]);

  const show = useCallback((next: Plan): void => {
    setPlan(next);
    setStep("companion");
    setOpen(true);
  }, []);

  useEffect(() => {
    if (plan) {
      trackOnboarding(logger, "shown", {
        mode: plan.mode,
        step: "companion",
        arrivalSkillId: plan.arrivalSkillId ?? undefined,
      });
    }
  }, [plan, logger]);

  // ── Arrival from a skill link ────────────────────────────────────────────
  useEffect(() => {
    if (
      isInitialLoading ||
      !arrivalSkillParam ||
      arrivalHandledRef.current === arrivalSkillParam
    ) {
      return;
    }
    arrivalHandledRef.current = arrivalSkillParam;
    const hadCompanion = favorites.some((f) => isCompanionSkillId(f.skillId));
    const { skillId: baseId, variantId } = parseSkillId(arrivalSkillParam);
    // Activating an uncensored skill would pop the 18+ dialog right away;
    // hold it until the companion question is answered.
    const mayAsk = !hadCompanion && !isCompanionSkillId(baseId) && !isDone();
    if (mayAsk) {
      setOnboardingOpen(true);
    }

    /** Resolves true when the companion question was shown. */
    const setUpArrival = async (): Promise<boolean> => {
      try {
        const response = await executeQuery({
          endpoint: skillSingleDefinition.GET,
          logger,
          user,
          locale,
          requestData: undefined,
          pathParams: { id: baseId },
        });
        if (!response.success) {
          logger.warn("Onboarding: arrival skill not found", {
            skillId: arrivalSkillParam,
            errorType: response.errorType.errorKey,
          });
          return false;
        }
        const skill = response.data;
        const variant =
          (variantId
            ? skill.variants.find((v) => v.id === variantId)
            : undefined) ?? defaultVariantOf(skill.variants);
        if (!variant) {
          return false;
        }
        // Favorites store the canonical slug; a UUID link matches its internalId.
        const composite = formatSkillId(baseId, variant.id);
        const existing = favorites.find(
          (f) =>
            f.skillId === composite ||
            (skill.internalId !== null &&
              f.skillId === formatSkillId(skill.internalId, variant.id)),
        );
        const favorite = existing
          ? { id: existing.id, skillId: existing.skillId }
          : ((
              await addSkillFavorites({
                skillId: baseId,
                icon: skill.icon,
                variants: [variant],
                deps,
              })
            )[0] ?? null);
        if (!favorite) {
          return false;
        }
        const arrivalModel = existing?.modelId
          ? getChatModelById(existing.modelId)
          : getBestChatModel(variant.modelSelection, user, availability);
        await activateFavorite(favorite, deps, arrivalModel?.id ?? null);
        await refreshFavorites(logger);
        if (!mayAsk) {
          return false;
        }
        show({
          mode: "arrival",
          arrivalSkillName: skill.name ?? baseId,
          arrivalSkillId: arrivalSkillParam,
          arrivalUncensored: isUncensoredContent(arrivalModel?.content),
          arrivalModelName: arrivalModel?.name ?? null,
        });
        return true;
      } catch (error) {
        logger.error(
          "Onboarding: arrival skill setup failed",
          parseError(error),
          {
            component: "CompanionOnboarding",
            skillId: arrivalSkillParam,
          },
        );
        return false;
      }
    };

    void setUpArrival().then((asked) => {
      if (mayAsk && !asked) {
        setOnboardingOpen(false);
      }
      // The arrival decided this visit; the regular first run must not run.
      setDecided(true);
      setPendingSkillId(null);
      return undefined;
    });
  }, [
    isInitialLoading,
    arrivalSkillParam,
    favorites,
    deps,
    user,
    logger,
    locale,
    isDone,
    show,
    availability,
    setOnboardingOpen,
    setPendingSkillId,
  ]);

  // ── Regular first run (decided once, during render) ──────────────────────
  if (!decided && !isInitialLoading && !arrivalSkillParam) {
    setDecided(true);
    if (!isDone()) {
      if (favorites.length === 0) {
        show({
          mode: "full",
          arrivalSkillName: null,
          arrivalSkillId: null,
          arrivalUncensored: false,
          arrivalModelName: null,
        });
      } else if (!favorites.some((f) => isCompanionSkillId(f.skillId))) {
        show({
          mode: "companion",
          arrivalSkillName: null,
          arrivalSkillId: null,
          arrivalUncensored: false,
          arrivalModelName: null,
        });
      } else {
        // Already set up (other device, or before this onboarding existed)
        setAlreadySetUp(true);
      }
    }
  }

  // Other one-time dialogs (18+ consent) wait while this one is up.
  useEffect(() => {
    setOnboardingOpen(open);
  }, [open, setOnboardingOpen]);

  useEffect(() => {
    if (alreadySetUp) {
      markDone();
    }
  }, [alreadySetUp, markDone]);

  const prefillComposer = useCallback(
    (text: string): void => {
      const draftKey = getDraftKey(
        activeThreadId,
        currentRootFolderId,
        currentSubFolderId,
      );
      useChatInputStore.getState().setInput(text);
      void saveDraft(draftKey, text, logger);
    },
    [logger, activeThreadId, currentRootFolderId, currentSubFolderId],
  );

  const finish = useCallback((): void => {
    markDone();
    setOpen(false);
    setBusy(false);
    setFailed(false);
    void refreshFavorites(logger);
    // Let the dialog's close animation hand focus back, then go to the composer.
    setTimeout(() => {
      useChatInputStore.getState().inputRef.current?.focus();
    }, 200);
  }, [markDone, logger]);

  /** Make `chosen` the companion; in arrival mode swap out the safety-net one. */
  const applyCompanion = useCallback(
    async (chosen: string, activate: boolean): Promise<boolean> => {
      const current = favorites.filter((f) => isCompanionSkillId(f.skillId));
      const alreadyHeld = current.some(
        (f) => parseSkillId(f.skillId).skillId === chosen,
      );
      let seededDefault = null;
      if (!alreadyHeld) {
        seededDefault = await seedCompanion(chosen, deps);
        if (!seededDefault) {
          return false;
        }
      }
      if (plan?.mode === "arrival") {
        // The visitor had no companion before the skill link: every other
        // companion row is the server's automatic Thea. Drop it.
        await removeFavorites(
          current
            .filter((f) => parseSkillId(f.skillId).skillId !== chosen)
            .map((f) => f.id),
          deps,
        );
      }
      if (activate && seededDefault) {
        await activateFavorite(seededDefault, deps);
      }
      return true;
    },
    [favorites, plan?.mode, deps],
  );

  // The 18+ confirmation lives inside this sheet when the next chat runs an
  // uncensored model, so nobody gets a second dialog right after this one.
  const selectedGoalConfig = GOALS.find((g) => g.id === goalId);
  const needsAdults =
    consent.consented !== true &&
    (step === "goal"
      ? (selectedGoalConfig?.adultsOnly ?? false)
      : plan?.mode === "arrival" && plan.arrivalUncensored);

  // Picking "Uncensored" brings the 18+ terms into view: nobody confirms
  // text they never saw.
  useEffect(() => {
    if (needsAdults) {
      adultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [needsAdults]);

  /** Records the 18+ confirmation when this step needs it. */
  const confirmAdultsIfNeeded = useCallback(async (): Promise<boolean> => {
    if (!needsAdults) {
      return true;
    }
    const result = await consent.agree();
    if (!result.success) {
      logger.error("Onboarding: storing 18+ confirmation failed", {
        component: "CompanionOnboarding",
        errorType: result.errorType.errorKey,
        reason: result.message,
      });
      setBusy(false);
      setFailed(true);
      return false;
    }
    return true;
  }, [needsAdults, consent, logger]);

  const confirmCompanion = useCallback(async (): Promise<void> => {
    if (!plan || busy) {
      return;
    }
    setBusy(true);
    setFailed(false);
    if (!(await confirmAdultsIfNeeded())) {
      return;
    }
    const ok = await applyCompanion(companionId, plan.mode === "full");
    trackOnboarding(logger, "companion_picked", {
      mode: plan.mode,
      step: "companion",
      companionId,
      arrivalSkillId: plan.arrivalSkillId ?? undefined,
    });
    if (!ok) {
      setBusy(false);
      setFailed(true);
      return;
    }
    if (plan.mode === "full") {
      setBusy(false);
      setStep("goal");
      return;
    }
    trackOnboarding(logger, "completed", {
      mode: plan.mode,
      step: "companion",
      companionId,
    });
    finish();
  }, [
    plan,
    busy,
    confirmAdultsIfNeeded,
    applyCompanion,
    companionId,
    logger,
    finish,
  ]);

  const confirmGoal = useCallback(async (): Promise<void> => {
    if (!plan || busy) {
      return;
    }
    const goal = GOALS.find((g) => g.id === goalId);
    if (!goal) {
      return;
    }
    setBusy(true);
    setFailed(false);
    if (!(await confirmAdultsIfNeeded())) {
      return;
    }
    const added = await seedBuiltInSkills(goal.skillIds, deps);
    const lead = goal.leadSkillId
      ? added.find((f) => parseSkillId(f.skillId).skillId === goal.leadSkillId)
      : undefined;
    if (lead) {
      await activateFavorite(lead, deps);
    } else if (goal.companionVariantId) {
      // Keep the companion just picked, switch it to the matching mode.
      // The composite id resolves to the user's own favorite row.
      const composite = formatSkillId(companionId, goal.companionVariantId);
      await activateFavorite({ id: composite, skillId: composite }, deps);
    }
    prefillComposer(t(`onboarding.goal.tiles.${goal.id}.prompt`));
    trackOnboarding(logger, "goal_picked", {
      mode: plan.mode,
      step: "goal",
      companionId,
      goal: goal.id,
    });
    trackOnboarding(logger, "completed", {
      mode: plan.mode,
      step: "goal",
      companionId,
      goal: goal.id,
    });
    finish();
  }, [
    plan,
    busy,
    goalId,
    confirmAdultsIfNeeded,
    deps,
    prefillComposer,
    t,
    logger,
    companionId,
    finish,
  ]);

  /** Skip from any step: nobody leaves without a companion. */
  const skip = useCallback(async (): Promise<void> => {
    if (!plan || busy) {
      return;
    }
    trackOnboarding(logger, "skipped", {
      mode: plan.mode,
      step,
      companionId: step === "goal" ? companionId : DEFAULT_COMPANION_ID,
      arrivalSkillId: plan.arrivalSkillId ?? undefined,
    });
    if (step === "companion") {
      setBusy(true);
      await applyCompanion(DEFAULT_COMPANION_ID, plan.mode === "full");
    }
    finish();
  }, [plan, busy, logger, step, companionId, applyCompanion, finish]);

  if (!plan) {
    return null;
  }

  const totalSteps = plan.mode === "full" ? 2 : 1;
  const currentStep = step === "companion" ? 1 : 2;
  const selectedGoal = GOALS.find((g) => g.id === goalId) ?? GOALS[0];
  const goalNames = selectedGoal ? goalSkillNames(selectedGoal, locale) : [];

  const title =
    step === "goal"
      ? t("onboarding.goal.title")
      : plan.mode === "arrival"
        ? t("onboarding.companion.arrivalTitle", {
            skill: plan.arrivalSkillName ?? "",
          })
        : plan.mode === "companion"
          ? t("onboarding.companion.missingTitle")
          : t("onboarding.companion.title");
  const subtitle =
    step === "goal"
      ? t("onboarding.goal.subtitle")
      : plan.mode === "arrival"
        ? t("onboarding.companion.arrivalSubtitle", {
            skill: plan.arrivalSkillName ?? "",
          })
        : plan.mode === "companion"
          ? t("onboarding.companion.missingSubtitle")
          : t("onboarding.companion.subtitle");

  const primaryLabel = needsAdults
    ? step === "goal"
      ? t("onboarding.consent.agreeStart")
      : t("onboarding.consent.agreeContinue")
    : step === "goal"
      ? t("onboarding.goal.start")
      : plan.mode === "arrival"
        ? t("onboarding.companion.arrivalContinue")
        : totalSteps > 1
          ? t("onboarding.companion.continue", { name: companionName })
          : t("onboarding.companion.start", { name: companionName });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          void skip();
        }
      }}
    >
      <DialogContent
        data-testid="companion-onboarding"
        overlayClassName="backdrop-blur-sm"
        onPointerDownOutside={(event) => event.preventDefault()}
        // No focus ring on a card the visitor never touched; Tab enters the dialog.
        onOpenAutoFocus={(event) => event.preventDefault()}
        className={cn(
          "flex max-h-[92dvh] max-w-2xl flex-col gap-0 overflow-hidden p-0 focus:outline-none",
          // Phone: bottom sheet
          "max-sm:bottom-0 max-sm:top-auto max-sm:translate-y-0 max-sm:rounded-t-3xl max-sm:border-x-0 max-sm:border-b-0",
          // Desktop: pinned near the top so the dialog does not jump between steps
          "sm:top-[8vh] sm:max-h-[86dvh] sm:translate-y-0 sm:rounded-3xl sm:data-[state=open]:slide-in-from-top-[2%]",
        )}
      >
        {/* Header: fixed above the scrolling body (18+ terms, phones) */}
        <Div className="flex shrink-0 flex-col gap-2 px-5 pb-4 pr-12 pt-6 sm:px-8 sm:pb-5 sm:pr-14 sm:pt-8">
          {totalSteps > 1 ? (
            <Div
              className="flex items-center gap-2"
              aria-label={t("onboarding.progress", {
                current: currentStep,
                total: totalSteps,
              })}
            >
              {[...Array(totalSteps).keys()].map((index) => (
                <Span
                  key={index}
                  aria-hidden="true"
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    index + 1 === currentStep
                      ? "w-6 bg-foreground"
                      : index + 1 < currentStep
                        ? "w-1.5 bg-foreground/60"
                        : "w-1.5 bg-foreground/20",
                  )}
                />
              ))}
              <Span className="ml-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {t("onboarding.progress", {
                  current: currentStep,
                  total: totalSteps,
                })}
              </Span>
            </Div>
          ) : null}
          <DialogTitle className="text-balance text-xl font-semibold leading-tight tracking-tight text-foreground sm:text-2xl">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            {subtitle}
          </DialogDescription>
        </Div>

        {/* Body: the only part that scrolls; top padding keeps the selected
            card's ring clear of the edge */}
        <Div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-1 sm:px-8 sm:pb-6">
          <Div>
            {step === "companion" ? (
              <CompanionCards
                cards={cards}
                selectedId={companionId}
                onSelect={setCompanionId}
                onConfirm={() => void confirmCompanion()}
                compact={needsAdults}
                t={t}
              />
            ) : (
              <Div className="flex flex-col gap-4">
                <GoalTiles
                  selectedId={goalId}
                  onSelect={(id) => {
                    setGoalId(id);
                    setGoalsExpanded(false);
                  }}
                  onConfirm={() => void confirmGoal()}
                  companionName={companionName}
                  collapsed={needsAdults && !goalsExpanded}
                  onExpand={() => setGoalsExpanded(true)}
                  t={t}
                />
                {selectedGoal ? (
                  <Div className="rounded-2xl border border-dashed border-border bg-muted/40 p-4 dark:bg-muted/20">
                    <Span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      {t("onboarding.goal.promptLabel")}
                    </Span>
                    <P className="mt-1.5 text-sm leading-relaxed text-foreground">
                      {t(`onboarding.goal.tiles.${selectedGoal.id}.prompt`)}
                    </P>
                    <Span className="mt-2 block text-xs text-muted-foreground">
                      {goalNames.length > 0
                        ? t("onboarding.goal.adds", {
                            skills: goalNames.join(", "),
                          })
                        : t("onboarding.goal.noSkills")}
                    </Span>
                  </Div>
                ) : null}
              </Div>
            )}
          </Div>

          {needsAdults ? (
            <Div
              ref={adultsRef}
              className="mt-5 flex scroll-mb-4 flex-col gap-2"
              data-testid="onboarding-adults-confirm"
            >
              <Span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {t("onboarding.consent.label")}
              </Span>
              {step === "companion" && plan.arrivalModelName ? (
                <P className="text-sm leading-snug text-foreground">
                  {t("onboarding.consent.reason", {
                    skill: plan.arrivalSkillName ?? "",
                    model: plan.arrivalModelName,
                  })}
                </P>
              ) : null}
              <UncensoredConsentTerms locale={locale} showStance={false} />
            </Div>
          ) : null}

          {user.isPublic && step === "companion" ? (
            <Div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Gift className="h-3.5 w-3.5 shrink-0" />
              <Span>
                {t("onboarding.guestCredits", {
                  credits: FREE_CREDIT_ALLOWANCE.guest,
                })}
              </Span>
            </Div>
          ) : null}
        </Div>

        {/* Footer */}
        <Div className="flex shrink-0 flex-col gap-2 border-t border-border bg-background px-5 py-3.5 sm:px-8 sm:py-4">
          {failed && !busy ? (
            <Div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <Span className="text-xs font-medium text-destructive">
                {t("onboarding.failed")}
              </Span>
            </Div>
          ) : null}
          {/* Phone: the primary action gets the full width on top */}
          <Div className="flex flex-col-reverse gap-1 sm:flex-row sm:items-center sm:gap-2">
            <Div className="flex items-center justify-between gap-2 sm:contents">
              {step === "goal" ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="h-11 gap-1.5 px-3 text-muted-foreground"
                  disabled={busy}
                  onClick={() => setStep("companion")}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <Span>{t("onboarding.back")}</Span>
                </Button>
              ) : null}
              <Button
                type="button"
                variant="ghost"
                className="ml-auto h-11 px-3 text-muted-foreground sm:ml-0"
                disabled={busy}
                data-testid="onboarding-skip"
                onClick={() => void skip()}
              >
                {step === "goal"
                  ? t("onboarding.skip")
                  : plan.mode === "arrival"
                    ? t("onboarding.notNow")
                    : t("onboarding.skipCompanion")}
              </Button>
            </Div>
            <Button
              type="button"
              className="h-12 w-full min-w-0 gap-2 px-5 text-base font-semibold sm:ml-auto sm:h-11 sm:w-auto sm:text-sm"
              disabled={busy}
              data-testid="onboarding-continue"
              onClick={() =>
                void (step === "goal" ? confirmGoal() : confirmCompanion())
              }
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("onboarding.saving")}
                </>
              ) : (
                <>
                  <Span className="truncate">
                    {failed ? t("onboarding.retry") : primaryLabel}
                  </Span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </>
              )}
            </Button>
          </Div>
        </Div>
      </DialogContent>
    </Dialog>
  );
}
