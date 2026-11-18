"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronDown } from "next-vibe/ui/components/icons/ChevronDown";
import { Coins } from "next-vibe/ui/components/icons/Coins";
import { Globe } from "next-vibe/ui/components/icons/Globe";
import { Handshake } from "next-vibe/ui/components/icons/Handshake";
import { HelpCircle } from "next-vibe/ui/components/icons/HelpCircle";
import { Key } from "next-vibe/ui/components/icons/Key";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { Settings } from "next-vibe/ui/components/icons/Settings";
import { Shield } from "next-vibe/ui/components/icons/Shield";
import { User } from "next-vibe/ui/components/icons/User";
import { Link } from "next-vibe/ui/components/link";
import { Progress } from "next-vibe/ui/components/progress";
import { Span } from "next-vibe/ui/components/span";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX } from "react";

import { useCredits } from "@/credits/hooks";
import { useNewsletterPromo } from "@/newsletter/hooks";

import { useChatBootContext } from "../../../../../../chat/hooks/context";
import { scopedTranslation as threads } from "../../../../../../chat/threads/widget/i18n";
import { TOUR_DATA_ATTRS } from "../../data-attrs";
import { UserMenu } from "../footer/user-menu";
import { scopedTranslation } from "./i18n";
import type { SidebarVariant } from "./selection";

export interface SidebarAccountProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  logger: EndpointLogger;
}

export function AccountLinks({
  locale,
  user,
  logger,
}: SidebarAccountProps): JSX.Element {
  const { t } = threads.scopedT(locale);
  const preview = scopedTranslation.scopedT(locale).t;
  const newsletter = useNewsletterPromo(user);
  const row =
    "flex min-h-11 sm:min-h-10 items-center gap-3 rounded-lg px-2.5 py-1.5 text-sm leading-tight hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground";
  return (
    <Div className="flex flex-col gap-0.5">
      {user.isPublic ? (
        <Div
          className="mb-2 flex gap-2"
          data-tour={TOUR_DATA_ATTRS.SIDEBAR_LOGIN}
        >
          <Link
            className="flex min-h-11 sm:min-h-10 flex-1 items-center justify-center rounded-lg border border-border bg-background text-sm font-medium hover:bg-accent"
            href={`/${locale}/user/login`}
          >
            {t("components.sidebar.login")}
          </Link>
          <Link
            className="flex min-h-11 sm:min-h-10 flex-1 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90"
            href={`/${locale}/user/signup`}
          >
            {t("components.sidebar.signup")}
          </Link>
        </Div>
      ) : (
        <Link className={row} href={`/${locale}/user/settings`}>
          <Settings />
          {t("components.navigation.settings")}
        </Link>
      )}
      <Link className={row} href={`/${locale}/subscription/overview`}>
        <Coins />
        {t("components.navigation.subscription")}
      </Link>
      <Link className={row} href={`/${locale}/user/referral`}>
        <Handshake />
        {t("components.navigation.partnerDashboard")}
      </Link>
      <Link className={row} href={`/${locale}/user/api-keys`}>
        <Key />
        {t("components.navigation.apiKeys")}
      </Link>
      <Div className="my-1.5 border-t border-border" />
      <Link className={row} href={`/${locale}/help`}>
        <HelpCircle />
        {t("components.navigation.help")}
      </Link>
      <Link className={row} href={`/${locale}/story`}>
        <Globe />
        {preview("websiteBlog")}
      </Link>
      {newsletter.state === "none" && (
        <Link className={row} href={`/${locale}/story/newsletter`}>
          <Mail />
          {preview("newsletter")}
        </Link>
      )}
      {!user.isPublic && user.roles.includes(UserRole.ADMIN) && (
        <Link className={row} href={`/${locale}/tools`}>
          <Shield />
          {t("components.navigation.admin")}
        </Link>
      )}
      {!user.isPublic && (
        <UserMenu user={user} locale={locale} logger={logger} />
      )}
    </Div>
  );
}

export function AccountSummary({
  locale,
  user,
  logger,
  variant,
  open,
  onToggle,
}: SidebarAccountProps & {
  variant: SidebarVariant;
  open: boolean;
  onToggle: () => void;
}): JSX.Element {
  const { initialCredits } = useChatBootContext();
  const response = useCredits(user, logger, initialCredits)?.read?.response;
  const credits = response?.success ? response.data : initialCredits;
  const { t } = scopedTranslation.scopedT(locale);
  const label = threads.scopedT(locale).t;
  const balance =
    credits &&
    new Intl.NumberFormat(locale.split("-")[0], {
      maximumFractionDigits: 2,
    }).format(credits.total);
  const value =
    credits &&
    Math.min(
      100,
      Math.max(0, (credits.total / Math.max(1, credits.capacity)) * 100),
    );

  if (variant === "B") {
    return (
      <Link
        href={`/${locale}/subscription/overview`}
        className="flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm hover:bg-accent"
      >
        <Coins className="size-4 text-primary" />
        <Span className="flex-1">{t("balance")}</Span>
        <Span className="font-semibold tabular-nums">{balance}</Span>
      </Link>
    );
  }

  if (variant === "C") {
    return (
      <Div className="flex items-center gap-1 rounded-xl border border-primary/20 bg-primary/5 p-1.5">
        <Button
          variant="ghost"
          size="unset"
          className="min-h-11 shrink-0 gap-1.5 rounded-lg px-2 text-sm font-semibold"
          aria-expanded={open}
          onClick={onToggle}
        >
          <User className="size-4 text-primary" />
          {t("account")}
          <ChevronDown
            className={cn("size-3 text-muted-foreground", open && "rotate-180")}
          />
        </Button>
        <Link
          href={`/${locale}/subscription/overview`}
          className="flex min-h-11 min-w-0 flex-1 flex-col justify-center gap-1.5 rounded-r-lg border-l border-primary/15 px-2.5 hover:bg-primary/5"
        >
          <Span className="flex flex-wrap items-baseline justify-between gap-x-1.5 text-xs">
            <Span>{t("balance")}</Span>
            <Span className="font-semibold tabular-nums">{balance}</Span>
          </Span>
          {value !== undefined && value !== null && (
            <Progress className="h-1" value={value} />
          )}
        </Link>
      </Div>
    );
  }
  return (
    <Div className="rounded-xl border border-border bg-card">
      <Button
        variant="ghost"
        size="unset"
        onClick={onToggle}
        aria-expanded={open}
        className="min-h-12 w-full justify-start gap-2.5 rounded-xl px-3 py-2"
      >
        <Span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User className="size-4" />
        </Span>
        <Span className="min-w-0 flex-1 text-left font-semibold">
          {t("account")}
        </Span>
        {balance && (
          <Span className="text-xs font-medium tabular-nums text-muted-foreground">
            {label(
              credits?.total === 1
                ? "components.credits.credit"
                : "components.credits.credits",
              { count: balance },
            )}
          </Span>
        )}
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground",
            !open && "rotate-180",
          )}
        />
      </Button>
    </Div>
  );
}
