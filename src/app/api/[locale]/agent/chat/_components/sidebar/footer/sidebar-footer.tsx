"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "next-vibe-ui/ui/collapsible";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Coins } from "next-vibe-ui/ui/icons/Coins";
import { Handshake } from "next-vibe-ui/ui/icons/Handshake";
import { HelpCircle } from "next-vibe-ui/ui/icons/HelpCircle";
import { Info } from "next-vibe-ui/ui/icons/Info";
import { ShoppingCart } from "next-vibe-ui/ui/icons/ShoppingCart";
import { User } from "next-vibe-ui/ui/icons/User";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useEffect } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { TOUR_DATA_ATTRS } from "../../../_components/welcome-tour/tour-config";
import { useTourState } from "../../../_components/welcome-tour/tour-state-context";
import { useBottomSheetExpanded } from "../../../hooks/use-bottom-sheet-expanded";
import { UserMenu } from "./user-menu";

interface SidebarFooterProps {
  locale: CountryLanguage;
  credits: {
    total: number;
    free: number;
    expiring: number;
    permanent: number;
    expiresAt?: string | null;
  } | null;
  user: JwtPayloadType | undefined;
  logger: EndpointLogger;
}

export function SidebarFooter({ locale, credits, user, logger }: SidebarFooterProps): JSX.Element {
  const { t } = simpleT(locale);
  const [isExpanded, setIsExpanded] = useBottomSheetExpanded();

  // Tour state - expand when tour needs the footer elements visible
  const tourIsActive = useTourState((state) => state.isActive);
  const tourBottomSheetExpanded = useTourState((state) => state.bottomSheetExpanded);

  // Expand collapsible when tour requests it
  useEffect(() => {
    if (tourIsActive && tourBottomSheetExpanded && !isExpanded) {
      setIsExpanded(true);
    }
  }, [tourIsActive, tourBottomSheetExpanded, isExpanded, setIsExpanded]);

  // Determine if user is logged in
  const isLoggedIn = user && !user.isPublic;

  return (
    <Div className="border-t border-border bg-background">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        {/* Sticky Header: Credits · Account - Always Visible */}
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full min-h-11 px-3 flex flex-row items-center justify-between hover:bg-accent/50 rounded-none border-b border-border/50 transition-all duration-150"
            aria-label={isExpanded ? "Collapse account section" : "Expand account section"}
            suppressHydrationWarning
          >
            <Span className="flex flex-row items-center gap-2 min-w-0 flex-1">
              {/* Credits display */}
              {credits && (
                <>
                  <Coins className="h-4 w-4 text-blue-500 shrink-0" />
                  <Span className="text-sm font-medium truncate" suppressHydrationWarning>
                    {credits.total === 1
                      ? t("app.chat.credits.credit", { count: 1 })
                      : t("app.chat.credits.credits", {
                          count: `${Math.floor(credits.total * 100) / 100}`,
                        })}
                  </Span>
                  <Span className="text-muted-foreground text-sm">•</Span>
                </>
              )}
              {/* Account status */}
              <Span className="flex flex-row items-center gap-1.5 min-w-0">
                <User className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                <Span className="text-sm text-muted-foreground truncate">
                  {isLoggedIn
                    ? t("app.api.agent.chat.components.sidebar.footer.account")
                    : t("app.api.agent.chat.components.sidebar.login")}
                </Span>
              </Span>
            </Span>
            {/* Chevron icon */}
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-150" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-150" />
            )}
          </Button>
        </CollapsibleTrigger>

        {/* Expandable Content with smooth animation */}
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <Div
            className="px-2 py-2 flex flex-col gap-2 bg-muted/20 border-t border-border/50"
            suppressHydrationWarning
          >
            {/* Account Section */}
            <Div className="flex flex-col gap-0.5">
              {/* Login/Profile - Primary action */}
              {!isLoggedIn && (
                <Link href={`/${locale}/user/login`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    data-tour={TOUR_DATA_ATTRS.SIDEBAR_LOGIN}
                    aria-label="Login to your account"
                  >
                    <User className="h-3.5 w-3.5 mr-2" />
                    {t("app.api.agent.chat.components.sidebar.login")}
                  </Button>
                </Link>
              )}

              {/* Subscription */}
              <Link href={`/${locale}/subscription`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-full justify-start"
                  aria-label="Manage subscription"
                  data-tour={TOUR_DATA_ATTRS.SUBSCRIPTION_BUTTON}
                >
                  <ShoppingCart className="h-3.5 w-3.5 mr-2" />
                  {t("app.chat.credits.navigation.subscription")}
                </Button>
              </Link>

              {/* Referral */}
              <Link href={`/${locale}/user/referral`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start "
                  aria-label="Referral program"
                >
                  <Handshake className="h-3.5 w-3.5 mr-2" />
                  {t("app.chat.credits.navigation.referral")}
                </Button>
              </Link>

              {/* Help */}
              <Link href={`/${locale}/help`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  aria-label="Get help"
                >
                  <HelpCircle className="h-3.5 w-3.5 mr-2" />
                  {t("app.chat.credits.navigation.help")}
                </Button>
              </Link>

              {/* About */}
              <Link href={`/${locale}/story`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  aria-label="About us"
                >
                  <Info className="h-3.5 w-3.5 mr-2" />
                  {t("app.chat.credits.navigation.about")}
                </Button>
              </Link>
              {/* Logout */}
              {isLoggedIn && <UserMenu user={user} locale={locale} logger={logger} />}
            </Div>
          </Div>
        </CollapsibleContent>
      </Collapsible>
    </Div>
  );
}
