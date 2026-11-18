"use client";

/**
 * Interactive islands of the skill landing page: share & earn, add to my
 * skills, creator lead capture. Everything else on the page is static markup.
 *
 * The shared dialogs/forms read user + logger from the widget context, so the
 * islands run inside a small widget context built for the skill GET endpoint.
 */

import skillDefinitions from "next-vibe/agent/skills/[id]/definition";
import { scopedTranslation as skillTranslation } from "next-vibe/agent/skills/[id]/i18n";
import { ShareSkillDialog } from "next-vibe/agent/skills/[id]/share-skill";
import type { FavoriteCreateRequestOutput } from "next-vibe/agent/skills/favorites/create/definition";
import { useFavoriteCreate } from "next-vibe/agent/skills/favorites/create/hooks";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { FormElement } from "next-vibe/ui/components/form-element";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { Check } from "next-vibe/ui/components/icons/Check";
import { DollarSign } from "next-vibe/ui/components/icons/DollarSign";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { Send } from "next-vibe/ui/components/icons/Send";
import { Input } from "next-vibe/ui/components/input";
import { Link } from "next-vibe/ui/components/link";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { useRouter } from "next-vibe/ui/hooks/use-navigation";
import { getElementById } from "next-vibe/ui/lib/dom";
import type {
  EndpointFormValues,
  ReactWidgetContext,
} from "next-vibe/unified-ui/_shared/react-types";
import { WidgetContextProvider } from "next-vibe/unified-ui/_shared/WidgetContextProvider";
import {
  NavigationStackProvider,
  useNavigationStack,
} from "next-vibe/unified-ui/hooks/use-navigation-stack";
import { type JSX, type ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { LeadCaptureForm } from "@/lead-magnet/capture/widget";

import { scopedTranslation } from "./i18n";

type SkillGetEndpoint = typeof skillDefinitions.GET;

interface IslandProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: Platform;
  children: ReactNode;
}

function IslandContext({
  locale,
  user,
  platform,
  children,
}: IslandProps): JSX.Element {
  const logger = useLogger();
  const navigation = useNavigationStack();
  const form = useForm<EndpointFormValues<SkillGetEndpoint>>();
  const { t } = skillTranslation.scopedT(locale);
  const context: ReactWidgetContext<SkillGetEndpoint> = {
    locale,
    isInteractive: true,
    user,
    logger,
    platform,
    endpointFields: skillDefinitions.GET.fields,
    disabled: false,
    response: undefined,
    navigation,
    endpoint: skillDefinitions.GET,
    t,
    form,
  };
  return (
    <WidgetContextProvider context={context}>{children}</WidgetContextProvider>
  );
}

/** Widget context for one interactive island. */
export function SkillIsland(props: IslandProps): JSX.Element {
  return (
    <NavigationStackProvider>
      <IslandContext {...props} />
    </NavigationStackProvider>
  );
}

const SECONDARY_BTN =
  "h-9 gap-1.5 rounded-full px-3.5 text-sm font-medium text-primary hover:bg-primary/10 hover:text-primary";

