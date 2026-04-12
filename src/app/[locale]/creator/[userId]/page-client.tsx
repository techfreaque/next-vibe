"use client";

import { Avatar, AvatarFallback, AvatarImage } from "next-vibe-ui/ui/avatar";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import { Link } from "next-vibe-ui/ui/link";
import { Nav } from "next-vibe-ui/ui/nav";
import { Span } from "next-vibe-ui/ui/span";
import { H1, H2, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useCallback, useState } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CreatorGetResponseOutput } from "@/app/api/[locale]/user/public/creator/[userId]/definition";
import type { CountryLanguage } from "@/i18n/core/config";

import {
  DEFAULT_ACCENT,
  ProfileBio,
  ProfileHero,
  ProfileSkillsSection,
  ProfileSocialPills,
  type ProfileSkillItem,
} from "./_shared/profile-content";
import type { CreatorPageT } from "./i18n";

export interface CreatorLeadMagnetConfig {
  headline: string | null;
  buttonText: string | null;
}

export interface CreatorPageData {
  locale: CountryLanguage;
  userId: string;
  creator: CreatorGetResponseOutput | null;
  skills: ProfileSkillItem[];
  appName: string;
  leadMagnetConfig: CreatorLeadMagnetConfig | null;
}

type CaptureState = "idle" | "submitting" | "done" | "error";

function CreatorLeadCaptureForm({
  skillId,
  config,
  locale,
  t,
}: {
  skillId: string;
  config: CreatorLeadMagnetConfig;
  locale: CountryLanguage;
  t: CreatorPageT;
}): JSX.Element {
  const [state, setState] = useState<CaptureState>("idle");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

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
        const logger = createEndpointLogger(false, Date.now(), locale);
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
  }, [skillId, firstName, email, locale]);

  const headline = config.headline ?? t("list.headline");
  const buttonLabel = config.buttonText ?? t("list.send");

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
          {t("list.doneHeading")}
        </H2>
        <P style={{ color: "rgba(255,255,255,0.55)", margin: 0, fontSize: 14 }}>
          {t("list.doneSub")}
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
        {headline}
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
          placeholder={t("list.namePlaceholder")}
          disabled={state === "submitting"}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500"
        />
        <Input
          type="email"
          value={email}
          onChange={(e): void => setEmail(e.target.value)}
          placeholder={t("list.emailPlaceholder")}
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
          {state === "submitting" ? t("list.sending") : buttonLabel}
        </Button>
        {state === "error" && (
          <Span style={{ fontSize: 12, color: "rgba(255,100,100,0.8)" }}>
            {t("list.error")}
          </Span>
        )}
      </Div>
      <Span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
        {t("list.finePrint")}
      </Span>
    </Div>
  );
}

export function CreatorProfilePage({
  locale,
  creator,
  skills,
  appName,
  leadMagnetConfig,
  t,
}: CreatorPageData & { t: CreatorPageT }): JSX.Element {
  if (!creator) {
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
        <H1 style={{ fontSize: 24, fontWeight: 700 }}>{t("notFound.title")}</H1>
        <P style={{ color: "rgba(255,255,255,0.5)", maxWidth: 360 }}>
          {t("notFound.description")}
        </P>
        <Link href={`/${locale}` as never}>
          <Button variant="outline">{t("notFound.back")}</Button>
        </Link>
      </Div>
    );
  }

  const accent = creator.creatorAccentColor ?? DEFAULT_ACCENT;

  const avatarNode = (
    <Avatar className="h-full w-full">
      {creator.avatarUrl && (
        <AvatarImage src={creator.avatarUrl} alt={creator.publicName} />
      )}
      <AvatarFallback className="text-2xl font-bold bg-violet-900/60 text-violet-200">
        {creator.publicName
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
      ? `${String(skills.length)} ${t("skills.title").toLowerCase()}`
      : undefined;

  const belowAvatarRow = (
    <>
      {creator.bio && <ProfileBio bio={creator.bio} />}
      <ProfileSocialPills profile={creator} />
    </>
  );

  return (
    <Div
      style={{
        minHeight: "100vh",
        background: "#0f0520",
        color: "#fff",
        fontFamily: "inherit",
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
          {t("nav.backArrow")} {appName}
        </Link>
      </Nav>

      {/* ── HERO ── */}
      <ProfileHero
        profile={creator}
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
        <ProfileSkillsSection
          skills={skills}
          accent={accent}
          skillHref={(id): string => {
            const path = `/${locale}/skill/${id}`;
            if (!creator.referralCode) {
              return path;
            }
            return `/track?ref=${encodeURIComponent(creator.referralCode)}&url=${encodeURIComponent(path)}`;
          }}
          sectionLabel={t("skills.title")}
          chatLabel={t("skills.chat")}
          addLabel={t("skills.add")}
          emptyLabel={t("skills.empty")}
        />

        {/* Lead capture */}
        {leadMagnetConfig && skills.length > 0 && (
          <Div style={{ marginTop: 36 }}>
            <CreatorLeadCaptureForm
              skillId={skills[0].id}
              config={leadMagnetConfig}
              locale={locale}
              t={t}
            />
          </Div>
        )}

        {/* Referral code */}
        {creator.referralCode && (
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
              {t("referral.label")}
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
              {creator.referralCode}
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
          {t("nav.copyright")} {appName}
        </Span>
      </Div>
    </Div>
  );
}
