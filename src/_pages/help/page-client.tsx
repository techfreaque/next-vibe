"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { SiDiscord } from "next-vibe/ui/components/icons/SiDiscord";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { Link } from "next-vibe/ui/components/link";
import { H2, H3, P } from "next-vibe/ui/components/typography";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { openUrl } from "next-vibe/ui/lib/location";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";

import { buildFaqStructuredData } from "@/_pages/_components/faq-structured-data";
import contactDefinitions from "@/contact/definition";
import { contactClientRepository } from "@/contact/repository-client";
import { configScopedTranslation } from "@/env/i18n";
import { getPricingParams } from "@/products/repository-client";

import { scopedTranslation as pageT } from "./i18n";

interface HelpPageClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: Platform;
  userEmail?: string;
  modelCount: number;
}

export default function HelpPageClient({
  locale,
  user,
  platform,
  userEmail,
  modelCount,
}: HelpPageClientProps): JSX.Element {
  const logger = useLogger();
  const { t } = pageT.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const supportEmail = contactClientRepository.getSupportEmail(locale);
  const pricing = getPricingParams(locale);

  return (
    <Div className="container max-w-6xl mx-auto py-8 px-4">
      <Div className="text-center mb-12">
        <H2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-br from-cyan-500 to-blue-600 text-center">
          {t("pages.help.title")}
        </H2>
        <P className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-center">
          {t("pages.help.subtitle")}
        </P>
      </Div>

      <Div className="grid md:grid-cols-2 gap-12 mb-16">
        <EndpointsPage
          logger={logger}
          endpoint={contactDefinitions}
          locale={locale}
          user={user}
          platform={platform}
          endpointOptions={
            userEmail
              ? { create: { autoPrefillData: { email: userEmail } } }
              : undefined
          }
        />

        {/* Contact Info */}
        <Div className="flex flex-col gap-8">
          <Div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
            <H3 className="text-2xl font-bold mb-6">
              {t("pages.help.info.title")}
            </H3>
            <Div className="flex flex-col gap-6">
              <Div>
                <Div className="flex items-start mb-2">
                  <Mail className="h-5 w-5 text-primary mt-0.5 mr-3" />
                  <H3 className="font-medium">
                    {t("pages.help.info.supportEmail")}
                  </H3>
                </Div>
                <Button
                  onClick={() => {
                    openUrl(`mailto:${supportEmail}`);
                  }}
                  className="text-primary hover:underline ml-8 bg-transparent border-none p-0 cursor-pointer"
                >
                  {supportEmail}
                </Button>
              </Div>
              <Div>
                <Div className="flex items-start mb-2">
                  <SiDiscord className="h-5 w-5 text-primary mt-0.5 mr-3" />
                  <H3 className="font-medium">
                    {t("pages.help.info.discord")}
                  </H3>
                </Div>
                <Link
                  href={configT("social.discordInvite")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline ml-8"
                >
                  {t("pages.help.info.discordUrl")}
                </Link>
              </Div>
            </Div>
          </Div>
        </Div>
      </Div>

      {/* FAQ Section */}
      <Div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 mb-16">
        <H2 className="text-2xl font-bold mb-6 text-center">
          {t("pages.help.faq.title")}
        </H2>
        <JsonLd
          id="faq-structured-data"
          data={buildFaqStructuredData([
            {
              question: t("pages.help.faq.questions.q1.question", {
                appName: configT("appName"),
              }),
              answer: t("pages.help.faq.questions.q1.answer", {
                appName: configT("appName"),
                modelCount,
              }),
            },
            {
              question: t("pages.help.faq.questions.q2.question"),
              answer: t("pages.help.faq.questions.q2.answer", {
                ...pricing,
              }),
            },
            {
              question: t("pages.help.faq.questions.q3.question"),
              answer: t("pages.help.faq.questions.q3.answer", {
                ...pricing,
                modelCount,
              }),
            },
            {
              question: t("pages.help.faq.questions.q4.question"),
              answer: t("pages.help.faq.questions.q4.answer"),
            },
          ])}
        />
        <Div className="grid md:grid-cols-2 gap-8">
          <Div>
            <H3 className="text-lg font-semibold mb-2">
              {t("pages.help.faq.questions.q1.question", {
                appName: configT("appName"),
              })}
            </H3>
            <P className="text-gray-600 dark:text-gray-300">
              {t("pages.help.faq.questions.q1.answer", {
                appName: configT("appName"),
                modelCount,
              })}
            </P>
          </Div>
          <Div>
            <H3 className="text-lg font-semibold mb-2">
              {t("pages.help.faq.questions.q2.question")}
            </H3>
            <P className="text-gray-600 dark:text-gray-300">
              {t("pages.help.faq.questions.q2.answer", {
                ...pricing,
              })}
            </P>
          </Div>
          <Div>
            <H3 className="text-lg font-semibold mb-2">
              {t("pages.help.faq.questions.q3.question")}
            </H3>
            <P className="text-gray-600 dark:text-gray-300">
              {t("pages.help.faq.questions.q3.answer", {
                ...pricing,
                modelCount,
              })}
            </P>
          </Div>
          <Div>
            <H3 className="text-lg font-semibold mb-2">
              {t("pages.help.faq.questions.q4.question")}
            </H3>
            <P className="text-gray-600 dark:text-gray-300">
              {t("pages.help.faq.questions.q4.answer")}
            </P>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
