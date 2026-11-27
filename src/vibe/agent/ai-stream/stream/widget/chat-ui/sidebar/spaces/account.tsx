"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ArrowLeft } from "next-vibe/ui/components/icons/ArrowLeft";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { ChevronUp } from "next-vibe/ui/components/icons/ChevronUp";
import { Globe } from "next-vibe/ui/components/icons/Globe";
import { Handshake } from "next-vibe/ui/components/icons/Handshake";
import { HelpCircle } from "next-vibe/ui/components/icons/HelpCircle";
import { Key } from "next-vibe/ui/components/icons/Key";
import { LogIn } from "next-vibe/ui/components/icons/LogIn";
import { LogOut } from "next-vibe/ui/components/icons/LogOut";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { Palette } from "next-vibe/ui/components/icons/Palette";
import { Settings } from "next-vibe/ui/components/icons/Settings";
import { Shield } from "next-vibe/ui/components/icons/Shield";
import { ShoppingCart } from "next-vibe/ui/components/icons/ShoppingCart";
import { User } from "next-vibe/ui/components/icons/User";
import { UserPlus } from "next-vibe/ui/components/icons/UserPlus";
import { Link } from "next-vibe/ui/components/link";
import { Progress, ProgressIndicator } from "next-vibe/ui/components/progress";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { Span } from "next-vibe/ui/components/span";
import { addDocumentListener } from "next-vibe/ui/lib/dom";
import type { IconComponent } from "next-vibe/ui/lib/helper";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { type JSX, type ReactNode, useEffect } from "react";

import { scopedTranslation as studio } from "@/_pages/create/i18n";
import { useCredits } from "@/credits/hooks";
import { useNewsletterPromo } from "@/newsletter/hooks";
import { FREE_CREDIT_MAX_TOTAL } from "@/products/constants";
import { useLogout } from "@/user/private/logout/hooks";
import { useUser } from "@/user/private/me/hooks";

import { useChatBootContext } from "../../../../../../chat/hooks/context";
import { scopedTranslation as threads } from "../../../../../../chat/threads/widget/i18n";
import { TOUR_DATA_ATTRS } from "../../data-attrs";
import { scopedTranslation } from "./i18n";

export interface SidebarAccountProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  logger: EndpointLogger;
}

type CreditLevel = "pending" | "depleted" | "low" | "part" | "ample";

interface CreditState {
  /** 0..100, null while loading. Never the balance itself. */
  percent: number | null;
  /** Fill color: app primary, warning when low, destructive when empty. */
  fill: string;
  /** "Credits, plenty left" for screen readers and titles. */
  label: string;
  levelText: string;
  /** Tinted track in the fill's own hue. */
  track: string;
  /** True when the person should top up now. */
  warn: boolean;
}

function useCreditState({
  user,
  logger,
  locale,
}: SidebarAccountProps): CreditState {
  const { initialCredits } = useChatBootContext();
  const response = useCredits(user, logger, initialCredits)?.read?.response;
  const credits = response?.success ? response.data : initialCredits;
  const { t } = scopedTranslation.scopedT(locale);
  const fraction = credits
    ? Math.max(0, Math.min(1, credits.total / Math.max(1, credits.capacity)))
    : null;
  const level: CreditLevel =
    fraction === null
      ? "pending"
      : fraction === 0
        ? "depleted"
        : fraction <= 0.2
          ? "low"
          : fraction <= 0.6
            ? "part"
            : "ample";
  return {
    percent: fraction === null ? null : Math.max(fraction * 100, 3),
    fill:
      level === "depleted"
        ? "bg-destructive"
        : level === "low"
          ? "bg-warning"
          : "bg-primary",
    label: `${t("credits")}, ${t(level)}`,
    levelText: t(level),
    warn: level === "low" || level === "depleted",
    track:
      level === "depleted"
        ? "bg-destructive/15"
        : level === "low"
          ? "bg-warning/20"
          : "bg-primary/20",
  };
}

