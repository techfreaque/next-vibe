"use client";

import { parseSkillId } from "next-vibe/agent/chat/slugify";
import skillsDef from "next-vibe/agent/skills/definition";
import { useChatFavorites } from "next-vibe/agent/skills/favorites/hooks/hooks";
import { scopedTranslation as skillsScopedTranslation } from "next-vibe/agent/skills/i18n";
import { CollapsibleSkillSection } from "next-vibe/agent/skills/widget";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ArrowLeft } from "next-vibe/ui/components/icons/ArrowLeft";
import { Link } from "next-vibe/ui/components/link";
import { Nav } from "next-vibe/ui/components/nav";
import { Span } from "next-vibe/ui/components/span";
import { H2, P } from "next-vibe/ui/components/typography";
import { useTouchDevice } from "next-vibe/ui/hooks/use-touch-device";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useWidgetValue } from "next-vibe/unified-ui/_shared/use-widget-value";
import { type JSX,useMemo } from "react";

import { buildScopedPaletteStyle } from "@/_pages/creator/[userId]/_shared/palette-generator";
import {
  DEFAULT_ACCENT,
  ProfileBio,
  ProfileHero,
  ProfileSocialPills,
} from "@/_pages/creator/[userId]/_shared/profile-content";
import { LeadCaptureForm } from "@/lead-magnet/capture/widget";

import type { GET } from "./definition";
import { scopedTranslation } from "./i18n";

export function CreatorProfileWidget(): JSX.Element {
  const data = useWidgetValue<typeof GET>();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const { t } = scopedTranslation.scopedT(locale);
  const { push: navigate } = useWidgetNavigation();

  // Skills context - reuse real components from skills/widget.tsx
  const isTouch = useTouchDevice();
  const skillsT = skillsScopedTranslation.scopedT(locale).t;
  const skillsFieldChildren = skillsDef.GET.fields.children;

  // Favorites for skill status indicators
  const { favorites, activeFavoriteId } = useChatFavorites(logger, {
    activeFavoriteId: null,
  });

  const favoritesBySkill = useMemo(() => {
    const map: Record<string, string[]> = {};
    if (favorites) {
      for (const fav of favorites) {
        if (!map[fav.skillId]) {
          map[fav.skillId] = [];
        }
        map[fav.skillId].push(fav.id);
      }
    }
    return map;
  }, [favorites]);

  const favoritesByVariant = useMemo(() => {
    const map: Record<string, string[]> = {};
    if (favorites) {
      for (const fav of favorites) {
        if (parseSkillId(fav.skillId).variantId) {
          const key = fav.skillId;
          if (!map[key]) {
            map[key] = [];
          }
          map[key].push(fav.id);
        }
      }
    }
    return map;
  }, [favorites]);

  const accent = data?.creatorAccentColor ?? DEFAULT_ACCENT;
  // The creator's accent only recolours primary/ring — page surfaces stay on
  // the app's light/dark tokens so the profile reads right in both themes.
  const accentStyle = useMemo((): Record<string, string> => {
    const palette = buildScopedPaletteStyle(accent, false);
    return {
      "--primary": palette["--primary"],
      "--primary-surface": palette["--primary"],
      "--primary-foreground": palette["--primary-foreground"],
      "--ring": palette["--ring"],
    };
  }, [accent]);

  if (!data) {
    return (
      <Div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <H2 className="m-0 border-0 p-0 text-2xl font-semibold tracking-tight text-foreground">
          {t("widget.notFound.title")}
        </H2>
        <P className="m-0 max-w-sm text-sm text-muted-foreground">
          {t("widget.notFound.description")}
        </P>
        <Link href={`/${locale}`}>
          <Button variant="outline" className="h-11">
            {t("widget.notFound.back")}
          </Button>
        </Link>
      </Div>
    );
  }

  const skills = data.skills;

  const nameSubline =
    skills.length > 0
      ? `${String(skills.length)} ${t("widget.skills.title").toLowerCase()}`
      : undefined;

  const belowAvatarRow = (
    <>
      {data.bio && <ProfileBio bio={data.bio} />}
      <ProfileSocialPills profile={data} />
    </>
  );

  return (
    <Div style={{ fontFamily: "inherit", ...accentStyle }}>
      <Div className="min-h-screen bg-background text-foreground">
        {/* ── NAV ── */}
        <Nav className="sticky top-0 z-50 flex h-14 items-center border-b bg-background/85 px-4 backdrop-blur sm:px-6">
          <Link
            href={`/${locale}`}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground no-underline transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {data.appName}
          </Link>
        </Nav>

        {/* ── HERO ── */}
        <ProfileHero
          profile={data}
          nameSubline={nameSubline}
          belowAvatarRow={belowAvatarRow}
        />

        {/* ── SKILLS + EXTRAS ── */}
        <Div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 pb-20 pt-8 sm:px-6">
          {skills.length > 0 && (
            <CollapsibleSkillSection
              skills={skills}
              idx={0}
              navigate={navigate}
              logger={logger}
              user={user}
              locale={locale}
              isTouch={isTouch}
              t={skillsT}
              favoritesBySkill={favoritesBySkill}
              favoritesByVariant={favoritesByVariant}
              activeFavoriteId={activeFavoriteId}
            >
              {skillsFieldChildren}
            </CollapsibleSkillSection>
          )}

          {data.leadMagnetActive && skills.length > 0 && (
            <LeadCaptureForm
              skillId={skills[0].id}
              headline={data.leadMagnetHeadline}
              buttonText={data.leadMagnetButtonText}
            />
          )}

          {data.referralCode && (
            <Div className="flex items-center justify-between gap-4 rounded-xl border bg-card px-5 py-4 shadow-sm">
              <Span className="text-sm text-muted-foreground">
                {t("widget.referral.label")}
              </Span>
              <Span className="font-mono text-sm font-semibold tracking-wider text-primary">
                {data.referralCode}
              </Span>
            </Div>
          )}

          <Span className="mt-6 block text-center text-xs text-muted-foreground/70">
            {t("widget.nav.copyright")} {data.appName}
          </Span>
        </Div>
      </Div>
    </Div>
  );
}
