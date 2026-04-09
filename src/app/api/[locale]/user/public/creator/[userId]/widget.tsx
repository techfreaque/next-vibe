"use client";

import { Avatar, AvatarFallback, AvatarImage } from "next-vibe-ui/ui/avatar";
import { Badge } from "next-vibe-ui/ui/badge";
import { Div } from "next-vibe-ui/ui/div";
import { SiDiscord } from "next-vibe-ui/ui/icons/SiDiscord";
import { SiGithub } from "next-vibe-ui/ui/icons/SiGithub";
import { Globe } from "next-vibe-ui/ui/icons/Globe";
import { Instagram } from "next-vibe-ui/ui/icons/Instagram";
import { Music } from "next-vibe-ui/ui/icons/Music";
import { Twitter } from "next-vibe-ui/ui/icons/Twitter";
import { Youtube } from "next-vibe-ui/ui/icons/Youtube";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { CreatorGetResponseOutput } from "./definition";

interface CreatorCardProps {
  creator: CreatorGetResponseOutput;
  accentColor?: string;
}

export function CreatorCard({ creator }: CreatorCardProps): JSX.Element {
  const initials = creator.publicName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const socials = [
    {
      url: creator.twitterUrl,
      icon: <Twitter className="h-4 w-4" />,
      label: "X",
    },
    {
      url: creator.youtubeUrl,
      icon: <Youtube className="h-4 w-4" />,
      label: "YouTube",
    },
    {
      url: creator.instagramUrl,
      icon: <Instagram className="h-4 w-4" />,
      label: "Instagram",
    },
    {
      url: creator.tiktokUrl,
      icon: <Music className="h-4 w-4" />,
      label: "TikTok",
    },
    {
      url: creator.githubUrl,
      icon: <SiGithub className="h-4 w-4" />,
      label: "GitHub",
    },
    {
      url: creator.discordUrl,
      icon: <SiDiscord className="h-4 w-4" />,
      label: "Discord",
    },
    {
      url: creator.websiteUrl,
      icon: <Globe className="h-4 w-4" />,
      label: "Website",
    },
  ].filter((s) => s.url);

  return (
    <Div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:text-left">
      <Avatar className="h-16 w-16 shrink-0 ring-2 ring-violet-500/30">
        {creator.avatarUrl && (
          <AvatarImage src={creator.avatarUrl} alt={creator.publicName} />
        )}
        <AvatarFallback className="bg-violet-900/40 text-lg font-semibold text-violet-200">
          {initials}
        </AvatarFallback>
      </Avatar>

      <Div className="flex flex-col gap-1">
        <Div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <Span className="text-lg font-bold text-white">
            {creator.publicName}
          </Span>
          {creator.skillCount > 0 && (
            <Badge
              variant="outline"
              className="border-violet-500/30 text-violet-300 text-xs"
            >
              {creator.skillCount} skill{creator.skillCount !== 1 ? "s" : ""}
            </Badge>
          )}
        </Div>

        {creator.bio && (
          <P className="max-w-sm text-sm text-violet-200/70 leading-relaxed">
            {creator.bio}
          </P>
        )}

        {socials.length > 0 && (
          <Div className="mt-1 flex flex-wrap items-center gap-2">
            {socials.map(({ url, icon, label }) => (
              <Link
                key={label}
                href={url!}
                aria-label={label}
                className="text-violet-400/60 transition-colors hover:text-violet-300"
              >
                {icon}
              </Link>
            ))}
          </Div>
        )}
      </Div>
    </Div>
  );
}
