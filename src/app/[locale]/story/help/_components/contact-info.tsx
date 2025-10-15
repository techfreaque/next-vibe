import { Clock, Globe, Mail, MapPin } from "lucide-react";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { getLocalizedBusinessHours } from "@/i18n/core/localization-utils";
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

  // Get localized business hours using centralized utility
  const businessHourConstants = getLocalizedBusinessHours(locale);

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold mb-6">
          {t("pages.help.info.title")}
        </h2>

        <div className="space-y-4">
          <a href={`mailto:${supportEmail}`} className="flex items-start">
            <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
            <h3 className="font-medium">{supportEmail}</h3>
          </a>

          <div className="flex items-start">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
            <div>
              <h3 className="font-medium">
                {t("pages.help.info.businessHours")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("common.company.weekdayHours", businessHourConstants)}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
            <div>
              <h3 className="font-medium">
                {t("pages.help.info.globalService")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("pages.help.info.remoteFirst")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold mb-6">
          {t("pages.help.info.officeLocations")}
        </h2>

        <div className="space-y-6">
          <div>
            <div className="flex items-start mb-2">
              <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
              <h3 className="font-medium">
                {t("common.company.addresses.germany.name")}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 ml-8">
              {t("common.company.addresses.germany.city")}
            </p>
          </div>

          <div>
            <div className="flex items-start mb-2">
              <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
              <h3 className="font-medium">
                {t("common.company.addresses.austria.name")}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 ml-8">
              {t("common.company.addresses.austria.city")}
            </p>
          </div>

          <div>
            <div className="flex items-start mb-2">
              <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
              <h3 className="font-medium">
                {t("common.company.addresses.poland.name")}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 ml-8">
              {t("common.company.addresses.poland.city")}
            </p>
          </div>

          <div>
            <div className="flex items-start mb-2">
              <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
              <h3 className="font-medium">
                {t("common.company.addresses.uae.name")}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 ml-8">
              {t("common.company.addresses.uae.city")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
