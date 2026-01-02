import { Div } from "next-vibe-ui/ui/div";
import {
  Bot,
  Briefcase,
  Folder,
  Info,
  MessageSquare,
  Shield,
  Sparkles,
  Tag,
  Users,
} from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import { H3, P } from "next-vibe-ui/ui/typography";
import type React from "react";

import { TOTAL_MODEL_COUNT } from "@/app/api/[locale]/products/repository-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { Logo } from "../../_components/logo";

interface FooterProps {
  locale: CountryLanguage;
}

const Footer: React.FC<FooterProps> = ({ locale }) => {
  const { t } = simpleT(locale);
  const currentYear = new Date().getFullYear();

  return (
    <Div role="contentinfo" className="w-full border-t bg-gray-50 dark:bg-gray-900">
      <Div className="container px-4 md:px-6 py-12 md:py-16">
        <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <Div className="lg:col-span-1 flex flex-col gap-4">
            <Logo locale={locale} pathName="/story" />
            <P className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              {t("app.story._components.footer.tagline", {
                modelCount: TOTAL_MODEL_COUNT,
              })}
            </P>
            <P className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              {t("app.story._components.footer.privacyTagline", {
                modelCount: TOTAL_MODEL_COUNT,
              })}
            </P>
          </Div>

          {/* Platform Links */}
          <Div>
            <H3 className="font-semibold text-sm mb-4">
              {t("app.story._components.footer.platform.title")}
            </H3>
            <Div
              role="list"
              className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-400"
            >
              <Div role="listitem">
                <Link
                  href={`/${locale}/story#features`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {t("app.story._components.footer.platform.features")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/subscription/buy-credits`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Tag className="h-4 w-4" />
                  {t("app.story._components.footer.platform.subscription")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/story#model-costs`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Bot className="h-4 w-4" />
                  {t("app.story._components.footer.platform.aiModels")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/story#features`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  {t("app.story._components.footer.platform.characters")}
                </Link>
              </Div>
            </Div>
          </Div>

          {/* Product Links */}
          <Div>
            <H3 className="font-semibold text-sm mb-4">
              {t("app.story._components.footer.product.title")}
            </H3>
            <Div
              role="list"
              className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-400"
            >
              <Div role="listitem">
                <Link
                  href={`/${locale}/story#features`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Folder className="h-4 w-4" />
                  {t("app.story._components.footer.product.privateChats")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/story#features`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  {t("app.story._components.footer.product.incognitoMode")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/story#features`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  {t("app.story._components.footer.product.sharedFolders")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/threads/public`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  {t("app.story._components.footer.product.publicForum")}
                </Link>
              </Div>
            </Div>
          </Div>

          {/* Company Links */}
          <Div>
            <H3 className="font-semibold text-sm mb-4">
              {t("app.story._components.footer.company.title")}
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
                  {t("app.story._components.footer.company.aboutUs")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/story/careers`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  {t("app.story._components.footer.company.careers")}
                </Link>
              </Div>
            </Div>
          </Div>

          {/* Legal Links */}
          <Div>
            <H3 className="font-semibold text-sm mb-4">
              {t("app.story._components.footer.legal.title")}
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
                  {t("app.story._components.footer.company.privacyPolicy")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/story/terms-of-service`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t("app.story._components.footer.company.termsOfService")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/story/imprint`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t("app.story._components.footer.company.imprint")}
                </Link>
              </Div>
            </Div>
          </Div>
        </Div>

        <Separator className="my-8" />

        <Div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <P className="text-sm text-gray-600 dark:text-gray-400">
            {t("app.story._components.footer.copyright", {
              year: currentYear,
              appName: t("config.appName"),
            })}
          </P>
          <Div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Span>{t("app.story._components.footer.builtWith")}</Span>
            <Link
              href="https://github.com/techfreaque/next-vibe"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("config.framework")}
            </Link>
          </Div>
        </Div>
      </Div>
    </Div>
  );
};

export default Footer;