/** Credit meter with a localized status for assistive technology. */
function CreditBar({
  state,
  className,
}: {
  state: CreditState;
  className?: string;
}): JSX.Element {
  return (
    <Progress
      value={state.percent}
      getValueLabel={() => state.levelText}
      aria-label={state.label}
      className={cn("h-1.5 rounded-full", state.track, className)}
    >
      <ProgressIndicator
        value={state.percent}
        className={cn("rounded-[inherit] duration-500", state.fill)}
      />
    </Progress>
  );
}

interface Destination {
  path: string;
  label: string;
  icon: IconComponent;
}

interface DestinationGroups {
  account: Destination[];
  explore: Destination[];
  admin: Destination[];
}

function useDestinations({
  locale,
  user,
}: SidebarAccountProps): DestinationGroups {
  const { t } = threads.scopedT(locale);
  const newsletter = useNewsletterPromo(user).state === "none";
  return {
    account: [
      ...(user.isPublic
        ? []
        : [
            {
              path: "user/settings",
              label: t("components.navigation.settings"),
              icon: Settings,
            },
          ]),
      {
        path: "subscription/overview",
        label: t("components.navigation.subscription"),
        icon: ShoppingCart,
      },
      {
        path: "user/referral",
        label: t("components.navigation.partnerDashboard"),
        icon: Handshake,
      },
      {
        path: user.isPublic ? "docs/api" : "user/api-keys",
        label: t("components.navigation.apiKeys"),
        icon: Key,
      },
    ],
    explore: [
      {
        path: "create",
        label: studio.scopedT(locale).t("navName"),
        icon: Palette,
      },
      {
        path: "help",
        label: t("components.navigation.help"),
        icon: HelpCircle,
      },
      {
        path: "story",
        label: scopedTranslation.scopedT(locale).t("websiteBlog"),
        icon: Globe,
      },
      ...(newsletter
        ? [
            {
              path: "story/newsletter",
              label: t("components.navigation.newsletter", {
                freeCreditsMax: FREE_CREDIT_MAX_TOTAL,
              }),
              icon: Mail,
            },
          ]
        : []),
    ],
    admin:
      !user.isPublic && user.roles.includes(UserRole.ADMIN)
        ? [
            {
              path: "tools",
              label: t("components.navigation.admin"),
              icon: Shield,
            },
          ]
        : [],
  };
}

function GroupLabel({ children }: { children: ReactNode }): JSX.Element {
  return (
    <Span className="block px-2.5 pb-1 pt-3 text-xs font-medium text-muted-foreground">
      {children}
    </Span>
  );
}

/** Login + signup pair for guests, same buttons as the committed footer. */
function GuestActions({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { t } = threads.scopedT(locale);
  return (
    <Div
      className="grid grid-cols-2 gap-2"
      data-tour={TOUR_DATA_ATTRS.SIDEBAR_LOGIN}
    >
      <Button asChild variant="outline" size="sm">
        <Link href={`/${locale}/user/login`}>
          <LogIn className="size-3.5" />
          {t("components.sidebar.login")}
        </Link>
      </Button>
      <Button asChild size="sm">
        <Link href={`/${locale}/user/signup`}>
          <UserPlus className="size-3.5" />
          {t("components.sidebar.signup")}
        </Link>
      </Button>
    </Div>
  );
}

function LogoutRow(props: SidebarAccountProps): JSX.Element | null {
  const logout = useLogout(props.logger, props.user);
  if (props.user.isPublic) {
    return null;
  }
  return (
    <Button
      variant="ghost"
      size="unset"
      className={cn(compactRow, "w-full justify-start font-normal")}
      onClick={logout}
    >
      <LogOut />
      {threads.scopedT(props.locale).t("components.sidebar.logout")}
    </Button>
  );
}

interface Identity {
  name: string;
  detail: string;
  initial: string | null;
  /** Signed in, profile still loading: render placeholders, not a fallback. */
  loading: boolean;
}

/** Who is signed in: profile name + email, or "Guest" for visitors. */
function useIdentity({ user, logger, locale }: SidebarAccountProps): Identity {
  const { t } = scopedTranslation.scopedT(locale);
  const profile = useUser(user, logger).user;
  if (user.isPublic) {
    return {
      name: t("guest"),
      detail: t("notSignedIn"),
      initial: null,
      loading: false,
    };
  }
  const name = profile?.privateName || profile?.publicName || t("account");
  return {
    name,
    detail: profile?.email ?? "",
    initial: profile ? name.charAt(0).toUpperCase() : null,
    loading: !profile,
  };
}

function Avatar({
  user,
  identity,
  className,
}: {
  user: JwtPayloadType;
  identity: Identity;
  className?: string;
}): JSX.Element {
  return (
    <Span
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold [&_svg]:size-4",
        user.isPublic
          ? "bg-muted text-muted-foreground ring-1 ring-border"
          : "bg-primary text-primary-foreground",
        className,
      )}
    >
      {identity.initial ?? <User />}
    </Span>
  );
}

