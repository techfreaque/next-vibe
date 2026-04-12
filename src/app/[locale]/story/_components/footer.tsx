import { Div } from "next-vibe-ui/ui/div";
import { Bot } from "next-vibe-ui/ui/icons/Bot";
import { BookOpen } from "next-vibe-ui/ui/icons/BookOpen";
import { Briefcase } from "next-vibe-ui/ui/icons/Briefcase";
import { Code } from "next-vibe-ui/ui/icons/Code";
import { Folder } from "next-vibe-ui/ui/icons/Folder";
import { SiGithub } from "next-vibe-ui/ui/icons/SiGithub";
import { Info } from "next-vibe-ui/ui/icons/Info";
import { MessageSquare } from "next-vibe-ui/ui/icons/MessageSquare";
import { Server } from "next-vibe-ui/ui/icons/Server";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { Tag } from "next-vibe-ui/ui/icons/Tag";
import { TrendingUp } from "next-vibe-ui/ui/icons/TrendingUp";
import { Users } from "next-vibe-ui/ui/icons/Users";
import { Link } from "next-vibe-ui/ui/link";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import { H3, P } from "next-vibe-ui/ui/typography";
import type React from "react";

import { configScopedTranslation } from "@/config/i18n";
import { envClient } from "@/config/env-client";
import { GITHUB_REPO_URL } from "@/config/constants";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

import { Logo } from "../../_components/logo";

interface FooterProps {
  locale: CountryLanguage;
  totalModelCount: number;
  isPublic: boolean;
}

const Footer: React.FC<FooterProps> = ({
  locale,
  totalModelCount,
  isPublic,
}) => {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const currentYear = new Date().getFullYear();

  return (
    <Div
      role="contentinfo"
      className="w-full border-t bg-gray-50 dark:bg-gray-900"
    >
      <Div className="container px-4 md:px-6 py-12 md:py-16">
        <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <Div className="lg:col-span-1 flex flex-col gap-4">
            <Logo locale={locale} pathName="/story" />
            <P className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              {t("footer.tagline", {
                modelCount: totalModelCount,
              })}
            </P>
            <P className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              {t("footer.privacyTagline", {
                modelCount: totalModelCount,
              })}
            </P>
          </Div>

          {/* Platform Links */}
          <Div>
            <H3 className="font-semibold text-sm mb-4">
              {t("footer.platform.title")}
            </H3>
            <Div
              role="list"
              className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-400"
            >
              <Div role="listitem">
                <Link
                  href={`/${locale}/story?tab=unbottled#universe-content`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {t("footer.platform.featuresUncensoredAi")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/story?tab=personal#universe-content`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Server className="h-4 w-4" />
                  {t("footer.platform.featuresSelfHosted")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/story?tab=nextvibe#universe-content`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Code className="h-4 w-4" />
                  {t("footer.platform.featuresOpenSource")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/story?tab=referral#universe-content`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  {t("footer.platform.featuresReferral")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/subscription/overview`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Tag className="h-4 w-4" />
                  {t("footer.platform.subscription")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/subscription/overview`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Bot className="h-4 w-4" />
                  {t("footer.platform.aiModels")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/skills`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  {t("footer.platform.characters")}
                </Link>
              </Div>
            </Div>
          </Div>

          {/* Product Links */}
          <Div>
            <H3 className="font-semibold text-sm mb-4">
              {t("footer.product.title")}
            </H3>
            <Div
              role="list"
              className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-400"
            >
              <Div role="listitem">
                <Link
                  href={
                    isPublic
                      ? `/${locale}/story?tab=unbottled#privacy`
                      : `/${locale}/threads/private`
                  }
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Folder className="h-4 w-4" />
                  {t("footer.product.privateChats")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/threads/incognito`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  {t("footer.product.incognitoMode")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={
                    isPublic
                      ? `/${locale}/story?tab=unbottled#privacy`
                      : `/${locale}/threads/shared`
                  }
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  {t("footer.product.sharedFolders")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/threads/public`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  {t("footer.product.publicForum")}
                </Link>
              </Div>
            </Div>
          </Div>

          {/* Company Links */}
          <Div>
            <H3 className="font-semibold text-sm mb-4">
              {t("footer.company.title")}
            </H3>
            <Div
              role="list"
              className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-400"
            >
              <Div role="listitem">
                <Link
                  href={`/${locale}/story/about-us`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Info className="h-4 w-4" />
                  {t("footer.company.aboutUs")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/story/careers`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  {t("footer.company.careers")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/story/blog`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  {t("footer.company.blog")}
                </Link>
              </Div>
            </Div>
          </Div>

          {/* Legal Links */}
          <Div>
            <H3 className="font-semibold text-sm mb-4">
              {t("footer.legal.title")}
            </H3>
            <Div
              role="list"
              className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-400"
            >
              <Div role="listitem">
                <Link
                  href={`/${locale}/story/privacy-policy`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t("footer.company.privacyPolicy")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/story/terms-of-service`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t("footer.company.termsOfService")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/story/imprint`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t("footer.company.imprint")}
                </Link>
              </Div>
            </Div>
          </Div>
        </Div>

        <Separator className="my-8" />

        <Div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <P className="text-sm text-gray-600 dark:text-gray-400">
            {t("footer.copyright", {
              year: currentYear,
              appName: configT("appName"),
            })}
          </P>
          <Div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <Link
              href={GITHUB_REPO_URL}
              className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors flex items-center gap-1.5"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiGithub className="h-4 w-4" />
              <Span>{t("footer.github")}</Span>
            </Link>
            <Div className="flex items-center gap-2">
              <Span>{t("footer.builtWith")}</Span>
              <Link
                href={`${envClient.NEXT_PUBLIC_PROJECT_URL}/${locale}/story/framework`}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                {configT("framework")}
              </Link>
            </Div>
          </Div>
        </Div>
      </Div>
    </Div>
  );
};

export default Footer;
