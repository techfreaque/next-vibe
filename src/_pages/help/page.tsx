export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { getAvailableChatModelCount } from "next-vibe/agent/models/all-models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { UserRepository } from "next-vibe/identity/user/repository";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { Link } from "next-vibe/ui/components/link";
import { Main } from "next-vibe/ui/components/main";
import type { JSX } from "react";

import { contactClientRepository } from "@/contact/repository-client";
import { configScopedTranslation } from "@/env/i18n";

import { buildBreadcrumbList } from "../_components/structured-data";
import {
  BreadcrumbTrail,
  buildBreadcrumbTrail,
} from "../story/_shared/breadcrumbs";
import { GuideCardGrid } from "../story/blog/guide-links";
import type { BlogPostSlug } from "../story/blog/posts-meta";
import { scopedTranslation as pageT } from "./i18n";
import HelpPageClient from "./page-client";

/** The guides people ask about most, one per main question on this page. */
const HELP_GUIDES: readonly BlogPostSlug[] = [
  "best-uncensored-llm",
  "abliterated-vs-uncensored-models",
  "ai-chat-no-sign-up",
  "uncensored-ai-image-generator",
  "openai-anthropic-compatible-api",
  "ai-roleplay-without-filter",
];

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface HelpPageData {
  locale: CountryLanguage;
  jwtUser: JwtPayloadType;
  platform: Platform;
  userEmail?: string;
  supportEmail: string;
  modelCount: number;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = pageT.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return metadataGenerator(locale, {
    path: "help",
    title: t("meta.contact.title", { appName }),
    description: t("meta.contact.description", { appName }),
    category: t("meta.contact.category"),
    imageAlt: t("meta.contact.imageAlt", { appName }),
    keywords: [t("meta.contact.keywords", { appName })],
    additionalMetadata: {
      openGraph: {
        title: t("meta.contact.ogTitle", { appName }),
        description: t("meta.contact.ogDescription"),
      },
      twitter: {
        title: t("meta.contact.twitterTitle", { appName }),
        description: t("meta.contact.twitterDescription"),
      },
    },
  });
}

export async function tanstackLoader({ params }: Props): Promise<HelpPageData> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, locale);

  const jwtUser = await AuthRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );

  const isAdmin = !jwtUser.isPublic && jwtUser.roles.includes(UserRole.ADMIN);
  const modelCount = getAvailableChatModelCount(
    isAdmin,
    await getEnvAvailability(),
  );

  let userEmail: string | undefined;
  if (!jwtUser.isPublic) {
    const userRecord = await UserRepository.getUserById(
      jwtUser.id,
      undefined,
      locale,
      logger,
    );
    if (userRecord.success) {
      userEmail = userRecord.data.email ?? undefined;
    }
  }

  return {
    locale,
    jwtUser,
    platform: Platform.NEXT_PAGE,
    userEmail,
    supportEmail: contactClientRepository.getSupportEmail(locale),
    modelCount,
  };
}

export function TanstackPage({
  locale,
  jwtUser,
  platform,
  userEmail,
  supportEmail,
  modelCount,
}: HelpPageData): JSX.Element {
  const { t } = pageT.scopedT(locale);
  const crumbs = [{ name: t("breadcrumb"), path: "/help" }];

  return (
    <Main className="min-h-screen bg-primary/5 bg-linear-to-b from-primary/5 to-white dark:bg-gray-950 dark:from-gray-950 dark:to-gray-900">
      <JsonLd
        id="help-breadcrumbs"
        data={{
          "@context": "https://schema.org",
          ...buildBreadcrumbList(locale, crumbs),
        }}
      />
      <Div className="container max-w-6xl mx-auto pt-8 px-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <BreadcrumbTrail items={buildBreadcrumbTrail(locale, crumbs)} />
        <Link
          href={`/${locale}/threads/incognito/new`}
          className="inline-flex min-h-11 items-center text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {t("nav.home")}
        </Link>
      </Div>
      <HelpPageClient
        locale={locale}
        user={jwtUser}
        platform={platform}
        userEmail={userEmail}
        supportEmail={supportEmail}
        modelCount={modelCount}
        guides={<GuideCardGrid locale={locale} slugs={HELP_GUIDES} />}
      />
    </Main>
  );
}

export default async function ContactPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