function IdentityLines({
  identity,
  className,
}: {
  identity: Identity;
  className?: string;
}): JSX.Element {
  return (
    <Span className={cn("flex min-w-0 flex-col", className)}>
      {identity.loading ? (
        <>
          <Skeleton className="my-0.5 h-3.5 w-24" />
          <Skeleton className="my-0.5 h-3 w-32" />
        </>
      ) : (
        <Span className="truncate text-sm font-semibold text-foreground">
          {identity.name}
        </Span>
      )}
      {!identity.loading && identity.detail && (
        <Span className="truncate text-xs font-normal text-muted-foreground">
          {identity.detail}
        </Span>
      )}
    </Span>
  );
}

const compactRow =
  "flex min-h-9 items-center gap-3 rounded-md px-2.5 text-sm text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground";

function CompactLinks({
  locale,
  items,
  onNavigate,
}: {
  locale: CountryLanguage;
  items: Destination[];
  onNavigate: () => void;
}): JSX.Element {
  return (
    <Div className="flex flex-col">
      {items.map(({ path, label, icon: Glyph }) => (
        <Link
          className={compactRow}
          key={path}
          href={`/${locale}/${path}`}
          onClick={onNavigate}
          data-tour={
            path === "subscription/overview"
              ? TOUR_DATA_ATTRS.SUBSCRIPTION_BUTTON
              : undefined
          }
        >
          <Glyph />
          <Span className="min-w-0 py-1.5 leading-snug">{label}</Span>
        </Link>
      ))}
    </Div>
  );
}

