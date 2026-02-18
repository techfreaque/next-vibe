/**
 * Test Email Form Component
 */

"use client";

import type { JSX } from "react";

import { CampaignType } from "@/app/api/[locale]/emails/smtp-client/enum";
import testEmailDefinitions from "@/app/api/[locale]/leads/campaigns/emails/test-mail/definition";
import {
  type EmailCampaignStageValues,
  type EmailJourneyVariantValues,
  LeadSource,
  LeadStatus,
} from "@/app/api/[locale]/leads/enum";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import {
  getCountryFromLocale,
  getLanguageFromLocale,
} from "@/i18n/core/language-utils";

interface TestEmailFormProps {
  user: JwtPayloadType;
  locale: CountryLanguage;
  emailJourneyVariant: typeof EmailJourneyVariantValues;
  emailCampaignStage: typeof EmailCampaignStageValues;
}

export function TestEmailForm({
  user,
  locale,
  emailJourneyVariant,
  emailCampaignStage,
}: TestEmailFormProps): JSX.Element {
  const currentCountry = getCountryFromLocale(locale);
  const currentLanguage = getLanguageFromLocale(locale);

  return (
    <EndpointsPage
      endpoint={testEmailDefinitions}
      locale={locale}
      user={user}
      className="w-full min-w-0"
      endpointOptions={{
        create: {
          formOptions: {
            defaultValues: {
              /* eslint-disable i18next/no-literal-string -- Mock data for email preview */
              testEmail: "test@example.com",
              /* eslint-enable i18next/no-literal-string */
              campaignType: CampaignType.LEAD_CAMPAIGN,
              emailJourneyVariant: emailJourneyVariant,
              emailCampaignStage: emailCampaignStage,
              leadData: {
                /* eslint-disable i18next/no-literal-string -- Mock data for email preview */
                businessName: "Acme Digital Solutions",
                contactName: "Jane Smith",
                website: "https://acme-digital.com",
                /* eslint-enable i18next/no-literal-string */
                country: currentCountry,
                language: currentLanguage,
                status: LeadStatus.NEW,
                source: LeadSource.WEBSITE,
                /* eslint-disable i18next/no-literal-string -- Mock data for email preview */
                notes:
                  "Interested in premium social media management services. High potential client with established business.",
                /* eslint-enable i18next/no-literal-string */
              },
            },
          },
        },
      }}
    />
  );
}
