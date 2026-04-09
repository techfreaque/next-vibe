"use client";

import { Avatar, AvatarFallback } from "next-vibe-ui/ui/avatar";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { ExternalLink } from "next-vibe-ui/ui/icons/ExternalLink";
import { Globe } from "next-vibe-ui/ui/icons/Globe";
import { Instagram } from "next-vibe-ui/ui/icons/Instagram";
import { Mail } from "next-vibe-ui/ui/icons/Mail";
import { Music } from "next-vibe-ui/ui/icons/Music";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { SiDiscord } from "next-vibe-ui/ui/icons/SiDiscord";
import { SiGithub } from "next-vibe-ui/ui/icons/SiGithub";
import { Twitter } from "next-vibe-ui/ui/icons/Twitter";
import { User } from "next-vibe-ui/ui/icons/User";
import { Youtube } from "next-vibe-ui/ui/icons/Youtube";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { H2, P } from "next-vibe-ui/ui/typography";
import { type JSX, useCallback, useEffect, useMemo, useState } from "react";

import configDef from "@/app/api/[locale]/lead-magnet/config/definition";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetTranslation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/react";
import { UrlFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/url-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import { EndpointsPage } from "../../../system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import { scopedTranslation as userRoleScopedTranslation } from "../../user-roles/i18n";
import type meDefinition from "./definition";
import type { MePostResponseOutput } from "./definition";
import { useUser } from "./hooks";

interface MeUpdateWidgetProps {
  field: {
    value: MePostResponseOutput | null | undefined;
  } & (typeof meDefinition.POST)["fields"];
}

const SOCIAL_KEYS = [
  "websiteUrl",
  "twitterUrl",
  "youtubeUrl",
  "instagramUrl",
  "tiktokUrl",
  "githubUrl",
  "discordUrl",
] as const;

type SocialKey = (typeof SOCIAL_KEYS)[number];

function SocialIcon({ socialKey }: { socialKey: SocialKey }): JSX.Element {
  if (socialKey === "websiteUrl") {
    return <Globe className="h-4 w-4" />;
  }
  if (socialKey === "twitterUrl") {
    return <Twitter className="h-4 w-4" />;
  }
  if (socialKey === "youtubeUrl") {
    return <Youtube className="h-4 w-4" />;
  }
  if (socialKey === "instagramUrl") {
    return <Instagram className="h-4 w-4" />;
  }
  if (socialKey === "tiktokUrl") {
    return <Music className="h-4 w-4" />;
  }
  if (socialKey === "githubUrl") {
    return <SiGithub className="h-4 w-4" />;
  }
  return <SiDiscord className="h-4 w-4" />;
}

export function MeUpdateWidget({ field }: MeUpdateWidgetProps): JSX.Element {
  const children = field.children;
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const t = useWidgetTranslation<typeof meDefinition.POST>();
  const roleT = userRoleScopedTranslation.scopedT(locale).t;
  const form = useWidgetForm<typeof meDefinition.POST>();
  const { user: profileRaw } = useUser(user, logger);
  const profile = profileRaw && !profileRaw.isPublic ? profileRaw : undefined;

  const [editing, setEditing] = useState(false);

  // Prefill form when profile loads
  useEffect(() => {
    if (!profile) {
      return;
    }
    form.reset({
      basicInfo: {
        privateName: profile.privateName,
        publicName: profile.publicName,
        email: profile.email,
      },
      profileInfo: {
        bio: profile.bio,
        websiteUrl: profile.websiteUrl,
        twitterUrl: profile.twitterUrl,
        youtubeUrl: profile.youtubeUrl,
        instagramUrl: profile.instagramUrl,
        tiktokUrl: profile.tiktokUrl,
        githubUrl: profile.githubUrl,
        discordUrl: profile.discordUrl,
        creatorAccentColor: profile.creatorAccentColor,
        creatorHeaderImageUrl: profile.creatorHeaderImageUrl,
      },
      privacySettings: {
        marketingConsent: profile.marketingConsent,
      },
    });
  }, [profile, form]);

  const handleCancelEdit = useCallback((): void => {
    setEditing(false);
    if (profile) {
      form.reset({
        basicInfo: {
          privateName: profile.privateName,
          publicName: profile.publicName,
          email: profile.email,
        },
        profileInfo: {
          bio: profile.bio,
          websiteUrl: profile.websiteUrl,
          twitterUrl: profile.twitterUrl,
          youtubeUrl: profile.youtubeUrl,
          instagramUrl: profile.instagramUrl,
          tiktokUrl: profile.tiktokUrl,
          githubUrl: profile.githubUrl,
          discordUrl: profile.discordUrl,
          creatorAccentColor: profile.creatorAccentColor,
          creatorHeaderImageUrl: profile.creatorHeaderImageUrl,
        },
        privacySettings: {
          marketingConsent: profile.marketingConsent,
        },
      });
    }
  }, [profile, form]);

  const emptyField = useMemo(() => ({}), []);

  const initials = useMemo(() => {
    const name = profile?.publicName ?? profile?.privateName ?? "";
    return (
      name
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "?"
    );
  }, [profile?.publicName, profile?.privateName]);

  const socials = useMemo(
    () => SOCIAL_KEYS.filter((key) => profile?.[key]),
    [profile],
  );

  const basicInfo = children.basicInfo.children;
  const profileInfo = children.profileInfo.children;
  const privacySettings = children.privacySettings.children;

  return (
    <Div className="flex flex-col gap-6 p-4">
      <FormAlertWidget field={emptyField} />

      {editing ? (
        /* ── EDIT MODE ──────────────────────────────────────────── */
        <>
          <Div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card A - Creator Profile fields */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <Div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <User className="h-4 w-4 text-violet-400" />
                    {t("widget.profileCard.title")}
                  </CardTitle>
                  <Div className="flex items-center gap-2">
                    {user && !user.isPublic && (
                      <Link
                        href={`/${locale}/creator/${user.id}`}
                        className="inline-flex items-center gap-1.5 text-xs text-violet-400/70 hover:text-violet-300 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {t("widget.viewPublicProfile")}
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      {t("widget.cancelEdit")}
                    </Button>
                  </Div>
                </Div>
                <CardDescription>
                  {t("widget.profileCard.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                {/* Avatar preview */}
                <Div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 ring-2 ring-violet-500/30">
                    <AvatarFallback className="bg-violet-900/40 text-lg font-semibold text-violet-200">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <Div>
                    <P className="font-semibold">
                      {profile?.publicName ?? "—"}
                    </P>
                    <P className="text-sm text-muted-foreground">
                      {profile?.email ?? ""}
                    </P>
                  </Div>
                </Div>

                {/* Name fields */}
                <Div className="grid grid-cols-2 gap-4">
                  <TextFieldWidget
                    fieldName="basicInfo.privateName"
                    field={basicInfo.privateName}
                  />
                  <TextFieldWidget
                    fieldName="basicInfo.publicName"
                    field={basicInfo.publicName}
                  />
                </Div>

                {/* Email */}
                <TextFieldWidget
                  fieldName="basicInfo.email"
                  field={basicInfo.email}
                />

                {/* Marketing consent - directly below email, same as signup */}
                <BooleanFieldWidget
                  fieldName="privacySettings.marketingConsent"
                  field={privacySettings.marketingConsent}
                />

                {/* Bio */}
                <TextareaFieldWidget
                  fieldName="profileInfo.bio"
                  field={profileInfo.bio}
                />

                {/* Accent color + header image */}
                <Div className="grid grid-cols-2 gap-4">
                  <TextFieldWidget
                    fieldName="profileInfo.creatorAccentColor"
                    field={profileInfo.creatorAccentColor}
                  />
                  <UrlFieldWidget
                    fieldName="profileInfo.creatorHeaderImageUrl"
                    field={profileInfo.creatorHeaderImageUrl}
                  />
                </Div>

                <SubmitButtonWidget<typeof meDefinition.POST>
                  field={{
                    text: "widget.save",
                    loadingText: "widget.saving",
                    icon: "check",
                    variant: "primary",
                  }}
                />
              </CardContent>
            </Card>

            {/* Card B - Social Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Globe className="h-4 w-4 text-violet-400" />
                  {t("widget.socialCard.title")}
                </CardTitle>
                <CardDescription>
                  {t("widget.socialCard.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                  <UrlFieldWidget
                    fieldName="profileInfo.websiteUrl"
                    field={profileInfo.websiteUrl}
                  />
                </Div>
                <Div className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-muted-foreground shrink-0" />
                  <UrlFieldWidget
                    fieldName="profileInfo.twitterUrl"
                    field={profileInfo.twitterUrl}
                  />
                </Div>
                <Div className="flex items-center gap-2">
                  <Youtube className="h-4 w-4 text-muted-foreground shrink-0" />
                  <UrlFieldWidget
                    fieldName="profileInfo.youtubeUrl"
                    field={profileInfo.youtubeUrl}
                  />
                </Div>
                <Div className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-muted-foreground shrink-0" />
                  <UrlFieldWidget
                    fieldName="profileInfo.instagramUrl"
                    field={profileInfo.instagramUrl}
                  />
                </Div>
                <Div className="flex items-center gap-2">
                  <Music className="h-4 w-4 text-muted-foreground shrink-0" />
                  <UrlFieldWidget
                    fieldName="profileInfo.tiktokUrl"
                    field={profileInfo.tiktokUrl}
                  />
                </Div>
                <Div className="flex items-center gap-2">
                  <SiGithub className="h-4 w-4 text-muted-foreground shrink-0" />
                  <UrlFieldWidget
                    fieldName="profileInfo.githubUrl"
                    field={profileInfo.githubUrl}
                  />
                </Div>
                <Div className="flex items-center gap-2">
                  <SiDiscord className="h-4 w-4 text-muted-foreground shrink-0" />
                  <UrlFieldWidget
                    fieldName="profileInfo.discordUrl"
                    field={profileInfo.discordUrl}
                  />
                </Div>
              </CardContent>
            </Card>
          </Div>
        </>
      ) : (
        /* ── VIEW MODE ──────────────────────────────────────────── */
        <Card>
          <CardHeader>
            <Div className="flex items-start justify-between gap-4">
              {/* Avatar + name + bio */}
              <Div className="flex items-start gap-4">
                <Avatar className="h-20 w-20 shrink-0 ring-2 ring-violet-500/30">
                  <AvatarFallback className="bg-violet-900/40 text-xl font-semibold text-violet-200">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <Div className="flex flex-col gap-1">
                  <H2 className="text-xl font-bold leading-tight">
                    {profile?.publicName ?? "—"}
                  </H2>
                  {profile?.privateName &&
                    profile.privateName !== profile.publicName && (
                      <Span className="text-sm text-muted-foreground">
                        {profile.privateName}
                      </Span>
                    )}
                  <Div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <Span>{profile?.email ?? "—"}</Span>
                  </Div>
                  {profile?.createdAt && (
                    <Span className="text-xs text-muted-foreground/60">
                      {t("widget.memberSince")}{" "}
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </Span>
                  )}
                </Div>
              </Div>

              <Div className="flex items-center gap-2 shrink-0">
                {user && !user.isPublic && (
                  <Link
                    href={`/${locale}/creator/${user.id}`}
                    className="inline-flex items-center gap-1.5 text-xs text-violet-400/70 hover:text-violet-300 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {t("widget.viewPublicProfile")}
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={(): void => setEditing(true)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  {t("widget.editProfile")}
                </Button>
              </Div>
            </Div>
          </CardHeader>

          <CardContent className="flex flex-col gap-5">
            {/* Bio */}
            {profile?.bio && (
              <P className="text-sm text-muted-foreground leading-relaxed max-w-prose">
                {profile.bio}
              </P>
            )}

            {/* Roles */}
            {profile?.userRoles && profile.userRoles.length > 0 && (
              <Div className="flex flex-wrap gap-1.5">
                {profile.userRoles.map((r) => (
                  <Badge
                    key={r.id}
                    variant="outline"
                    className="border-violet-500/30 text-violet-300 text-xs"
                  >
                    {roleT(r.role)}
                  </Badge>
                ))}
              </Div>
            )}

            {/* Social links */}
            {socials.length > 0 ? (
              <Div className="flex flex-wrap items-center gap-3">
                {socials.map((key) => (
                  <Link
                    key={key}
                    href={profile![key]!}
                    className="text-violet-400/70 transition-colors hover:text-violet-300"
                    aria-label={key}
                  >
                    <SocialIcon socialKey={key} />
                  </Link>
                ))}
              </Div>
            ) : (
              <P className="text-sm text-muted-foreground/60 italic">
                {t("widget.noSocials")}
              </P>
            )}

            {/* Accent color swatch */}
            {profile?.creatorAccentColor && (
              <Div className="flex items-center gap-2">
                <Div
                  style={{
                    backgroundColor: profile.creatorAccentColor,
                    width: "1.25rem",
                    height: "1.25rem",
                    borderRadius: "9999px",
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.1)",
                    flexShrink: 0,
                  }}
                />
                <Span className="text-xs text-muted-foreground font-mono">
                  {profile.creatorAccentColor}
                </Span>
              </Div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── EMAIL LIST ── always visible ──────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Mail className="h-4 w-4 text-violet-400" />
            {t("widget.emailCard.title")}
          </CardTitle>
          <CardDescription>{t("widget.emailCard.description")}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <EndpointsPage endpoint={configDef} user={user} locale={locale} />
        </CardContent>
      </Card>
    </Div>
  );
}
