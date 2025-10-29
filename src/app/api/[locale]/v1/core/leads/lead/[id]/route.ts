/**
 * Individual Lead API Route Handlers
 * Next.js API route handlers with validation and notifications
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import { leadsRepository } from "../../repository";
import type { LeadUpdateType } from "../../types";
import definitions from "./definition";

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ urlPathParams, user, locale, logger }) => {
      return await leadsRepository.getLeadById(
        urlPathParams.id,
        user,
        locale,
        logger,
      );
    },
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: async ({ urlPathParams, data, user, locale, logger }) => {
      const leadId = urlPathParams.id;
      // Flatten nested update structure to match repository's flat LeadUpdateType
      const {
        basicInfo,
        contactDetails,
        campaignManagement,
        additionalDetails,
      } = data.updates;
      const updateData: Partial<LeadUpdateType> = {
        email: basicInfo.email,
        businessName: basicInfo.businessName,
        contactName: basicInfo.contactName,
        status: basicInfo.status,
        phone: contactDetails.phone,
        website: contactDetails.website,
        country: contactDetails.country,
        language: contactDetails.language,
        currentCampaignStage: campaignManagement.currentCampaignStage,
        source: campaignManagement.source,
        notes: additionalDetails.notes,
        consultationBookedAt: additionalDetails.consultationBookedAt,
        subscriptionConfirmedAt: additionalDetails.subscriptionConfirmedAt,
        metadata: additionalDetails.metadata,
      };
      return await leadsRepository.updateLead(
        leadId,
        updateData,
        user,
        locale,
        logger,
      );
    },
  },
});
