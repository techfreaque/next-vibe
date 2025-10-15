import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn } from "next-vibe/shared/utils/utils";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
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
  homePathName: "" | "/app/onboarding" | "/app/dashboard";
  navigationItems: NavItemType[];
}

export function Navbar({
  user,
  locale,
  isOnboardingComplete,
  homePathName,
  navigationItems,
}: NavbarProps): JSX.Element {
  const { t } = simpleT(locale);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        "bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm",
      )}
    >
      <div className="container flex h-16 md:h-20 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <Logo locale={locale} pathName={homePathName} />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 xl:gap-4">
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
                          <div key={childItem.title} className="relative">
                            <DropdownMenuItem
                              className="flex items-center gap-2 opacity-50 cursor-not-allowed"
                              disabled
                            >
                              {childItem.icon}
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  {t(childItem.title)}
                                  {badge && (
                                    <span
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
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {t(childItem.description)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {t(disabledReason)}
                                </p>
                              </div>
                            </DropdownMenuItem>
                          </div>
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
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                {t(childItem.title)}
                                {badge && (
                                  <span
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
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {t(childItem.description)}
                              </p>
                            </div>
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
        </nav>

        <div className="flex items-center gap-2">
          {/* Notifications - only show when user is logged in */}
          {/* {user && <Notifications locale={locale} user={user} />} */}

          {/* Theme toggle only visible on desktop */}
          <div className="hidden md:block">
            <ThemeToggle locale={locale} />
          </div>

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
              <div className="block lg:hidden">
                <MobileAuthButtons locale={locale} />
              </div>

              {/* Desktop auth buttons */}
              <div className="hidden lg:block">
                <AuthButtons locale={locale} />
              </div>
            </>
          )}

          <MobileMenuClient locale={locale} navigationItems={navigationItems} />
        </div>
      </div>
    </header>
  );
}
