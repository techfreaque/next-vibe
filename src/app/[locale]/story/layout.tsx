import { Div } from "next-vibe-ui/ui/div";
import type { JSX, ReactNode } from "react";

import Footer from "@/app/[locale]/_components/footer";
import { Navbar } from "@/app/[locale]/_components/nav/navbar";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { UserDetailLevel } from "@/app/api/[locale]/v1/core/user/enum";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import type { CountryLanguage } from "@/i18n/core/config";

import { navItems } from "../_components/nav/nav-constants";

interface SiteLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function SiteLayoutServer({
  children,
  params,
}: SiteLayoutProps): Promise<JSX.Element> {
  const { locale } = await params;

  // Create logger for server-side operations
  const logger = createEndpointLogger(false, Date.now(), locale);

  const userResponse = await userRepository.getUserByAuth(
    {
      locale,
      detailLevel: UserDetailLevel.STANDARD,
    },
    logger,
  );

  // TODO: Get onboarding status when onboarding module is implemented
  // For now, set to false as onboarding repository doesn't exist yet
  const isOnboardingComplete = false;

  return (
    <Div role="main" className="min-h-screen ">
      <Navbar
        user={userResponse.success ? userResponse.data : undefined}
        locale={locale}
        isOnboardingComplete={isOnboardingComplete}
        navigationItems={navItems}
      />
      {children}
      <Footer locale={locale} />
    </Div>
  );
}
