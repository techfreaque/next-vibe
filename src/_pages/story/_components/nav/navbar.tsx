import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { StandardUserType } from "next-vibe/identity/user/types";
import { Div } from "next-vibe/ui/components/div";
import { Nav } from "next-vibe/ui/components/nav";
import type { JSX } from "react";

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
  totalModelCount: number;
  hideUserMenu?: boolean;
}

export function Navbar({
  user,
  userProfile,
  locale,
  hasSubscription,
  navigationItems,
  totalModelCount,
  hideUserMenu = false,
}: NavbarProps): JSX.Element {
  return (
    <Div className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70">
      <Div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        {/* Logo */}
        <Div className="flex items-center gap-2 shrink-0">
          <Logo locale={locale} pathName="" />
        </Div>

        {/* Desktop Navigation - overflow-aware, hidden on mobile */}
        <Nav className="hidden md:flex flex-1 min-w-0 mx-4">
          <OverflowNav
            navigationItems={navigationItems}
            locale={locale}
            totalModelCount={totalModelCount}
          />
        </Nav>

        {/* Right side controls */}
        <Div className="flex items-center gap-2 shrink-0">
          {/* Theme toggle only visible on desktop */}
          <Div className="hidden md:block">
            <ThemeToggle locale={locale} />
          </Div>

          <CountrySelector isNavBar user={user} />

          {/* Auth buttons display logic */}
          {!hideUserMenu && (
            <>
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
            </>
          )}

          {/* Mobile hamburger menu */}
          <MobileMenuClient locale={locale} navigationItems={navigationItems} />
        </Div>
      </Div>
    </Div>
  );
}