export function AccountDock({
  open,
  onOpenChange,
  ...props
}: SidebarAccountProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}): JSX.Element {
  const { locale, user } = props;
  const { t } = scopedTranslation.scopedT(locale);
  const credits = useCreditState(props);
  const identity = useIdentity(props);
  const short = t(user.isPublic ? "guest" : "account");
  useEffect(
    () =>
      addDocumentListener("keydown", (event) => {
        if (event.key === "Escape") {
          onOpenChange(false);
          return;
        }
        if (
          (event.metaKey || event.ctrlKey) &&
          event.key.toLowerCase() === "k" &&
          !event.defaultPrevented
        ) {
          event.preventDefault();
          onOpenChange(!open);
        }
      }),
    [open, onOpenChange],
  );
  return (
    <Div className="flex items-stretch gap-1.5 px-2">
      <Button
        variant="ghost"
        size="unset"
        aria-expanded={open}
        aria-label={`${short}. ${credits.label}`}
        onClick={() => onOpenChange(!open)}
        className={cn(
          "flex min-h-12 min-w-0 flex-1 items-center justify-start gap-2.5 rounded-xl border border-border px-2 text-left hover:bg-accent",
          open ? "bg-accent" : "bg-card",
        )}
      >
        <Avatar user={user} identity={identity} />
        <Span className="flex min-w-0 flex-1 flex-col gap-1.5">
          {identity.loading ? (
            <Skeleton className="h-3.5 w-24" />
          ) : (
            <Span className="truncate text-sm font-semibold">
              {identity.name}
            </Span>
          )}
          {!open && <CreditBar state={credits} className="min-w-8" />}
        </Span>
        <ChevronUp
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </Button>
      {user.isPublic ? (
        <Button
          asChild
          size="unset"
          className="shrink-0 flex-col gap-0.5 rounded-xl px-3 text-[11px] font-medium"
        >
          <Link href={`/${locale}/user/signup`}>
            <UserPlus className="size-4" />
            {threads.scopedT(locale).t("components.sidebar.signup")}
          </Link>
        </Button>
      ) : (
        <Button
          asChild
          variant="ghost"
          size="unset"
          className="w-14 shrink-0 flex-col gap-0.5 rounded-xl border border-border bg-card text-[10px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <Link href={`/${locale}/create`}>
            <Palette className="size-4" />
            {studio.scopedT(locale).t("navName")}
          </Link>
        </Button>
      )}
    </Div>
  );
}

export function AccountPanel({
  onClose,
  ...props
}: SidebarAccountProps & { onClose: () => void }): JSX.Element {
  const { locale, user } = props;
  const { t } = scopedTranslation.scopedT(locale);
  const credits = useCreditState(props);
  const identity = useIdentity(props);
  const groups = useDestinations(props);
  return (
    <Div className="flex min-h-0 flex-1 flex-col border-t border-border">
      <Div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-2 py-1.5">
        <Button
          variant="ghost"
          size="unset"
          onClick={onClose}
          className="mb-1 h-10 w-full justify-start gap-2 rounded-md border-b border-border px-2 text-sm font-semibold text-foreground"
        >
          <ArrowLeft className="size-4" />
          {t("chats")}
        </Button>
        <Div className="flex items-center gap-2.5 px-1.5 py-1.5">
          <Avatar user={user} identity={identity} />
          <IdentityLines identity={identity} className="flex-1" />
        </Div>
        {user.isPublic && (
          <Div className="px-1.5 pb-2 pt-1">
            <Span className="mb-2 block text-xs text-muted-foreground">
              {t("guestPitch")}
            </Span>
            <GuestActions locale={locale} />
          </Div>
        )}
        <Link
          href={`/${locale}/subscription/overview`}
          onClick={onClose}
          title={credits.label}
          className="mx-1 mt-1 block rounded-lg border border-border bg-background px-3 py-2.5 hover:bg-accent"
        >
          <CreditBar state={credits} />
          {!user.isPublic && (
            <Span className="mt-2 flex items-center gap-1 text-xs font-medium text-primary">
              {t(credits.warn ? "topUpNow" : "topUp")}
              <ChevronRight className="size-3.5" />
            </Span>
          )}
        </Link>
        <GroupLabel>{t("account")}</GroupLabel>
        <CompactLinks
          locale={locale}
          items={groups.account}
          onNavigate={onClose}
        />
        <GroupLabel>{t("explore")}</GroupLabel>
        <CompactLinks
          locale={locale}
          items={user.isPublic ? groups.explore : groups.explore.slice(1)}
          onNavigate={onClose}
        />
        {groups.admin.length > 0 && (
          <>
            <GroupLabel>{t("admin")}</GroupLabel>
            <CompactLinks
              locale={locale}
              items={groups.admin}
              onNavigate={onClose}
            />
          </>
        )}
        {!user.isPublic && (
          <Div className="mt-1 border-t border-border pt-1">
            <LogoutRow {...props} />
          </Div>
        )}
      </Div>
    </Div>
  );
}
