import {
  BarChart2,
  Building,
  Edit3,
  FileText,
  HelpCircle,
  Info,
  MessageCircle,
  PenTool,
  Settings,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
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
    <footer className="w-full border-t bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            <Logo locale={locale} pathName="" />
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              {t("app.common.footer.description")}
            </p>
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
            </div> */}
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">
              {t("app.common.footer.services.title")}
            </h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link
                  href={`/${locale}#free-social-setup`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <Settings className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.services.socialAccountSetup")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}#features`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <Edit3 className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.services.contentCreation")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}#process`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <PenTool className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.services.strategyDevelopment")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}#features`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <BarChart2 className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.services.performanceAnalytics")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}#features`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.services.communityManagement")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}#features`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <Users className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.services.audienceBuilding")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}#features`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.services.adCampaigns")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">
              {t("app.common.footer.company.title")}
            </h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link
                  href={`/${locale}/about-us`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <Info className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.company.aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/help`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <HelpCircle className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.company.contactUs")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/careers`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <Building className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.company.careers")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/privacy-policy`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <Shield className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.company.privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/terms-of-service`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <FileText className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.company.termsOfService")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/imprint`}
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <FileText className="h-4 w-4 text-blue-500" />
                  {t("app.common.footer.company.imprint")}
                </Link>
              </li>
            </ul>
          </div>
          <NewsletterSignupFooter locale={locale} />
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("app.common.footer.copyright", {
              year: new Date().getFullYear(),
              appName: t("app.common.company.name"),
            })}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 md:mt-0">
            {t("app.common.footer.tagline")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
