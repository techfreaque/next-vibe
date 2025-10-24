import { Div, H3, P } from "next-vibe-ui/ui";
import {
  Briefcase,
  Edit,
  FileText,
  HelpCircle,
  Info,
  MessageSquare,
  Scale,
  Settings,
  Shield,
  TrendingUp,
  Users,
  Wrench,
} from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import type React from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { NewsletterSignupFooter } from "./footer-newsletter";
import { Logo } from "./nav/logo";

interface FooterProps {
  locale: CountryLanguage;
}

const Footer: React.FC<FooterProps> = ({ locale }) => {
  const { t } = simpleT(locale);
  return (
    <Div
      role="contentinfo"
      className="w-full border-t bg-white dark:bg-gray-950"
    >
      <Div className="container px-4 md:px-6 py-12 md:py-16">
        <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <Div className="space-y-4">
            <Logo locale={locale} pathName="" />
            <P className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              {t("app.common.footer.description")}
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

          <Div>
            <H3 className="font-semibold text-lg mb-4">
              {t("app.common.footer.services.title")}
            </H3>
            <Div
              role="list"
              className="space-y-3 text-sm text-gray-500 dark:text-gray-400"
            >
              <Div role="listitem">
                <Link
                  href={`/${locale}#free-social-setup`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <Settings className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.services.socialAccountSetup")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}#features`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <Edit className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.services.contentCreation")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}#process`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <Wrench className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.services.strategyDevelopment")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}#features`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <Scale className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.services.performanceAnalytics")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}#features`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.services.communityManagement")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}#features`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <Users className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.services.audienceBuilding")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}#features`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.services.adCampaigns")}
                </Link>
              </Div>
            </Div>
          </Div>

          <Div>
            <H3 className="font-semibold text-lg mb-4">
              {t("app.common.footer.company.title")}
            </H3>
            <Div
              role="list"
              className="space-y-3 text-sm text-gray-500 dark:text-gray-400"
            >
              <Div role="listitem">
                <Link
                  href={`/${locale}/about-us`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <Info className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.company.aboutUs")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/help`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <HelpCircle className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.company.contactUs")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/careers`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <Briefcase className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.company.careers")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/privacy-policy`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <Shield className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.company.privacyPolicy")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/terms-of-service`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <FileText className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.company.termsOfService")}
                </Link>
              </Div>
              <Div role="listitem">
                <Link
                  href={`/${locale}/imprint`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <FileText className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.company.imprint")}
                </Link>
              </Div>
            </Div>
          </Div>
          <NewsletterSignupFooter locale={locale} />
        </Div>

        <Div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <P className="text-sm text-gray-500 dark:text-gray-400">
            {t("app.common.footer.copyright", {
              year: new Date().getFullYear(),
              appName: t("app.common.company.name"),
            })}
          </P>
          <P className="text-sm text-gray-500 dark:text-gray-400 mt-4 md:mt-0">
            {t("app.common.footer.tagline")}
          </P>
        </Div>
      </Div>
    </Div>
  );
};

export default Footer;
