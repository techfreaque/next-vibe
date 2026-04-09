"use client";

import { Avatar, AvatarFallback, AvatarImage } from "next-vibe-ui/ui/avatar";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Globe } from "next-vibe-ui/ui/icons/Globe";
import { Instagram } from "next-vibe-ui/ui/icons/Instagram";
import { MessageCircle } from "next-vibe-ui/ui/icons/MessageCircle";
import { Music } from "next-vibe-ui/ui/icons/Music";
import { SiDiscord } from "next-vibe-ui/ui/icons/SiDiscord";
import { SiGithub } from "next-vibe-ui/ui/icons/SiGithub";
import { Twitter } from "next-vibe-ui/ui/icons/Twitter";
import { Youtube } from "next-vibe-ui/ui/icons/Youtube";
import { Image } from "next-vibe-ui/ui/image";
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
import type { CreatorPageT } from "./i18n";

/**
 * Build a skill card href.
 * When the creator has a referral code, route through the /track endpoint so that:
 *   1. The referral is attributed to the creator
 *   2. The skillId is extracted from the destination URL and stored on the lead
 */
function skillHref(
  locale: CountryLanguage,
  skillId: string,
  referralCode: string | null | undefined,
): string {
  const skillPath = `/${locale}/skill/${skillId}`;
  if (!referralCode) {
    return skillPath;
  }
  return `/track?ref=${encodeURIComponent(referralCode)}&url=${encodeURIComponent(skillPath)}`;
}

export interface CreatorSkillItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  category: string;
}

export interface CreatorLeadMagnetConfig {
  headline: string | null;
  buttonText: string | null;
}

export interface CreatorPageData {
  locale: CountryLanguage;
  userId: string;
  creator: CreatorGetResponseOutput | null;
  skills: CreatorSkillItem[];
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
          border: "1px solid rgba(139,92,246,0.2)",
          background: "rgba(139,92,246,0.05)",
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
          onChange={(e): void => {
            setFirstName(e.target.value);
          }}
          placeholder={t("list.namePlaceholder")}
          disabled={state === "submitting"}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500"
        />
        <Input
          type="email"
          value={email}
          onChange={(e): void => {
            setEmail(e.target.value);
          }}
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

const SOCIALS = [
  { key: "twitterUrl", Icon: Twitter, label: "X" },
  { key: "youtubeUrl", Icon: Youtube, label: "YouTube" },
  { key: "instagramUrl", Icon: Instagram, label: "Instagram" },
  { key: "tiktokUrl", Icon: Music, label: "TikTok" },
  { key: "githubUrl", Icon: SiGithub, label: "GitHub" },
  { key: "discordUrl", Icon: SiDiscord, label: "Discord" },
  { key: "websiteUrl", Icon: Globe, label: "Website" },
] as const;

type SocialKey = (typeof SOCIALS)[number]["key"];

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

  const accent = creator.creatorAccentColor ?? "#8b5cf6";
  const initials = creator.publicName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const activeSocials = SOCIALS.filter((s) => creator[s.key as SocialKey]);

