"use client";

import { useProviderAvailability } from "next-vibe/agent/env-availability-store";
import { getAvailableChatModelCount } from "next-vibe/agent/models/all-models";
import { LocaleSelectorContent } from "next-vibe/agent/ai-stream/stream/widget/chat-ui/top-area/locale-selector-content";
import chatSettingsDef from "next-vibe/agent/chat/settings/definition";
import { useChatSettings } from "next-vibe/agent/chat/settings/hooks";
import skillsDef from "next-vibe/agent/skills/definition";
import { SkillOwnershipType } from "next-vibe/agent/skills/enum";
import {
  SearchProvider,
  SearchProviderOptions,
} from "next-vibe/agent/web-search/enum";
import { scopedTranslation as searchScopedTranslation } from "next-vibe/agent/web-search/i18n";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import { useTranslation } from "next-vibe/core/i18n/core/client";
import { Platform } from "next-vibe/platforms/platforms";
import { UserRole } from "next-vibe/identity/roles/enum";
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
import { Download } from "next-vibe/ui/components/icons/Download";
import { Key } from "next-vibe/ui/components/icons/Key";
import { Camera } from "next-vibe/ui/components/icons/Camera";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { CreditCard } from "next-vibe/ui/components/icons/CreditCard";
import { ExternalLink } from "next-vibe/ui/components/icons/ExternalLink";
import { Globe } from "next-vibe/ui/components/icons/Globe";
import { Instagram } from "next-vibe/ui/components/icons/Instagram";
import { Lock } from "next-vibe/ui/components/icons/Lock";
import { Shield } from "next-vibe/ui/components/icons/Shield";
import { LogOut } from "next-vibe/ui/components/icons/LogOut";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { Building } from "next-vibe/ui/components/icons/Building";
import { Monitor } from "next-vibe/ui/components/icons/Monitor";
import { Moon } from "next-vibe/ui/components/icons/Moon";
import { Music } from "next-vibe/ui/components/icons/Music";
import { Palette } from "next-vibe/ui/components/icons/Palette";
import { Pencil } from "next-vibe/ui/components/icons/Pencil";
import { Search } from "next-vibe/ui/components/icons/Search";
import { Sparkles } from "next-vibe/ui/components/icons/Sparkles";
import { Sun } from "next-vibe/ui/components/icons/Sun";
import { SiDiscord } from "next-vibe/ui/components/icons/SiDiscord";
import { SiGithub } from "next-vibe/ui/components/icons/SiGithub";
import { TrendingUp } from "next-vibe/ui/components/icons/TrendingUp";
import { Twitter } from "next-vibe/ui/components/icons/Twitter";
import { Youtube } from "next-vibe/ui/components/icons/Youtube";
import { Zap } from "next-vibe/ui/components/icons/Zap";
import { Dialog, DialogContent } from "next-vibe/ui/components/dialog";
import { Input } from "next-vibe/ui/components/input";
import { Link } from "next-vibe/ui/components/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
import { useThemeToggle } from "next-vibe/ui/components/theme-provider";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { H2, H3, P } from "next-vibe/ui/components/typography";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { useRouter } from "next-vibe/ui/hooks/use-navigation";
import { assignUrl } from "next-vibe/ui/lib/location";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetPlatform,
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
import { NewsletterSubscribeInline } from "@/newsletter/_components/newsletter-subscribe-inline";
import { FREE_CREDIT_ALLOWANCE } from "@/products/constants";
import subscriptionDef from "@/subscription/definition";
import { SubscriptionStatus } from "@/subscription/enum";
import { scopedTranslation as subscriptionScopedTranslation } from "@/subscription/i18n";
import logoutDef from "@/user/private/logout/definition";
import addressesDef from "@/user/private/me/addresses/definition";
import passwordDef from "@/user/private/me/password/definition";
import exportDef from "@/user/private/me/export/definition";
import twoFactorDef from "@/user/private/me/two-factor/definition";
import verifyEmailDef from "@/user/public/verify-email/definition";
import apiKeysDef from "@/api-keys/definition";
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
      className="group flex h-auto min-h-14 w-full items-center justify-start gap-3.5 rounded-none px-4 py-3 text-left transition-colors hover:bg-muted/50"
    >
      <Span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted/70 text-muted-foreground transition-colors group-hover:bg-muted group-hover:text-foreground">
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
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
    </Button>
  );
}

/** Rows wrapped in one bordered, rounded card. */
function HubCard({ children }: { children: ReactNode }): JSX.Element {
  return (
    <Div className="flex flex-col divide-y divide-border/70 overflow-hidden rounded-2xl border bg-card shadow-sm">
      {children}
    </Div>
  );
}

