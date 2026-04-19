"use client";

import { Avatar, AvatarFallback, AvatarImage } from "next-vibe-ui/ui/avatar";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { Camera } from "next-vibe-ui/ui/icons/Camera";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Copy } from "next-vibe-ui/ui/icons/Copy";
import { ExternalLink } from "next-vibe-ui/ui/icons/ExternalLink";
import { Globe } from "next-vibe-ui/ui/icons/Globe";
import { Instagram } from "next-vibe-ui/ui/icons/Instagram";
import { Mail } from "next-vibe-ui/ui/icons/Mail";
import { Music } from "next-vibe-ui/ui/icons/Music";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { SiDiscord } from "next-vibe-ui/ui/icons/SiDiscord";
import { SiGithub } from "next-vibe-ui/ui/icons/SiGithub";
import { Twitter } from "next-vibe-ui/ui/icons/Twitter";
import { Youtube } from "next-vibe-ui/ui/icons/Youtube";
import { Input } from "next-vibe-ui/ui/input";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { H2, P } from "next-vibe-ui/ui/typography";
import {
  type JSX,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { buildScopedPaletteStyle } from "@/app/[locale]/creator/[userId]/_shared/palette-generator";
import {
  DEFAULT_ACCENT,
  ProfileBio,
  ProfileHero,
  ProfileSocialPills,
} from "@/app/[locale]/creator/[userId]/_shared/profile-content";
import { useChatFavorites } from "@/app/api/[locale]/agent/chat/favorites/hooks/hooks";
import { parseSkillId } from "@/app/api/[locale]/agent/chat/slugify";
import skillsDef from "@/app/api/[locale]/agent/chat/skills/definition";
import { SkillOwnershipType } from "@/app/api/[locale]/agent/chat/skills/enum";
import { scopedTranslation as skillsScopedTranslation } from "@/app/api/[locale]/agent/chat/skills/i18n";
import { CollapsibleSkillSection } from "@/app/api/[locale]/agent/chat/skills/widget";
import configDef from "@/app/api/[locale]/lead-magnet/config/definition";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/widget";
import { ColorFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/color-field/widget";
import { FileFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/file-field/widget";
import { MarkdownTextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/markdown-textarea-field/widget";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { UrlFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/url-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";
import { envClient } from "@/config/env-client";
import { useTouchDevice } from "next-vibe-ui/hooks/use-touch-device";

import { apiClient } from "../../../system/unified-interface/react/hooks/store";
import { EndpointsPage } from "../../../system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import { scopedTranslation as userRoleScopedTranslation } from "../../user-roles/i18n";
import avatarDef from "./avatar/definition";
import type meDefinition from "./definition";
import type { MePostResponseOutput } from "./definition";
import { useUser } from "./hooks";

interface MeUpdateWidgetProps {
  field: {
    value: MePostResponseOutput | null | undefined;
  } & (typeof meDefinition.POST)["fields"];
}

type SocialKey =
  | "websiteUrl"
  | "twitterUrl"
  | "youtubeUrl"
  | "instagramUrl"
  | "tiktokUrl"
  | "githubUrl"
  | "discordUrl";

/**
 * Avatar with upload-on-hover - fits inside the shared ProfileHero avatar slot.
 * The outer 88×88 ring/border is handled by ProfileHero; we just render
 * the inner Avatar + camera overlay here (no extra border).
 */
function AvatarUploadButton({
  avatarUrl,
  initials,
  onUploaded,
}: {
  avatarUrl?: string | null;
  initials: string;
  onUploaded: (url: string) => void;
}): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File): void => {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setUploading(true);
      void (async (): Promise<void> => {
        if (!user) {
          return;
        }
        const result = await apiClient.mutate(
          avatarDef.POST,
          logger,
          user,
          { fileUpload: { file } },
          undefined,
          locale,
        );
        setUploading(false);
        if (result.success && result.data.response?.avatarUrl) {
          onUploaded(result.data.response.avatarUrl);
        }
      })();
    },
    [user, logger, locale, onUploaded],
  );

  const displayUrl = previewUrl ?? avatarUrl;

  return (
    <Div className="relative group h-full w-full">
      <Avatar className="h-full w-full">
        {displayUrl && <AvatarImage src={displayUrl} alt="" />}
        <AvatarFallback className="text-2xl font-bold bg-violet-900/60 text-violet-200">
          {initials}
        </AvatarFallback>
      </Avatar>
      <Button
        type="button"
        variant="ghost"
        onClick={(): void => inputRef.current?.click()}
        disabled={uploading}
        className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-0 h-auto w-auto"
        aria-label={initials}
      >
        {uploading ? (
          <Span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Camera className="h-5 w-5 text-white" />
        )}
      </Button>
      <Input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e): void => {
          const file = e.target.files?.[0];
          if (file) {
            handleFile(file);
          }
        }}
      />
    </Div>
  );
}