  return (
    <Div
      style={{
        minHeight: "100vh",
        background: "#16082a",
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
          background: "rgba(22,8,42,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Link
          href={`/${locale}`}
          className="text-xs no-underline text-white/60 hover:text-white/90 transition-colors"
        >
          {t("nav.backArrow")} {appName}
        </Link>
      </Nav>

      {/* ── HERO ── */}
      <Div
        style={{
          position: "relative",
          paddingTop: 52,
          minHeight: 260,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        {/* Header image or gradient */}
        {creator.creatorHeaderImageUrl ? (
          <Div
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
            }}
          >
            <Image
              src={creator.creatorHeaderImageUrl}
              alt=""
              fill
              style={{ objectFit: "cover", opacity: 0.35 }}
            />
            <Div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, transparent 30%, #16082a 100%)",
              }}
            />
          </Div>
        ) : (
          <Div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse at 60% 0%, ${accent}33 0%, transparent 70%)`,
            }}
          />
        )}

        {/* Creator info */}
        <Div
          style={{
            position: "relative",
            maxWidth: 720,
            margin: "0 auto",
            width: "100%",
            padding: "40px 24px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <Div style={{ display: "flex", alignItems: "flex-end", gap: 20 }}>
            <Div
              style={{
                width: 80,
                height: 80,
                flexShrink: 0,
                borderRadius: "50%",
                border: `3px solid ${accent}66`,
                overflow: "hidden",
              }}
            >
              <Avatar className="h-full w-full">
                {creator.avatarUrl && (
                  <AvatarImage
                    src={creator.avatarUrl}
                    alt={creator.publicName}
                  />
                )}
                <AvatarFallback className="text-2xl font-bold bg-violet-900/40 text-violet-200">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Div>

            <Div style={{ flex: 1, minWidth: 0 }}>
              <H1
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: "#fff",
                  margin: 0,
                }}
              >
                {creator.publicName}
              </H1>
              {skills.length > 0 && (
                <Span
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.4)",
                    marginTop: 4,
                    display: "block",
                  }}
                >
                  {skills.length} {t("skills.title").toLowerCase()}
                </Span>
              )}
            </Div>
          </Div>

          {creator.bio && (
            <P
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.6,
                maxWidth: 520,
                margin: 0,
              }}
            >
              {creator.bio}
            </P>
          )}

          {/* Social links */}
          {activeSocials.length > 0 && (
            <Div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {activeSocials.map(({ key, Icon: SIcon, label }) => (
                <Link
                  key={key}
                  href={creator[key as SocialKey] as never}
                  aria-label={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/60 text-xs no-underline transition-colors hover:text-white/90 hover:border-white/20"
                >
                  <SIcon className="h-3.5 w-3.5" />
                  {label}
                </Link>
              ))}
            </Div>
          )}
        </Div>
      </Div>

      {/* ── SKILLS GRID ── */}
      <Div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "0 24px 80px",
        }}
      >
        {skills.length > 0 ? (
          <>
            <H2
              style={{
                fontSize: 13,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.35)",
                margin: "0 0 16px",
              }}
            >
              {t("skills.title")}
            </H2>

            <Div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 12,
              }}
            >
              {skills.map((skill) => (
                <Link
                  key={skill.id}
                  href={
                    skillHref(locale, skill.id, creator.referralCode) as never
                  }
                  className="no-underline"
                >
                  <Div
                    style={{
                      padding: "16px 20px",
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.03)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      cursor: "pointer",
                      transition: "border-color 0.15s, background 0.15s",
                    }}
                  >
                    <Div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 12,
                      }}
                    >
                      <Div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          minWidth: 0,
                        }}
                      >
                        <Span
                          style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}
                        >
                          {skill.icon}
                        </Span>
                        <Div style={{ minWidth: 0 }}>
                          <Span
                            style={{
                              display: "block",
                              fontSize: 15,
                              fontWeight: 600,
                              color: "#fff",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {skill.name}
                          </Span>
                          {skill.tagline && (
                            <Span
                              style={{
                                display: "block",
                                fontSize: 12,
                                color: "rgba(255,255,255,0.45)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {skill.tagline}
                            </Span>
                          )}
                        </Div>
                      </Div>
                      <Badge
                        variant="outline"
                        style={{
                          borderColor: `${accent}55`,
                          color: accent,
                          fontSize: 11,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <MessageCircle className="h-3 w-3" />
                        {t("skills.chat")}
                      </Badge>
                    </Div>

                    {skill.description && (
                      <P
                        style={{
                          fontSize: 13,
                          color: "rgba(255,255,255,0.45)",
                          lineHeight: 1.5,
                          margin: 0,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {skill.description}
                      </P>
                    )}
                  </Div>
                </Link>
              ))}
            </Div>
          </>
        ) : (
          <P
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: 14,
              textAlign: "center",
              padding: "48px 0",
            }}
          >
            {t("skills.empty")}
          </P>
        )}

        {/* Lead capture form */}
        {leadMagnetConfig && skills.length > 0 && (
          <Div style={{ marginTop: 32 }}>
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
              border: `1px solid ${accent}33`,
              background: `${accent}0d`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <Span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
              {t("referral.label")}
            </Span>
            <Span
              style={{
                fontFamily: "monospace",
                fontSize: 13,
                color: accent,
                fontWeight: 600,
                letterSpacing: "0.05em",
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
            marginTop: 48,
            fontSize: 12,
            color: "rgba(255,255,255,0.2)",
          }}
        >
          {t("nav.copyright")} {appName}
        </Span>
      </Div>
    </Div>
  );
}
