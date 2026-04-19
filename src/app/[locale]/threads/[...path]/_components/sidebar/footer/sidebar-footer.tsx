"use client";

import { Button } from "next-vibe-ui/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "next-vibe-ui/ui/collapsible";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Globe } from "next-vibe-ui/ui/icons/Globe";
import { HelpCircle } from "next-vibe-ui/ui/icons/HelpCircle";
import { Settings } from "next-vibe-ui/ui/icons/Settings";
import { ShoppingCart } from "next-vibe-ui/ui/icons/ShoppingCart";
import { User } from "next-vibe-ui/ui/icons/User";
import { Link } from "next-vibe-ui/ui/link";
import { Progress, ProgressIndicator } from "next-vibe-ui/ui/progress";
import { Span } from "next-vibe-ui/ui/span";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import type { JSX } from "react";

import { useChatBootContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { scopedTranslation } from "@/app/api/[locale]/agent/chat/threads/widget/i18n";
import { useCredits } from "@/app/api/[locale]/credits/hooks";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { useSidebarFooterStore } from "../../welcome-tour/sidebar-footer-store";
import { TOUR_DATA_ATTRS } from "../../welcome-tour/tour-config";
import { UserMenu } from "./user-menu";

interface SidebarFooterProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  logger: EndpointLogger;
}

export function SidebarFooter({
  locale,
  user,
  logger,
}: SidebarFooterProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { initialCredits } = useChatBootContext();

  const creditsEndpoint = useCredits(user, logger, initialCredits);
  const credits = creditsEndpoint?.read?.response?.success
    ? creditsEndpoint.read.response.data
    : initialCredits;

  // Bottom sheet expanded state
  const isExpanded = useSidebarFooterStore(
    (state) => state.isBottomSheetExpanded,
  );
  const setIsExpanded = useSidebarFooterStore(
    (state) => state.setBottomSheetExpanded,
  );

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
            aria-label={
              isExpanded ? "Collapse account section" : "Expand account section"
            }
            suppressHydrationWarning
          >
            <Span className="flex flex-row items-center gap-2 min-w-0 flex-1">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              {/* Credits label + bar */}
              {credits
                ? (() => {
                    const max =
                      credits.expiring > 0
                        ? 800
                        : credits.free > 0
                          ? 20
                          : Math.max(credits.total, 1);
                    const pct = Math.min(credits.total / max, 1) * 100;
                    const indicatorColor =
                      pct > 50
                        ? "bg-green-500"
                        : pct > 20
                          ? "bg-amber-500"
                          : "bg-destructive";
                    const tooltipLabel =
                      credits.total === 1
                        ? t("components.credits.credit", { count: 1 })
                        : t("components.credits.credits", {
                            count: `${Math.floor(credits.total * 100) / 100}`,
                          });
                    return (
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Span className="flex flex-row items-center gap-1.5 min-w-0 flex-1">
                              <Span className="text-xs text-muted-foreground shrink-0">
                                {t("components.credits.label")}
                              </Span>
                              <Progress
                                className="h-1.5 flex-1 min-w-0"
                                value={pct}
                              >
                                <ProgressIndicator
                                  value={pct}
                                  className={indicatorColor}
                                />
                              </Progress>
                            </Span>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            {tooltipLabel}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })()
                : null}
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
        <CollapsibleContent
          className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
          suppressHydrationWarning
        >
          <Div className="px-2 py-2 flex flex-col gap-2 bg-muted/20 border-t border-border/50">
            <Div className="flex flex-col gap-0.5">
              {/* Login/Signup - shown when logged out */}
              {!isLoggedIn && (
                <Div
                  className="flex flex-row gap-1.5 py-1"
                  data-tour={TOUR_DATA_ATTRS.SIDEBAR_LOGIN}
                >
                  <Link href={`/${locale}/user/login`} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      aria-label="Login to your account"
                    >
                      <User className="h-3.5 w-3.5 mr-1.5" />
                      {t("components.sidebar.login")}
                    </Button>
                  </Link>
                  <Link href={`/${locale}/user/signup`} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      aria-label="Create an account"
                    >
                      <User className="h-3.5 w-3.5 mr-1.5" />
                      {t("components.sidebar.signup")}
                    </Button>
                  </Link>
                </Div>
              )}

              {/* Account Settings */}
              {isLoggedIn && (
                <Link href={`/${locale}/user/settings`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    aria-label="Account settings"
                  >
                    <Settings className="h-3.5 w-3.5 mr-2" />
                    {t("components.navigation.settings")}
                  </Button>
                </Link>
              )}

              {/* Subscription */}
              <Link href={`/${locale}/subscription/overview`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-full justify-start"
                  aria-label="Manage subscription"
                  data-tour={TOUR_DATA_ATTRS.SUBSCRIPTION_BUTTON}
                >
                  <ShoppingCart className="h-3.5 w-3.5 mr-2" />
                  {t("components.navigation.subscription")}
                </Button>
              </Link>

              {/* Feedback & Help */}
              <Link href={`/${locale}/help`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  aria-label="Feedback and help"
                >
                  <HelpCircle className="h-3.5 w-3.5 mr-2" />
                  {t("components.navigation.help")}
                </Button>
              </Link>

              {/* Website & Blog */}
              <Link href={`/${locale}/story`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  aria-label="Website and blog"
                >
                  <Globe className="h-3.5 w-3.5 mr-2" />
                  {t("components.navigation.websiteBlog")}
                </Button>
              </Link>

              {/* Admin Dashboard */}
              {isLoggedIn && user.roles?.includes(UserRole.ADMIN) && (
                <Link href={`/${locale}/admin`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    aria-label="Admin dashboard"
                  >
                    <Settings className="h-3.5 w-3.5 mr-2" />
                    {t("components.navigation.admin")}
                  </Button>
                </Link>
              )}

              {/* Logout */}
              {isLoggedIn && (
                <UserMenu user={user} locale={locale} logger={logger} />
              )}
            </Div>
          </Div>
        </CollapsibleContent>
      </Collapsible>
    </Div>
  );
}
