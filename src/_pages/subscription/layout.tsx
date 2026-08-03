export const dynamic = "force-dynamic";

import { getAvailableModelCount } from "next-vibe/agent/models/all-models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { UserDetailLevel } from "next-vibe/identity/user/enum";
import { UserRepository } from "next-vibe/identity/user/repository";
import type { StandardUserType } from "next-vibe/identity/user/types";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/ui/div";
import { PageLayout } from "next-vibe/ui/ui/page-layout";
import type { JSX, ReactNode } from "react";

import Footer from "@/_pages/story/_components/footer";
import { Navbar } from "@/_pages/story/_components/nav/navbar";
import { accountNavItems } from "@/_pages/user/_components/account-nav-items";
import { SubscriptionStatus } from "@/subscription/enum";
import { SubscriptionRepository } from "@/subscription/repository";

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
  const logger = createEndpointLogger(false, locale);

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
  const { getEnvAvailability } =
    await import("next-vibe/agent/env-availability");
  const totalModelCount = getAvailableModelCount(
    isAdmin,
    await getEnvAvailability(),
  );

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
