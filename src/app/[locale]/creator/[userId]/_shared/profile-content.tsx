"use client";

/**
 * Shared creator profile UI components.
 * Used by both the public creator page (/creator/[userId])
 * and the settings widget (me/widget.tsx) - exact same layout, same pixels.
 */

import { Avatar, AvatarFallback, AvatarImage } from "next-vibe-ui/ui/avatar";
import { Div } from "next-vibe-ui/ui/div";
import { Facebook } from "next-vibe-ui/ui/icons/Facebook";
import { Globe } from "next-vibe-ui/ui/icons/Globe";
import { Instagram } from "next-vibe-ui/ui/icons/Instagram";
import { SiDiscord } from "next-vibe-ui/ui/icons/SiDiscord";
import { SiGab } from "next-vibe-ui/ui/icons/SiGab";
import { SiGithub } from "next-vibe-ui/ui/icons/SiGithub";
import { SiNostr } from "next-vibe-ui/ui/icons/SiNostr";
import { SiOdysee } from "next-vibe-ui/ui/icons/SiOdysee";
import { SiRumble } from "next-vibe-ui/ui/icons/SiRumble";
import { SiTiktok } from "next-vibe-ui/ui/icons/SiTiktok";
import { SiTribe } from "next-vibe-ui/ui/icons/SiTribe";
import { Twitter } from "next-vibe-ui/ui/icons/Twitter";
import { Youtube } from "next-vibe-ui/ui/icons/Youtube";
import { Image } from "next-vibe-ui/ui/image";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { H1 } from "next-vibe-ui/ui/typography";
import type { JSX, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

export const DEFAULT_ACCENT = "#8b5cf6";

export const PROFILE_SOCIALS = [
  { key: "twitterUrl" as const, Icon: Twitter, label: "X" },
  { key: "youtubeUrl" as const, Icon: Youtube, label: "YouTube" },
  { key: "instagramUrl" as const, Icon: Instagram, label: "Instagram" },
  { key: "facebookUrl" as const, Icon: Facebook, label: "Facebook" },
  { key: "tiktokUrl" as const, Icon: SiTiktok, label: "TikTok" },
  { key: "rumbleUrl" as const, Icon: SiRumble, label: "Rumble" },
  { key: "odyseeUrl" as const, Icon: SiOdysee, label: "Odysee" },
  { key: "nostrUrl" as const, Icon: SiNostr, label: "Nostr" },
  { key: "gabUrl" as const, Icon: SiGab, label: "Gab" },
  { key: "githubUrl" as const, Icon: SiGithub, label: "GitHub" },
  { key: "discordUrl" as const, Icon: SiDiscord, label: "Discord" },
  { key: "tribeUrl" as const, Icon: SiTribe, label: "Tribe" },
  { key: "websiteUrl" as const, Icon: Globe, label: "Website" },
] as const;

export type ProfileSocialKey = (typeof PROFILE_SOCIALS)[number]["key"];

export interface ProfileData {
  publicName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  creatorAccentColor?: string | null;
  creatorHeaderImageUrl?: string | null;
  twitterUrl?: string | null;
  youtubeUrl?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  rumbleUrl?: string | null;
  odyseeUrl?: string | null;
  nostrUrl?: string | null;
  gabUrl?: string | null;
  githubUrl?: string | null;
  facebookUrl?: string | null;
  discordUrl?: string | null;
  tribeUrl?: string | null;
  websiteUrl?: string | null;
}

// ── HERO BAND ──────────────────────────────────────────────────────────────────

export function ProfileHero({
  profile,
  avatarNode,
  nameSubline,
  topRightActions,
  belowAvatarRow,
}: {
  profile: ProfileData;
  /** Avatar element (read-only Avatar or editable AvatarUploadButton) */
  avatarNode: ReactNode;
  /** Optional text/element shown below the name (e.g. skill count or email) */
  nameSubline?: ReactNode;
  /** Buttons shown top-right inside the hero band */
  topRightActions?: ReactNode;
  /** Content rendered after the avatar+name row (bio, social pills, edit form) */
  belowAvatarRow?: ReactNode;
}): JSX.Element {
  const accent = profile.creatorAccentColor ?? DEFAULT_ACCENT;
  const headerImage = profile.creatorHeaderImageUrl;

  const initials = profile.publicName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      {/* ── HERO BAND ── */}
      <Div
        style={{
          position: "relative",
          paddingTop: 52,
          minHeight: 300,
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "flex-end",
        }}
      >
        {/* Background */}
        {headerImage ? (
          <Div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <Image
              src={headerImage}
              alt=""
              fill
              style={{ objectFit: "cover", opacity: 0.3 }}
            />
            <Div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(15,5,32,0.2) 0%, #0f0520 100%)",
              }}
            />
          </Div>
        ) : (
          <Div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse at 50% -20%, ${accent}40 0%, transparent 65%)`,
            }}
          />
        )}

        {/* Top-right action slot */}
        {topRightActions && (
          <Div
            style={{
              position: "absolute",
              top: 60,
              right: 24,
              display: "flex",
              alignItems: "center",
              gap: 8,
              zIndex: 10,
            }}
          >
            {topRightActions}
          </Div>
        )}

        {/* Creator info */}
        <Div
          style={{
            position: "relative",
            maxWidth: 720,
            margin: "0 auto",
            width: "100%",
            padding: "48px 24px 40px",
          }}
        >
          {/* Avatar + name row */}
          <Div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 20,
              marginBottom: 20,
            }}
          >
            {/* Avatar slot */}
            <Div
              style={{
                width: 88,
                height: 88,
                flexShrink: 0,
                borderRadius: "50%",
                border: `3px solid ${accent}80`,
                overflow: "hidden",
                boxShadow: `0 0 0 1px ${accent}30, 0 8px 32px rgba(0,0,0,0.4)`,
              }}
            >
              {avatarNode ?? (
                <Avatar className="h-full w-full">
                  {profile.avatarUrl && (
                    <AvatarImage
                      src={profile.avatarUrl}
                      alt={profile.publicName}
                    />
                  )}
                  <AvatarFallback className="text-2xl font-bold bg-violet-900/60 text-violet-200">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              )}
            </Div>

            <Div style={{ flex: 1, minWidth: 0, paddingBottom: 4 }}>
              <H1
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: "#fff",
                  margin: "0 0 4px",
                  letterSpacing: "-0.02em",
                }}
              >
                {profile.publicName}
              </H1>
              {nameSubline && (
                <Span
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.4)",
                    display: "block",
                  }}
                >
                  {nameSubline}
                </Span>
              )}
            </Div>
          </Div>

          {/* Below avatar: bio, socials, or edit form */}
          {belowAvatarRow}
        </Div>
      </Div>
    </>
  );
}

// ── BIO ────────────────────────────────────────────────────────────────────────

export function ProfileBio({ bio }: { bio: string }): JSX.Element {
  return (
    <Div
      style={{
        fontSize: 15,
        color: "rgba(255,255,255,0.65)",
        lineHeight: 1.65,
        maxWidth: 560,
        marginBottom: 16,
      }}
    >
      <Div className="prose prose-sm prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
          {bio}
        </ReactMarkdown>
      </Div>
    </Div>
  );
}

// ── SOCIAL PILLS ───────────────────────────────────────────────────────────────

export function ProfileSocialPills({
  profile,
}: {
  profile: ProfileData;
}): JSX.Element | null {
  const active = PROFILE_SOCIALS.filter((s) => profile[s.key]);
  if (active.length === 0) {
    return null;
  }
  return (
    <Div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {active.map(({ key, Icon: SIcon, label }) => (
        <Link
          key={key}
          href={profile[key] as never}
          aria-label={label}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/55 text-xs no-underline transition-all hover:text-white/85 hover:border-white/20 hover:bg-white/8"
        >
          <SIcon className="h-3.5 w-3.5" />
          {label}
        </Link>
      ))}
    </Div>
  );
}
