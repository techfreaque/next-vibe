"use client";

/**
 * Shared creator profile UI components.
 * Used by both the public creator page (/creator/[userId])
 * and the settings widget (me/widget.tsx) - exact same layout, same pixels.
 */

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "next-vibe/ui/components/avatar";
import { Div } from "next-vibe/ui/components/div";
import { Facebook } from "next-vibe/ui/components/icons/Facebook";
import { Globe } from "next-vibe/ui/components/icons/Globe";
import { Instagram } from "next-vibe/ui/components/icons/Instagram";
import { SiDiscord } from "next-vibe/ui/components/icons/SiDiscord";
import { SiGab } from "next-vibe/ui/components/icons/SiGab";
import { SiGithub } from "next-vibe/ui/components/icons/SiGithub";
import { SiNostr } from "next-vibe/ui/components/icons/SiNostr";
import { SiOdysee } from "next-vibe/ui/components/icons/SiOdysee";
import { SiRumble } from "next-vibe/ui/components/icons/SiRumble";
import { SiTiktok } from "next-vibe/ui/components/icons/SiTiktok";
import { SiTribe } from "next-vibe/ui/components/icons/SiTribe";
import { Twitter } from "next-vibe/ui/components/icons/Twitter";
import { Youtube } from "next-vibe/ui/components/icons/Youtube";
import { Image } from "next-vibe/ui/components/image";
import { ExternalLink } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H1 } from "next-vibe/ui/components/typography";
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
  avatarNode?: ReactNode;
  /** Optional text/element shown below the name (e.g. skill count or email) */
  nameSubline?: ReactNode;
  /** Buttons shown top-right inside the hero band */
  topRightActions?: ReactNode;
  /** Content rendered after the avatar+name row (bio, social pills, edit form) */
  belowAvatarRow?: ReactNode;
}): JSX.Element {
  const headerImage = profile.creatorHeaderImageUrl;

  const initials = profile.publicName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Div className="mx-auto w-full max-w-3xl px-4 pt-4 sm:px-6 sm:pt-6">
      {/* Banner: header image, or a quiet accent wash */}
      <Div className="relative h-32 overflow-hidden rounded-xl border bg-primary/10 sm:h-44">
        {headerImage ? (
          <Image src={headerImage} alt="" fill style={{ objectFit: "cover" }} />
        ) : (
          <Div className="absolute inset-0 bg-linear-to-br from-primary/25 via-primary/10 to-transparent" />
        )}
        {topRightActions && (
          <Div className="absolute right-3 top-3 z-10 flex items-center gap-2">
            {topRightActions}
          </Div>
        )}
      </Div>

      <Div className="relative px-1 sm:px-2">
        {/* Avatar overlaps the banner */}
        <Div className="-mt-10 h-20 w-20 overflow-hidden rounded-full border-4 border-background bg-card shadow-md sm:-mt-12 sm:h-24 sm:w-24">
          {avatarNode ?? (
            <Avatar className="h-full w-full">
              {profile.avatarUrl && (
                <AvatarImage src={profile.avatarUrl} alt={profile.publicName} />
              )}
              <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
          )}
        </Div>

        <Div className="mt-4 flex flex-col gap-1">
          <H1 className="m-0 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-3xl">
            {profile.publicName}
          </H1>
          {nameSubline && (
            <Span className="block text-sm text-muted-foreground">
              {nameSubline}
            </Span>
          )}
        </Div>

        {belowAvatarRow && (
          <Div className="mt-4 flex flex-col gap-4">{belowAvatarRow}</Div>
        )}
      </Div>
    </Div>
  );
}

// ── BIO ────────────────────────────────────────────────────────────────────────

export function ProfileBio({ bio }: { bio: string }): JSX.Element {
  return (
    <Div className="prose prose-sm max-w-xl text-[15px] leading-relaxed text-muted-foreground dark:prose-invert prose-a:text-primary prose-strong:text-foreground">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
        {bio}
      </ReactMarkdown>
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
    <Div className="flex flex-wrap gap-2">
      {active.map(({ key, Icon: SIcon, label }) => (
        <ExternalLink
          key={key}
          href={profile[key] ?? ""}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground no-underline transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <SIcon className="h-3.5 w-3.5" />
          {label}
        </ExternalLink>
      ))}
    </Div>
  );
}
