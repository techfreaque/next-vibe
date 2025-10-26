import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { cn } from "next-vibe/shared/utils";
import {
  Div,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  P,
  Span,
} from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { ChevronDown } from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import { TooltipProvider } from "next-vibe-ui/ui/tooltip";
import type { JSX } from "react";

import type { StandardUserType } from "@/app/api/[locale]/v1/core/user/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import CountrySelector from "../country-selector";
import { AuthButtons, MobileAuthButtons } from "./auth-buttons";
import { Logo } from "./logo";
import { MobileMenuClient } from "./mobile-menu-client";
import type { NavItemType } from "./nav-constants";
import { NavSingleItem } from "./nav-single-item";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

interface NavbarProps {
  user: StandardUserType | undefined;
  locale: CountryLanguage;
  isOnboardingComplete: boolean;
  navigationItems: NavItemType[];
}

export function Navbar({
  user,
  locale,
  isOnboardingComplete,
  navigationItems,
}: NavbarProps): JSX.Element {
  const { t } = simpleT(locale);

  return (
    <Div
      role="banner"
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        "bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm",
      )}
    >
      <Div className="container flex h-16 md:h-20 items-center justify-between px-4 lg:px-6">
        <Div className="flex items-center gap-2">
          <Logo locale={locale} pathName="" />
        </Div>

        {/* Desktop Navigation */}
        <Div
          role="navigation"
          className="hidden md:flex items-center gap-1 xl:gap-4"
        >
          <TooltipProvider>
            {navigationItems.map((item) => {
              return item.children ? (
                <DropdownMenu key={item.title}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="px-2 py-3 text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5"
                    >
                      {item.icon}
                      {t(item.title)}
                      <ChevronDown className="h-4 w-4 ml-0.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-72 bg-white dark:bg-gray-900 shadow-md border rounded-md"
                  >
                    {item.children.map((childItem) => {
                      const isDisabled = childItem.disabled;
                      const disabledReason = childItem.disabledReason;
                      const badge = childItem.badge;
                      const badgeTranslationPayload =
                        childItem.badgeTranslationPayload;
                      const badgeVariant = childItem.badgeVariant;

                      if (isDisabled && disabledReason) {
                        return (
                          <Div key={childItem.title} className="relative">
                            <DropdownMenuItem
                              className="flex items-center gap-2 opacity-50 cursor-not-allowed"
                              disabled
                            >
                              {childItem.icon}
                              <Div className="flex-1">
                                <Div className="flex items-center gap-2">
                                  {t(childItem.title)}
                                  {badge && (
                                    <Span
                                      className={cn(
                                        "px-2 py-0.5 text-xs rounded",
                                        badgeVariant === "destructive"
                                          ? "bg-destructive text-destructive-foreground"
                                          : badgeVariant === "outline"
                                            ? "border border-border text-foreground"
                                            : "bg-secondary text-secondary-foreground",
                                      )}
                                    >
                                      {typeof badge === "string" &&
                                      badge.includes(".")
                                        ? t(badge, badgeTranslationPayload)
                                        : badge}
                                    </Span>
                                  )}
                                </Div>
                                <P className="text-xs text-gray-500 dark:text-gray-400">
                                  {t(childItem.description)}
                                </P>
                                <P className="text-xs text-muted-foreground mt-1">
                                  {t(disabledReason)}
                                </P>
                              </Div>
                            </DropdownMenuItem>
                          </Div>
                        );
                      }

                      return (
                        <Link
                          key={childItem.title}
                          href={`/${locale}${childItem.href}`}
                          className="w-full font-medium"
                        >
                          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                            {childItem.icon}
                            <Div className="flex-1">
                              <Div className="flex items-center gap-2">
                                {t(childItem.title)}
                                {badge && (
                                  <Span
                                    className={cn(
                                      "px-2 py-0.5 text-xs rounded",
                                      badgeVariant === "destructive"
                                        ? "bg-destructive text-destructive-foreground"
                                        : badgeVariant === "outline"
                                          ? "border border-border text-foreground"
                                          : "bg-secondary text-secondary-foreground",
                                    )}
                                  >
                                    {typeof badge === "string" &&
                                    badge.includes(".")
                                      ? t(badge)
                                      : badge}
                                  </Span>
                                )}
                              </Div>
                              <P className="text-xs text-gray-500 dark:text-gray-400">
                                {t(childItem.description)}
                              </P>
                            </Div>
                          </DropdownMenuItem>
                        </Link>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <NavSingleItem
                  key={item.title}
                  locale={locale}
                  href={item.href}
                  icon={item.icon}
                  title={item.title}
                  badge={item.badge}
                  badgeVariant={item.badgeVariant}
                  isActive={item.isActive}
                  disabled={item.disabled}
                  disabledReason={item.disabledReason}
                />
              );
            })}
          </TooltipProvider>
        </Div>

        <Div className="flex items-center gap-2">
          {/* Notifications - only show when user is logged in */}
          {/* {user && <Notifications locale={locale} user={user} />} */}

          {/* Theme toggle only visible on desktop */}
          <Div className="hidden md:block">
            <ThemeToggle locale={locale} />
          </Div>

          <CountrySelector isNavBar locale={locale} />

          {/* Auth buttons display logic */}
          {user ? (
            <UserMenu
              user={user}
              locale={locale}
              isOnboardingComplete={isOnboardingComplete}
            />
          ) : (
            <>
              {/* Mobile auth button (showing signup) */}
              <Div className="block lg:hidden">
                <MobileAuthButtons locale={locale} />
              </Div>

              {/* Desktop auth buttons */}
              <Div className="hidden lg:block">
                <AuthButtons locale={locale} />
              </Div>
            </>
          )}

          <MobileMenuClient locale={locale} navigationItems={navigationItems} />
        </Div>
      </Div>
    </Div>
  );
}
