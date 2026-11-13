export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRepository } from "next-vibe/identity/user/repository";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { redirect } from "next-vibe/ui/lib/redirect";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";
import { ReferralRepository } from "@/referral/repository";

import SignUpForm from "./_components/sign-up-form";
import { scopedTranslation as pageT } from "./i18n";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
  searchParams?: Promise<Record<string, string | undefined>>;
}

export interface SignUpPageData {
  locale: CountryLanguage;
  user: JwtPayloadType | null;
  initialReferralCode: string | null;
  /** Same-site path to land on after signup (e.g. the referral page). */
  callbackUrl: string | null;
  platform: Platform;
}

/** Only same-site absolute paths: "/x" yes, "//host", "https:", "\\" no. */
function safeCallbackPath(value: string | undefined): string | null {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    value.includes("://")
  ) {
    return null;
  }
  return value;
}

/**
 * Generate metadata for the Signup page with translations
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = pageT.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return metadataGenerator(locale, {
    path: "user/signup",
    title: t("meta.title", { appName }),
    description: t("meta.description", { appName }),
    category: t("meta.category"),
    image:
      "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=1200&h=630&auto=format&fit=crop",
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
    additionalMetadata: {
      openGraph: {
        title: t("meta.ogTitle", { appName }),
        description: t("meta.ogDescription", { appName }),
        url: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/user/signup`,
        type: "website",
        images: [
          {
            url: "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=1200&h=630&auto=format&fit=crop",
            width: 1200,
            height: 630,
            alt: t("meta.imageAlt", { appName }),
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: t("meta.twitterTitle", { appName }),
        description: t("meta.twitterDescription", { appName }),
        images: [
          "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=1200&h=630&auto=format&fit=crop",
        ],
      },
    },
  });
}

export async function tanstackLoader({
  params,
  searchParams,
}: Props): Promise<SignUpPageData> {
  const { locale } = await params;
  const search = searchParams ? await searchParams : {};
  const refFromUrl = search["ref"] ?? null;
  const skillIdFromUrl = search["skillId"] ?? null;
  const callbackUrl = safeCallbackPath(search["callbackUrl"]);

  const logger = createEndpointLogger(false, locale);
  const user = await UserRepository.getUserByAuth({}, locale, logger);

  // Only redirect if user is authenticated and not a public user
  if (user.success && !user.data.isPublic) {
    redirect(callbackUrl ?? `/${locale}/`);
  }

  if (!user.success) {
    return {
      locale,
      user: null,
      initialReferralCode: null,
      callbackUrl,
      platform: Platform.NEXT_PAGE,
    };
  }

  const leadId = user.data.leadId;

  // Store skillId on lead from URL param (first-touch, if not already set)
  if (leadId && skillIdFromUrl) {
    const { LeadsRepository } =
      await import("next-vibe/identity/lead/repository");
    void LeadsRepository.updateLeadSkillId(
      leadId,
      skillIdFromUrl,
      false,
      logger,
    ).catch((error: Error) => {
      logger.error("Signup page: storing lead skillId threw", error, {
        page: "signup",
        operation: "updateLeadSkillId",
        leadId,
        skillId: skillIdFromUrl,
      });
    });
  }

  // Link referral code from URL param if present
  if (leadId && refFromUrl) {
    void ReferralRepository.linkReferralToLead(
      leadId,
      refFromUrl,
      logger,
      locale,
    )
      .then((linkResult) => {
        if (!linkResult.success) {
          // Lost referral attribution - the referrer never gets credited
          logger.warn("Signup page: linking referral code to lead failed", {
            page: "signup",
            operation: "linkReferralToLead",
            leadId,
            referralCode: refFromUrl,
            errorType: linkResult.errorType.errorKey,
            reason: linkResult.message,
          });
        }
        return undefined;
      })
      .catch((error: Error) => {
        logger.error(
          "Signup page: linking referral code to lead threw",
          error,
          {
            page: "signup",
            operation: "linkReferralToLead",
            leadId,
            referralCode: refFromUrl,
          },
        );
      });
  }

  // Get the latest referral code for the lead (URL ref takes priority over DB)
  let initialReferralCode: string | null = refFromUrl;
  if (!initialReferralCode && leadId) {
    const referralResult = await ReferralRepository.getLatestLeadReferralCode(
      leadId,
      logger,
      locale,
    );
    if (referralResult.success && referralResult.data.referralCode) {
      initialReferralCode = referralResult.data.referralCode;
    }
  }

  return {
    locale,
    user: user.data,
    initialReferralCode,
    callbackUrl,
    platform: Platform.NEXT_PAGE,
  };
}

export function TanstackPage({
  locale,
  user,
  initialReferralCode,
  callbackUrl,
  platform,
}: SignUpPageData): JSX.Element {
  const { t } = pageT.scopedT(locale);

  if (!user) {
    return <Div>{t("errors.failedToLoadBrowserIdentity")}</Div>;
  }

  return (
    <SignUpForm
      locale={locale}
      initialReferralCode={initialReferralCode}
      callbackUrl={callbackUrl}
      user={user}
      platform={platform}
    />
  );
}

/**
 * Signup Page Component
 * Fully definition-driven using EndpointsPage
 */
export default async function SignUpPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
