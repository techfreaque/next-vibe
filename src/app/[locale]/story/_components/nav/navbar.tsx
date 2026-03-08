import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { StandardUserType } from "@/app/api/[locale]/user/types";
import type { CountryLanguage } from "@/i18n/core/config";

import CountrySelector from "../../../_components/country-selector";
import { Logo } from "../../../_components/logo";
import { ThemeToggle } from "../../../_components/theme-toggle";
import { AuthButtons } from "./auth-buttons";
import { MobileMenuClient } from "./mobile-menu-client";
import type { NavItemType } from "./nav-constants";
import { OverflowNav } from "./overflow-nav";
import { UserMenu } from "./user-menu";

interface NavbarProps {
  user: JwtPayloadType;
  userProfile: StandardUserType | undefined;
  locale: CountryLanguage;
  hasSubscription: boolean;
  navigationItems: NavItemType[];
}

export function Navbar({
  user,
  userProfile,
  locale,
  hasSubscription,
  navigationItems,
}: NavbarProps): JSX.Element {
  return (
    <Div className="sticky top-0 z-50 w-full transition-all duration-300 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm">
      <Div className="container flex h-16 md:h-20 items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <Div className="flex items-center gap-2 shrink-0">
          <Logo locale={locale} pathName="" />
        </Div>

        {/* Desktop Navigation — overflow-aware, hidden on mobile */}
        <Div role="navigation" className="hidden md:flex flex-1 min-w-0 mx-4">
          <OverflowNav navigationItems={navigationItems} locale={locale} />
        </Div>

        {/* Right side controls */}
        <Div className="flex items-center gap-2 shrink-0">
          {/* Theme toggle only visible on desktop */}
          <Div className="hidden md:block">
            <ThemeToggle locale={locale} />
          </Div>

          <CountrySelector isNavBar locale={locale} user={user} />

          {/* Auth buttons display logic */}
          {!user.isPublic ? (
            <UserMenu
              user={user}
              userProfile={userProfile}
              locale={locale}
              hasSubscription={hasSubscription}
            />
          ) : (
            <AuthButtons locale={locale} />
          )}

          {/* Mobile hamburger menu */}
          <MobileMenuClient locale={locale} navigationItems={navigationItems} />
        </Div>
      </Div>
    </Div>
  );
}
