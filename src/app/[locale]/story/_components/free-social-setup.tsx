"use client";

import { MotionDiv } from "next-vibe-ui/ui/motion";
import {
  CheckCircle,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  Settings,
  Twitter,
  Youtube,
} from 'next-vibe-ui/ui/icons';
import { Button } from "next-vibe-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Span } from "next-vibe-ui/ui/span";
import { Div } from "next-vibe-ui/ui/div";
import { Link } from "next-vibe-ui/ui/link";
import type React from "react";
import type { JSX } from "react";
import { useInView } from "react-intersection-observer";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface SocialPlatform {
  icon: React.ReactNode;
  name: string;
  color: string;
}

/**
 * Free Social Setup component.
 * Highlights the free social account setup service prominently.
 */
export default function FreeSocialSetup({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const socialPlatforms: SocialPlatform[] = [
    {
      icon: <Facebook className="h-8 w-8" />,
      name: t("app.socialMedia.platforms.facebook"),
      color: "text-blue-600",
    },
    {
      icon: <Instagram className="h-8 w-8" />,
      name: t("app.socialMedia.platforms.instagram"),
      color: "text-pink-600",
    },
    {
      icon: <Twitter className="h-8 w-8" />,
      name: t("app.socialMedia.platforms.twitter"),
      color: "text-gray-900 dark:text-white",
    },
    {
      icon: <Linkedin className="h-8 w-8" />,
      name: t("app.socialMedia.platforms.linkedin"),
      color: "text-blue-700",
    },
    {
      icon: <Youtube className="h-8 w-8" />,
      name: t("app.socialMedia.platforms.youtube"),
      color: "text-red-600",
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      name: t("app.socialMedia.platforms.tiktok"),
      color: "text-gray-900 dark:text-white",
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      name: t("app.socialMedia.platforms.pinterest"),
      color: "text-red-500",
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      name: t("app.socialMedia.platforms.snapchat"),
      color: "text-yellow-500",
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      name: t("app.socialMedia.platforms.whatsapp"),
      color: "text-green-600",
    },
  ];

  const benefits = [
    t("app.story._components.home.freeSocialSetup.benefits.professionalSetup"),
    t("app.story._components.home.freeSocialSetup.benefits.optimizedProfiles"),
    t("app.story._components.home.freeSocialSetup.benefits.brandConsistency"),
    t("app.story._components.home.freeSocialSetup.benefits.strategicPlanning"),
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Div
      id="free-social-setup"
      className="container px-4 md:px-6 py-24 md:py-32 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20"
      ref={ref}
    >
      <Div className="max-w-6xl mx-auto">
        <Div className="text-center mb-16">
          <MotionDiv
            className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 0.5 }}
          >
            <CheckCircle className="h-4 w-4" />
            {t("app.story._components.home.freeSocialSetup.badge")}
          </MotionDiv>

          <MotionDiv
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t("app.story._components.home.freeSocialSetup.title")}
          </MotionDiv>

          <MotionDiv
            className="mx-auto max-w-[800px] text-gray-600 dark:text-gray-300 md:text-xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t("app.story._components.home.freeSocialSetup.description")}
          </MotionDiv>
        </Div>

        <Div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Benefits */}
          <MotionDiv
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-2 border-blue-200 dark:border-blue-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader>
                <Div className="flex items-center gap-3 mb-4">
                  <Div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Settings className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </Div>
                  <Div>
                    <CardTitle className="text-2xl">
                      {t(
                        "app.story._components.home.freeSocialSetup.card.title",
                      )}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {t(
                        "app.story._components.home.freeSocialSetup.card.subtitle",
                      )}
                    </CardDescription>
                  </Div>
                </Div>
              </CardHeader>
              <CardContent>
                <Div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <MotionDiv
                      // eslint-disable-next-line i18next/no-literal-string
                      key={`benefit_${index}_${benefit}`}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={
                        inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                      }
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    >
                      <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <Span className="text-gray-700 dark:text-gray-300">
                        {benefit}
                      </Span>
                    </MotionDiv>
                  ))}
                </Div>

                <MotionDiv
                  className="mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Link href={`/${locale}/pricing`}>
                    <Button
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {t("app.story._components.home.freeSocialSetup.cta")}
                    </Button>
                  </Link>
                </MotionDiv>
              </CardContent>
            </Card>
          </MotionDiv>

          {/* Right side - Social Platforms */}
          <MotionDiv
            className="space-y-6"
            variants={container}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
          >
            <MotionDiv
              className="text-2xl font-semibold text-center mb-8"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {t("app.story._components.home.freeSocialSetup.platforms.title")}
            </MotionDiv>

            <Div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4">
              {socialPlatforms.map((platform) => (
                <MotionDiv
                  key={platform.name}
                  variants={item}
                  className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
                >
                  <Div className={`${platform.color} mb-3`}>
                    {platform.icon}
                  </Div>
                  <Span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {platform.name}
                  </Span>
                </MotionDiv>
              ))}
            </Div>

            <MotionDiv
              className="text-center text-gray-600 dark:text-gray-400 text-sm mt-6"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              {t(
                "app.story._components.home.freeSocialSetup.platforms.subtitle",
              )}
            </MotionDiv>
          </MotionDiv>
        </Div>
      </Div>
    </Div>
  );
}
