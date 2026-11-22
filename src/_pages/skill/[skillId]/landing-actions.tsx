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
import { Check } from "next-vibe/ui/components/icons/Check";
import { DollarSign } from "next-vibe/ui/components/icons/DollarSign";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { Link } from "next-vibe/ui/components/link";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import type {
  EndpointFormValues,
  ReactWidgetContext,
} from "next-vibe/unified-ui/_shared/react-types";
import { WidgetContextProvider } from "next-vibe/unified-ui/_shared/WidgetContextProvider";
import {
  NavigationStackProvider,
  useNavigationStack,
} from "next-vibe/unified-ui/hooks/use-navigation-stack";
import { type JSX, type ReactNode, useState } from "react";
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
        layout="inline"
      />
    </SkillIsland>
  );
}
