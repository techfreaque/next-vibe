"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Globe, Mail } from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import { H2, H3, P } from "next-vibe-ui/ui/typography";
import { openUrl } from "next-vibe-ui/utils/browser";
import type { JSX } from "react";

import { scopedTranslation as contactInfoScopedTranslation } from "@/app/api/[locale]/contact/widget/i18n";
import contactDefinitions from "@/app/api/[locale]/contact/definition";
import { contactClientRepository } from "@/app/api/[locale]/contact/repository-client";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface HelpPageClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export default function HelpPageClient({
  locale,
  user,
}: HelpPageClientProps): JSX.Element {
  const { t } = simpleT(locale);
  const { t: infoT } = contactInfoScopedTranslation.scopedT(locale);
  const supportEmail = contactClientRepository.getSupportEmail(locale);

  return (
    <Div className="container max-w-6xl mx-auto py-8 px-4">
      <Div className="text-center mb-12">
        <H2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-br from-cyan-500 to-blue-600 text-center">
          {t("app.help.pages.help.title")}
        </H2>
        <P className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-center">
          {t("app.help.pages.help.subtitle")}
        </P>
      </Div>

      <Div className="grid md:grid-cols-2 gap-12 mb-16">
        <EndpointsPage
          endpoint={contactDefinitions}
          locale={locale}
          user={user}
        />

        {/* Contact Info */}
        <Div className="flex flex-col gap-8">
          <Div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
            <H3 className="text-2xl font-bold mb-6">
              {infoT("pages.help.info.title")}
            </H3>
            <Div className="flex flex-col gap-6">
              <Div>
                <Div className="flex items-start mb-2">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                  <H3 className="font-medium">
                    {infoT("pages.help.info.supportEmail")}
                  </H3>
                </Div>
                <Button
                  onClick={() => {
                    openUrl(`mailto:${supportEmail}`);
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-8 bg-transparent border-none p-0 cursor-pointer"
                >
                  {supportEmail}
                </Button>
              </Div>
              <Div>
                <Div className="flex items-start mb-2">
                  <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                  <H3 className="font-medium">
                    {infoT("pages.help.info.website")}
                  </H3>
                </Div>
                <Link
                  href={envClient.NEXT_PUBLIC_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-8"
                >
                  {infoT("pages.help.info.websiteUrl")}
                </Link>
              </Div>
            </Div>
          </Div>
        </Div>
      </Div>

      {/* FAQ Section */}
      <Div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 mb-16">
        <H2 className="text-2xl font-bold mb-6 text-center">
          {t("app.help.pages.help.faq.title")}
        </H2>
        <Div className="grid md:grid-cols-2 gap-8">
          <Div>
            <H3 className="text-lg font-semibold mb-2">
              {t("app.help.pages.help.faq.questions.q1.question", {
                appName: t("config.appName"),
              })}
            </H3>
            <P className="text-gray-600 dark:text-gray-300">
              {t("app.help.pages.help.faq.questions.q1.answer", {
                appName: t("config.appName"),
              })}
            </P>
          </Div>
          <Div>
            <H3 className="text-lg font-semibold mb-2">
              {t("app.help.pages.help.faq.questions.q2.question")}
            </H3>
            <P className="text-gray-600 dark:text-gray-300">
              {t("app.help.pages.help.faq.questions.q2.answer")}
            </P>
          </Div>
          <Div>
            <H3 className="text-lg font-semibold mb-2">
              {t("app.help.pages.help.faq.questions.q3.question")}
            </H3>
            <P className="text-gray-600 dark:text-gray-300">
              {t("app.help.pages.help.faq.questions.q3.answer")}
            </P>
          </Div>
          <Div>
            <H3 className="text-lg font-semibold mb-2">
              {t("app.help.pages.help.faq.questions.q4.question")}
            </H3>
            <P className="text-gray-600 dark:text-gray-300">
              {t("app.help.pages.help.faq.questions.q4.answer")}
            </P>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