export function MeUpdateWidget({ field }: MeUpdateWidgetProps): JSX.Element {
  const children = field.children;
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const t = useWidgetTranslation<typeof meDefinition.POST>();
  const roleT = userRoleScopedTranslation.scopedT(locale).t;
  const form = useWidgetForm<typeof meDefinition.POST>();
  const { user: profileRaw, refetch } = useUser(user, logger);
  const profile = profileRaw && !profileRaw.isPublic ? profileRaw : undefined;

  const [editing, setEditing] = useState(false);
  const [liveAvatarUrl, setLiveAvatarUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Skills come from the me GET endpoint response (server-side enriched)
  const mySkills = useMemo(() => {
    if (!profile) {
      return [];
    }
    return profile.skills.filter(
      (s: { ownershipType: string }) =>
        s.ownershipType === SkillOwnershipType.PUBLIC,
    );
  }, [profile]);

  // Skills list context — reuse the real components from skills/widget.tsx
  const { push: navigate } = useWidgetNavigation();
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

  useEffect(() => {
    if (profile?.avatarUrl) {
      setLiveAvatarUrl(profile.avatarUrl);
    }
  }, [profile?.avatarUrl]);

  const handleAvatarUploaded = useCallback(
    (url: string): void => {
      setLiveAvatarUrl(url);
      void refetch();
    },
    [refetch],
  );

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
        creatorSlug: profile.creatorSlug,
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
          creatorSlug: profile.creatorSlug,
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

  const basicInfo = children.basicInfo.children;
  const profileInfo = children.profileInfo.children;
  const privacySettings = children.privacySettings.children;

  const accent = profile?.creatorAccentColor ?? DEFAULT_ACCENT;

  // Shared profile shape for the shared components
  const profileData = useMemo(
    () =>
      profile
        ? {
            publicName: profile.publicName ?? profile.privateName ?? "",
            avatarUrl: liveAvatarUrl ?? profile.avatarUrl,
            bio: profile.bio,
            creatorAccentColor: profile.creatorAccentColor,
            creatorHeaderImageUrl: profile.creatorHeaderImageUrl,
            twitterUrl: profile.twitterUrl,
            youtubeUrl: profile.youtubeUrl,
            instagramUrl: profile.instagramUrl,
            tiktokUrl: profile.tiktokUrl,
            githubUrl: profile.githubUrl,
            discordUrl: profile.discordUrl,
            websiteUrl: profile.websiteUrl,
          }
        : {
            publicName: "—",
            avatarUrl: null,
          },
    [profile, liveAvatarUrl],
  );

  // Avatar node: upload button in edit mode, plain avatar in view mode
  const avatarNode = (
    <AvatarUploadButton
      avatarUrl={liveAvatarUrl ?? profile?.avatarUrl}
      initials={initials}
      onUploaded={handleAvatarUploaded}
    />
  );

  // Resolved slug for public profile links (null if no profile loaded yet)
  const profileSlug = profile?.creatorSlug ?? null;
  const profilePath = profileSlug
    ? `/${locale}/creator/${profileSlug}`
    : user && !user.isPublic
      ? `/${locale}/creator/${user.id}`
      : null;
  const profileHref = profilePath
    ? `${envClient.NEXT_PUBLIC_APP_URL}${profilePath}`
    : null;

  // Top-right action buttons inside the hero
  const topRightActions = (
    <>
      {profileHref && (
        <Link
          href={profileHref}
          className="inline-flex items-center gap-1.5 text-xs bg-black/50 text-white/70 rounded-md px-2.5 py-1.5 hover:bg-black/70 hover:text-white/90 transition-colors backdrop-blur-sm no-underline"
        >
          <ExternalLink className="h-3 w-3" />
          {t("widget.viewPublicProfile")}
        </Link>
      )}
      {editing ? (
        <Button
          variant="ghost"
          size="sm"
          className="bg-black/50 text-white/75 backdrop-blur-sm text-xs h-[30px] hover:bg-black/70 hover:text-white/90"
          onClick={handleCancelEdit}
        >
          {t("widget.cancelEdit")}
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="bg-black/50 text-white/75 backdrop-blur-sm text-xs h-[30px] gap-1.5 hover:bg-black/70 hover:text-white/90"
          onClick={(): void => setEditing(true)}
        >
          <Pencil className="h-3 w-3" />
          {t("widget.editProfile")}
        </Button>
      )}
    </>
  );

  // Name subline: email (private info only visible to owner)
  const nameSubline = profile?.email ? (
    <>
      <Mail className="h-3 w-3 inline mr-1" />
      {profile.email}
    </>
  ) : undefined;

  // Below the avatar row: view content or edit form
  const belowAvatarRow = editing ? (
    <Div className="flex flex-col gap-5">
      {/* Role badges */}
      {profile?.userRoles && profile.userRoles.length > 0 && (
        <Div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {profile.userRoles.map((r) => (
            <Badge
              key={r.id}
              variant="outline"
              style={{
                borderColor: `${accent}50`,
                color: accent,
                fontSize: 11,
              }}
            >
              {roleT(r.role)}
            </Badge>
          ))}
        </Div>
      )}

      {/* Name + email */}
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

      <TextFieldWidget fieldName="basicInfo.email" field={basicInfo.email} />

      <BooleanFieldWidget
        fieldName="privacySettings.marketingConsent"
        field={privacySettings.marketingConsent}
      />

      {/* Bio - markdown editor */}
      <MarkdownTextareaFieldWidget
        fieldName="profileInfo.bio"
        field={profileInfo.bio}
      />

      {/* Profile URL slug - editable with link-break warning */}
      <Div
        style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}
      >
        <TextFieldWidget
          fieldName="profileInfo.creatorSlug"
          field={profileInfo.creatorSlug}
        />
        <Div
          style={{
            background: "rgba(251,191,36,0.07)",
            border: "1px solid rgba(251,191,36,0.22)",
            borderRadius: 8,
            padding: "10px 14px",
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <Div
            style={{ color: "rgb(251,191,36)", flexShrink: 0, paddingTop: 1 }}
          >
            <AlertTriangle className="h-4 w-4" />
          </Div>
          <Span
            style={{
              fontSize: 12,
              color: "rgba(251,191,36,0.9)",
              lineHeight: 1.6,
            }}
          >
            {t("widget.slugWarning")}
          </Span>
        </Div>
      </Div>

      {/* Accent color + header image */}
      <Div className="grid grid-cols-2 gap-4">
        <ColorFieldWidget
          fieldName="profileInfo.creatorAccentColor"
          field={profileInfo.creatorAccentColor}
        />
        <FileFieldWidget
          fieldName="profileInfo.creatorHeaderImageUrl"
          field={profileInfo.creatorHeaderImageUrl}
        />
      </Div>

      {/* Social links */}
      <Div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(
          [
            { key: "websiteUrl", icon: <Globe className="h-4 w-4" /> },
            { key: "twitterUrl", icon: <Twitter className="h-4 w-4" /> },
            { key: "youtubeUrl", icon: <Youtube className="h-4 w-4" /> },
            { key: "instagramUrl", icon: <Instagram className="h-4 w-4" /> },
            { key: "tiktokUrl", icon: <Music className="h-4 w-4" /> },
            { key: "githubUrl", icon: <SiGithub className="h-4 w-4" /> },
            { key: "discordUrl", icon: <SiDiscord className="h-4 w-4" /> },
          ] as { key: SocialKey; icon: JSX.Element }[]
        ).map(({ key, icon }) => (
          <Div key={key} className="flex items-center gap-2">
            <Div style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>
              {icon}
            </Div>
            <UrlFieldWidget
              fieldName={`profileInfo.${key}`}
              field={profileInfo[key]}
            />
          </Div>
        ))}
      </Div>

      <SubmitButtonWidget<typeof meDefinition.POST>
        field={{
          text: "widget.save",
          loadingText: "widget.saving",
          icon: "check",
          variant: "primary",
        }}
      />
    </Div>
  ) : (
    <>
      {/* Role badges */}
      {profile?.userRoles && profile.userRoles.length > 0 && (
        <Div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 12,
          }}
        >
          {profile.userRoles.map((r) => (
            <Badge
              key={r.id}
              variant="outline"
              style={{
                borderColor: `${accent}50`,
                color: accent,
                fontSize: 11,
              }}
            >
              {roleT(r.role)}
            </Badge>
          ))}
        </Div>
      )}
      {profile?.bio && <ProfileBio bio={profile.bio} />}
      <ProfileSocialPills profile={profileData} />
      {/* Current public URL */}
      {profileHref && (
        <Div
          style={{
            marginTop: 12,
            padding: "8px 12px",
            background: "rgba(255,255,255,0.04)",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Span
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.35)",
              flexShrink: 0,
            }}
          >
            {t("widget.profileUrl")}
          </Span>
          <Span
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.6)",
              fontFamily: "monospace",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {profileHref}
          </Span>
          <Button
            variant="ghost"
            size="sm"
            style={{
              flexShrink: 0,
              height: 24,
              width: 24,
              padding: 0,
              color: copied ? "rgba(134,239,172,0.9)" : "rgba(255,255,255,0.4)",
            }}
            onClick={(): void => {
              void navigator.clipboard.writeText(profileHref).then(() => {
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
                return undefined;
              });
            }}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </Div>
      )}
    </>
  );

  const scopedPaletteStyle = useMemo(
    () => buildScopedPaletteStyle(accent, true),
    [accent],
  );

  return (
    <Div
      style={{
        background: "#0f0520",
        color: "#fff",
        fontFamily: "inherit",
        ...scopedPaletteStyle,
      }}
    >
      <FormAlertWidget field={emptyField} />

      {/* ── HERO (identical structure to creator page) ── */}
      <ProfileHero
        profile={profileData}
        avatarNode={avatarNode}
        nameSubline={nameSubline}
        topRightActions={topRightActions}
        belowAvatarRow={belowAvatarRow}
      />

      {/* ── SKILLS GRID ── */}
      <Div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "0 24px 48px",
        }}
      >
        {/* Skills section header */}
        {mySkills.length > 0 && (
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
              {t("widget.skills.title")}
            </H2>
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
              {mySkills.length}
            </Span>
          </Div>
        )}
        <CollapsibleSkillSection
          skills={mySkills}
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

      {/* ── EMAIL LIST ── */}
      <Div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "0 24px 48px",
        }}
      >
        <H2
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.3)",
            margin: "0 0 14px",
          }}
        >
          {t("widget.emailCard.title")}
        </H2>
        <P
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.45)",
            margin: "0 0 16px",
          }}
        >
          {t("widget.emailCard.description")}
        </P>
        <EndpointsPage endpoint={configDef} user={user} locale={locale} />
      </Div>
    </Div>
  );
}
