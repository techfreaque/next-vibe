import { Globe, Mail, MessageCircle, Twitter } from "lucide-react";
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
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold mb-6">
          {t("app.help.components.pages.help.info.title")}
        </h2>

        <div className="space-y-6">
          <div>
            <div className="flex items-start mb-2">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
              <h3 className="font-medium">
                {t("app.help.components.pages.help.info.email")}
              </h3>
            </div>
            <button
              onClick={() => {
                window.location.href = `mailto:${supportEmail}`;
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline ml-8 bg-transparent border-none p-0 cursor-pointer"
            >
              {supportEmail}
            </button>
          </div>

          <div>
            <div className="flex items-start mb-2">
              <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
              <h3 className="font-medium">
                {t("app.help.components.pages.help.info.website")}
              </h3>
            </div>
            <a
              href="https://unbottled.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline ml-8"
            >
              {t("app.help.components.pages.help.info.websiteUrl")}
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold mb-6">
          {t("app.help.components.pages.help.info.community")}
        </h2>

        <div className="space-y-6">
          <div>
            <div className="flex items-start mb-2">
              <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
              <h3 className="font-medium">
                {t("app.help.components.pages.help.info.discord")}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 ml-8 mb-2">
              {t("app.help.components.pages.help.info.discordDescription")}
            </p>
            <a
              href="https://discord.gg/unbottled"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline ml-8"
            >
              discord.gg/unbottled
            </a>
          </div>

          <div>
            <div className="flex items-start mb-2">
              <Twitter className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
              <h3 className="font-medium">
                {t("app.help.components.pages.help.info.twitter")}
              </h3>
            </div>
            <a
              href="https://twitter.com/unbottled_ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline ml-8"
            >
              {t("app.help.components.pages.help.info.twitterHandle")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