export function ShareEarnAction({
  locale,
  user,
  platform,
  skillId,
  skillName,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: Platform;
  skillId: string;
  skillName: string;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [open, setOpen] = useState(false);
  if (user.isPublic) {
    // Sharing needs an account (the link carries your referral code).
    return (
      <Button asChild variant="ghost" size="sm" className={SECONDARY_BTN}>
        <Link href={`/${locale}/story/earn`}>
          <DollarSign className="h-4 w-4" />
          {t("actions.shareEarn")}
        </Link>
      </Button>
    );
  }
  return (
    <SkillIsland locale={locale} user={user} platform={platform}>
      <Button
        variant="ghost"
        size="sm"
        className={SECONDARY_BTN}
        onClick={() => setOpen(true)}
      >
        <DollarSign className="h-4 w-4" />
        {t("actions.shareEarn")}
      </Button>
      <ShareSkillDialog
        skillId={skillId}
        skillName={skillName}
        locale={locale}
        open={open}
        onOpenChange={setOpen}
      />
    </SkillIsland>
  );
}

/** Signed-in only: save this skill (variant) to the user's chat skills. */
export function AddToSkillsAction({
  locale,
  user,
  data,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
  data: FavoriteCreateRequestOutput;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const logger = useLogger();
  const { addFavorite, isLoading } = useFavoriteCreate(user, logger);
  const [state, setState] = useState<"idle" | "added" | "failed">("idle");

  const handleAdd = (): void => {
    void addFavorite(data)
      .then((id) => {
        setState(id ? "added" : "failed");
        return undefined;
      })
      .catch((error: Error) => {
        logger.error("Skill page: add to my skills failed", parseError(error), {
          page: "skill",
          skillId: data.skillId,
        });
        setState("failed");
      });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={SECONDARY_BTN}
      onClick={handleAdd}
      disabled={isLoading || state === "added"}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : state === "added" ? (
        <Check className="h-4 w-4 text-success" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
      {state === "added"
        ? t("actions.added")
        : state === "failed"
          ? t("actions.addFailed")
          : t("actions.addToSkills")}
    </Button>
  );
}

export function LeadCaptureIsland({
  locale,
  user,
  platform,
  skillId,
  headline,
  buttonText,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: Platform;
  skillId: string;
  headline: string | null;
  buttonText: string | null;
}): JSX.Element {
  return (
    <SkillIsland locale={locale} user={user} platform={platform}>
      <LeadCaptureForm
        skillId={skillId}
        headline={headline}
        buttonText={buttonText}
      />
    </SkillIsland>
  );
}

/**
 * The composer under the sample answers: type a question, Enter or send
 * opens the chat with this skill and the question. Empty input just opens
 * the chat.
 */
export function SampleComposer({
  chatUrl,
  placeholder,
  sendLabel,
}: {
  /** Chat deep link incl. ?skill= (and &ref=), without q. */
  chatUrl: string;
  placeholder: string;
  sendLabel: string;
}): JSX.Element {
  const router = useRouter();
  const [text, setText] = useState("");
  const handleSubmit = (): void => {
    const question = text.trim();
    router.push(
      question ? `${chatUrl}&q=${encodeURIComponent(question)}` : chatUrl,
    );
  };
  return (
    <FormElement
      onSubmit={handleSubmit}
      className="flex min-h-11 items-center gap-2 rounded-xl border border-border bg-background py-1 pr-1 pl-3 transition-colors focus-within:border-primary/50"
    >
      <Input
        name="q"
        value={text}
        onChange={(e): void => setText(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-9 min-w-0 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
      />
      <Button
        type="submit"
        size="icon"
        aria-label={sendLabel}
        className="h-9 w-9 shrink-0 rounded-lg"
      >
        <Send className="h-4 w-4" />
      </Button>
    </FormElement>
  );
}

/** Element ids the sticky bar watches (set on the hero CTA and final band). */
export const HERO_CTA_ID = "skill-hero-cta";
export const FINAL_CTA_ID = "skill-final-cta";

/**
 * Phones only: a slim "Try it" bar pinned to the bottom once the hero CTA has
 * scrolled away, hidden again while the closing CTA band is on screen. Slides
 * in with a transform, so nothing below it moves.
 */
export function StickyTryBar({
  href,
  label,
}: {
  href: string;
  label: string;
}): JSX.Element {
  const [heroGone, setHeroGone] = useState(false);
  const [finalVisible, setFinalVisible] = useState(false);

  useEffect(() => {
    const hero = getElementById(HERO_CTA_ID);
    const final = getElementById(FINAL_CTA_ID);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) {
          // Gone means scrolled past (above the viewport), not "not yet seen".
          setHeroGone(
            !entry.isIntersecting && entry.boundingClientRect.top < 0,
          );
        } else if (entry.target === final) {
          setFinalVisible(entry.isIntersecting);
        }
      }
    });
    if (hero) {
      observer.observe(hero);
    }
    if (final) {
      observer.observe(final);
    }
    return (): void => observer.disconnect();
  }, []);

  const shown = heroGone && !finalVisible;
  return (
    <Div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-200 lg:hidden ${
        // invisible also takes the hidden bar out of the tab order
        shown ? "translate-y-0" : "invisible translate-y-full"
      }`}
    >
      <Button asChild className="h-11 w-full gap-2 text-base font-semibold">
        <Link href={href}>
          {label}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </Div>
  );
}