/** Titled group of HubRows inside one bordered card, with an optional hint. */
function HubSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <Div className="flex flex-col gap-2.5">
      <Div className="flex flex-col gap-0.5 px-1">
        <H3 className="m-0 border-0 p-0 text-[13px] font-semibold tracking-tight text-foreground">
          {title}
        </H3>
        {subtitle && (
          <Span className="text-xs leading-snug text-muted-foreground">
            {subtitle}
          </Span>
        )}
      </Div>
      <HubCard>{children}</HubCard>
    </Div>
  );
}

/** A cluster caption rendered inside a HubCard to separate groups of rows.
 *  A plain label (not a heading), so it never competes with the section's own
 *  heading in the a11y tree. */
function RowLabel({
  label,
  hint,
}: {
  label: string;
  hint?: string;
}): JSX.Element {
  return (
    <Div className="flex items-baseline gap-2 bg-muted/25 px-4 py-2">
      <Span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Span>
      {hint && (
        <Span className="truncate text-[11px] text-muted-foreground/70">
          {hint}
        </Span>
      )}
    </Div>
  );
}

/**
 * One settings row with an inline control on the right instead of a navigation
 * chevron. Matches HubRow's geometry (same icon tile, title, hint) so a mixed
 * list of tappable rows and inline controls reads as one coherent group.
 */
function HubControlRow({
  icon,
  title,
  subtitle,
  control,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  control: ReactNode;
}): JSX.Element {
  return (
    <Div className="flex min-h-14 w-full items-center justify-start gap-3.5 px-4 py-3 text-left">
      <Span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted/70 text-muted-foreground">
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
      <Div className="shrink-0">{control}</Div>
    </Div>
  );
}

/** A compact at-a-glance stat in the identity header strip. */
function StatTile({
  icon,
  label,
  value,
  badge,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  badge?: ReactNode;
}): JSX.Element {
  return (
    <Div className="flex min-w-0 flex-1 flex-col gap-1 rounded-xl border bg-background/60 px-3.5 py-3">
      <Span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        <Span className="text-muted-foreground/70">{icon}</Span>
        {label}
      </Span>
      <Div className="flex min-w-0 items-center gap-2">
        <Span className="truncate text-sm font-semibold text-foreground">
          {value}
        </Span>
        {badge}
      </Div>
    </Div>
  );
}

/** Platforms that render real UI — theme/locale controls are meaningless on
 *  headless surfaces (CLI, AI, MCP, cron). */
function isVisualPlatform(platform: Platform): boolean {
  return (
    platform !== Platform.CLI &&
    platform !== Platform.CLI_PACKAGE &&
    platform !== Platform.AI &&
    platform !== Platform.MCP &&
    platform !== Platform.REMOTE_SKILL &&
    platform !== Platform.CRON
  );
}

/**
 * Three-option theme switch: light, dark, or follow the OS. Reuses the exact
 * same theme state as the top-bar and nav toggles (useThemeToggle ->
 * next-themes), so a change here updates every other theme control instantly
 * and vice-versa.
 */
