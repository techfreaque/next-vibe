import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import { Footer as FooterContainer } from "next-vibe/ui/components/footer";
import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { Bot } from "next-vibe/ui/components/icons/Bot";
import { Briefcase } from "next-vibe/ui/components/icons/Briefcase";
import { Code } from "next-vibe/ui/components/icons/Code";
import { Terminal } from "next-vibe/ui/components/icons/Terminal";
import { Folder } from "next-vibe/ui/components/icons/Folder";
import { Info } from "next-vibe/ui/components/icons/Info";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Server } from "next-vibe/ui/components/icons/Server";
import { Shield } from "next-vibe/ui/components/icons/Shield";
import { SiGithub } from "next-vibe/ui/components/icons/SiGithub";
import { Sparkles } from "next-vibe/ui/components/icons/Sparkles";
import { Tag } from "next-vibe/ui/components/icons/Tag";
import { TrendingUp } from "next-vibe/ui/components/icons/TrendingUp";
import { Users } from "next-vibe/ui/components/icons/Users";
import { Li } from "next-vibe/ui/components/li";
import { Link } from "next-vibe/ui/components/link";
import { Separator } from "next-vibe/ui/components/separator";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import { Ul } from "next-vibe/ui/components/ul";
import type React from "react";

import { GITHUB_REPO_URL } from "@/env/constants";
import { configScopedTranslation } from "@/env/i18n";

import { Logo } from "../../_components/logo";
import { scopedTranslation } from "./i18n";

interface FooterProps {
  locale: CountryLanguage;
  totalModelCount: number;
  isPublic: boolean;
}

/** Server-rendered — kept outside the component body so render stays pure. */
function getCurrentYear(): number {
  return new Date().getFullYear();
}

const Footer: React.FC<FooterProps> = ({
  locale,
  totalModelCount,
  isPublic,
}) => {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const currentYear = getCurrentYear();

  return (
    <FooterContainer className="w-full border-t border-border bg-muted/40">
      <Div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <Div className="lg:col-span-1 flex flex-col gap-4">
            <Logo locale={locale} pathName="/story" />
            <P className="text-sm text-muted-foreground max-w-xs">
              {t("footer.tagline", {
                modelCount: totalModelCount,
              })}
            </P>
            <P className="text-sm text-muted-foreground max-w-xs">
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
            <Ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <Li>
                <Link
                  href={`/${locale}/story#how-it-works`}
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {t("footer.platform.featuresUncensoredAi")}
                </Link>
              </Li>
              <Li>
                <Link
                  href={`/${locale}/story/self-host`}
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Server className="h-4 w-4" />
                  {t("footer.platform.featuresSelfHosted")}
                </Link>
              </Li>
              <Li>
                <Link
                  href={`/${locale}/docs/api`}
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Terminal className="h-4 w-4" />
                  {t("footer.platform.featuresApiDocs")}
                </Link>
              </Li>
              <Li>
                <Link
                  href={`/${locale}/story/framework`}
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Code className="h-4 w-4" />
                  {t("footer.platform.featuresOpenSource")}
                </Link>
              </Li>
              <Li>
                <Link
                  href={`/${locale}/story/earn`}
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  {t("footer.platform.featuresReferral")}
                </Link>
              </Li>
              <Li>
                <Link
                  href={`/${locale}/subscription/overview`}
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Tag className="h-4 w-4" />
                  {t("footer.platform.subscription")}
                </Link>
              </Li>
              <Li>
                <Link
                  href={`/${locale}/models`}
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Bot className="h-4 w-4" />
                  {t("footer.platform.aiModels")}
                </Link>
              </Li>
              <Li>
                <Link
                  href={`/${locale}/skills`}
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  {t("footer.platform.characters")}
                </Link>
              </Li>
            </Ul>
          </Div>

          {/* Product Links */}
          <Div>
            <H3 className="font-semibold text-sm mb-4">
              {t("footer.product.title")}
            </H3>
            <Ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <Li>
                <Link
                  href={
                    isPublic
                      ? `/${locale}/story#privacy`
                      : `/${locale}/threads/private`
                  }
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Folder className="h-4 w-4" />
                  {t("footer.product.privateChats")}
                </Link>
              </Li>
              <Li>
                <Link
                  href={`/${locale}/threads/incognito`}
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  {t("footer.product.incognitoMode")}
                </Link>
              </Li>
              <Li>
                <Link
                  href={
                    isPublic
                      ? `/${locale}/story#privacy`
                      : `/${locale}/threads/shared`
                  }
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  {t("footer.product.sharedFolders")}
                </Link>
              </Li>
              <Li>
                <Link
                  href={`/${locale}/threads/public`}
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  {t("footer.product.publicForum")}
                </Link>
              </Li>
            </Ul>
          </Div>

          {/* Company Links */}
          <Div>
            <H3 className="font-semibold text-sm mb-4">
              {t("footer.company.title")}
            </H3>
            <Ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <Li>
                <Link
                  href={`/${locale}/story/about-us`}
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Info className="h-4 w-4" />
                  {t("footer.company.aboutUs")}
                </Link>
              </Li>
              <Li>
                <Link
                  href={`/${locale}/story/careers`}
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  {t("footer.company.careers")}
                </Link>
              </Li>
              <Li>
                <Link
                  href={`/${locale}/story/blog`}
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  {t("footer.company.blog")}
                </Link>
              </Li>
            </Ul>
          </Div>

          {/* Legal Links */}
          <Div>
            <H3 className="font-semibold text-sm mb-4">
              {t("footer.legal.title")}
            </H3>
            <Ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <Li>
                <Link
                  href={`/${locale}/story/privacy-policy`}
                  className="hover:text-foreground transition-colors"
                >
                  {t("footer.company.privacyPolicy")}
                </Link>
              </Li>
              <Li>
                <Link
                  href={`/${locale}/story/terms-of-service`}
                  className="hover:text-foreground transition-colors"
                >
                  {t("footer.company.termsOfService")}
                </Link>
              </Li>
              <Li>
                <Link
                  href={`/${locale}/story/imprint`}
                  className="hover:text-foreground transition-colors"
                >
                  {t("footer.company.imprint")}
                </Link>
              </Li>
            </Ul>
          </Div>
        </Div>

        <Separator className="my-8" />

        <Div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <P className="text-sm text-muted-foreground">
            {t("footer.copyright", {
              year: currentYear,
              appName: configT("appName"),
            })}
          </P>
          <Div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link
              href={GITHUB_REPO_URL}
              className="hover:text-foreground transition-colors flex items-center gap-1.5"
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
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {configT("framework")}
              </Link>
            </Div>
          </Div>
        </Div>
      </Div>
    </FooterContainer>
  );
};

export default Footer;
