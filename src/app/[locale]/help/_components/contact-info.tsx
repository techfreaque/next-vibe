import { Globe, Mail, MessageCircle, Twitter } from "lucide-react";
import { Div, Link } from "next-vibe-ui/ui";
import { H2, H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ContactInfoProps {
  locale: CountryLanguage;
  supportEmail: string;
}

/**
 * Contact information component
 * Displays company contact details and office locations
 */
export default function ContactInfo({
  locale,
  supportEmail,
}: ContactInfoProps): JSX.Element {
  const { t } = simpleT(locale);

  return (
    <Div className="space-y-8">
      <Div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
        <H2 className="text-2xl font-bold mb-6">
          {t("app.help.components.pages.help.info.title")}
        </H2>

        <Div className="space-y-6">
          <Div>
            <Div className="flex items-start mb-2">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
              <H3 className="font-medium">
                {t("app.help.components.pages.help.info.email")}
              </H3>
            </Div>
            <button
              onClick={() => {
                window.location.href = `mailto:${supportEmail}`;
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline ml-8 bg-transparent border-none p-0 cursor-pointer"
            >
              {supportEmail}
            </button>
          </Div>

          <Div>
            <Div className="flex items-start mb-2">
              <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
              <H3 className="font-medium">
                {t("app.help.components.pages.help.info.website")}
              </H3>
            </Div>
            <Link
              href="https://unbottled.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline ml-8"
            >
              {t("app.help.components.pages.help.info.websiteUrl")}
            </Link>
          </Div>
        </Div>
      </Div>

      <Div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
        <H2 className="text-2xl font-bold mb-6">
          {t("app.help.components.pages.help.info.community")}
        </H2>

        <Div className="space-y-6">
          <Div>
            <Div className="flex items-start mb-2">
              <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
              <H3 className="font-medium">
                {t("app.help.components.pages.help.info.discord")}
              </H3>
            </Div>
            <P className="text-gray-600 dark:text-gray-300 ml-8 mb-2">
              {t("app.help.components.pages.help.info.discordDescription")}
            </P>
            <Link
              href="https://discord.gg/unbottled"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline ml-8"
            >
              discord.gg/unbottled
            </Link>
          </Div>

          <Div>
            <Div className="flex items-start mb-2">
              <Twitter className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
              <H3 className="font-medium">
                {t("app.help.components.pages.help.info.twitter")}
              </H3>
            </Div>
            <Link
              href="https://twitter.com/unbottled_ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline ml-8"
            >
              {t("app.help.components.pages.help.info.twitterHandle")}
            </Link>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
