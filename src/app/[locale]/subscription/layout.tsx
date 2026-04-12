export const dynamic = "force-dynamic";

import { Div } from "next-vibe-ui/ui/div";
import { PageLayout } from "next-vibe-ui/ui/page-layout";
import type { JSX, ReactNode } from "react";

import Footer from "@/app/[locale]/story/_components/footer";
import { Navbar } from "@/app/[locale]/story/_components/nav/navbar";
import { accountNavItems } from "@/app/[locale]/user/_components/account-nav-items";
import { getAvailableModelCount } from "@/app/api/[locale]/agent/models/all-models";
import { SubscriptionStatus } from "@/app/api/[locale]/subscription/enum";
import { SubscriptionRepository } from "@/app/api/[locale]/subscription/repository";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import type { StandardUserType } from "@/app/api/[locale]/user/types";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

export interface SubscriptionLayoutData {
  locale: CountryLanguage;
  user: JwtPayloadType;
  userProfile: StandardUserType | undefined;
  hasSubscription: boolean;
  totalModelCount: number;
  children?: ReactNode;
}

export async function tanstackLoader({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<Omit<SubscriptionLayoutData, "children">> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, Date.now(), locale);

  const user = await AuthRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );

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

  const isAdmin = !user.isPublic && user.roles.includes(UserRole.ADMIN);
  const totalModelCount = getAvailableModelCount(isAdmin);

  return { locale, user, userProfile, hasSubscription, totalModelCount };
}

export function TanstackPage({
  locale,
  user,
  userProfile,
  hasSubscription,
  totalModelCount,
  children,
}: SubscriptionLayoutData): JSX.Element {
  return (
    <PageLayout scrollable={true}>
      <Div role="main" className="min-h-screen">
        <Navbar
          user={user}
          userProfile={userProfile}
          locale={locale}
          hasSubscription={hasSubscription}
          navigationItems={accountNavItems}
          totalModelCount={totalModelCount}
        />
        {children}
        <Footer
          locale={locale}
          totalModelCount={totalModelCount}
          isPublic={user.isPublic}
        />
      </Div>
    </PageLayout>
  );
}

interface SubscriptionLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function SubscriptionLayoutServer({
  children,
  params,
}: SubscriptionLayoutProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data}>{children}</TanstackPage>;
}
