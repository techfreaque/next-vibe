import type { Metadata } from "next";
import { Div, H1, H2, H3, P } from "next-vibe-ui/ui";
import { ChevronLeft } from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX } from "react";

import { contactClientRepository } from "@/app/api/[locale]/v1/core/contact/repository-client";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import { UserDetailLevel } from "@/app/api/[locale]/v1/core/user/enum";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";

import ContactForm from "./_components/contact-form";
import ContactInfo from "./_components/contact-info";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return metadataGenerator(locale, {
    path: "contact",
    title: "app.help.meta.contact.title",
    description: "app.help.meta.contact.description",
    category: "app.help.meta.contact.category",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&h=630&auto=format&fit=crop",
    imageAlt: "app.help.meta.contact.imageAlt",
    keywords: ["app.help.meta.contact.keywords"],
    additionalMetadata: {
      openGraph: {
        title: "app.help.meta.contact.ogTitle",
        description: "app.help.meta.contact.ogDescription",
      },
      twitter: {
        title: "app.help.meta.contact.twitterTitle",
        description: "app.help.meta.contact.twitterDescription",
      },
    },
  });
}

/**
 * Contact page component
 * Displays contact form and company information
 */
export default async function ContactPage({
  params,
}: Props): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);
  const userResponse = await userRepository.getUserByAuth(
    {
      detailLevel: UserDetailLevel.STANDARD,
    },
    logger,
  );
  const user = userResponse.success ? userResponse.data : undefined;
  const supportEmail = contactClientRepository.getSupportEmail(locale);

  return (
    <Div
      role="main"
      className="min-h-screen bg-blue-50 bg-gradient-to-b from-blue-50 to-white dark:bg-gray-950 dark:from-gray-950 dark:to-gray-900"
    >
      <Div className="container max-w-6xl mx-auto py-8 px-4">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-8"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {t("app.help.nav.home")}
        </Link>

        <Div className="text-center mb-12">
          <H1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
            {t("app.help.pages.help.title")}
          </H1>
          <P className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t("app.help.pages.help.subtitle")}
          </P>
        </Div>

        <Div className="grid md:grid-cols-2 gap-12 mb-16">
          <ContactForm locale={locale} user={user} />
          <ContactInfo locale={locale} supportEmail={supportEmail} />
        </Div>

        <Div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 mb-16">
          <H2 className="text-2xl font-bold mb-6 text-center">
            {t("app.help.pages.help.faq.title")}
          </H2>
          <Div className="grid md:grid-cols-2 gap-8">
            <Div>
              <H3 className="text-lg font-semibold mb-2">
                {t("app.help.pages.help.faq.questions.q1.question")}
              </H3>
              <P className="text-gray-600 dark:text-gray-300">
                {t("app.help.pages.help.faq.questions.q1.answer")}
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
    </Div>
  );
}
