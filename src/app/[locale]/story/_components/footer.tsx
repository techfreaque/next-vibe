import { Div } from "next-vibe-ui/ui/div";
import { H3, P } from "next-vibe-ui/ui/typography";
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
import type React from "react";

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
    <Div
      role="contentinfo"
      className="w-full border-t bg-gray-50 dark:bg-gray-900"
    >
      <Div className="container px-4 md:px-6 py-12 md:py-16">
        <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <Div className="lg:col-span-1 space-y-4">
            <Logo locale={locale} pathName="/story" />
            <P className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              {t("app.common.footer.tagline")}
            </P>
            <P className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              {t("app.common.footer.privacyTagline")}
            </P>
            {/* <div className="flex space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:text-blue-600 dark:hover:text-blue-500"
                aria-label={t("app.common.footer.social.facebook")}
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:text-blue-600 dark:hover:text-blue-500"
                aria-label={t("app.common.footer.social.instagram")}
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:text-blue-600 dark:hover:text-blue-500"
                aria-label={t("app.common.footer.social.twitter")}
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:text-blue-600 dark:hover:text-blue-500"
                aria-label={t("app.common.footer.social.linkedin")}
              >
                <Linkedin className="h-5 w-5" />
              </Button>
            </Div> */}
          </Div>

          {/* Platform Links */}
          <Div>
            <H3 className="font-semibold text-sm mb-4">{t("app.common.footer.platform.title")}</H3>
            <Div role="list" className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <Div role="listitem">
                <Link
                  href={`/${locale}/story#features`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {t("app.common.footer.platform.features")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/story#pricing`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Tag className="h-4 w-4" />
                  {t("app.common.footer.platform.pricing")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/story#features`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Bot className="h-4 w-4" />
                  {t("app.common.footer.platform.aiModels")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/story#features`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  {t("app.common.footer.platform.personas")}
                </Link>
              </Div>
            </Div>
          </Div>

          {/* Product Links */}
          <Div>
            <H3 className="font-semibold text-sm mb-4">{t("app.common.footer.product.title")}</H3>
            <Div role="list" className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <Div role="listitem">
                <Link
                  href={`/${locale}/story#features`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Folder className="h-4 w-4" />
                  {t("app.common.footer.product.privateChats")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/story#features`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  {t("app.common.footer.product.incognitoMode")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/story#features`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  {t("app.common.footer.product.sharedFolders")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/public`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  {t("app.common.footer.product.publicForum")}
                </Link>
              </Div>
            </Div>
          </Div>

          {/* Company Links */}
          <Div>
            <H3 className="font-semibold text-sm mb-4">{t("app.common.footer.company.title")}</H3>
            <Div role="list" className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <Div role="listitem">
                <Link
                  href={`/${locale}/story/about-us`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Info className="h-4 w-4" />
                  {t("app.common.footer.company.aboutUs")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/story/careers`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  {t("app.common.footer.company.careers")}
                </Link>
              </Div>
            </Div>
          </Div>

          {/* Legal Links */}
          <Div>
            <H3 className="font-semibold text-sm mb-4">{t("app.common.footer.legal.title")}</H3>
            <Div role="list" className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <Div role="listitem">
                <Link
                  href={`/${locale}/story/privacy-policy`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t("app.common.footer.company.privacyPolicy")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/story/terms-of-service`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t("app.common.footer.company.termsOfService")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/story/imprint`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t("app.common.footer.company.imprint")}
                </Link>
              </Div>
            </Div>
          </Div>
        </Div>

        <Separator className="my-8" />

        <Div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <P className="text-sm text-gray-600 dark:text-gray-400">
            {t("app.common.footer.copyright", {
              year: currentYear,
              appName: t("app.common.company.name"),
            })}
          </P>
          <Div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>{t("app.common.footer.builtWith")}</span>
            <Link
              href="https://github.com/techfreaque/next-vibe"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
            >
              {t("app.common.footer.framework")}
            </Link>
          </Div>
        </Div>
      </Div>
    </Div>
  );
};

export default Footer;
