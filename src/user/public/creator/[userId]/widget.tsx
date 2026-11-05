"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "next-vibe/ui/components/avatar";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Link } from "next-vibe/ui/components/link";
import { Nav } from "next-vibe/ui/components/nav";
import { Span } from "next-vibe/ui/components/span";
import { H2, P } from "next-vibe/ui/components/typography";
import { useMemo, type JSX } from "react";

import { buildScopedPaletteStyle } from "@/_pages/creator/[userId]/_shared/palette-generator";
import {
  DEFAULT_ACCENT,
  ProfileBio,
  ProfileHero,
  ProfileSocialPills,
} from "@/_pages/creator/[userId]/_shared/profile-content";
import { parseSkillId } from "next-vibe/agent/chat/slugify";
import skillsDef from "next-vibe/agent/skills/definition";
import { useChatFavorites } from "next-vibe/agent/skills/favorites/hooks/hooks";
import { scopedTranslation as skillsScopedTranslation } from "next-vibe/agent/skills/i18n";
import { CollapsibleSkillSection } from "next-vibe/agent/skills/widget";
import { useTouchDevice } from "next-vibe/ui/hooks/use-touch-device";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useWidgetValue } from "next-vibe/unified-ui/_shared/use-widget-value";

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
  const scopedPaletteStyle = useMemo(
    () => buildScopedPaletteStyle(accent, true),
    [accent],
  );

  if (!data) {
    return (
      <Div
        style={{
          minHeight: "100vh",
          background: "#16082a",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        <H2 style={{ fontSize: 24, fontWeight: 700 }}>
          {t("widget.notFound.title")}
        </H2>
        <P style={{ color: "rgba(255,255,255,0.5)", maxWidth: 360 }}>
          {t("widget.notFound.description")}
        </P>
        <Link href={`/${locale}` as never}>
          <Button variant="outline">{t("widget.notFound.back")}</Button>
        </Link>
      </Div>
    );
  }

  const skills = data.skills;

  const avatarNode = (
    <Avatar className="h-full w-full">
      {data.avatarUrl && (
        <AvatarImage src={data.avatarUrl} alt={data.publicName} />
      )}
      <AvatarFallback className="text-2xl font-bold bg-violet-900/60 text-violet-200">
        {data.publicName
          .split(" ")
          .map((w: string) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );

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
    <Div
      style={{
        minHeight: "100vh",
        background: "#0f0520",
        color: "#fff",
        fontFamily: "inherit",
        ...scopedPaletteStyle,
      }}
    >
      {/* ── NAV ── */}
      <Nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 24px",
          height: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(15,5,32,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Link
          href={`/${locale}`}
          className="text-xs no-underline text-white/50 hover:text-white/80 transition-colors"
        >
          {t("widget.nav.backArrow")} {data.appName}
        </Link>
      </Nav>

      {/* ── HERO ── */}
      <ProfileHero
        profile={data}
        avatarNode={avatarNode}
        nameSubline={nameSubline}
        belowAvatarRow={belowAvatarRow}
      />

      {/* ── SKILLS + EXTRAS ── */}
      <Div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "0 24px 80px",
        }}
      >
        {/* Skills - rendered via CollapsibleSkillSection */}
        {skills.length > 0 && (
          <Div style={{ marginBottom: 36 }}>
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
          </Div>
        )}

        {/* Lead capture */}
        {data.leadMagnetActive && skills.length > 0 && (
          <Div style={{ marginTop: 36 }}>
            <LeadCaptureForm
              skillId={skills[0].id}
              headline={data.leadMagnetHeadline}
              buttonText={data.leadMagnetButtonText}
            />
          </Div>
        )}

        {/* Referral code */}
        {data.referralCode && (
          <Div
            style={{
              marginTop: 48,
              padding: "16px 20px",
              borderRadius: 12,
              border: `1px solid ${accent}30`,
              background: `${accent}08`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <Span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
              {t("widget.referral.label")}
            </Span>
            <Span
              style={{
                fontFamily: "monospace",
                fontSize: 13,
                color: accent,
                fontWeight: 600,
                letterSpacing: "0.06em",
              }}
            >
              {data.referralCode}
            </Span>
          </Div>
        )}

        {/* Footer */}
        <Span
          style={{
            display: "block",
            textAlign: "center",
            marginTop: 56,
            fontSize: 12,
            color: "rgba(255,255,255,0.18)",
          }}
        >
          {t("widget.nav.copyright")} {data.appName}
        </Span>
      </Div>
    </Div>
  );
}
