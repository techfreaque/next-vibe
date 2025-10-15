import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
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
    title: "meta.signup.title",
    description: "meta.signup.description",
    category: "meta.signup.category",
    image:
      "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=1200&h=630&auto=format&fit=crop",
    imageAlt: "meta.signup.imageAlt",
    keywords: ["meta.signup.keywords"],
    additionalMetadata: {
      openGraph: {
        title: "meta.signup.ogTitle",
        description: "meta.signup.ogDescription",
        url: `https://nextvibe.dev/${locale}/user/signup`,
        type: "website",
        images: [
          {
            url: "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=1200&h=630&auto=format&fit=crop",
            width: 1200,
            height: 630,
            alt: "meta.signup.imageAlt",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "meta.signup.twitterTitle",
        description: "meta.signup.twitterDescription",
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
  const user = await userRepository.getUserByAuth({}, logger);
  if (user.success) {
    redirect(`/${locale}/app/onboarding`);
  }

  return (
    <div className="container max-w- mx-auto pt-8 pb-30 px-4 sm:px-2">
      <Link
        href={`/${locale}`}
        className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("common.backToHome")}
      </Link>
      <div className="grid xl:grid-cols-2 gap-8 items-center">
        <div className="order-2 xl:order-1">
          <SignUpForm locale={locale} />
        </div>

        <div className="order-1 xl:order-2 text-center xl:text-left">
          <div className="mb-8">
            <h1 className="text-3xl xl:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
              {t("auth.signup.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
              {t("auth.signup.subtitle")}
            </p>

            <div className="hidden xl:block">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-6">
                <div className="flex items-start mb-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-4">
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
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {t("auth.signup.benefits.contentCreation.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {t("auth.signup.benefits.contentCreation.description")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-4">
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
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {t("auth.signup.benefits.dataStrategy.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {t("auth.signup.benefits.dataStrategy.description")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mr-4">
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
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {t("auth.signup.benefits.saveTime.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {t("auth.signup.benefits.saveTime.description")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center xl:justify-start gap-4">
              <div className="flex -space-x-2">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&auto=format&fit=crop&crop=face"
                  width={40}
                  height={40}
                  alt={t("auth.signup.avatarAlt")}
                  className="rounded-full border-2 border-white dark:border-gray-800"
                />
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&auto=format&fit=crop&crop=face"
                  width={40}
                  height={40}
                  alt={t("auth.signup.avatarAlt")}
                  className="rounded-full border-2 border-white dark:border-gray-800"
                />
                <Image
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=40&h=40&auto=format&fit=crop&crop=face"
                  width={40}
                  height={40}
                  alt={t("auth.signup.avatarAlt")}
                  className="rounded-full border-2 border-white dark:border-gray-800"
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("auth.signup.userCount", { count: clientCount })}{" "}
                {t("auth.signup.trustText")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
