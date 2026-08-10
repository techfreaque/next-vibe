"use client";

import skillsDef from "next-vibe/agent/skills/definition";
import { SkillOwnershipType } from "next-vibe/agent/skills/enum";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import { scopedTranslation as userRoleScopedTranslation } from "next-vibe/identity/roles/i18n";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "next-vibe/ui/components/avatar";
import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Form } from "next-vibe/ui/components/form/form";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { Camera } from "next-vibe/ui/components/icons/Camera";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { ExternalLink } from "next-vibe/ui/components/icons/ExternalLink";
import { Globe } from "next-vibe/ui/components/icons/Globe";
import { Instagram } from "next-vibe/ui/components/icons/Instagram";
import { LogOut } from "next-vibe/ui/components/icons/LogOut";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { Music } from "next-vibe/ui/components/icons/Music";
import { Pencil } from "next-vibe/ui/components/icons/Pencil";
import { Save } from "next-vibe/ui/components/icons/Save";
import { SiDiscord } from "next-vibe/ui/components/icons/SiDiscord";
import { SiGithub } from "next-vibe/ui/components/icons/SiGithub";
import { Twitter } from "next-vibe/ui/components/icons/Twitter";
import { Youtube } from "next-vibe/ui/components/icons/Youtube";
import { Input } from "next-vibe/ui/components/input";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { H2, P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { useRouter } from "next-vibe/ui/hooks/use-navigation";
import { assignUrl } from "next-vibe/ui/lib/location";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { apiClient } from "next-vibe/unified-ui/hooks/store";
import { useApiQuery } from "next-vibe/unified-ui/hooks/use-api-query";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { ColorFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/color-field/widget";
import { FileFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/file-field/widget";
import { MarkdownTextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/markdown-textarea-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { UrlFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/url-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import {
  type JSX,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { buildScopedPaletteStyle } from "@/_pages/creator/[userId]/_shared/palette-generator";
import {
  DEFAULT_ACCENT,
  ProfileBio,
  ProfileSocialPills,
} from "@/_pages/creator/[userId]/_shared/profile-content";
import creditsDef from "@/credits/definition";
import configDef from "@/lead-magnet/config/definition";
import subscriptionDef from "@/subscription/definition";
import { SubscriptionStatus } from "@/subscription/enum";
import { scopedTranslation as subscriptionScopedTranslation } from "@/subscription/i18n";
import logoutDef from "@/user/private/logout/definition";
import addressesDef from "@/user/private/me/addresses/definition";
import passwordDef from "@/user/private/me/password/definition";
import sessionsDef from "@/user/private/sessions/definition";

import avatarDef from "./avatar/definition";
import type meDefinition from "./definition";
import type { MeGetResponseOutput, MePostRequestOutput } from "./definition";
import { useUser } from "./hooks";

/** Compact tappable row used throughout the account hub */
function HubRow({
  icon,
  title,
  subtitle,
  badge,
  onClick,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  onClick: () => void;
}): JSX.Element {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        padding: "10px 12px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
        marginBottom: 4,
        textAlign: "left",
        height: "auto",
        justifyContent: "flex-start",
      }}
    >
      <Span
        style={{ fontSize: 18, flexShrink: 0, width: 28, textAlign: "center" }}
      >
        {icon}
      </Span>
      <Div style={{ flex: 1, minWidth: 0 }}>
        <Span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "rgba(255,255,255,0.85)",
            display: "block",
          }}
        >
          {title}
        </Span>
        {subtitle && (
          <Span
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.4)",
              display: "block",
              marginTop: 1,
            }}
          >
            {subtitle}
          </Span>
        )}
      </Div>
      {badge && <Div style={{ flexShrink: 0 }}>{badge}</Div>}
      <ChevronRight className="h-4 w-4 shrink-0 text-white/25" />
    </Button>
  );
}

/**
 * MeGetWidget - entry point for the GET card in the admin panel.
 * Immediately replaces itself with the full profile widget (POST endpoint).
 */
export function MeGetWidget(): JSX.Element {
  const { push: navigate } = useWidgetNavigation();

  useEffect(() => {
    void (async (): Promise<void> => {
      const meDef = await import("./definition");
      navigate(meDef.default.POST, {});
    })();
  }, [navigate]);

  return <Div style={{ background: "#0f0520", minHeight: "100vh" }} />;
}

