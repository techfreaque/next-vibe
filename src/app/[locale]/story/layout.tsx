import { Div } from "next-vibe-ui/ui/div";
import { PageLayout } from "next-vibe-ui/ui/page-layout";
import type { JSX, ReactNode } from "react";

import Footer from "@/app/[locale]/story/_components/footer";
import { Navbar } from "@/app/[locale]/story/_components/nav/navbar";
import { SubscriptionStatus } from "@/app/api/[locale]/subscription/enum";
import { SubscriptionRepository } from "@/app/api/[locale]/subscription/repository";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import type { StandardUserType } from "@/app/api/[locale]/user/types";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { navItems } from "../story/_components/nav/nav-constants";

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

  const user = await AuthRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );

  // Get subscription status for authenticated users
  let userProfile: StandardUserType | undefined = undefined;
  let hasSubscription = false;
  if (!user.isPublic) {
    const subscriptionResponse = await SubscriptionRepository.getSubscription(
      user.id,
      logger,
      locale,
    );
    hasSubscription =
      subscriptionResponse.success &&
      subscriptionResponse.data.status === SubscriptionStatus.ACTIVE;

    const userProfileResponse = await UserRepository.getUserById(
      user.id,
      UserDetailLevel.STANDARD,
      locale,
      logger,
    );
    userProfile = userProfileResponse.success
      ? userProfileResponse.data
      : undefined;
  }

  return (
    <PageLayout scrollable={true}>
      <Div role="main" className="min-h-screen ">
        <Navbar
          user={user}
          userProfile={userProfile}
          locale={locale}
          hasSubscription={hasSubscription}
          navigationItems={navItems}
        />
        {children}
        <Footer locale={locale} />
      </Div>
    </PageLayout>
  );
}
