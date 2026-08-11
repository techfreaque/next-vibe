/* eslint-disable oxlint-plugin-jsx-capitalization/jsx-capitalization */
export const dynamic = "force-dynamic";

import { getEnvAvailability } from "next-vibe/agent/env-availability";
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
import { Div } from "next-vibe/ui/components/div";
import { Main } from "next-vibe/ui/components/main";
import { PageLayout } from "next-vibe/ui/components/page-layout";
import { getPathname } from "next-vibe/ui/lib/headers";
import type { JSX, ReactNode } from "react";

import Footer from "@/_pages/story/_components/footer";
import { Navbar } from "@/_pages/story/_components/nav/navbar";
import { SubscriptionStatus } from "@/subscription/enum";
import { SubscriptionRepository } from "@/subscription/repository";

import { navItems } from "../story/_components/nav/nav-constants";
import { SITE_FOOTER_ID } from "./constants";

export { SITE_FOOTER_ID } from "./constants";

export interface SiteLayoutData {
  locale: CountryLanguage;
  user: JwtPayloadType;
  userProfile: StandardUserType | undefined;
  hasSubscription: boolean;
  totalModelCount: number;
  isHomePage: boolean;
  children?: ReactNode;
}

export async function tanstackLoader({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<Omit<SiteLayoutData, "children">> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, locale);

  const user = await AuthRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER],
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
  const totalModelCount = getAvailableModelCount(
    isAdmin,
    await getEnvAvailability(),
  );

  const pathname = await getPathname();
  const normalizedPath = pathname.replace(/\/+$/, "");
  const isHomePage =
    normalizedPath === `/${locale}/story` || normalizedPath === `/${locale}`;

  return {
    locale,
    user,
    userProfile,
    hasSubscription,
    totalModelCount,
    isHomePage,
  };
}

export function TanstackPage({
  locale,
  user,
  userProfile,
  hasSubscription,
  totalModelCount,
  isHomePage,
  children,
}: SiteLayoutData): JSX.Element {
  return (
    <PageLayout scrollable={true}>
      <Main className="min-h-screen ">
        <Navbar
          user={user}
          userProfile={userProfile}
          locale={locale}
          hasSubscription={hasSubscription}
          navigationItems={navItems}
          totalModelCount={totalModelCount}
        />
        {children}
        <Div
          id={SITE_FOOTER_ID}
          style={isHomePage ? { display: "none" } : undefined}
        >
          <Footer
            locale={locale}
            totalModelCount={totalModelCount}
            isPublic={user.isPublic}
          />
        </Div>
      </Main>
    </PageLayout>
  );
}

interface SiteLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function SiteLayoutServer({
  children,
  params,
}: SiteLayoutProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data}>{children}</TanstackPage>;
}