export function MeDeleteWidget(): JSX.Element {
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const t = useWidgetTranslation<typeof meDefinition.DELETE>();
  const { pop } = useWidgetNavigation();
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const canDelete = confirmText === "DELETE";

  const handleDelete = useCallback(async (): Promise<void> => {
    if (!user || !canDelete || isDeleting) {
      return;
    }
    setIsDeleting(true);
    setDeleteError(null);

    const meDef = await import("./definition");
    const result = await apiClient.mutate(
      meDef.default.DELETE,
      logger,
      user,
      undefined,
      undefined,
      locale,
    );

    if (result.success) {
      setDeleted(true);
      setTimeout(() => {
        assignUrl(`/${locale}`);
      }, 1500);
    } else {
      setIsDeleting(false);
      setDeleteError(result.message ?? t("delete.errors.internal.title"));
    }
  }, [user, logger, locale, canDelete, isDeleting, t]);

  const deletedItems = [
    t("widget.deleteAccount.items.profile"),
    t("widget.deleteAccount.items.chats"),
    t("widget.deleteAccount.items.skills"),
    t("widget.deleteAccount.items.files"),
    t("widget.deleteAccount.items.subscriptions"),
    t("widget.deleteAccount.items.credits"),
  ];

  if (deleted) {
    return (
      <Div
        style={{
          padding: 48,
          textAlign: "center",
          color: "rgba(255,255,255,0.6)",
          fontSize: 14,
        }}
      >
        {t("widget.deleteAccount.success")}
      </Div>
    );
  }

  return (
    <Div
      style={{
        background: "#0f0520",
        color: "#fff",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <Div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Div style={{ color: "#ef4444", flexShrink: 0, display: "flex" }}>
          <AlertTriangle className="h-5 w-5" />
        </Div>
        <H2
          style={{ color: "#ef4444", fontSize: 16, fontWeight: 700, margin: 0 }}
        >
          {t("widget.deleteAccount.confirmTitle")}
        </H2>
      </Div>

      <P
        style={{
          color: "rgba(255,255,255,0.55)",
          fontSize: 13,
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        {t("widget.deleteAccount.confirmDescription")}
      </P>

      <Div
        style={{
          background: "rgba(239,68,68,0.06)",
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 8,
          padding: "12px 16px",
        }}
      >
        <Span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "rgba(239,68,68,0.75)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          {t("widget.deleteAccount.whatGetsDeleted")}
        </Span>
        <Div
          style={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {deletedItems.map((item) => (
            <Div
              key={item}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <Div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "rgba(239,68,68,0.4)",
                  flexShrink: 0,
                }}
              />
              <Span
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.5,
                }}
              >
                {item}
              </Span>
            </Div>
          ))}
        </Div>
      </Div>

      <Div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
          {t("widget.deleteAccount.confirmLabel")}
        </Span>
        <Input
          value={confirmText}
          onChange={(e): void => {
            setConfirmText(e.target.value);
          }}
          placeholder={t("widget.deleteAccount.confirmPlaceholder")}
          disabled={isDeleting}
          style={{ fontFamily: "monospace", letterSpacing: "0.05em" }}
        />
      </Div>

      {deleteError !== null && (
        <Span style={{ fontSize: 12, color: "#ef4444" }}>{deleteError}</Span>
      )}

      <Div style={{ display: "flex", gap: 10 }}>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isDeleting}
          onClick={(): void => {
            pop();
          }}
          style={{ flex: 1, color: "rgba(255,255,255,0.5)" }}
        >
          {t("widget.deleteAccount.cancelButton")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!canDelete || isDeleting}
          onClick={(): void => {
            void handleDelete();
          }}
          style={{
            flex: 1,
            background: canDelete ? "rgba(239,68,68,0.12)" : undefined,
            border: "1px solid",
            borderColor: canDelete
              ? "rgba(239,68,68,0.4)"
              : "rgba(255,255,255,0.08)",
            color: canDelete ? "#ef4444" : "rgba(255,255,255,0.2)",
          }}
        >
          {isDeleting
            ? t("widget.deleteAccount.deleting")
            : t("widget.deleteAccount.confirmButton")}
        </Button>
      </Div>
    </Div>
  );
}

