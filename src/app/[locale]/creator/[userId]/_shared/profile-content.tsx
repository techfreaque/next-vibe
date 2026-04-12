"use client";

/**
 * Shared creator profile UI components.
 * Used by both the public creator page (/creator/[userId])
 * and the settings widget (me/widget.tsx) - exact same layout, same pixels.
 */

import { Avatar, AvatarFallback, AvatarImage } from "next-vibe-ui/ui/avatar";
import { Div } from "next-vibe-ui/ui/div";
import { Globe } from "next-vibe-ui/ui/icons/Globe";
import {
  Icon,
  type IconKey,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { Instagram } from "next-vibe-ui/ui/icons/Instagram";
import { MessageCircle } from "next-vibe-ui/ui/icons/MessageCircle";
import { Music } from "next-vibe-ui/ui/icons/Music";
import { SiDiscord } from "next-vibe-ui/ui/icons/SiDiscord";
import { SiGithub } from "next-vibe-ui/ui/icons/SiGithub";
import { Twitter } from "next-vibe-ui/ui/icons/Twitter";
import { Youtube } from "next-vibe-ui/ui/icons/Youtube";
import { Image } from "next-vibe-ui/ui/image";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { H1, H2, P } from "next-vibe-ui/ui/typography";
import type { JSX, ReactNode } from "react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

export const DEFAULT_ACCENT = "#8b5cf6";

export const PROFILE_SOCIALS = [
  { key: "twitterUrl" as const, Icon: Twitter, label: "X" },
  { key: "youtubeUrl" as const, Icon: Youtube, label: "YouTube" },
  { key: "instagramUrl" as const, Icon: Instagram, label: "Instagram" },
  { key: "tiktokUrl" as const, Icon: Music, label: "TikTok" },
  { key: "githubUrl" as const, Icon: SiGithub, label: "GitHub" },
  { key: "discordUrl" as const, Icon: SiDiscord, label: "Discord" },
  { key: "websiteUrl" as const, Icon: Globe, label: "Website" },
] as const;

export type ProfileSocialKey = (typeof PROFILE_SOCIALS)[number]["key"];

export interface ProfileSkillItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: IconKey;
}

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
  githubUrl?: string | null;
  discordUrl?: string | null;
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

// ── SKILLS LIST ────────────────────────────────────────────────────────────────

function ProfileSkillCard({
  skill,
  accent,
  href,
  chatLabel,
  addLabel,
}: {
  skill: ProfileSkillItem;
  accent: string;
  href: string;
  chatLabel: string;
  addLabel: string;
}): JSX.Element {
  const [showActions, setShowActions] = useState(false);

  return (
    <Div
      style={{
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
        overflow: "hidden",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Main content - click goes to skill page */}
      <Link href={href as never} className="no-underline block">
        <Div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            padding: "12px 16px",
            cursor: "pointer",
          }}
        >
          {/* Icon box */}
          <Div
            style={{
              width: 40,
              height: 40,
              borderRadius: 9,
              background: `${accent}18`,
              border: `1px solid ${accent}28`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            <Icon icon={skill.icon} className="h-5 w-5" />
          </Div>

          {/* Text content */}
          <Div style={{ flex: 1, minWidth: 0 }}>
            {/* Name + tagline row */}
            <Div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexWrap: "wrap" as const,
                marginBottom: 2,
              }}
            >
              <Span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fff",
                  lineHeight: 1.3,
                }}
              >
                {skill.name}
              </Span>
              {skill.tagline && (
                <Span
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.35)",
                    lineHeight: 1.3,
                  }}
                >
                  {skill.tagline}
                </Span>
              )}
            </Div>

            {/* Description */}
            {skill.description && (
              <Span
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.35)",
                  lineHeight: 1.5,
                }}
              >
                {skill.description}
              </Span>
            )}
          </Div>
        </Div>
      </Link>

      {/* Action bar - slides in on hover */}
      <Div
        style={{
          overflow: "hidden",
          maxHeight: showActions ? 48 : 0,
          transition: "max-height 0.18s ease-out",
        }}
      >
        <Div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          {/* Left label */}
          <Span
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.3)",
              flexShrink: 0,
            }}
          >
            {addLabel}
          </Span>

          {/* Right actions */}
          <Div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {/* Chat Now - primary */}
            <Span
              style={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 6,
                overflow: "hidden",
                background: accent,
              }}
            >
              <Link
                href={href as never}
                className="no-underline inline-flex items-center gap-1.5 text-xs font-medium px-3 h-7 text-white"
              >
                <MessageCircle className="h-3 w-3" />
                {chatLabel}
              </Link>
            </Span>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}

export function ProfileSkillsGrid({
  skills,
  accent,
  skillHref: getHref,
  chatLabel,
  addLabel,
  emptyLabel,
}: {
  skills: ProfileSkillItem[];
  accent: string;
  skillHref: (id: string) => string;
  chatLabel: string;
  addLabel: string;
  emptyLabel?: string;
}): JSX.Element {
  if (skills.length === 0) {
    if (!emptyLabel) {
      return <></>;
    }
    return (
      <P
        style={{
          color: "rgba(255,255,255,0.3)",
          fontSize: 14,
          textAlign: "center",
          padding: "56px 0",
        }}
      >
        {emptyLabel}
      </P>
    );
  }

  return (
    <Div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
      {skills.map((skill) => (
        <ProfileSkillCard
          key={skill.id}
          skill={skill}
          accent={accent}
          href={getHref(skill.id)}
          chatLabel={chatLabel}
          addLabel={addLabel}
        />
      ))}
    </Div>
  );
}

// ── SKILLS SECTION (label + list) ─────────────────────────────────────────────

export function ProfileSkillsSection({
  skills,
  accent,
  skillHref: getHref,
  sectionLabel,
  chatLabel,
  addLabel,
  emptyLabel,
}: {
  skills: ProfileSkillItem[];
  accent: string;
  skillHref: (id: string) => string;
  sectionLabel: string;
  chatLabel: string;
  addLabel: string;
  emptyLabel?: string;
}): JSX.Element {
  return (
    <>
      {(skills.length > 0 || emptyLabel) && (
        <Div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <H2
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.3)",
              margin: 0,
            }}
          >
            {sectionLabel}
          </H2>
          {skills.length > 0 && (
            <Span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.06)",
                borderRadius: 4,
                padding: "1px 6px",
              }}
            >
              {skills.length}
            </Span>
          )}
        </Div>
      )}
      <ProfileSkillsGrid
        skills={skills}
        accent={accent}
        skillHref={getHref}
        chatLabel={chatLabel}
        addLabel={addLabel}
        emptyLabel={emptyLabel}
      />
    </>
  );
}
