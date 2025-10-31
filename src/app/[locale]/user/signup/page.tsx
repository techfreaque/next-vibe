import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons";
import { Image } from "next-vibe-ui/ui/image";
import { Link } from "next-vibe-ui/ui/link";
import { H1, H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";

import SignUpForm from "./_components/sign-up-form";

const clientCount = 10000;
interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

/**
 * Generate metadata for the Signup page with translations
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return metadataGenerator(locale, {
    path: "signup",
    title: "app.user.signup.meta.title",
    description: "app.user.signup.meta.description",
    category: "app.user.signup.meta.category",
    image:
      "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=1200&h=630&auto=format&fit=crop",
    imageAlt: "app.user.signup.meta.imageAlt",
    keywords: ["app.user.signup.meta.keywords"],
    additionalMetadata: {
      openGraph: {
        title: "app.user.signup.meta.ogTitle",
        description: "app.user.signup.meta.ogDescription",
        url: `https://nextvibe.dev/${locale}/user/signup`,
        type: "website",
        images: [
          {
            url: "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=1200&h=630&auto=format&fit=crop",
            width: 1200,
            height: 630,
            alt: "app.user.signup.meta.imageAlt",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "app.user.signup.meta.twitterTitle",
        description: "app.user.signup.meta.twitterDescription",
        images: [
          "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=1200&h=630&auto=format&fit=crop",
        ],
      },
    },
  });
}

export default async function SignUpPage({
  params,
}: Props): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  const logger = createEndpointLogger(false, Date.now(), locale);
  const user = await userRepository.getUserByAuth({ locale }, logger);
  if (user.success) {
    redirect(`/${locale}/`);
  }

  return (
    <Div className="container max-w- mx-auto pt-8 pb-30 px-4 sm:px-2">
      <Link
        href={`/${locale}`}
        className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-8"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        {t("app.user.common.backToHome")}
      </Link>
      <Div className="grid xl:grid-cols-2 gap-8 items-center">
        <Div className="order-2 xl:order-1">
          <SignUpForm locale={locale} />
        </Div>

        <Div className="order-1 xl:order-2 text-center xl:text-left">
          <Div className="mb-8">
            <H1 className="text-3xl xl:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
              {t("app.user.signup.auth.signup.title")}
            </H1>
            <P className="text-gray-600 dark:text-gray-300 text-lg mb-6">
              {t("app.user.signup.auth.signup.subtitle")}
            </P>

            <Div className="hidden xl:block">
              <Div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-6">
                <Div className="flex items-start mb-4">
                  <Div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-4">
                    <svg
                      className="h-6 w-6 text-green-600 dark:text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </Div>
                  <Div>
                    <H3 className="font-semibold text-lg mb-1">
                      {t(
                        "app.user.signup.auth.signup.benefits.contentCreation.title",
                      )}
                    </H3>
                    <P className="text-gray-600 dark:text-gray-400 text-sm">
                      {t(
                        "app.user.signup.auth.signup.benefits.contentCreation.description",
                      )}
                    </P>
                  </Div>
                </Div>

                <Div className="flex items-start mb-4">
                  <Div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-4">
                    <svg
                      className="h-6 w-6 text-blue-600 dark:text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </Div>
                  <Div>
                    <H3 className="font-semibold text-lg mb-1">
                      {t(
                        "app.user.signup.auth.signup.benefits.dataStrategy.title",
                      )}
                    </H3>
                    <P className="text-gray-600 dark:text-gray-400 text-sm">
                      {t(
                        "app.user.signup.auth.signup.benefits.dataStrategy.description",
                      )}
                    </P>
                  </Div>
                </Div>

                <Div className="flex items-start">
                  <Div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mr-4">
                    <svg
                      className="h-6 w-6 text-purple-600 dark:text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </Div>
                  <Div>
                    <H3 className="font-semibold text-lg mb-1">
                      {t("app.user.signup.auth.signup.benefits.saveTime.title")}
                    </H3>
                    <P className="text-gray-600 dark:text-gray-400 text-sm">
                      {t(
                        "app.user.signup.auth.signup.benefits.saveTime.description",
                      )}
                    </P>
                  </Div>
                </Div>
              </Div>
            </Div>

            <Div className="flex flex-col md:flex-row items-center justify-center xl:justify-start gap-4">
              <Div className="flex -space-x-2">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&auto=format&fit=crop&crop=face"
                  width={40}
                  height={40}
                  alt={t("app.user.signup.auth.signup.avatarAlt")}
                  className="rounded-full border-2 border-white dark:border-gray-800"
                />
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&auto=format&fit=crop&crop=face"
                  width={40}
                  height={40}
                  alt={t("app.user.signup.auth.signup.avatarAlt")}
                  className="rounded-full border-2 border-white dark:border-gray-800"
                />
                <Image
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=40&h=40&auto=format&fit=crop&crop=face"
                  width={40}
                  height={40}
                  alt={t("app.user.signup.auth.signup.avatarAlt")}
                  className="rounded-full border-2 border-white dark:border-gray-800"
                />
              </Div>
              <P className="text-sm text-gray-600 dark:text-gray-400">
                {t("app.user.signup.auth.signup.userCount", {
                  count: clientCount,
                })}{" "}
                {t("app.user.signup.auth.signup.trustText")}
              </P>
            </Div>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