function profileFormValues(profile: MeGetResponseOutput): MePostRequestOutput {
  return {
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
  };
}

interface MeUpdateWidgetProps {
  field: {
    value: MePostRequestOutput | null | undefined;
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
  const subscriptionT = subscriptionScopedTranslation.scopedT(locale).t;
  const form = useWidgetForm<typeof meDefinition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const { user: profileRaw, refetch } = useUser(user, logger);
  const profile = profileRaw && !profileRaw.isPublic ? profileRaw : undefined;

  const [editing, setEditing] = useState(false);
  const [liveAvatarUrl, setLiveAvatarUrl] = useState<string | null>(null);

  // Skills come from the me GET endpoint response (server-side enriched)
  const mySkills = useMemo(
    () =>
      profile?.skills.filter(
        (s) => s.ownershipType === SkillOwnershipType.PUBLIC,
      ) ?? [],
    [profile],
  );

  // Skills list context - reuse the real components from skills/widget.tsx
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const router = useRouter();

  const handleLogout = useCallback((): void => {
    navigate(logoutDef.POST, {});
  }, [navigate]);

  const handleAddAddress = useCallback((): void => {
    navigate(addressesDef.POST, { popNavigationOnSuccess: 1 });
  }, [navigate]);

  const handleDeleteAccount = useCallback((): void => {
    void import("./definition").then((meDef) => {
      navigate(meDef.default.DELETE, { renderInModal: true });
      return undefined;
    });
  }, [navigate]);

  const { data: addressesResponse } = useApiQuery({
    endpoint: addressesDef.GET,
    logger,
    user,
    options: { enabled: !user.isPublic },
  });
  const addresses = addressesResponse?.addresses ?? [];

  const { data: subscriptionResponse } = useApiQuery({
    endpoint: subscriptionDef.GET,
    logger,
    user,
    options: { enabled: !user.isPublic },
  });
  const subscription =
    subscriptionResponse?.hasSubscription &&
    subscriptionResponse.plan &&
    subscriptionResponse.status
      ? {
          plan: subscriptionResponse.plan,
          status: subscriptionResponse.status,
          currentPeriodEnd: subscriptionResponse.currentPeriodEnd,
        }
      : null;

  const { data: creditsResponse } = useApiQuery({
    endpoint: creditsDef.GET,
    logger,
    user,
    options: { enabled: !user.isPublic },
  });
  const credits = creditsResponse ?? null;

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
    form.reset(profileFormValues(profile));
  }, [profile, form]);

  const handleCancelEdit = useCallback((): void => {
    setEditing(false);
    if (profile) {
      form.reset(profileFormValues(profile));
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

  // Resolved slug for public profile links (null if no profile loaded yet)
  const profileSlug = profile?.creatorSlug ?? null;
  const profilePath = profileSlug
    ? `/creator/${profileSlug}`
    : user && !user.isPublic
      ? `/creator/${user.id}`
      : null;
  const profileHref = profilePath
    ? `${envClient.NEXT_PUBLIC_APP_URL}${profilePath}`
    : null;

  const scopedPaletteStyle = useMemo(
    () => buildScopedPaletteStyle(accent, true),
    [accent],
  );

  // Icon constants defined outside JSX to satisfy i18n linting rules
  const iconSkills = "🧠";
  const iconSubscription = "💳";
  const iconCredits = "⚡";
  const iconAddresses = "📍";
  const iconPassword = "🔒";
  const iconSessions = "📱";
  const iconEmail = "📧";
  const iconReferral = "🔗";

  return (
    <WidgetShell
      scroll
      padding="none"
      style={{ background: "#0f0520", ...scopedPaletteStyle }}
    >
      {/* ── NAV BAR ── */}
      <WidgetHeader
        title=""
        backButton={
          canGoBack ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(): void => {
                pop();
              }}
              className="gap-1.5 -ml-1"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("widget.nav.back")}
            </Button>
          ) : undefined
        }
        actions={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-1.5 text-muted-foreground"
          >
            <LogOut className="h-4 w-4" />
            {t("widget.nav.logout")}
          </Button>
        }
      />

      {/* ── IDENTITY CARD ── */}
      <Form form={form} onSubmit={onSubmit}>
        <FormAlertWidget field={emptyField} />

        {/* Avatar + name + edit toggle */}
        <Div
          style={{
            position: "relative",
            background: `radial-gradient(ellipse at 50% -10%, ${accent}50 0%, transparent 70%)`,
            padding: "24px 24px 20px",
            display: "flex",
            alignItems: "flex-start",
            gap: 16,
          }}
        >
          {/* Avatar */}
          <Div style={{ flexShrink: 0 }}>
            <AvatarUploadButton
              avatarUrl={liveAvatarUrl ?? profile?.avatarUrl}
              initials={initials}
              onUploaded={handleAvatarUploaded}
            />
          </Div>

          {/* Name / email / roles */}
          <Div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
            <Div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <Span
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.95)",
                  lineHeight: 1.2,
                }}
              >
                {profile?.publicName ?? profile?.privateName ?? "—"}
              </Span>
              {profile?.userRoles?.map((r) => (
                <Badge
                  key={r.id}
                  variant="outline"
                  style={{
                    borderColor: `${accent}60`,
                    color: accent,
                    fontSize: 10,
                    padding: "1px 6px",
                  }}
                >
                  {roleT(r.role)}
                </Badge>
              ))}
            </Div>
            <Div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 3,
              }}
            >
              <Mail className="h-3 w-3 text-white/40" />
              <Span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
                {profile?.email}
              </Span>
            </Div>
          </Div>

          {/* Edit / Save / Cancel + public profile link */}
          <Div
            style={{
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 6,
            }}
          >
            {profileHref && (
              <Link
                href={profileHref}
                className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-white/70 no-underline transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                {t("widget.viewPublicProfile")}
              </Link>
            )}
            {editing ? (
              <Div style={{ display: "flex", gap: 6 }}>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="bg-white/10 text-white/70 hover:bg-white/20 text-xs h-7"
                  onClick={handleCancelEdit}
                >
                  {t("widget.cancelEdit")}
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs h-7 gap-1"
                  disabled={form.formState.isSubmitting}
                >
                  <Save className="h-3 w-3" />
                  {form.formState.isSubmitting
                    ? t("widget.saving")
                    : t("widget.save")}
                </Button>
              </Div>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="bg-white/10 text-white/70 hover:bg-white/20 text-xs h-7 gap-1"
                onClick={(): void => {
                  setEditing(true);
                }}
              >
                <Pencil className="h-3 w-3" />
                {t("widget.editProfile")}
              </Button>
            )}
          </Div>
        </Div>

        {/* Bio + socials (view mode) */}
        {!editing && profile?.bio && (
          <Div style={{ padding: "0 24px 8px" }}>
            <ProfileBio bio={profile.bio} />
          </Div>
        )}
        {!editing && (
          <Div style={{ padding: "0 24px 16px" }}>
            <ProfileSocialPills profile={profileData} />
          </Div>
        )}

        {/* Edit form (expanded inline) */}
        {editing && (
          <Div
            style={{
              padding: "16px 24px 24px",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
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
            <TextFieldWidget
              fieldName="basicInfo.email"
              field={basicInfo.email}
            />
            <BooleanFieldWidget
              fieldName="privacySettings.marketingConsent"
              field={privacySettings.marketingConsent}
            />
            <MarkdownTextareaFieldWidget
              fieldName="profileInfo.bio"
              field={profileInfo.bio}
            />
            <Div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
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
                  style={{
                    color: "rgb(251,191,36)",
                    flexShrink: 0,
                    paddingTop: 1,
                  }}
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
            <Div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(
                [
                  { key: "websiteUrl", icon: <Globe className="h-4 w-4" /> },
                  { key: "twitterUrl", icon: <Twitter className="h-4 w-4" /> },
                  { key: "youtubeUrl", icon: <Youtube className="h-4 w-4" /> },
                  {
                    key: "instagramUrl",
                    icon: <Instagram className="h-4 w-4" />,
                  },
                  { key: "tiktokUrl", icon: <Music className="h-4 w-4" /> },
                  { key: "githubUrl", icon: <SiGithub className="h-4 w-4" /> },
                  {
                    key: "discordUrl",
                    icon: <SiDiscord className="h-4 w-4" />,
                  },
                ] as { key: SocialKey; icon: JSX.Element }[]
              ).map(({ key, icon }) => (
                <Div key={key} className="flex items-center gap-2">
                  <Div
                    style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }}
                  >
                    {icon}
                  </Div>
                  <UrlFieldWidget
                    fieldName={`profileInfo.${key}`}
                    field={profileInfo[key]}
                  />
                </Div>
              ))}
            </Div>
          </Div>
        )}
      </Form>

      {/* ── SKILLS ── */}
      {mySkills.length > 0 && (
        <Div style={{ padding: "0 16px" }}>
          <HubRow
            icon={iconSkills}
            title={`${t("widget.skills.title")} (${mySkills.length.toString()})`}
            subtitle={t("widget.skills.hubSubtitle", {
              count: mySkills.length,
            })}
            onClick={(): void => {
              navigate(skillsDef.GET, {});
            }}
          />
        </Div>
      )}

      {/* ── ACCOUNT ── */}
      <Div
        style={{
          padding: "16px 16px 0",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            padding: "0 4px 8px",
          }}
        >
          {t("widget.sections.account")}
        </Div>

        <HubRow
          icon={iconSubscription}
          title={
            subscription?.plan
              ? subscriptionT(subscription.plan)
              : t("widget.sections.noSubscription")
          }
          subtitle={
            subscription?.currentPeriodEnd
              ? new Date(subscription.currentPeriodEnd).toLocaleDateString(
                  locale,
                )
              : t("widget.sections.subscriptionHint")
          }
          badge={
            subscription?.status ? (
              <StatusPill
                status={subscriptionT(subscription.status)}
                variant={
                  subscription.status === SubscriptionStatus.ACTIVE
                    ? "success"
                    : "warning"
                }
              />
            ) : (
              <Span
                style={{
                  fontSize: 11,
                  color: accent,
                  fontWeight: 600,
                  background: `${accent}20`,
                  padding: "2px 8px",
                  borderRadius: 99,
                }}
              >
                {t("widget.sections.upgrade")}
              </Span>
            )
          }
          onClick={(): void => {
            router.push(`/${locale}/subscription/buy`);
          }}
        />

        <HubRow
          icon={iconCredits}
          title={t("widget.sections.credits")}
          subtitle={
            credits
              ? `${credits.total.toLocaleString()} ${t("widget.sections.creditsAvailable")}`
              : "—"
          }
          onClick={(): void => {
            router.push(`/${locale}/subscription/overview`);
          }}
        />

        <HubRow
          icon={iconAddresses}
          title={t("widget.sections.addresses")}
          subtitle={
            addresses.length > 0
              ? t("widget.sections.addressCount", { count: addresses.length })
              : t("widget.sections.noAddresses")
          }
          onClick={handleAddAddress}
        />

        <HubRow
          icon={iconPassword}
          title={t("widget.sections.password")}
          subtitle={t("widget.sections.passwordHint")}
          onClick={(): void => {
            navigate(passwordDef.POST, {});
          }}
        />

        <HubRow
          icon={iconSessions}
          title={t("widget.sections.sessions")}
          subtitle={t("widget.sections.sessionsHint")}
          onClick={(): void => {
            navigate(sessionsDef.GET, {});
          }}
        />
      </Div>

      {/* ── CREATOR ── */}
      <Div
        style={{
          padding: "16px 16px 0",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            padding: "0 4px 8px",
          }}
        >
          {t("widget.sections.creator")}
        </Div>

        <HubRow
          icon={iconEmail}
          title={t("widget.emailCard.title")}
          subtitle={t("widget.emailCard.description")}
          onClick={(): void => {
            navigate(configDef.GET, {});
          }}
        />

        <HubRow
          icon={iconReferral}
          title={t("widget.sections.referral")}
          subtitle={t("widget.sections.referralHint")}
          onClick={(): void => {
            router.push(`/${locale}/user/referral`);
          }}
        />
      </Div>

      {/* ── DANGER ── */}
      <Div style={{ padding: "24px 16px 32px" }}>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleDeleteAccount}
          className="w-full text-destructive/70 hover:text-destructive hover:bg-destructive/10 border border-destructive/20 hover:border-destructive/40 transition-all"
        >
          {t("widget.deleteAccount.button")}
        </Button>
      </Div>
    </WidgetShell>
  );
}
