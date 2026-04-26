"use client";

import { Avatar, AvatarFallback, AvatarImage } from "next-vibe-ui/ui/avatar";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import { Link } from "next-vibe-ui/ui/link";
import { Nav } from "next-vibe-ui/ui/nav";
import { Span } from "next-vibe-ui/ui/span";
import { H2, P } from "next-vibe-ui/ui/typography";
import { type JSX, useCallback, useMemo, useState } from "react";

import { useTouchDevice } from "next-vibe-ui/hooks/use-touch-device";
import { CollapsibleSkillSection } from "@/app/api/[locale]/agent/chat/skills/widget";
import skillsDef from "@/app/api/[locale]/agent/chat/skills/definition";
import { scopedTranslation as skillsScopedTranslation } from "@/app/api/[locale]/agent/chat/skills/i18n";
import { useChatFavorites } from "@/app/api/[locale]/agent/chat/favorites/hooks/hooks";
import { parseSkillId } from "@/app/api/[locale]/agent/chat/slugify";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { useWidgetValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-value";
import {
  DEFAULT_ACCENT,
  ProfileBio,
  ProfileHero,
  ProfileSocialPills,
} from "@/app/[locale]/creator/[userId]/_shared/profile-content";
import { buildScopedPaletteStyle } from "@/app/[locale]/creator/[userId]/_shared/palette-generator";

import { GET, type CreatorGetResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

type CaptureState = "idle" | "submitting" | "done" | "error";

function CreatorLeadCaptureForm({
  skillId,
  headline,
  buttonText,
  locale,
  t,
}: {
  skillId: string;
  headline: string | null;
  buttonText: string | null;
  locale: ReturnType<typeof useWidgetLocale>;
  t: ReturnType<typeof scopedTranslation.scopedT>["t"];
}): JSX.Element {
  const [state, setState] = useState<CaptureState>("idle");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const logger = useWidgetLogger();

  const handleSubmit = useCallback((): void => {
    if (!firstName.trim() || !email.trim()) {
      return;
    }
    setState("submitting");
    void (async (): Promise<void> => {
      try {
        const [{ apiClient }, captureDef] = await Promise.all([
          import("@/app/api/[locale]/system/unified-interface/react/hooks/store"),
          import("@/app/api/[locale]/lead-magnet/capture/definition"),
        ]);
        const result = await apiClient.mutate(
          captureDef.POST,
          logger,
          { id: "", isPublic: true, roles: [], leadId: "" } as never,
          { skillId, firstName: firstName.trim(), email: email.trim() },
          undefined,
          locale,
        );
        setState(result.success ? "done" : "error");
      } catch {
        setState("error");
      }
    })();
  }, [skillId, firstName, email, locale, logger]);

  const displayHeadline = headline ?? t("widget.lead.headline");
  const displayButton = buttonText ?? t("widget.lead.send");

  if (state === "done") {
    return (
      <Div
        style={{
          padding: "32px 24px",
          borderRadius: 12,
          border: "1px solid rgba(139,92,246,0.25)",
          background: "rgba(139,92,246,0.08)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          alignItems: "center",
        }}
      >
        <H2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 }}>
          {t("widget.lead.doneHeading")}
        </H2>
        <P style={{ color: "rgba(255,255,255,0.55)", margin: 0, fontSize: 14 }}>
          {t("widget.lead.doneSub")}
        </P>
      </Div>
    );
  }

  return (
    <Div
      style={{
        padding: "28px 24px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <H2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>
        {displayHeadline}
      </H2>
      <Div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
          maxWidth: 340,
        }}
      >
        <Input
          value={firstName}
          onChange={(e): void => setFirstName(e.target.value)}
          placeholder={t("widget.lead.namePlaceholder")}
          disabled={state === "submitting"}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500"
        />
        <Input
          type="email"
          value={email}
          onChange={(e): void => setEmail(e.target.value)}
          placeholder={t("widget.lead.emailPlaceholder")}
          disabled={state === "submitting"}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500"
        />
        <Button
          onClick={handleSubmit}
          disabled={
            state === "submitting" || !firstName.trim() || !email.trim()
          }
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          {state === "submitting" ? t("widget.lead.sending") : displayButton}
        </Button>
        {state === "error" && (
          <Span style={{ fontSize: 12, color: "rgba(255,100,100,0.8)" }}>
            {t("widget.lead.error")}
          </Span>
        )}
      </Div>
      <Span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
        {t("widget.lead.finePrint")}
      </Span>
    </Div>
  );
}

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

  const accent = data.creatorAccentColor ?? DEFAULT_ACCENT;
  const scopedPaletteStyle = useMemo(
    () => buildScopedPaletteStyle(accent, true),
    [accent],
  );
  const skills = data.skills;
  const hasLeadMagnet =
    data.leadMagnetHeadline !== null || data.leadMagnetButtonText !== null;

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
        {hasLeadMagnet && skills.length > 0 && (
          <Div style={{ marginTop: 36 }}>
            <CreatorLeadCaptureForm
              skillId={skills[0].id}
              headline={data.leadMagnetHeadline}
              buttonText={data.leadMagnetButtonText}
              locale={locale}
              t={t}
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
