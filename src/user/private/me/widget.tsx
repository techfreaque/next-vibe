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
import { Brain } from "next-vibe/ui/components/icons/Brain";
import { Camera } from "next-vibe/ui/components/icons/Camera";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { CreditCard } from "next-vibe/ui/components/icons/CreditCard";
import { ExternalLink } from "next-vibe/ui/components/icons/ExternalLink";
import { Globe } from "next-vibe/ui/components/icons/Globe";
import { Instagram } from "next-vibe/ui/components/icons/Instagram";
import { Lock } from "next-vibe/ui/components/icons/Lock";
import { LogOut } from "next-vibe/ui/components/icons/LogOut";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { Building } from "next-vibe/ui/components/icons/Building";
import { Monitor } from "next-vibe/ui/components/icons/Monitor";
import { Music } from "next-vibe/ui/components/icons/Music";
import { Pencil } from "next-vibe/ui/components/icons/Pencil";
import { SiDiscord } from "next-vibe/ui/components/icons/SiDiscord";
import { SiGithub } from "next-vibe/ui/components/icons/SiGithub";
import { TrendingUp } from "next-vibe/ui/components/icons/TrendingUp";
import { Twitter } from "next-vibe/ui/components/icons/Twitter";
import { Youtube } from "next-vibe/ui/components/icons/Youtube";
import { Zap } from "next-vibe/ui/components/icons/Zap";
import { Input } from "next-vibe/ui/components/input";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { H2, H3, P } from "next-vibe/ui/components/typography";
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
  useWidgetValue,
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
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import {
  type JSX,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
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

/** Placeholder while a value is still loading. */
const PENDING_VALUE = "—";

/** One tappable settings row — 56px+ tall, icon tile, title, hint, chevron. */
function HubRow({
  icon,
  title,
  subtitle,
  badge,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  onClick: () => void;
}): JSX.Element {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className="flex h-auto min-h-14 w-full items-center justify-start gap-3 rounded-none px-4 py-3 text-left hover:bg-muted/60"
    >
      <Span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        {icon}
      </Span>
      <Div className="min-w-0 flex-1">
        <Span className="block truncate text-sm font-medium text-foreground">
          {title}
        </Span>
        {subtitle && (
          <Span className="mt-0.5 block whitespace-normal text-xs font-normal leading-snug text-muted-foreground">
            {subtitle}
          </Span>
        )}
      </Div>
      {badge && <Div className="shrink-0">{badge}</Div>}
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60" />
    </Button>
  );
}

/** Titled group of HubRows inside one bordered card. */
function HubSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <Div className="flex flex-col gap-2">
      <H3 className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </H3>
      <Div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border bg-card shadow-sm">
        {children}
      </Div>
    </Div>
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

  return <Div className="min-h-64 bg-background" />;
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
      <Div className="p-12 text-center text-sm text-muted-foreground">
        {t("widget.deleteAccount.success")}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-5 bg-background p-6 text-foreground">
      <Div className="flex items-start gap-3">
        <Span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-5 w-5" />
        </Span>
        <Div className="flex flex-col gap-1">
          <H2 className="m-0 border-0 p-0 text-lg font-semibold tracking-tight text-foreground">
            {t("widget.deleteAccount.confirmTitle")}
          </H2>
          <P className="m-0 text-sm leading-relaxed text-muted-foreground">
            {t("widget.deleteAccount.confirmDescription")}
          </P>
        </Div>
      </Div>

      <Div className="rounded-lg border border-destructive/25 bg-destructive/5 px-4 py-3">
        <Span className="text-xs font-semibold uppercase tracking-wider text-destructive">
          {t("widget.deleteAccount.whatGetsDeleted")}
        </Span>
        <Div className="mt-2 flex flex-col gap-1.5">
          {deletedItems.map((item) => (
            <Div key={item} className="flex items-center gap-2">
              <Span className="h-1.5 w-1.5 shrink-0 rounded-full bg-destructive/50" />
              <Span className="text-sm text-muted-foreground">{item}</Span>
            </Div>
          ))}
        </Div>
      </Div>

      <Div className="flex flex-col gap-2">
        <Span className="text-sm font-medium text-foreground">
          {t("widget.deleteAccount.confirmLabel")}
        </Span>
        <Input
          value={confirmText}
          onChange={(e): void => {
            setConfirmText(e.target.value);
          }}
          placeholder={t("widget.deleteAccount.confirmPlaceholder")}
          disabled={isDeleting}
          className="h-11 font-mono tracking-wider"
        />
      </Div>

      {deleteError !== null && (
        <Span className="text-sm text-destructive">{deleteError}</Span>
      )}

      <Div className="flex flex-col-reverse gap-2 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          disabled={isDeleting}
          onClick={(): void => {
            pop();
          }}
          className="h-11 flex-1"
        >
          {t("widget.deleteAccount.cancelButton")}
        </Button>
        <Button
          type="button"
          variant="destructive"
          disabled={!canDelete || isDeleting}
          onClick={(): void => {
            void handleDelete();
          }}
          className="h-11 flex-1"
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

