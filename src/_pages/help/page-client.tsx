"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { Code } from "next-vibe/ui/components/icons/Code";
import { Cpu } from "next-vibe/ui/components/icons/Cpu";
import { CreditCard } from "next-vibe/ui/components/icons/CreditCard";
import { Image } from "next-vibe/ui/components/icons/Image";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { Server } from "next-vibe/ui/components/icons/Server";
import { ShieldOff } from "next-vibe/ui/components/icons/ShieldOff";
import { SiDiscord } from "next-vibe/ui/components/icons/SiDiscord";
import { Zap } from "next-vibe/ui/components/icons/Zap";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { Link } from "next-vibe/ui/components/link";
import { Section } from "next-vibe/ui/components/section";
import { Span } from "next-vibe/ui/components/span";
import { H1, H2, H3, P } from "next-vibe/ui/components/typography";
import { openUrl } from "next-vibe/ui/lib/location";
import type { JSX, ReactNode } from "react";

import { buildFaqStructuredData } from "@/_pages/_components/faq-structured-data";
import { ContactFormSection } from "@/_pages/story/_components/contact-form-section";
import { configScopedTranslation } from "@/env/i18n";
import { getPricingParams } from "@/products/repository-client";

import { scopedTranslation as pageT } from "./i18n";

interface HelpPageClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: Platform;
  userEmail?: string;
  supportEmail: string;
  modelCount: number;
  /** Server-rendered guide cards (blog registry stays out of the client). */
  guides: ReactNode;
}

type IconComponent = typeof Cpu;

interface FaqEntry {
  question: string;
  answer: string;
  /** Localized href of the page that goes deeper. */
  href?: string;
}

export default function HelpPageClient({
  locale,
  user,
  platform,
  userEmail,
  supportEmail,
  modelCount,
  guides,
}: HelpPageClientProps): JSX.Element {
  const { t } = pageT.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const pricing = getPricingParams(locale);

  const topics: {
    href: string;
    icon: IconComponent;
    title: string;
    body: string;
  }[] = [
    {
      href: `/${locale}/models`,
      icon: Cpu,
      title: t("pages.help.topics.models.title"),
      body: t("pages.help.topics.models.body", { modelCount }),
    },
    {
      href: `/${locale}/story/uncensored-ai`,
      icon: ShieldOff,
      title: t("pages.help.topics.uncensored.title"),
      body: t("pages.help.topics.uncensored.body"),
    },
    {
      href: `/${locale}/skills`,
      icon: Zap,
      title: t("pages.help.topics.skills.title"),
      body: t("pages.help.topics.skills.body"),
    },
    {
      href: `/${locale}/create`,
      icon: Image,
      title: t("pages.help.topics.studio.title"),
      body: t("pages.help.topics.studio.body"),
    },
    {
      href: `/${locale}/subscription/overview`,
      icon: CreditCard,
      title: t("pages.help.topics.pricing.title"),
      body: t("pages.help.topics.pricing.body"),
    },
    {
      href: `/${locale}/docs/api`,
      icon: Code,
      title: t("pages.help.topics.api.title"),
      body: t("pages.help.topics.api.body"),
    },
    {
      href: `/${locale}/story/self-host`,
      icon: Server,
      title: t("pages.help.topics.selfHost.title"),
      body: t("pages.help.topics.selfHost.body"),
    },
  ];

  const faq: FaqEntry[] = [
    {
      question: t("pages.help.faq.questions.q1.question", { appName }),
      answer: t("pages.help.faq.questions.q1.answer", { appName, modelCount }),
      href: `/${locale}/models`,
    },
    {
      question: t("pages.help.faq.questions.q5.question"),
      answer: t("pages.help.faq.questions.q5.answer", { ...pricing }),
      href: `/${locale}/story/uncensored-ai`,
    },
    {
      question: t("pages.help.faq.questions.q3.question"),
      answer: t("pages.help.faq.questions.q3.answer", {
        ...pricing,
        modelCount,
      }),
      href: `/${locale}/subscription/overview`,
    },
    {
      question: t("pages.help.faq.questions.q2.question"),
      answer: t("pages.help.faq.questions.q2.answer", { ...pricing }),
    },
    {
      question: t("pages.help.faq.questions.q6.question"),
      answer: t("pages.help.faq.questions.q6.answer"),
      href: `/${locale}/story/abliterated-ai-chat`,
    },
    {
      question: t("pages.help.faq.questions.q4.question"),
      answer: t("pages.help.faq.questions.q4.answer"),
      href: `/${locale}/story/privacy-policy`,
    },
    {
      question: t("pages.help.faq.questions.q7.question"),
      answer: t("pages.help.faq.questions.q7.answer"),
      href: `/${locale}/docs/api`,
    },
    {
      question: t("pages.help.faq.questions.q8.question", { appName }),
      answer: t("pages.help.faq.questions.q8.answer", { appName }),
      href: `/${locale}/story/self-host`,
    },
  ];

  return (
    <Div className="container max-w-6xl mx-auto py-8 px-4">
      <Div className="text-center mb-12">
        <H1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-br from-cyan-500 to-blue-600 text-center">
          {t("pages.help.title")}
        </H1>
        <P className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-center">
          {t("pages.help.subtitle")}
        </P>
      </Div>

      {/* Topic hubs */}
      <Section className="mb-16">
        <H2 className="mb-6 border-none p-0 text-2xl font-bold">
          {t("pages.help.topics.title")}
        </H2>
        <Div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map(({ href, icon: Icon, title, body }) => (
            <Link
              key={href}
              href={href}
              className="group flex h-full flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-colors hover:border-primary/40 dark:border-gray-700 dark:bg-gray-800"
            >
              <Icon className="h-5 w-5 text-primary" />
              <H3 className="mt-3 mb-0 text-base font-semibold">{title}</H3>
              <P className="mt-1 mb-0 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {body}
              </P>
              <Span className="mt-auto pt-3 text-primary">
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Span>
            </Link>
          ))}
        </Div>
      </Section>

      {/* FAQ */}
      <Section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 mb-16">
        <H2 className="text-2xl font-bold mb-6 text-center">
          {t("pages.help.faq.title")}
        </H2>
        <JsonLd
          id="faq-structured-data"
          data={buildFaqStructuredData(
            faq.map(({ question, answer }) => ({ question, answer })),
          )}
        />
        <Div className="grid md:grid-cols-2 gap-8">
          {faq.map(({ question, answer, href }) => (
            <Div key={question}>
              <H3 className="text-lg font-semibold mb-2">{question}</H3>
              <P className="text-gray-600 dark:text-gray-300">{answer}</P>
              {href && (
                <Link
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  href={href}
                >
                  {t("pages.help.faq.more")}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </Div>
          ))}
        </Div>
      </Section>

      {/* Guides */}
      <Section className="mb-16">
        <H2 className="mb-6 border-none p-0 text-2xl font-bold">
          {t("pages.help.guides.title")}
        </H2>
        {guides}
      </Section>

      {/* Contact */}
      <Section>
        <H2 className="mb-2 border-none p-0 text-2xl font-bold">
          {t("pages.help.info.title")}
        </H2>
        <P className="mt-0 mb-6 text-gray-600 dark:text-gray-300">
          {t("pages.help.info.intro")}
        </P>
        <Div className="grid md:grid-cols-2 gap-12">
          <ContactFormSection
            locale={locale}
            user={user}
            platform={platform}
            userEmail={userEmail}
          />

          <Div className="flex flex-col gap-8">
            <Div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
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
      </Section>
    </Div>
  );
}
