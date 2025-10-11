import { Settings, Shield } from "lucide-react";
import type { JSX, ReactNode } from "react";
import { useMemo } from "react";

import type { CompleteUserType } from "@/app/api/[locale]/v1/core/user/schema";
import type { OnboardingStatusResponseType } from "@/app/api/[locale]/v1/onboarding/schema";
import type { CountryLanguage } from "@/i18n/core/config";

import type { NavItemType } from "../../_components/nav/nav-constants";
import { Navbar } from "../../_components/nav/navbar";

interface AppLayoutClientProps {
  locale: CountryLanguage;
  user: CompleteUserType;
  children: ReactNode;
  onboardingStatus?: OnboardingStatusResponseType | null;
  isAdmin: boolean;
}

export function AppLayoutClient({
  locale,
  user,
  children,
  onboardingStatus,
  isAdmin,
}: AppLayoutClientProps): JSX.Element {
  const onboardingIsComplete = onboardingStatus?.isCompleted ?? false;

  // Memoize individual icons to prevent re-creation
  // const homeIcon = useMemo(() => <Home className="h-5 w-5" />, []);
  const settingsIcon = useMemo(() => <Settings className="h-5 w-5" />, []);
  const adminIcon = useMemo(() => <Shield className="h-5 w-5" />, []);
  // const briefcaseIcon = useMemo(() => <Briefcase className="h-5 w-5" />, []);
  // const userIcon = useMemo(() => <User className="h-5 w-5" />, []);
  // const usersIcon = useMemo(() => <Users className="h-4 w-4" />, []);
  // const calendarIcon = useMemo(() => <Calendar className="h-4 w-4" />, []);
  // const barChart3Icon = useMemo(() => <BarChart3 className="h-4 w-4" />, []);
  // const creditCardIcon = useMemo(() => <CreditCard className="h-4 w-4" />, []);
  // const helpCircleIcon = useMemo(() => <HelpCircle className="h-4 w-4" />, []);

  // Convert app navigation to generic navbar format with sub-menus
  const appNavigationItems: NavItemType[] = useMemo(
    () => [
      // Core navigation - always visible
      // {
      //   title: "app.nav.dashboard",
      //   href: "/app/dashboard",
      //   icon: homeIcon,
      //   isActive: pathname === `/${locale}/app/dashboard`,
      //   // disabled: !onboardingIsComplete,
      //   disabledReason: !onboardingIsComplete
      //     ? "app.nav.completeOnboardingFirst"
      //     : undefined,
      // },
      {
        title: "app.nav.onboarding" as const,
        href: "/app/onboarding",
        icon: settingsIcon,
        badge: onboardingIsComplete
          ? undefined
          : ("app.nav.incomplete" as const),
        badgeVariant: onboardingIsComplete ? undefined : "destructive",
        // isActive: pathname.startsWith(`/${locale}/app/onboarding`),
        disabled: false, // Onboarding is always accessible
      },
      ...(isAdmin
        ? [
            {
              title: "app.nav.admin" as const,
              href: "/admin" as const,
              icon: adminIcon,
              // isActive: pathname.startsWith(`/${locale}/admin`),
              disabled: false, // Admin is always accessible
            },
          ]
        : []),

      // // Services sub-menu
      // {
      //   title: "app.nav.services.title",
      //   icon: briefcaseIcon,
      //   children: [
      //     {
      //       title: "app.nav.social",
      //       description: "app.nav.descriptions.social",
      //       href: "/app/social",
      //       icon: usersIcon,
      //       badge:
      //         state.socialPlatforms.count > 0
      //           ? "app.nav.socialBadge"
      //           : undefined,
      //       badgeTranslationPayload:
      //         state.socialPlatforms.count > 0
      //           ? {
      //               count: state.socialPlatforms.count.toString(),
      //             }
      //           : undefined,
      //       badgeVariant: "secondary",
      //       isActive: pathname.startsWith(`/${locale}/app/social`),
      //       // disabled: !onboardingIsComplete,
      //       disabledReason: !onboardingIsComplete
      //         ? "app.nav.completeOnboardingFirst"
      //         : undefined,
      //     },
      //     {
      //       title: "app.nav.consultation",
      //       description: "app.nav.descriptions.consultation",
      //       href: "/app/consultation",
      //       icon: calendarIcon,
      //       badge: state.dashboard.hasScheduledConsultation
      //         ? "app.nav.scheduled"
      //         : undefined,
      //       badgeVariant: state.dashboard.hasScheduledConsultation
      //         ? "default"
      //         : undefined,
      //       isActive: pathname.startsWith(`/${locale}/app/consultation`),
      //       // disabled: !onboardingIsComplete,
      //       disabledReason: !onboardingIsComplete
      //         ? "app.nav.completeOnboardingFirst"
      //         : undefined,
      //     },
      //     {
      //       title: "app.nav.analytics",
      //       description: "app.nav.descriptions.analytics",
      //       href: "/app/analytics",
      //       icon: barChart3Icon,
      //       isActive: pathname.startsWith(`/${locale}/app/analytics`),
      //       // disabled: !onboardingIsComplete,
      //       disabledReason: !onboardingIsComplete
      //         ? "app.nav.completeOnboardingFirst"
      //         : undefined,
      //     },
      //   ],
      // },

      // // Account sub-menu
      // {
      //   title: "app.nav.account.title",
      //   icon: userIcon,
      //   children: [
      //     {
      //       title: "app.nav.subscription",
      //       description: "app.nav.descriptions.subscription",
      //       href: "/app/subscription",
      //       icon: creditCardIcon,
      //       badge: state.subscription.isActive ? "app.nav.active" : undefined,
      //       badgeVariant: state.subscription.isActive ? "default" : "outline",
      //       isActive: pathname.startsWith(`/${locale}/app/subscription`),
      //       // disabled: !onboardingIsComplete,
      //       disabledReason: !onboardingIsComplete
      //         ? "app.nav.completeOnboardingFirst"
      //         : undefined,
      //     },
      //     {
      //       title: "app.nav.help",
      //       description: "app.nav.descriptions.help",
      //       href: "/help",
      //       icon: helpCircleIcon,
      //       isActive: pathname.startsWith(`/${locale}/app/help`),
      //       disabled: false, // Help is always accessible
      //     },
      //   ],
      // },
    ],
    [settingsIcon, onboardingIsComplete, isAdmin, adminIcon],
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Use Generic Navbar */}
      <Navbar
        user={user}
        locale={locale}
        isOnboardingComplete={onboardingIsComplete}
        navigationItems={appNavigationItems}
        homePathName={
          onboardingIsComplete ? "/app/dashboard" : "/app/onboarding"
        }
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Page Content */}
        <div>{children}</div>
      </main>
    </div>
  );
}