const SOCIAL_FIELDS: { key: SocialKey; icon: JSX.Element }[] = [
  { key: "websiteUrl", icon: <Globe className="h-4 w-4" /> },
  { key: "twitterUrl", icon: <Twitter className="h-4 w-4" /> },
  { key: "youtubeUrl", icon: <Youtube className="h-4 w-4" /> },
  { key: "instagramUrl", icon: <Instagram className="h-4 w-4" /> },
  { key: "tiktokUrl", icon: <Music className="h-4 w-4" /> },
  { key: "githubUrl", icon: <SiGithub className="h-4 w-4" /> },
  { key: "discordUrl", icon: <SiDiscord className="h-4 w-4" /> },
];

/**
 * Avatar with upload. The camera badge is always visible — no hover-only
 * affordance, so it works on touch.
 */
function AvatarUploadButton({
  avatarUrl,
  initials,
  label,
  onUploaded,
}: {
  avatarUrl?: string | null;
  initials: string;
  label: string;
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
    <Div className="relative h-16 w-16 shrink-0 sm:h-20 sm:w-20">
      <Avatar className="h-full w-full ring-2 ring-border ring-offset-2 ring-offset-card">
        {displayUrl && <AvatarImage src={displayUrl} alt="" />}
        <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={(): void => inputRef.current?.click()}
        disabled={uploading}
        className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-card shadow-sm"
        aria-label={label}
        title={label}
      >
        {uploading ? (
          <Span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        ) : (
          <Camera className="h-3.5 w-3.5" />
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

/** Titled block inside the profile editor. */
function EditorSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <Div className="flex flex-col gap-4 border-t px-5 py-5 sm:px-6">
      <Div className="flex flex-col gap-0.5">
        <H3 className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </H3>
        {description && (
          <P className="m-0 text-sm text-muted-foreground">{description}</P>
        )}
      </Div>
      {children}
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

  // A successful save closes the editor (adjust state during render) and
  // reloads the profile so the card shows what was just saved.
  const saved = useWidgetValue<typeof meDefinition.POST>();
  // Before any submit the widget value is not a response yet — no `response` key
  const savedOk =
    saved !== undefined &&
    "response" in saved &&
    saved.response?.success === true;
  const [handledSave, setHandledSave] = useState(saved);
  const [saveCount, setSaveCount] = useState(0);
  if (saved !== handledSave) {
    setHandledSave(saved);
    if (savedOk) {
      setEditing(false);
      setSaveCount((n) => n + 1);
    }
  }
  useEffect(() => {
    if (saveCount > 0) {
      void refetch();
    }
  }, [saveCount, refetch]);

  // Skills come from the me GET endpoint response (server-side enriched)
  const mySkills = useMemo(
    () =>
      profile?.skills.filter(
        (s) => s.ownershipType === SkillOwnershipType.PUBLIC,
      ) ?? [],
    [profile],
  );

  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const router = useRouter();

  const handleLogout = useCallback((): void => {
    navigate(logoutDef.POST, {});
  }, [navigate]);

  // Open the list (it has its own empty state + add button) so saved
  // addresses can be seen and edited, not only added.
  const handleAddAddress = useCallback((): void => {
    navigate(addressesDef.GET, {});
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

  // Server avatar wins whenever it changes (adjust state during render)
  const profileAvatarUrl = profile?.avatarUrl;
  const [prevProfileAvatarUrl, setPrevProfileAvatarUrl] =
    useState(profileAvatarUrl);
  if (profileAvatarUrl !== prevProfileAvatarUrl) {
    setPrevProfileAvatarUrl(profileAvatarUrl);
    if (profileAvatarUrl) {
      setLiveAvatarUrl(profileAvatarUrl);
    }
  }

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

  const handleStartEdit = useCallback((): void => {
    // Open the editor on the saved profile — the form may have been
    // re-initialised since the profile loaded (empty fields, and a
    // cleared field would never register as a change).
    if (profile) {
      form.reset(profileFormValues(profile));
    }
    setEditing(true);
  }, [profile, form]);

  const emptyField = useMemo(() => ({}), []);

  const displayName = profile?.publicName ?? profile?.privateName ?? "";
  const initials = useMemo(
    () =>
      displayName
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "?",
    [displayName],
  );

  const basicInfo = children.basicInfo.children;
  const profileInfo = children.profileInfo.children;
  const privacySettings = children.privacySettings.children;

  // Shared profile shape for the shared components
  const profileData = useMemo(
    () =>
      profile
        ? {
            publicName: displayName,
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
            publicName: PENDING_VALUE,
            avatarUrl: null,
          },
    [profile, liveAvatarUrl, displayName],
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

  const iconClass = "h-4 w-4";

  return (
    <WidgetShell scroll className="gap-6 pb-8">
      {/* ── BACK (only when pushed from another screen) ── */}
      {canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(): void => {
            pop();
          }}
          className="-ml-2 w-fit gap-1.5 text-muted-foreground"
        >
          <ChevronLeft className={iconClass} />
          {t("widget.nav.back")}
        </Button>
      )}

      {/* ── PROFILE CARD ── */}
      <Div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <Form form={form} onSubmit={onSubmit}>
          <Div className="flex flex-col gap-5 p-5 sm:p-6">
            <Div className="flex items-start gap-4">
              <AvatarUploadButton
                avatarUrl={liveAvatarUrl ?? profile?.avatarUrl}
                initials={initials}
                label={t("widget.changePhoto")}
                onUploaded={handleAvatarUploaded}
              />
              <Div className="flex min-w-0 flex-1 flex-col gap-1 pt-1">
                <Div className="flex flex-wrap items-center gap-2">
                  <H2 className="m-0 truncate border-0 p-0 text-xl font-semibold tracking-tight text-foreground">
                    {displayName || PENDING_VALUE}
                  </H2>
                  {profile?.userRoles?.map((r) => (
                    <Badge
                      key={r.id}
                      variant="secondary"
                      className="px-2 py-0 text-[11px] font-medium"
                    >
                      {roleT(r.role)}
                    </Badge>
                  ))}
                </Div>
                <Div className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <Span className="truncate">{profile?.email}</Span>
                </Div>
              </Div>
            </Div>

            {!editing && profile?.bio && <ProfileBio bio={profile.bio} />}
            {!editing && <ProfileSocialPills profile={profileData} />}

            {!editing && (
              <Div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  className="h-11 gap-2 sm:h-10"
                  onClick={handleStartEdit}
                >
                  <Pencil className={iconClass} />
                  {t("widget.editProfile")}
                </Button>
                {profileHref && (
                  <Link
                    href={profileHref}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-input px-4 text-sm font-medium text-foreground no-underline transition-colors hover:bg-accent sm:h-10"
                  >
                    <ExternalLink className={iconClass} />
                    {t("widget.viewPublicProfile")}
                  </Link>
                )}
              </Div>
            )}
          </Div>

          <FormAlertWidget field={emptyField} />

          {/* ── EDITOR ── */}
          {editing && (
            <>
              <EditorSection
                title={t("widget.sections.basics")}
                description={t("widget.sections.basicsHint")}
              >
                <Div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              </EditorSection>

              <EditorSection
                title={t("widget.profileCard.title")}
                description={t("widget.profileCard.description")}
              >
                <MarkdownTextareaFieldWidget
                  fieldName="profileInfo.bio"
                  field={profileInfo.bio}
                />
                <Div className="flex flex-col gap-2">
                  <TextFieldWidget
                    fieldName="profileInfo.creatorSlug"
                    field={profileInfo.creatorSlug}
                  />
                  <Div className="flex items-start gap-2.5 rounded-lg border border-warning/30 bg-warning/10 px-3.5 py-2.5">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                    <Span className="text-xs leading-relaxed text-foreground/80">
                      {t("widget.slugWarning")}
                    </Span>
                  </Div>
                </Div>
                <Div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ColorFieldWidget
                    fieldName="profileInfo.creatorAccentColor"
                    field={profileInfo.creatorAccentColor}
                  />
                  <FileFieldWidget
                    fieldName="profileInfo.creatorHeaderImageUrl"
                    field={profileInfo.creatorHeaderImageUrl}
                  />
                </Div>
              </EditorSection>

              <EditorSection
                title={t("widget.socialCard.title")}
                description={t("widget.socialCard.description")}
              >
                <Div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {SOCIAL_FIELDS.map(({ key, icon }) => (
                    <Div key={key} className="flex items-end gap-2">
                      <Span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        {icon}
                      </Span>
                      <Div className="min-w-0 flex-1">
                        <UrlFieldWidget
                          fieldName={`profileInfo.${key}`}
                          field={profileInfo[key]}
                        />
                      </Div>
                    </Div>
                  ))}
                </Div>
              </EditorSection>

              <Div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t bg-card/95 px-5 py-4 backdrop-blur sm:flex-row sm:justify-end sm:px-6">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 sm:h-10"
                  onClick={handleCancelEdit}
                >
                  {t("widget.cancelEdit")}
                </Button>
                <SubmitButtonWidget<typeof meDefinition.POST>
                  field={{
                    text: "widget.save",
                    loadingText: "widget.saving",
                    icon: "save",
                    size: "default",
                    className: "h-11 sm:h-10",
                  }}
                />
              </Div>
            </>
          )}
        </Form>
      </Div>

      {/* ── SKILLS ── */}
      {mySkills.length > 0 && (
        <HubSection title={t("widget.skills.title")}>
          <HubRow
            icon={<Brain className={iconClass} />}
            title={`${t("widget.skills.title")} (${mySkills.length.toString()})`}
            subtitle={t("widget.skills.hubSubtitle", {
              count: mySkills.length,
            })}
            onClick={(): void => {
              navigate(skillsDef.GET, {});
            }}
          />
        </HubSection>
      )}

      {/* ── ACCOUNT ── */}
      <HubSection title={t("widget.sections.account")}>
        <HubRow
          icon={<CreditCard className={iconClass} />}
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
              <Badge className="px-2 py-0.5 text-[11px]">
                {t("widget.sections.upgrade")}
              </Badge>
            )
          }
          onClick={(): void => {
            router.push(
              subscription
                ? `/${locale}/subscription/overview`
                : `/${locale}/subscription/buy`,
            );
          }}
        />

        <HubRow
          icon={<Zap className={iconClass} />}
          title={t("widget.sections.credits")}
          subtitle={
            credits
              ? `${credits.total.toLocaleString(locale)} ${t("widget.sections.creditsAvailable")}`
              : PENDING_VALUE
          }
          onClick={(): void => {
            router.push(`/${locale}/subscription/overview`);
          }}
        />

        <HubRow
          icon={<Building className={iconClass} />}
          title={t("widget.sections.addresses")}
          subtitle={
            addresses.length > 0
              ? t("widget.sections.addressCount", { count: addresses.length })
              : t("widget.sections.noAddresses")
          }
          onClick={handleAddAddress}
        />

        <HubRow
          icon={<Lock className={iconClass} />}
          title={t("widget.sections.password")}
          subtitle={t("widget.sections.passwordHint")}
          onClick={(): void => {
            navigate(passwordDef.POST, {});
          }}
        />

        <HubRow
          icon={<Monitor className={iconClass} />}
          title={t("widget.sections.sessions")}
          subtitle={t("widget.sections.sessionsHint")}
          onClick={(): void => {
            navigate(sessionsDef.GET, {});
          }}
        />
      </HubSection>

      {/* ── CREATOR ── */}
      <HubSection title={t("widget.sections.creator")}>
        <HubRow
          icon={<Mail className={iconClass} />}
          title={t("widget.emailCard.title")}
          subtitle={t("widget.emailCard.description")}
          onClick={(): void => {
            navigate(configDef.GET, {});
          }}
        />

        <HubRow
          icon={<TrendingUp className={iconClass} />}
          title={t("widget.sections.referral")}
          subtitle={t("widget.sections.referralHint")}
          onClick={(): void => {
            router.push(`/${locale}/user/referral`);
          }}
        />
      </HubSection>

      {/* ── SIGN OUT ── */}
      <Div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border bg-card shadow-sm">
        <HubRow
          icon={<LogOut className={iconClass} />}
          title={t("widget.nav.logout")}
          subtitle={t("widget.nav.logoutHint")}
          onClick={handleLogout}
        />
      </Div>

      {/* ── DANGER ZONE ── */}
      <Div className="flex flex-col gap-2">
        <H3 className="px-1 text-xs font-semibold uppercase tracking-wider text-destructive">
          {t("widget.deleteAccount.dangerZone")}
        </H3>
        <Div className="flex flex-col gap-4 rounded-xl border border-destructive/30 bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <Div className="flex flex-col gap-0.5">
            <Span className="text-sm font-medium text-foreground">
              {t("widget.deleteAccount.button")}
            </Span>
            <Span className="text-xs leading-snug text-muted-foreground">
              {t("widget.deleteAccount.dangerDescription")}
            </Span>
          </Div>
          <Button
            type="button"
            variant="outline"
            onClick={handleDeleteAccount}
            className="h-11 shrink-0 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive sm:h-10"
          >
            {t("widget.deleteAccount.button")}
          </Button>
        </Div>
      </Div>
    </WidgetShell>
  );
}
