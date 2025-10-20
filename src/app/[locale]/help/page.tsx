import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { JSX } from "react";

import { contactClientRepository } from "@/app/api/[locale]/v1/core/contact/repository-client";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
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
    <main className="min-h-screen bg-blue-50 bg-gradient-to-b from-blue-50 to-white dark:bg-gray-950 dark:from-gray-950 dark:to-gray-900">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("app.help.nav.home")}
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
            {t("app.help.pages.help.title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t("app.help.pages.help.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <ContactForm locale={locale} user={user} />
          <ContactInfo locale={locale} supportEmail={supportEmail} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {t("app.help.pages.help.faq.title")}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {t("app.help.pages.help.faq.questions.q1.question")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("app.help.pages.help.faq.questions.q1.answer")}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {t("app.help.pages.help.faq.questions.q2.question")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("app.help.pages.help.faq.questions.q2.answer")}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {t("app.help.pages.help.faq.questions.q3.question")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("app.help.pages.help.faq.questions.q3.answer")}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {t("app.help.pages.help.faq.questions.q4.question")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("app.help.pages.help.faq.questions.q4.answer")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