function ThemeSegmented(): JSX.Element {
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof meDefinition.POST>();
  const { preference, setPreference, isMounted } = useThemeToggle();
  const options = [
    {
      key: "light" as const,
      icon: <Sun className="h-3.5 w-3.5" />,
      label: t("widget.appearance.light"),
    },
    {
      key: "dark" as const,
      icon: <Moon className="h-3.5 w-3.5" />,
      label: t("widget.appearance.dark"),
    },
    {
      key: "system" as const,
      icon: <Monitor className="h-3.5 w-3.5" />,
      label: t("widget.appearance.system"),
    },
  ];
  return (
    <Div
      className="inline-flex rounded-lg border bg-muted/40 p-0.5"
      suppressHydrationWarning
    >
      {options.map((opt) => {
        const active = isMounted && preference === opt.key;
        return (
          <Button
            key={`${opt.key}-${locale}`}
            type="button"
            variant="ghost"
            size="sm"
            suppressHydrationWarning
            onClick={(): void => {
              if (preference !== opt.key) {
                setPreference(opt.key);
              }
            }}
            className={cn(
              "h-8 gap-1.5 rounded-md px-3 text-xs font-medium transition-colors",
              active
                ? "bg-card text-foreground shadow-sm hover:bg-card"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={active}
          >
            {opt.icon}
            {opt.label}
          </Button>
        );
      })}
    </Div>
  );
}

/**
 * Appearance group: theme + language. Web-only — scoped into its own component
 * so the theme/locale hooks never run on headless platforms. Language reuses the
 * shared LocaleSelectorContent (the same control the top-bar opens), so it
 * switches locale through the exact same mechanism.
 */
function AppearanceSection(): JSX.Element {
  const t = useWidgetTranslation<typeof meDefinition.POST>();
  const { currentCountry } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);

  return (
    <>
      <HubSection
        title={t("widget.appearance.title")}
        subtitle={t("widget.appearance.sectionHint")}
      >
        <HubControlRow
          icon={<Palette className="h-4 w-4" />}
          title={t("widget.appearance.theme")}
          subtitle={t("widget.appearance.themeHint")}
          control={<ThemeSegmented />}
        />
        <HubRow
          icon={<Globe className="h-4 w-4" />}
          title={t("widget.appearance.language")}
          subtitle={t("widget.appearance.languageHint")}
          badge={
            <Span className="text-lg leading-none">{currentCountry.flag}</Span>
          }
          onClick={(): void => {
            setLangOpen(true);
          }}
        />
      </HubSection>
      <Dialog open={langOpen} onOpenChange={setLangOpen}>
        <DialogContent className="max-w-md">
          <LocaleSelectorContent />
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Chat preferences group: web-search provider (inline, instant) + a row into the
 * full background-automation panel. Both read/write through useChatSettings — the
 * same DB-backed endpoint the in-chat settings use — so the two stay in sync.
 */
function ChatPrefsSection(): JSX.Element {
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof meDefinition.POST>();
  const { t: tSearch } = searchScopedTranslation.scopedT(locale);
  const { push: navigate } = useWidgetNavigation();
  const { settings, updateSettings } = useChatSettings(user, logger);

  const handleSearchProvider = useCallback(
    (value: string): void => {
      const opt = SearchProviderOptions.find((o) => o.value === value);
      if (opt) {
        void updateSettings({ searchProvider: opt.value });
      }
    },
    [updateSettings],
  );

  const automationOn =
    (settings?.dreamerEnabled ?? false) ||
    (settings?.autopilotEnabled ?? false);

  return (
    <HubSection
      title={t("widget.chatPrefs.title")}
      subtitle={t("widget.chatPrefs.sectionHint")}
    >
      <HubControlRow
        icon={<Search className="h-4 w-4" />}
        title={t("widget.chatPrefs.searchProvider")}
        subtitle={t("widget.chatPrefs.searchProviderHint")}
        control={
          <Select
            value={settings?.searchProvider ?? SearchProvider.AUTO}
            onValueChange={handleSearchProvider}
          >
            <SelectTrigger className="h-8 w-36 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SearchProviderOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {tSearch(opt.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />
      {!user.isPublic && (
        <HubRow
          icon={<Sparkles className="h-4 w-4" />}
          title={t("widget.chatPrefs.automation")}
          subtitle={t("widget.chatPrefs.automationHint")}
          badge={
            <StatusPill
              status={
                automationOn
                  ? t("widget.chatPrefs.on")
                  : t("widget.chatPrefs.off")
              }
              variant={automationOn ? "success" : "warning"}
            />
          }
          onClick={(): void => {
            navigate(chatSettingsDef.GET, {});
          }}
        />
      )}
    </HubSection>
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
  const availability = useProviderAvailability();
  const t = useWidgetTranslation<typeof meDefinition.POST>();
  const roleT = userRoleScopedTranslation.scopedT(locale).t;
  const subscriptionT = subscriptionScopedTranslation.scopedT(locale).t;
  const form = useWidgetForm<typeof meDefinition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const {
    user: profileRaw,
    refetch,
    error: profileError,
  } = useUser(user, logger);
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
  const platform = useWidgetPlatform();
  const showVisualSettings = isVisualPlatform(platform);

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

  const {
    data: creditsResponse,
    isError: creditsError,
    refetch: refetchCredits,
  } = useApiQuery({
    endpoint: creditsDef.GET,
    logger,
    user,
    options: { enabled: !user.isPublic },
  });
  const credits = creditsResponse ?? null;
  // A failed load is an error with a retry - never a blank or a fake value
  const profileLoadFailed = !profile && profileError !== undefined;

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
            publicName: profileLoadFailed ? "" : PENDING_VALUE,
            avatarUrl: null,
          },
    [profile, liveAvatarUrl, displayName, profileLoadFailed],
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

  // ── At-a-glance header stats ──
  const planLabel = subscription?.plan
    ? subscriptionT(subscription.plan)
    : t("widget.sections.noSubscription");
  const planActive = subscription?.status === SubscriptionStatus.ACTIVE;
  const creditsLabel = credits
    ? credits.total.toLocaleString(locale)
    : creditsError
      ? t("widget.loadState.creditsFailed")
      : PENDING_VALUE;
  const memberSinceLabel = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
      })
    : PENDING_VALUE;

  return (
    <WidgetShell scroll className="gap-7 pb-10">
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

      {/* ── VERIFY NUDGE (never blocks anything, just asks) ── */}
      {profile && !profile.emailVerified && (
        <Div className="flex flex-col gap-3 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <Div className="flex min-w-0 items-start gap-2.5">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <Div className="flex min-w-0 flex-col gap-0.5">
              <Span className="text-sm font-medium text-foreground">
                {t("widget.verifyNudge.title")}
              </Span>
              <Span className="text-xs leading-relaxed text-foreground/80">
                {t("widget.verifyNudge.description", { email: profile.email })}
              </Span>
            </Div>
          </Div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 shrink-0"
            onClick={(): void => {
              navigate(verifyEmailDef.POST, {});
            }}
          >
            {t("widget.verifyNudge.action")}
          </Button>
        </Div>
      )}

      {/* ── IDENTITY HERO ── */}
      <Div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <Form form={form} onSubmit={onSubmit}>
          {/* Decorative accent band. */}
          <Div className="h-16 bg-gradient-to-r from-primary/25 via-primary/10 to-transparent sm:h-20" />
          <Div className="flex flex-col gap-5 px-5 pb-5 sm:px-6 sm:pb-6">
            {profileLoadFailed && (
              <Div className="-mt-2 flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm">
                <Span className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {t("widget.loadState.profileFailed")}
                </Span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(): void => {
                    void refetch();
                  }}
                >
                  {t("widget.loadState.retry")}
                </Button>
              </Div>
            )}
            <Div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <Div className="flex min-w-0 items-end gap-4">
                <Div className="-mt-9 shrink-0 sm:-mt-12">
                  <AvatarUploadButton
                    avatarUrl={liveAvatarUrl ?? profile?.avatarUrl}
                    initials={initials}
                    label={t("widget.changePhoto")}
                    onUploaded={handleAvatarUploaded}
                  />
                </Div>
                <Div className="flex min-w-0 flex-col gap-1 pb-0.5">
                  <Div className="flex flex-wrap items-center gap-2">
                    <H2 className="m-0 truncate border-0 p-0 text-xl font-semibold tracking-tight text-foreground">
                      {displayName ||
                        (profileLoadFailed
                          ? t("widget.loadState.profileFailed")
                          : PENDING_VALUE)}
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

              {!editing && (
                <Div className="flex shrink-0 flex-col-reverse gap-2 sm:flex-row sm:items-center">
                  {profileHref && (
                    <Link
                      href={profileHref}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-input px-3.5 text-sm font-medium text-foreground no-underline transition-colors hover:bg-accent sm:h-10"
                    >
                      <ExternalLink className={iconClass} />
                      {t("widget.viewPublicProfile")}
                    </Link>
                  )}
                  <Button
                    type="button"
                    className="h-11 gap-2 sm:h-10"
                    onClick={handleStartEdit}
                  >
                    <Pencil className={iconClass} />
                    {t("widget.editProfile")}
                  </Button>
                </Div>
              )}
            </Div>
            {/* identity row end */}

            {!editing && (
              <Div className="flex gap-2.5">
                <StatTile
                  icon={<CreditCard className="h-3.5 w-3.5" />}
                  label={t("widget.stats.plan")}
                  value={planLabel}
                  badge={
                    subscription?.status ? (
                      <StatusPill
                        status={subscriptionT(subscription.status)}
                        variant={planActive ? "success" : "warning"}
                      />
                    ) : undefined
                  }
                />
                <StatTile
                  icon={<Zap className="h-3.5 w-3.5" />}
                  label={t("widget.stats.credits")}
                  value={creditsLabel}
                />
                <StatTile
                  icon={<Sparkles className="h-3.5 w-3.5" />}
                  label={t("widget.stats.member")}
                  value={memberSinceLabel}
                />
              </Div>
            )}

            {!editing && profile?.bio && <ProfileBio bio={profile.bio} />}
            {!editing && <ProfileSocialPills profile={profileData} />}
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

      {/* ── SKILLS + PREFERENCES (web/native surfaces only) ── */}
      {(mySkills.length > 0 || showVisualSettings) && (
        <Div className="grid gap-5 @2xl:grid-cols-2">
          {mySkills.length > 0 && (
            <HubSection
              title={t("widget.skills.title")}
              subtitle={t("widget.skills.hubSubtitle", {
                count: mySkills.length,
              })}
            >
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
          {showVisualSettings && <AppearanceSection />}
          {showVisualSettings && <ChatPrefsSection />}
        </Div>
      )}

      {/* ── ACCOUNT ── */}
      <Div className="flex flex-col gap-2.5">
        <Div className="flex flex-col gap-0.5 px-1">
          <H3 className="m-0 border-0 p-0 text-[13px] font-semibold tracking-tight text-foreground">
            {t("widget.sections.account")}
          </H3>
          <Span className="text-xs leading-snug text-muted-foreground">
            {t("widget.sections.accountHint")}
          </Span>
        </Div>
        <HubCard>
          <RowLabel
            label={t("widget.sections.billing")}
            hint={t("widget.sections.billingHint")}
          />
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
                : creditsError
                  ? t("widget.loadState.creditsFailed")
                  : t("widget.loadState.loading")
            }
            onClick={(): void => {
              if (!credits && creditsError) {
                void refetchCredits();
                return;
              }
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

          <RowLabel
            label={t("widget.sections.security")}
            hint={t("widget.sections.securityHint")}
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
            icon={<Mail className={iconClass} />}
            title={t("widget.sections.emailVerification")}
            subtitle={
              profile?.emailVerified
                ? t("widget.sections.emailVerifiedHint")
                : t("widget.sections.emailUnverifiedHint")
            }
            badge={
              <StatusPill
                status={
                  profile?.emailVerified
                    ? t("widget.sections.verified")
                    : t("widget.sections.unverified")
                }
                variant={profile?.emailVerified ? "success" : "warning"}
              />
            }
            onClick={(): void => {
              navigate(verifyEmailDef.POST, {});
            }}
          />
          <HubRow
            icon={<Shield className={iconClass} />}
            title={t("widget.sections.twoFactor")}
            subtitle={t("widget.sections.twoFactorHint")}
            badge={
              <StatusPill
                status={
                  profile?.requireTwoFactor
                    ? t("widget.sections.on")
                    : t("widget.sections.off")
                }
                variant={profile?.requireTwoFactor ? "success" : "warning"}
              />
            }
            onClick={(): void => {
              navigate(twoFactorDef.POST, {});
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

          <RowLabel
            label={t("widget.sections.data")}
            hint={t("widget.sections.dataHint")}
          />
          <HubRow
            icon={<Key className={iconClass} />}
            title={t("widget.sections.apiKeys")}
            subtitle={t("widget.sections.apiKeysHint", {
              modelCount: getAvailableChatModelCount(
                !user.isPublic && user.roles.includes(UserRole.ADMIN),
                availability,
              ),
            })}
            onClick={(): void => {
              navigate(apiKeysDef.GET, {});
            }}
          />
          <HubRow
            icon={<Download className={iconClass} />}
            title={t("widget.sections.exportData")}
            subtitle={t("widget.sections.exportDataHint")}
            onClick={(): void => {
              navigate(exportDef.GET, {});
            }}
          />
        </HubCard>
      </Div>

      {/* ── NEWSLETTER ── */}
      <HubSection
        title={t("widget.newsletter.title")}
        subtitle={t("widget.newsletter.subtitle", {
          bonusCredits: FREE_CREDIT_ALLOWANCE.newsletterBonus,
        })}
      >
        <Div className="p-3.5">
          <NewsletterSubscribeInline
            locale={locale}
            user={user}
            userEmail={profile?.email}
            variant="card"
          />
        </Div>
      </HubSection>

      {/* ── CREATOR ── */}
      <HubSection
        title={t("widget.sections.creator")}
        subtitle={t("widget.sections.creatorHint")}
      >
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
      <HubCard>
        <HubRow
          icon={<LogOut className={iconClass} />}
          title={t("widget.nav.logout")}
          subtitle={t("widget.nav.logoutHint")}
          onClick={handleLogout}
        />
      </HubCard>

      {/* ── DANGER ZONE ── */}
      <Div className="flex flex-col gap-2.5">
        <H3 className="m-0 border-0 px-1 pb-0 pt-0 text-[13px] font-semibold tracking-tight text-destructive">
          {t("widget.deleteAccount.dangerZone")}
        </H3>
        <Div className="flex flex-col gap-4 rounded-2xl border border-destructive/30 bg-destructive/[0.03] p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <Div className="flex items-start gap-3">
            <Span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive sm:flex">
              <AlertTriangle className="h-4 w-4" />
            </Span>
            <Div className="flex flex-col gap-0.5">
              <Span className="text-sm font-medium text-foreground">
                {t("widget.deleteAccount.button")}
              </Span>
              <Span className="text-xs leading-snug text-muted-foreground">
                {t("widget.deleteAccount.dangerDescription")}
              </Span>
            </Div>
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
